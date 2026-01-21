# Chat0 API Documentation for Next.js Integration

## Overview

The Chat0 API provides a chatbot service with Memory0 integration, supporting advanced memory management with Qdrant vector store and Neo4j graph relationships. This document explains how to integrate with the Flask API from your Next.js application.

## Base URL

```
http://localhost:5000  # Development
https://your-api-domain.com  # Production
```

## Authentication

### Better Auth Session Tokens

All Chat0 endpoints require Bearer token authentication using Better Auth session tokens.

**Header Format:**
```
Authorization: Bearer <session_token>
```

**How to Get Session Token in Next.js:**

```typescript
import { auth } from "@/auth"  // Your Better Auth instance

// Get session
const session = await auth()

// Extract token from session
const sessionToken = session?.token  // Or however Better Auth stores it
```

**Example API Call:**
```typescript
const response = await fetch('http://localhost:5000/api/chat0/message', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${sessionToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    session_id: '...',
    message: 'Hello!'
  })
})
```

## Endpoints

### 1. Create Chat Session

Create a new chat session for the authenticated user.

**Endpoint:** `POST /api/chat0/sessions`

**Request:**
```json
{
  "name": "babe",           // Optional: what to call the user (default: "babe")
  "persona": "loving",      // Optional: personality type (default: from user DB or "loving")
  "audio_enabled": false    // Optional: enable TTS responses (default: false)
}
```

**Response:**
```json
{
  "message": "Session created",
  "session": {
    "session_id": "uuid-here",
    "user_id": "user-id",
    "name": "babe",
    "persona": "loving",
    "history": [],
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00",
    "audio_enabled": false
  }
}
```

**TypeScript Example:**
```typescript
async function createSession(name?: string, persona?: string) {
  const session = await auth()
  const response = await fetch('http://localhost:5000/api/chat0/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session?.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name || 'babe',
      persona: persona || undefined,  // Will fetch from DB if not provided
      audio_enabled: false
    })
  })
  
  if (!response.ok) {
    throw new Error('Failed to create session')
  }
  
  const data = await response.json()
  return data.session
}
```

### 2. List Sessions

Get all chat sessions for the authenticated user.

**Endpoint:** `GET /api/chat0/sessions`

**Response:**
```json
{
  "sessions": [
    {
      "session_id": "uuid-1",
      "user_id": "user-id",
      "name": "babe",
      "persona": "loving",
      "message_count": 10,
      "created_at": "2024-01-01T00:00:00",
      "updated_at": "2024-01-01T00:00:00",
      "audio_enabled": false
    }
  ],
  "count": 1
}
```

**TypeScript Example:**
```typescript
async function listSessions() {
  const session = await auth()
  const response = await fetch('http://localhost:5000/api/chat0/sessions', {
    headers: {
      'Authorization': `Bearer ${session?.token}`
    }
  })
  
  const data = await response.json()
  return data.sessions
}
```

### 3. Get Session

Get a specific session with full conversation history.

**Endpoint:** `GET /api/chat0/sessions/<session_id>`

**Response:**
```json
{
  "session": {
    "session_id": "uuid-here",
    "user_id": "user-id",
    "name": "babe",
    "persona": "loving",
    "history": [
      {"role": "user", "content": "Hello!"},
      {"role": "assistant", "content": "Hey babe! How are you?"}
    ],
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00",
    "audio_enabled": false
  }
}
```

### 4. Send Message (Main Endpoint)

Send a message and get a reply. This is the primary endpoint for chat interactions.

**Endpoint:** `POST /api/chat0/message`

**Request:**
```json
{
  "session_id": "uuid-here",     // Required: session to use
  "message": "Hello!",            // Required: the user's message
  "generate_audio": false         // Optional: generate TTS for reply
}
```

**Response:**
```json
{
  "reply": "Hey babe! How are you doing?",
  "session_id": "uuid-here",
  "model": "x-ai/grok-4.1-fast",
  "memories_used": 3,
  "relations_used": 1,
  "persona": "loving",
  "audio": {                      // Only if generate_audio=true
    "url": "https://...",
    "filename": "..."
  }
}
```

**TypeScript Example:**
```typescript
async function sendMessage(sessionId: string, message: string) {
  const session = await auth()
  const response = await fetch('http://localhost:5000/api/chat0/message', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session?.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: message,
      generate_audio: false
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to send message')
  }
  
  const data = await response.json()
  return data
}
```

### 5. Quick Message (No Session)

Send a quick message without requiring a session. Creates a temporary session for this request only.

**Endpoint:** `POST /api/chat0/message/quick`

**Request:**
```json
{
  "message": "Hello!",            // Required: the user's message
  "name": "babe",                 // Optional: what to call the user
  "persona": "loving",            // Optional: personality type
  "generate_audio": false          // Optional: generate TTS
}
```

