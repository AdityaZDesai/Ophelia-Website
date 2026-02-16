# Discord Integration Handoff (Frontend Agent)

This document explains how the Discord integration works in this repo, from onboarding through live chat behavior, so frontend can integrate safely.

## High-Level Architecture

- The integration has **two backend runtimes**:
  - **Flask API** (OAuth + onboarding endpoints)
  - **Discord bot process** (`discord_bot.py`) for live Discord messaging
- `run.py` starts only the Flask API. The Discord bot must be run separately.
- User account linking is stored in the DB and looked up by Discord user ID.

Key files:
- `app/blueprints/discord.py`
- `app/blueprints/user.py`
- `discord_bot.py`
- `app/services/db_service.py`
- `app/services/chat0_service.py`

## End-to-End User Flow

### 1) Onboarding (Web App)

Frontend calls:
- `POST /api/user/onboarding`

Request body (Discord case):

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "selectedPersonality": "loving",
  "communicationChannel": "discord"
}
```

Behavior:
- Backend creates or updates user as unverified.
- Backend generates a secure verification token.
- Backend stores that token (prefers `discord_verification_token`, falls back to `auth_code`).
- Backend returns a Discord OAuth URL in `verification_url`.

Expected response fields:
- `success`
- `user_id`
- `verification_url`
- `verification_token`
- `instructions`

### 2) Bot Invite Link

Frontend calls:
- `GET /api/discord/invite`

Behavior:
- Returns `invite_url` for adding bot to server.
- Uses `DISCORD_BOT_INVITE_URL` if configured, otherwise constructs a default invite URL.

### 3) OAuth Verification

User clicks `verification_url`.

OAuth callback endpoint:
- `GET /api/discord/callback`

Server-side callback behavior:
- Reads `code` and `state` (`state` is the verification token).
- Resolves user by stored token.
- Exchanges code for Discord access token.
- Fetches Discord profile from `/users/@me`.
- Stores Discord user ID in DB and marks user verified.
- Clears verification token.
- Redirects to frontend pages:
  - Success: `{WEB_APP_BASE_URL}/discord/success?username={discord_username}`
  - Error: `{WEB_APP_BASE_URL}/discord/error?error={error_code}`

## Verification Modes Supported

### Preferred: OAuth auto-verification
- Main flow for frontend.
- No manual code entry needed by user after OAuth success.

### Fallback: Manual auth code in Discord
- Bot supports `/login <auth_code>`.
- Useful if OAuth was skipped or failed.

## How Bot-Side Authentication Works

At message time, bot maps Discord account to DB user:
- Checks in-memory cache first.
- Then DB lookup by Discord ID.
- Requires `verified=true` unless bypass mode is enabled.

If not linked:
- Bot replies with login instructions and blocks chat.

## Live Messaging Behavior

The bot responds when:
- User DMs bot, or
- User mentions bot in a server channel, or
- `RESPOND_TO_ALL_MESSAGES=true`

For authenticated users:
- Bot sends message + history to `chat0_service`.
- Service returns `reply` and optionally `voice_note` and/or `image_job`.
- Bot posts text reply.
- If `voice_note` present, bot downloads and uploads mp3 to Discord.
- If image URL is immediate, bot posts image.
- If async image job is queued, bot posts queue message and sends image later when job completes.

## Async Image Job Notes

- Jobs are queued to Redis/Celery.
- Bot has a background loop polling for completed jobs every 5 seconds.
- On completion, bot downloads and posts the image to the original Discord channel.

Operational dependency for image jobs:
- Redis + Celery worker must be running.

## Frontend Responsibilities

1. Build onboarding UI that submits `communicationChannel: "discord"`.
2. Show both links after onboarding:
   - Add bot link (`/api/discord/invite`)
   - OAuth verification link (`verification_url` from onboarding)
3. Implement callback destination pages:
   - `/discord/success`
   - `/discord/error`
4. Map backend error query params to user-friendly messages.
5. Guide user to Discord after success (for DM/mention interaction).

## OAuth Error Codes You Should Handle

Possible `error` query values on `/discord/error` redirect:
- `missing_params`
- `invalid_token`
- `oauth_not_configured`
- `token_exchange_failed`
- `no_access_token`
- `user_info_failed`
- `no_discord_id`
- `verification_failed`
- `server_error`

## Environment Variables (Backend)

Required for OAuth flow:
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_REDIRECT_URI` (must match Discord app settings)
- `WEB_APP_BASE_URL`

Bot runtime:
- `DISCORD_BOT_TOKEN`

Optional:
- `DISCORD_BOT_INVITE_URL`
- `RESPOND_TO_ALL_MESSAGES`
- `BYPASS_AUTH` (testing only)

## Local/QA Checklist

- Flask API running (`python run.py`)
- Discord bot running (`python discord_bot.py`)
- Redis running (for image jobs)
- Celery worker running (for image generation tasks)
- Discord OAuth redirect URL matches environment value exactly
