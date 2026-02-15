# Telegram Backend Integration Notes (Flask)

This file is for the Flask backend agent to implement Telegram end-to-end.

## Current Frontend Behavior (already implemented)

- On onboarding, users can now choose `telegram` as `communicationChannel`.
- Frontend calls `POST /api/user/onboarding` and expects an `authCode` in response for Telegram.
- The onboarding API currently stores:
  - `user.communicationChannel = 'telegram'`
  - `user.auth_code = <6-digit-code>`
  - `user.verified = false`
- Frontend stores the code in `sessionStorage['telegramAuthCode']`.
- Frontend sends users to `/telegram-chat`, which opens:
  - `https://t.me/<BOT_USERNAME>?start=<authCode>`

So the backend must verify `/start <authCode>` and link that Telegram chat to the user.

## Required Env Vars (Flask)

Add these variables to Flask runtime config:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`
- `TELEGRAM_BOT_USERNAME`
- `TELEGRAM_WEBHOOK_URL` (public https URL for webhook)
- `CHAT0_API_URL` (if needed for downstream calls)

## Database Changes

Add Telegram linkage fields to `user` table (or create a separate mapping table if preferred):

- `telegram_chat_id` (string or bigint-safe text)
- `telegram_username` (nullable)
- `telegram_linked_at` (timestamp, nullable)

Keep using existing fields:

- `auth_code` for connect code
- `verified` as final link status
- `communicationChannel = 'telegram'`

## Telegram Webhook Endpoint

Implement a Flask route, for example:

- `POST /api/telegram/webhook`

### Security

Validate request header:

- `X-Telegram-Bot-Api-Secret-Token == TELEGRAM_WEBHOOK_SECRET`

Reject with `401` if invalid.

### Supported Update Type

Start with `message` only (private chats).

Ignore if:

- no `message`
- no `message.text`
- `message.chat.type != 'private'`

## `/start` Verification Flow

When user sends `/start <payload>`:

1. Parse `<payload>` as `auth_code`.
2. Query user by `auth_code` and `communicationChannel='telegram'`.
3. If not found: send Telegram message: "Invalid or expired code. Please reconnect from the app." and return.
4. If found:
   - set `telegram_chat_id = str(message.chat.id)`
   - set `telegram_username = message.from.username` (if present)
   - set `verified = true`
   - optional: clear `auth_code` after successful verification
   - set `telegram_linked_at = now()`
5. Send confirmation message: "Connected. You can now chat here."

## Normal Telegram Message Flow

For non-`/start` text messages:

1. Look up user by `telegram_chat_id`.
2. If no linked user: ask user to connect from app first using `/start` link.
3. If linked:
   - get/create chat session for that user in your chat engine
   - generate assistant reply
   - send reply via Telegram `sendMessage`

## Chat Engine Integration Options

Pick one stable path and keep it consistent:

1. Preferred: call your internal chat service directly by `user_id`.
2. Alternative: expose a service-authenticated backend endpoint for Telegram worker (not user-session auth).

Note: Telegram webhook requests do not include Better Auth session tokens, so direct calls to user-token-protected endpoints usually will not work without service credentials.

## Telegram API Helpers

Use Bot API base:

- `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/...`

Implement helper:

- `send_telegram_message(chat_id, text)` -> POST `/sendMessage`

Optional helper:

- `setWebhook` on startup/deploy
- `getWebhookInfo` for health checks

## Webhook Setup Command

Use this once per environment:

```bash
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://YOUR_DOMAIN/api/telegram/webhook",
    "secret_token": "YOUR_SECRET",
    "allowed_updates": ["message"],
    "drop_pending_updates": true
  }'
```

Verify:

```bash
curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo"
```

## Minimal Flask Pseudocode

```python
@app.post("/api/telegram/webhook")
def telegram_webhook():
    secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token")
    if secret != TELEGRAM_WEBHOOK_SECRET:
        return {"error": "unauthorized"}, 401

    update = request.get_json(silent=True) or {}
    message = update.get("message")
    if not message:
        return {"ok": True}, 200

    chat = message.get("chat", {})
    if chat.get("type") != "private":
        return {"ok": True}, 200

    chat_id = str(chat.get("id"))
    text = (message.get("text") or "").strip()

    if text.startswith("/start"):
        code = parse_start_code(text)  # '/start 123456' -> '123456'
        user = find_user_by_auth_code_and_channel(code, "telegram")
        if not user:
            send_telegram_message(chat_id, "Invalid or expired code. Reconnect from the app.")
            return {"ok": True}, 200

        link_telegram_to_user(user.id, chat_id, message.get("from", {}).get("username"))
        send_telegram_message(chat_id, "Connected! You can chat with me here now.")
        return {"ok": True}, 200

    user = find_user_by_telegram_chat_id(chat_id)
    if not user:
        send_telegram_message(chat_id, "Please connect from the app first.")
        return {"ok": True}, 200

    reply = generate_reply_for_user(user.id, text)
    send_telegram_message(chat_id, reply)
    return {"ok": True}, 200
```

## Testing Checklist

1. User selects Telegram in frontend onboarding.
2. Confirm DB row has `communicationChannel='telegram'`, `auth_code` set, `verified=false`.
3. Open deep link from `/telegram-chat` page.
4. Send `/start <code>` in Telegram.
5. Confirm DB stores `telegram_chat_id` and sets `verified=true`.
6. Send normal message in Telegram and receive assistant response.
7. Confirm unlinked chat IDs receive connect instructions.

## Notes

- Keep bot token server-side only; never expose in frontend.
- Use idempotency for duplicate updates (`update_id`) if needed.
- Return HTTP `200` quickly from webhook; do heavy work async if latency grows.
