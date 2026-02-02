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
const WHATSAPP_API_BASE_URL =
  process.env.WHATSAPP_API_BASE_URL || CHAT0_API_BASE_URL || "http://localhost:5000";
const WHATSAPP_TO_ALIAS = process.env.WHATSAPP_TO_ALIAS || "";
const WHATSAPP_AUTH_DIR = process.env.WHATSAPP_AUTH_DIR || "./data/auth";
const QR_IMAGE_PATH = process.env.QR_IMAGE_PATH || "./data/qr.png";
const ALLOW_GROUPS = (process.env.ALLOW_GROUPS || "false").toLowerCase() === "true";

let socket: WASocket | null = null;
let isStarting = false;

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

function jidToWhatsAppAlias(jid: string) {
  if (jid.endsWith("@s.whatsapp.net")) {
    const digits = jid.split("@", 1)[0].replace(/\D+/g, "");
    return `${digits}@whatsapp`;
  }
  return jid;
}

function resolveFromJid(message: proto.IWebMessageInfo) {
  const participant = message.key.participant;
  if (participant && participant.endsWith("@s.whatsapp.net")) {
    return jidToWhatsAppAlias(participant);
  }
  if (message.key.remoteJid) {
    return jidToWhatsAppAlias(message.key.remoteJid);
  }
  return "unknown@whatsapp";
}

function resolveToAlias() {
  if (WHATSAPP_TO_ALIAS) return WHATSAPP_TO_ALIAS;
  if (socket?.user?.id) return jidToWhatsAppAlias(socket.user.id);
  return "companion@whatsapp";
}

type WhatsAppBackendResponse = {
  reply?: string;
  handled?: boolean;
  session_id?: string;
  attachments?: string[];
  voice_note?: { url?: string };
};

async function sendWhatsAppToBackend(payload: {
  from: string;
  to: string;
  text: string;
  timestamp: number;
  metadata: { jid?: string; push_name?: string; message_id?: string };
}): Promise<WhatsAppBackendResponse> {
  try {
    const response = await fetch(`${WHATSAPP_API_BASE_URL}/api/whatsapp/message`, {
      method: "POST",
      headers: withAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.error || data.message || `Failed to send WhatsApp message (${response.status})`
      );
    }

    return data as WhatsAppBackendResponse;
  } catch (error) {
    log.error({ error: formatError(error) }, "WhatsApp backend call failed");
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
  const trimmed = input.trim();
  if (trimmed.endsWith("@whatsapp")) {
    const digits = trimmed.split("@", 1)[0].replace(/\D+/g, "");
    return `${digits}@s.whatsapp.net`;
  }
  if (
    trimmed.endsWith("@s.whatsapp.net") ||
    trimmed.endsWith("@g.us") ||
    trimmed.endsWith("@broadcast")
  ) {
    return trimmed;
  }
  if (trimmed.includes("@")) {
    const digits = trimmed.split("@", 1)[0].replace(/\D+/g, "");
    return digits ? `${digits}@s.whatsapp.net` : trimmed;
  }
  const digitsOnly = trimmed.replace(/\D+/g, "");
  return `${digitsOnly}@s.whatsapp.net`;
}

function getAudioMeta(url: string) {
  let ext = "";
  try {
    const parsed = new URL(url);
    ext = path.extname(parsed.pathname).toLowerCase();
  } catch {
    ext = path.extname(url).toLowerCase();
  }

  switch (ext) {
    case ".ogg":
    case ".opus":
      return {
        mimetype: "audio/ogg; codecs=opus",
        fileName: `voice${ext || ".ogg"}`,
        ptt: true,
      };
    case ".m4a":
      return { mimetype: "audio/mp4", fileName: "voice.m4a", ptt: false };
    case ".wav":
      return { mimetype: "audio/wav", fileName: "voice.wav", ptt: false };
    case ".mp3":
    default:
      return { mimetype: "audio/mpeg", fileName: "voice.mp3", ptt: false };
  }
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
        log.info(
          {
            remoteJid,
            from: resolveFromJid(message),
            messageId: message.key.id || undefined,
            pushName: message.pushName || undefined,
            textPreview: text.slice(0, 160),
          },
          "Inbound WhatsApp message"
        );
        const payload = {
          from: resolveFromJid(message),
          to: resolveToAlias(),
          text,
          timestamp: Math.floor(Date.now() / 1000),
          metadata: {
            jid: remoteJid,
            push_name: message.pushName || undefined,
            message_id: message.key.id || undefined,
          },
        };

        log.info(
          {
            remoteJid,
            to: payload.to,
            messageId: payload.metadata.message_id,
          },
          "Forwarding WhatsApp message to backend"
        );
        const result = await sendWhatsAppToBackend(payload);
        if (!result.handled) {
          log.info(
            { remoteJid, messageId: payload.metadata.message_id },
            "Backend did not handle message"
          );
          continue;
        }

        const attachments = Array.isArray(result.attachments)
          ? result.attachments.filter(Boolean)
          : [];
        const voiceUrl = result.voice_note?.url || "";
        const replyText = result.reply || "";

        log.info(
          {
            remoteJid,
            messageId: payload.metadata.message_id,
            attachments: attachments.length,
            hasVoiceNote: Boolean(voiceUrl),
            replyPreview: replyText ? replyText.slice(0, 160) : undefined,
          },
          "Preparing WhatsApp response"
        );

        let sentMedia = false;

        if (attachments.length > 0) {
          for (let index = 0; index < attachments.length; index += 1) {
            const url = attachments[index];
            const caption = index === 0 && replyText ? replyText : undefined;
            log.info(
              {
                remoteJid,
                index: index + 1,
                total: attachments.length,
                hasCaption: Boolean(caption),
              },
              "Sending WhatsApp image"
            );
            await socket?.sendMessage(remoteJid, {
              image: { url },
              ...(caption ? { caption } : {}),
            });
          }
          sentMedia = true;
        }

        if (voiceUrl) {
          const audioMeta = getAudioMeta(voiceUrl);
          log.info(
            { remoteJid, mimetype: audioMeta.mimetype, ptt: audioMeta.ptt },
            "Sending WhatsApp voice note"
          );
          await socket?.sendMessage(remoteJid, {
            audio: { url: voiceUrl },
            mimetype: audioMeta.mimetype,
            fileName: audioMeta.fileName,
            ptt: audioMeta.ptt,
          });
          sentMedia = true;
        }

        if (!sentMedia && replyText) {
          log.info(
            { remoteJid, replyPreview: replyText.slice(0, 160) },
            "Sending WhatsApp text reply"
          );
          await socket?.sendMessage(remoteJid, { text: replyText });
        }

        if (!sentMedia && !replyText) {
          log.info({ remoteJid }, "No reply content to send");
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
    log.info({ to: jid, length: message.length }, "Sending WhatsApp text via API");
    await socket.sendMessage(jid, { text: message });
    log.info({ to: jid }, "WhatsApp text sent via API");
    return res.json({ ok: true, to: jid });
  } catch (error) {
    log.error({ error }, "Failed to send message");
    return res.status(500).json({ error: "Failed to send message" });
  }
});

