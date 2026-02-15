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
  const personalityId = (session?.user as any)?.selectedPersonality as PersonalityId | null;
  const personality = personalityId
    ? PERSONALITIES.find((p) => p.id === personalityId)
    : PERSONALITIES[0]; // Default to first personality

  // Initialize session on mount
  useEffect(() => {
    if (isPending || !session) return;

    async function initializeSession() {
      try {
        setInitializing(true);
        setError(null);

        // Try to get existing sessions first
        let session: ChatSession;
        try {
          const existingSessions = await listSessions();
          if (existingSessions.length > 0) {
            // Load the most recent session
            session = await getSession(existingSessions[0].session_id);
          } else {
            // Create a new session with user's personality
            const persona = getPersonaFromPersonality(personalityId);
            session = await createSession({
              name: "babe",
              persona: persona,
              audio_enabled: false,
            });
          }
        } catch (listError) {
          // If listing fails, try creating a new session
          const persona = getPersonaFromPersonality(personalityId);
          session = await createSession({
            name: "babe",
            persona: persona,
            audio_enabled: false,
          });
        }

        setChatSession(session);

        // Load conversation history
        if (session.history && session.history.length > 0) {
          const formattedMessages: ChatMessage[] = session.history.map((msg: any) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
            images: normalizeImages({
              image: msg.image,
              images: msg.images,
              attachments: msg.attachments,
            }),
          }));
          setMessages(formattedMessages);
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

  const normalizeImages = (data: {
    image?: MessageResponse["image"];
    images?: MessageResponse["images"];
    attachments?: MessageResponse["attachments"];
  }): string[] | undefined => {
    const imageUrl =
      typeof data.image === "string"
        ? data.image
        : data.image && typeof data.image === "object"
        ? data.image.url
        : undefined;

    const images = data.images?.filter((img) => typeof img === "string") || [];
    const attachments =
      data.attachments?.filter((attachment) => typeof attachment === "string") || [];

    const allImages = [imageUrl, ...images, ...attachments].filter(
      (img): img is string => typeof img === "string" && img.length > 0
    );
    const uniqueImages = Array.from(new Set(allImages));

    return uniqueImages.length > 0 ? uniqueImages : undefined;
  };

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
      };
      setMessages((prev) => [...prev, assistantMsg]);
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

  if (isPending || initializing) {
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
