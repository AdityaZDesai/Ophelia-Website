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
3. The adapter maps the WhatsApp sender (JID) to a Chat0 session ID.
   - If none exists, it creates a new session in Chat0.
4. The adapter sends the message text to Chat0 via `/api/chat0/message`.
5. Chat0 returns a reply.
6. The adapter sends the reply back to the same WhatsApp chat.

## Message Flow (Outbound)

1. Your backend or ops tool calls the adapter HTTP endpoint.
2. The adapter sends a WhatsApp message to the specified JID or phone.
3. If the recipient replies, the inbound flow above triggers and the adapter replies via Chat0.

## WhatsApp-Specific Endpoint Proposal

If you want a dedicated WhatsApp endpoint on the backend, implement:

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
  "handled": true
}
```

### What this endpoint should do

- Authenticate the adapter (service token or shared secret).
- Map `from` to a user record (or anonymous user).
- Resolve or create a Chat0 session ID per WhatsApp contact.
- Call Chat0 core (`/api/chat0/message`) with the message content.
- Return the reply to the adapter.

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
- Persist auth state and the WhatsApp JID -> session mapping.
- Monitor `connection.update` events and handle logged-out cases.

## Relevant Files

- `services/whatsapp-adapter/src/index.ts` (adapter logic)
- `CHAT0_API_DOCS.md` (Chat0 backend API)