app.post("/send-media", async (req: Request, res: Response) => {
  const { to, image_url, caption, attachments, voice_url } = req.body as {
    to?: string;
    image_url?: string;
    caption?: string;
    attachments?: string[];
    voice_url?: string;
  };

  if (!to) {
    return res.status(400).json({ error: "Missing to" });
  }

  const mediaUrls = [
    ...(Array.isArray(attachments) ? attachments : []),
    ...(image_url ? [image_url] : []),
  ].filter(Boolean);

  if (mediaUrls.length === 0 && !voice_url) {
    return res.status(400).json({ error: "No media to send" });
  }

  if (!socket) {
    return res.status(503).json({ error: "WhatsApp socket not ready" });
  }

  try {
    const jid = normalizeJid(to);
    let sentCount = 0;
    log.info(
      { to: jid, images: mediaUrls.length, hasVoiceNote: Boolean(voice_url) },
      "Sending WhatsApp media via API"
    );

    if (mediaUrls.length > 0) {
      for (let index = 0; index < mediaUrls.length; index += 1) {
        const url = mediaUrls[index];
        const imageCaption = index === 0 && caption ? caption : undefined;
        log.info(
          { to: jid, index: index + 1, total: mediaUrls.length },
          "Sending WhatsApp image via API"
        );
        await socket.sendMessage(jid, {
          image: { url },
          ...(imageCaption ? { caption: imageCaption } : {}),
        });
        sentCount += 1;
      }
    }

    if (voice_url) {
      const audioMeta = getAudioMeta(voice_url);
      log.info(
        { to: jid, mimetype: audioMeta.mimetype, ptt: audioMeta.ptt },
        "Sending WhatsApp voice note via API"
      );
      await socket.sendMessage(jid, {
        audio: { url: voice_url },
        mimetype: audioMeta.mimetype,
        fileName: audioMeta.fileName,
        ptt: audioMeta.ptt,
      });
      sentCount += 1;
    }

    log.info({ to: jid, sent: sentCount }, "WhatsApp media sent via API");
    return res.json({ ok: true, to: jid, sent: sentCount });
  } catch (error) {
    log.error({ error: formatError(error) }, "Failed to send media");
    return res.status(500).json({ error: "Failed to send media" });
  }
});

app.listen(PORT, () => {
  log.info({ port: PORT }, "WhatsApp adapter listening");
});

startSocket().catch((error) => {
  isStarting = false;
  log.error({ error }, "Failed to start WhatsApp socket");
});
