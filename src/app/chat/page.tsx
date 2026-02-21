"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  createSession,
  getSession,
  listSessions,
  sendMessage,
  type ChatSession,
  type MessageResponse,
} from "@/lib/chat0-client";
import { PERSONALITIES } from "@/lib/constants";
import type { PersonalityId } from "@/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  images?: string[];
  audioUrls?: string[];
}

interface CachedChatState {
  sessionId: string;
  updatedAt: string;
  messages: ChatMessage[];
}

interface SessionUser {
  id?: string;
  selectedPersonality?: PersonalityId | null;
}

const AUDIO_URL_PATTERN = /\.(mp3|wav|m4a|ogg|webm)(\?|$)/i;

function getCacheKey(userId: string): string {
  return `chat0-cache:${userId}`;
}

function readChatCache(userId: string): CachedChatState | null {
  try {
    const raw = localStorage.getItem(getCacheKey(userId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedChatState;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.sessionId || !Array.isArray(parsed.messages) || !parsed.updatedAt) return null;

    return parsed;
  } catch {
    return null;
  }
}

function writeChatCache(userId: string, data: CachedChatState): void {
  try {
    localStorage.setItem(getCacheKey(userId), JSON.stringify(data));
  } catch {
    // Ignore localStorage write errors (private mode, quota exceeded)
  }
}

function normalizeAudioUrls(data: {
  audio?: MessageResponse["audio"];
  attachments?: MessageResponse["attachments"];
}): string[] | undefined {
  const directAudio =
    data.audio && typeof data.audio === "object" && typeof data.audio.url === "string"
      ? data.audio.url
      : undefined;

  const attachmentAudio =
    data.attachments?.filter(
      (attachment): attachment is string =>
        typeof attachment === "string" &&
        (attachment.startsWith("data:audio/") || AUDIO_URL_PATTERN.test(attachment))
    ) || [];

  const allAudio = [directAudio, ...attachmentAudio].filter(
    (url): url is string => typeof url === "string" && url.length > 0
  );
  const uniqueAudio = Array.from(new Set(allAudio));

  return uniqueAudio.length > 0 ? uniqueAudio : undefined;
}

function normalizeImages(data: {
  image?: MessageResponse["image"];
  images?: MessageResponse["images"];
  attachments?: MessageResponse["attachments"];
}): string[] | undefined {
  const imageUrl =
    typeof data.image === "string"
      ? data.image
      : data.image && typeof data.image === "object"
      ? data.image.url
      : undefined;

  const images = data.images?.filter((img) => typeof img === "string") || [];
  const attachments =
    data.attachments?.filter(
      (attachment): attachment is string =>
        typeof attachment === "string" &&
        !attachment.startsWith("data:audio/") &&
        !AUDIO_URL_PATTERN.test(attachment)
    ) || [];

  const allImages = [imageUrl, ...images, ...attachments].filter(
    (img): img is string => typeof img === "string" && img.length > 0
  );
  const uniqueImages = Array.from(new Set(allImages));

  return uniqueImages.length > 0 ? uniqueImages : undefined;
}

function formatHistory(history: ChatSession["history"]): ChatMessage[] {
  return history.map((msg: ChatSession["history"][number]) => ({
    role: msg.role as "user" | "assistant",
    content: msg.content,
    images: normalizeImages({
      image: msg.image,
      images: msg.images,
      attachments: msg.attachments,
    }),
    audioUrls: normalizeAudioUrls({
      audio: msg.audio,
      attachments: msg.attachments,
    }),
  }));
}

export default function ChatPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Map personality ID to API persona
  const getPersonaFromPersonality = (personalityId: PersonalityId | null): string => {
    const mapping: Record<PersonalityId, string> = {
      vanilla: "loving",
      goth: "tsundere",
      dominant: "dominant",
      yandere: "dominant",
      dandere: "loving",
      kuudere: "tsundere",
    };
    return personalityId ? mapping[personalityId] || "loving" : "loving";
  };

  // Get personality data
  const sessionUser = session?.user as SessionUser | undefined;
  const personalityId = sessionUser?.selectedPersonality ?? null;
  const personality = personalityId
    ? PERSONALITIES.find((p) => p.id === personalityId)
    : PERSONALITIES[0]; // Default to first personality

  // Initialize session on mount
  useEffect(() => {
    if (isPending || !session) return;
    const currentSession = session;

    async function initializeSession() {
      try {
        setInitializing(true);
        setError(null);
        const userId = (currentSession.user as SessionUser | undefined)?.id;
        const cached = userId ? readChatCache(userId) : null;

        if (cached?.messages.length) {
          setMessages(cached.messages);
        }

        // Try to get existing sessions first
        let activeSession: ChatSession | null = null;

        if (cached?.sessionId) {
          try {
            activeSession = await getSession(cached.sessionId);
          } catch {
            activeSession = null;
          }
        }

        try {
          if (!activeSession) {
            const existingSessions = await listSessions();
            if (existingSessions.length > 0) {
              // Load the most recent session
              activeSession = await getSession(existingSessions[0].session_id);
            } else {
              // Create a new session with user's personality
              const persona = getPersonaFromPersonality(personalityId);
              activeSession = await createSession({
                name: "babe",
                persona: persona,
                audio_enabled: false,
              });
            }
          }
        } catch {
          // If listing fails, try creating a new session
          const persona = getPersonaFromPersonality(personalityId);
          activeSession = await createSession({
            name: "babe",
            persona: persona,
            audio_enabled: false,
          });
        }

        if (!activeSession) {
          throw new Error("Could not initialize chat session");
        }

        setChatSession(activeSession);

        // Load conversation history
        if (activeSession.history && activeSession.history.length > 0) {
          const formattedMessages = formatHistory(activeSession.history);
          setMessages(formattedMessages);

          if (userId) {
            writeChatCache(userId, {
              sessionId: activeSession.session_id,
              updatedAt: activeSession.updated_at,
              messages: formattedMessages,
            });
          }
        } else if (userId) {
          writeChatCache(userId, {
            sessionId: activeSession.session_id,
            updatedAt: activeSession.updated_at,
            messages: [],
          });
        }
      } catch (err) {
        console.error("Failed to initialize session:", err);
        setError("Failed to load chat. Please refresh the page.");
      } finally {
        setInitializing(false);
      }
    }

    initializeSession();
  }, [session, isPending, personalityId]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession || loading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);

    // Add user message immediately
    const userMsg: ChatMessage = {
      role: "user",
      content: userMessage,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response: MessageResponse = await sendMessage(
        chatSession.session_id,
        userMessage,
        false
      );

      // Add assistant response
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: response.reply,
        images: normalizeImages(response),
        audioUrls: normalizeAudioUrls(response),
      };
      let nextMessages: ChatMessage[] = [];
      setMessages((prev) => {
        nextMessages = [...prev, assistantMsg];
        return nextMessages;
      });

      const userId = (session?.user as SessionUser | undefined)?.id;
      if (userId) {
        writeChatCache(userId, {
          sessionId: chatSession.session_id,
          updatedAt: new Date().toISOString(),
          messages: nextMessages,
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isPending || (initializing && messages.length === 0)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-white/50 font-jakarta">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-[100dvh] bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center overflow-hidden"
                style={{
                  background: personality
                    ? `linear-gradient(135deg, ${personality.accentColor}40, ${personality.accentColor}20)`
                    : "linear-gradient(135deg, #f59e0b40, #f59e0b20)",
                }}
              >
                {personality ? (
                  <img
                    src={personality.image}
                    alt={personality.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl">✨</span>
                )}
              </div>
              <div>
                <p className="font-cormorant text-xl text-white">{personality?.name || "Serena"}</p>
                <p className="font-jakarta text-xs text-white/50">
                  {chatSession ? "Online" : "Connecting..."}
                </p>
              </div>
            </div>
            <div>
              <h1 className="font-cormorant text-2xl text-white">harmonica</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10 pb-32 sm:pb-36 lg:pb-40">
          {messages.length === 0 ? (
            <div className="text-center mt-20">
              <div
                className="inline-block p-6 rounded-2xl mb-6"
                style={{
                  backgroundColor: personality
                    ? `${personality.accentColor}20`
                    : "#f59e0b20",
                  borderColor: personality
                    ? `${personality.accentColor}40`
                    : "#f59e0b40",
                  borderWidth: "1px",
                }}
              >
                <p className="font-jakarta text-white/80">
                  {personality?.name || "Serena"} is ready to chat. Say hello!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 ${
                      msg.role === "user"
                        ? "bg-white/10 text-white"
                        : "bg-white/5 text-white/90 border border-white/10"
                    }`}
                    style={
                      msg.role === "assistant" && personality
                        ? {
                            borderColor: `${personality.accentColor}30`,
                          }
                        : undefined
                    }
                  >
                    <p className="font-jakarta text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.audioUrls && msg.audioUrls.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.audioUrls.map((audioUrl, audioIdx) => (
                          <div key={audioIdx} className="rounded-lg border border-white/10 bg-black/20 p-2">
                            <audio controls preload="none" className="w-full" src={audioUrl} />
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.images && msg.images.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="rounded-lg overflow-hidden">
                            {typeof img === "string" &&
                            (img.startsWith("data:image") || img.startsWith("http")) ? (
                              <img
                                src={img}
                                alt={`Image ${imgIdx + 1}`}
                                className="max-w-full h-auto"
                                onError={(e) => {
                                  console.error("Failed to load image:", img);
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="p-4 bg-white/5 rounded text-white/50 text-xs">
                                Image data: {img.substring(0, 50)}...
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto px-6 pb-4">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
            <p className="font-jakarta text-sm text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-8 sm:pb-7 lg:pb-8 safe-bottom">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading || !chatSession}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 font-jakarta text-sm focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim() || !chatSession}
              className="px-6 py-3 bg-white text-black rounded-xl font-jakarta text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
