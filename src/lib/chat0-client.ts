"use client";

/**
 * Client-side API helper for Chat0 endpoints
 * All requests go through Next.js API routes which handle authentication
 */

export interface ChatSession {
  session_id: string;
  user_id: string;
  name: string;
  persona: string;
  history: Array<{ role: string; content: string }>;
  created_at: string;
  updated_at: string;
  audio_enabled: boolean;
  message_count?: number;
}

export interface MessageResponse {
  reply: string;
  session_id: string;
  model: string;
  memories_used: number;
  relations_used: number;
  persona: string;
  audio?: {
    url: string;
    filename: string;
  };
  image?: string; // URL or base64
  images?: string[]; // Array of image URLs or base64
}

export interface CreateSessionRequest {
  name?: string;
  persona?: string;
  audio_enabled?: boolean;
}

export interface UpdateSessionRequest {
  name?: string;
  persona?: string;
  audio_enabled?: boolean;
}

export interface SendMessageRequest {
  session_id: string;
  message: string;
  generate_audio?: boolean;
}

/**
 * Create a new chat session
 */
export async function createSession(
  options?: CreateSessionRequest
): Promise<ChatSession> {
  const response = await fetch("/api/chat0/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options || {}),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create session");
  }

  const data = await response.json();
  return data.session;
}

/**
 * List all chat sessions for the current user
 */
export async function listSessions(): Promise<ChatSession[]> {
  const response = await fetch("/api/chat0/sessions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to list sessions");
  }

  const data = await response.json();
  return data.sessions || [];
}

/**
 * Get a specific session with full history
 */
export async function getSession(sessionId: string): Promise<ChatSession> {
  const response = await fetch(`/api/chat0/sessions/${sessionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get session");
  }

  const data = await response.json();
  return data.session;
}

/**
 * Send a message and get a reply
 */
export async function sendMessage(
  sessionId: string,
  message: string,
  generateAudio = false
): Promise<MessageResponse> {
  const response = await fetch("/api/chat0/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: message,
      generate_audio: generateAudio,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send message");
  }

  return await response.json();
}

/**
 * Update a session's settings
 */
export async function updateSession(
  sessionId: string,
  updates: UpdateSessionRequest
): Promise<ChatSession> {
  const response = await fetch(`/api/chat0/sessions/${sessionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update session");
  }

  const data = await response.json();
  return data.session;
}

/**
 * Delete a chat session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const response = await fetch(`/api/chat0/sessions/${sessionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete session");
  }
}