**Response:**
```json
{
  "reply": "Hey babe!",
  "model": "x-ai/grok-4.1-fast",
  "memories_used": 3,
  "relations_used": 1,
  "persona": "loving"
}
```

### 6. Update Session

Update a session's settings (name, persona, audio_enabled).

**Endpoint:** `PATCH /api/chat0/sessions/<session_id>`

**Request:**
```json
{
  "name": "honey",          // Optional: change user's name
  "persona": "tsundere",    // Optional: change personality
  "audio_enabled": true      // Optional: toggle audio
}
```

### 7. Delete Session

Delete a chat session.

**Endpoint:** `DELETE /api/chat0/sessions/<session_id>`

**Response:**
```json
{
  "message": "Session deleted",
  "session_id": "uuid-here"
}
```

### 8. Check Status

Check if Chat0 service is available and configured.

**Endpoint:** `GET /api/chat0/status`

**Response:**
```json
{
  "chat0_available": true,
  "memory0_available": true,
  "openrouter_configured": true,
  "qdrant_configured": true,
  "neo4j_configured": true
}
```

## Complete Next.js Integration Example

```typescript
// lib/chat0-api.ts

import { auth } from "@/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

async function getAuthHeaders() {
  const session = await auth()
  if (!session?.token) {
    throw new Error('Not authenticated')
  }
  
  return {
    'Authorization': `Bearer ${session.token}`,
    'Content-Type': 'application/json'
  }
}

export async function createChatSession(name?: string, persona?: string) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE_URL}/api/chat0/sessions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, persona })
  })
  
  if (!response.ok) throw new Error('Failed to create session')
  const data = await response.json()
  return data.session
}

export async function sendChatMessage(sessionId: string, message: string) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE_URL}/api/chat0/message`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      session_id: sessionId,
      message: message
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to send message')
  }
  
  return await response.json()
}

export async function listChatSessions() {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE_URL}/api/chat0/sessions`, {
    headers
  })
  
  if (!response.ok) throw new Error('Failed to list sessions')
  const data = await response.json()
  return data.sessions
}

export async function getChatSession(sessionId: string) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE_URL}/api/chat0/sessions/${sessionId}`, {
    headers
  })
  
  if (!response.ok) throw new Error('Failed to get session')
  const data = await response.json()
  return data.session
}
```

## React Component Example

```typescript
// components/ChatInterface.tsx

'use client'

import { useState, useEffect } from 'react'
import { sendChatMessage, createChatSession, getChatSession } from '@/lib/chat0-api'

export default function ChatInterface() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Create or load session on mount
    async function initSession() {
      try {
        const session = await createChatSession('babe', 'loving')
        setSessionId(session.session_id)
        
        // Load existing history if any
        if (session.history && session.history.length > 0) {
          setMessages(session.history)
        }
      } catch (error) {
        console.error('Failed to initialize session:', error)
      }
    }
    
    initSession()
  }, [])

  async function handleSend() {
    if (!input.trim() || !sessionId || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await sendChatMessage(sessionId, userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }])
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
```

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `201` - Created (for POST /sessions)
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found (session not found)
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

**TypeScript Error Handling:**
```typescript
try {
  const response = await fetch(url, options)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  
  return await response.json()
} catch (error) {
  if (error instanceof Error) {
    // Handle error
    console.error('API Error:', error.message)
  }
  throw error
}
```

## Persona Options

Available personas (must be configured in environment variables):
- `loving` - Warm, affectionate girlfriend
- `tsundere` - Playfully prickly, aloof on surface
- `submissive` - Gentle, sweet, eager to please
- `dominant` - Confident, assertive, in control
- `petplay_dominant` - Playful Owner/Mistress with petplay dynamics

The user's persona is automatically fetched from the database (`user.selectedPersonality`) if not specified in the request.

## Memory0 Features

The Chat0 service uses Memory0 for advanced memory management:
- **Vector Search**: Semantic search via Qdrant
- **Graph Relationships**: Entity relationships via Neo4j
- **Automatic Memory Extraction**: Memories are saved after each message exchange

The response includes:
- `memories_used`: Number of memories retrieved for context
- `relations_used`: Number of graph relationships used

## Session Management

- Sessions are persisted in the database
- Full conversation history is stored (no limit)
- Only last N messages (configurable via `MAX_CONVERSATION_HISTORY`) are used for chat context
- Sessions survive server restarts

## Environment Variables for Next.js

Add to your Next.js `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
# Or in production:
# NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Notes

1. **Authentication**: Always include `Authorization: Bearer <token>` header
2. **Session Management**: Create a session once, reuse the `session_id` for all messages
3. **Error Handling**: Always check `response.ok` and handle errors gracefully
4. **Loading States**: Show loading indicators while waiting for API responses
5. **Memory**: The API automatically saves memories - no additional calls needed

