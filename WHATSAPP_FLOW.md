# WhatsApp Integration Flow (Baileys Adapter + Chat0 Backend)

This document explains how the WhatsApp integration works in this repo and how to design a WhatsApp-specific backend endpoint.

## Architecture

- **WhatsApp Adapter (Node + Baileys)**: A standalone service that links to a WhatsApp account via QR code and connects over WhatsApp Web's WebSocket protocol.
- **Chat0 Backend (Flask)**: Existing message API (`/api/chat0/message`, `/api/chat0/sessions`) that generates replies.
- **Frontend (Next.js)**: Not required for WhatsApp, but uses the same Chat0 backend.

Key idea: the adapter is the WhatsApp client. It receives inbound WhatsApp messages, forwards them to Chat0, then sends Chat0's reply back to WhatsApp.

## WhatsApp Linking Flow

1. The adapter starts and requests a QR code from WhatsApp servers.
2. The QR is scanned by a phone (Linked Devices).
3. WhatsApp approves the adapter as a linked device and issues long-lived credentials.
4. The adapter stores credentials in its auth directory for reconnects.
5. A WebSocket session stays open for real-time send/receive.

Notes:
- QR codes expire quickly (scan within ~30-60 seconds).
- If the device is unlinked, the auth state must be cleared and re-scanned.

## Message Flow (Inbound)

1. A user sends a WhatsApp message to the linked account.
2. The adapter receives the message event.
3. The adapter forwards the message to `POST /api/whatsapp/message`.
4. The backend resolves the user, creates/reuses a Chat0 session, and returns a response.
5. The adapter sends the reply back to the same WhatsApp chat.

## Message Flow (Outbound)

1. Your backend or ops tool calls the adapter HTTP endpoint.
2. The adapter sends a WhatsApp message to the specified JID or phone.
3. If the recipient replies, the inbound flow above triggers and the adapter replies via Chat0.

## Adapter Send-Media Endpoint

`POST http://localhost:8081/send-media`

Use this endpoint when you want Celery (or any backend worker) to send images or voice notes directly through the adapter.

**Payload (single image + optional caption)**
```json
{
  "to": "15551234567",
  "image_url": "https://cdn.example.com/image.png",
  "caption": "Optional text"
}
```

**Payload (multiple images + optional caption)**
```json
{
  "to": "15551234567",
  "attachments": [
    "https://cdn.example.com/1.png",
    "https://cdn.example.com/2.png"
  ],
  "caption": "Only used on first image"
}
```

**Payload (voice note only)**
```json
{
  "to": "15551234567",
  "voice_url": "https://cdn.example.com/voice.mp3"
}
```

**Payload (images + voice note)**
```json
{
  "to": "15551234567",
  "attachments": [
    "https://cdn.example.com/1.png"
  ],
  "caption": "Only used on first image",
  "voice_url": "https://cdn.example.com/voice.mp3"
}
```

Notes:
- `to` can be a raw phone number or a WhatsApp JID (e.g., `15551234567@s.whatsapp.net`).
- `attachments` are treated as image URLs. The first image gets the caption, if provided.
- `voice_url` is sent as an MP3 voice note.
- No auth headers are required by default.

## WhatsApp-Specific Endpoint

`POST /api/whatsapp/message`

**Request (example)**
```json
{
  "from": "15551234567@whatsapp",
  "to": "companion@whatsapp",
  "text": "Hello",
  "timestamp": 1700000000,
  "metadata": {
    "jid": "15551234567@s.whatsapp.net",
    "push_name": "Alex",
    "message_id": "ABC123"
  }
}
```

**Response (example)**
```json
{
  "reply": "Hey! How are you?",
  "session_id": "...",
  "handled": true,
  "attachments": [
    "https://.../image.png"
  ],
  "voice_note": {
    "url": "https://.../voice.mp3"
  }
}
```

### What this endpoint should do

- Authenticate the adapter (service token or shared secret).
- Map `from` to a user record (or anonymous user).
- Resolve or create a Chat0 session ID per WhatsApp contact.
- Call Chat0 core (`/api/chat0/message`) with the message content.
- Return the reply to the adapter.

## Implemented Endpoint

Behavior:
- Accepts the request payload shown above (Option A).
- Bypasses Better Auth and instead checks that the inbound number maps to a user in the database.
- Creates or reuses a Chat0 session for that user and returns `{ reply, session_id, handled }`.
- Returns `attachments` and `voice_note` so the adapter can send images/audio.
- Ignores duplicates when `metadata.message_id` repeats within the TTL window.

Adapter handling:
- Sends `attachments` as image messages. The first image uses `reply` as its caption.
- Sends `voice_note.url` as a WhatsApp voice note (MP3).
- If no media is present, sends `reply` as a text message.

Example curl:
```bash
curl -X POST http://localhost:5000/api/whatsapp/message \
  -H "Content-Type: application/json" \
  -d '{
    "from": "15551234567@whatsapp",
    "to": "companion@whatsapp",
    "text": "Hello",
    "timestamp": 1700000000,
    "metadata": {
      "jid": "15551234567@s.whatsapp.net",
      "push_name": "Alex",
      "message_id": "ABC123"
    }
  }'
```

### Optional enhancements

- **Allowlist**: only respond to known users.
- **Persona mapping**: set persona per user or per number.
- **Attachments**: store incoming media and pass links to Chat0.
- **Rate limiting**: protect the endpoint from spam.
- **Audit trail**: log all inbound/outbound messages.

## Auth Considerations

The adapter runs outside the web app, so it does not have user cookies.
Use one of:

- **Service token**: recommended. Adapter sends `Authorization: Bearer <token>`.
- **Shared secret header**: e.g., `X-Adapter-Token: ...`.

## Operational Notes

- The adapter should run in its own process or container.
- Persist auth state in the adapter so re-linking is not required.
- Monitor `connection.update` events and handle logged-out cases.

## Relevant Files

- `services/whatsapp-adapter/src/index.ts` (adapter logic)
- `CHAT0_API_DOCS.md` (Chat0 backend API)
