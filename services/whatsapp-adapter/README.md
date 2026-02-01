# WhatsApp Adapter (Baileys)

Node service that bridges WhatsApp Web (Baileys) to the existing Chat0 message API.

## Setup

1. Copy env file:

```bash
cp .env.example .env
```

2. Install deps:

```bash
npm install
```

3. Start the service:

```bash
npm run dev
```

On first run, scan the QR in the console with WhatsApp (Linked Devices).

## Environment

- `WHATSAPP_API_BASE_URL`: Base URL for the Flask backend (e.g. `http://localhost:5000`).
- `WHATSAPP_TO_ALIAS`: Optional alias for the companion (e.g. `companion@whatsapp`).
- `CHAT0_API_TOKEN`: Optional bearer token for backend auth (not required for WhatsApp endpoint).
- `CHAT0_DEFAULT_PERSONA`: Optional persona for new sessions (unused by WhatsApp endpoint).
- `WHATSAPP_AUTH_DIR`: Directory to store WhatsApp auth state.
- `SESSION_STORE_PATH`: File path for WhatsApp JID to session mapping.
- `ALLOW_GROUPS`: Set `true` to respond in group chats.
- `PORT`: HTTP server port (health + send endpoint).

## Endpoints

- `GET /health` - basic status
- `POST /send` - send a WhatsApp message directly

Request body:

```json
{
  "to": "1234567890@s.whatsapp.net",
  "message": "Hello"
}
```
