import "dotenv/config";
import express, { type Request, type Response } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import pino from "pino";
import qrcode from "qrcode";
import {
  DisconnectReason,
  type ConnectionState,
  type BaileysEventMap,
  fetchLatestBaileysVersion,
  makeWASocket,
  useMultiFileAuthState,
  type WASocket,
  type proto,
} from "@whiskeysockets/baileys";

const log = pino({ level: process.env.LOG_LEVEL || "info" });

const PORT = Number(process.env.PORT || 8081);
const CHAT0_API_BASE_URL = process.env.CHAT0_API_BASE_URL || "http://localhost:5000";
const CHAT0_API_TOKEN = process.env.CHAT0_API_TOKEN || "";
const CHAT0_DEFAULT_PERSONA = process.env.CHAT0_DEFAULT_PERSONA || "";
const WHATSAPP_AUTH_DIR = process.env.WHATSAPP_AUTH_DIR || "./data/auth";
const SESSION_STORE_PATH = process.env.SESSION_STORE_PATH || "./data/sessions.json";
const QR_IMAGE_PATH = process.env.QR_IMAGE_PATH || "./data/qr.png";
const ALLOW_GROUPS = (process.env.ALLOW_GROUPS || "false").toLowerCase() === "true";

let socket: WASocket | null = null;
let isStarting = false;

type SessionStore = Record<string, string>;

function formatError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  if (typeof error === "object" && error !== null) {
    return { message: JSON.stringify(error) };
  }
  return { message: String(error) };
}

function withAuthHeaders(headers: Record<string, string>) {
  if (CHAT0_API_TOKEN) {
    return { ...headers, Authorization: `Bearer ${CHAT0_API_TOKEN}` };
  }
  return headers;
}

async function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function readSessionStore(): Promise<SessionStore> {
  try {
    const data = await fs.readFile(SESSION_STORE_PATH, "utf8");
    return JSON.parse(data) as SessionStore;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

async function writeSessionStore(store: SessionStore) {
  await ensureDir(SESSION_STORE_PATH);
  const payload = JSON.stringify(store, null, 2);
  await fs.writeFile(SESSION_STORE_PATH, payload, "utf8");
}

async function getSessionId(jid: string): Promise<string | null> {
  const store = await readSessionStore();
  return store[jid] || null;
}

async function setSessionId(jid: string, sessionId: string) {
  const store = await readSessionStore();
  store[jid] = sessionId;
  await writeSessionStore(store);
}

async function createChatSession(name?: string): Promise<string> {
  const body: Record<string, unknown> = {};
  if (name) body.name = name;
  if (CHAT0_DEFAULT_PERSONA) body.persona = CHAT0_DEFAULT_PERSONA;

  try {
    const response = await fetch(`${CHAT0_API_BASE_URL}/api/chat0/sessions`, {
      method: "POST",
      headers: withAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.error || data.message || `Failed to create session (${response.status})`
      );
    }

    return data.session?.session_id as string;
  } catch (error) {
    log.error({ error: formatError(error) }, "Create session failed");
    throw error;
  }
}

async function sendChatMessage(sessionId: string, message: string): Promise<string> {
  try {
    const response = await fetch(`${CHAT0_API_BASE_URL}/api/chat0/message`, {
      method: "POST",
      headers: withAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ session_id: sessionId, message, generate_audio: false }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.error || data.message || `Failed to send message (${response.status})`
      );
    }

    return data.reply as string;
  } catch (error) {
    log.error({ error: formatError(error) }, "Send message failed");
    throw error;
  }
}

function extractText(message: proto.IMessage | null | undefined) {
  if (!message) return "";
  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    ""
  );
}

function normalizeJid(input: string) {
  if (input.includes("@")) return input;
  const digitsOnly = input.replace(/\D+/g, "");
  return `${digitsOnly}@s.whatsapp.net`;
}

async function startSocket() {
  if (isStarting) return;
  isStarting = true;

  await fs.mkdir(WHATSAPP_AUTH_DIR, { recursive: true });
  const { state, saveCreds } = await useMultiFileAuthState(WHATSAPP_AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  socket = makeWASocket({
    auth: state,
    version,
    logger: pino({ level: "silent" }),
  });

  socket.ev.on("creds.update", saveCreds);

  socket.ev.on("connection.update", (update: Partial<ConnectionState>) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      log.info({ qr }, "Scan QR to connect WhatsApp");
      ensureDir(QR_IMAGE_PATH)
        .then(() => qrcode.toFile(QR_IMAGE_PATH, qr))
        .then(() => log.info({ path: QR_IMAGE_PATH }, "Wrote QR code image"))
        .catch((error) => log.error({ error }, "Failed to write QR image"));
    }

    if (connection === "close") {
      const statusCode = (lastDisconnect?.error as { output?: { statusCode?: number } })
        ?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      log.warn({ statusCode }, "WhatsApp connection closed");
      if (!shouldReconnect) {
        fs.rm(WHATSAPP_AUTH_DIR, { recursive: true, force: true })
          .then(() => log.warn("Cleared WhatsApp auth state after logout"))
          .catch((error) => log.error({ error }, "Failed to clear auth state"))
          .finally(() => {
            socket = null;
            startSocket().catch((error) => log.error({ error }, "Reconnect failed"));
          });
        return;
      }

      startSocket().catch((error) => log.error({ error }, "Reconnect failed"));
    }

    if (connection === "open") {
      log.info("WhatsApp connection open");
    }
  });

  socket.ev.on(
    "messages.upsert",
    async ({ messages, type }: BaileysEventMap["messages.upsert"]) => {
    if (type !== "notify") return;

    for (const message of messages) {
      if (!message.message || message.key.fromMe) continue;

      const remoteJid = message.key.remoteJid;
      if (!remoteJid) continue;

      if (!ALLOW_GROUPS && remoteJid.endsWith("@g.us")) {
        continue;
      }

      const text = extractText(message.message);
      if (!text) {
        log.info({ remoteJid }, "Ignored non-text message");
        continue;
      }

      try {
        let sessionId = await getSessionId(remoteJid);
        if (!sessionId) {
          sessionId = await createChatSession(message.pushName || undefined);
          await setSessionId(remoteJid, sessionId);
        }

        const reply = await sendChatMessage(sessionId, text);
        if (reply) {
          await socket?.sendMessage(remoteJid, { text: reply });
        }
      } catch (error) {
        log.error(
          { error: formatError(error), remoteJid, textPreview: text.slice(0, 120) },
          "Failed to handle inbound message"
        );
      }
    }
  }
  );

  isStarting = false;
}

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    connected: Boolean(socket?.user),
    user: socket?.user?.id || null,
  });
});

app.post("/send", async (req: Request, res: Response) => {
  const { to, message } = req.body as { to?: string; message?: string };
  if (!to || !message) {
    return res.status(400).json({ error: "Missing to or message" });
  }

  if (!socket) {
    return res.status(503).json({ error: "WhatsApp socket not ready" });
  }

  try {
    const jid = normalizeJid(to);
    await socket.sendMessage(jid, { text: message });
    return res.json({ ok: true, to: jid });
  } catch (error) {
    log.error({ error }, "Failed to send message");
    return res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(PORT, () => {
  log.info({ port: PORT }, "WhatsApp adapter listening");
});

startSocket().catch((error) => {
  isStarting = false;
  log.error({ error }, "Failed to start WhatsApp socket");
});
