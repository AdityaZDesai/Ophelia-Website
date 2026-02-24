# Discord Backend Requirements (Flask)

This document defines exactly what the frontend now sends and expects for Discord onboarding.

## Current Frontend Behavior

When user selects Discord in onboarding, frontend does two things:

1. Saves onboarding selections in frontend DB (`user` table)
2. Calls Flask `POST /api/user/onboarding` for Discord OAuth setup

## Payload Sent to Flask

Endpoint called by frontend server route:

- `POST {harmonica_API_URL}/api/user/onboarding`

JSON body sent for Discord:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "selectedPersonalityId": "vanilla",
  "selectedPersonality": "loving",
  "selectedPhoto": "serena",
  "selectedAudio": "jessica_v3",
  "communicationChannel": "discord"
}
```

Notes:

- `selectedPersonalityId` is frontend personality id (`vanilla`, `goth`, etc).
- `selectedPersonality` is mapped to backend persona (`loving`, `tsundere`, `dominant`) for compatibility.
- `selectedPhoto` and `selectedAudio` are now included and should be persisted if needed by backend features.

## Response Required from Flask

For successful Discord onboarding setup, Flask must return:

```json
{
  "success": true,
  "verification_url": "https://discord.com/oauth2/authorize?...",
  "verification_token": "secure_token_here",
  "instructions": "Optional UX guidance text"
}
```

Required fields for frontend flow:

- `verification_url` (required)
- `verification_token` (strongly recommended; frontend stores and mirrors to local auth_code)
- `instructions` (optional)

On error, return non-2xx and:

```json
{
  "error": "human_readable_message"
}
```

## Invite Endpoint Required

Frontend Discord setup page calls:

- `GET {harmonica_API_URL}/api/discord/invite`

Return:

```json
{
  "invite_url": "https://discord.com/oauth2/authorize?client_id=..."
}
```

## OAuth Callback Redirects Required

After Discord OAuth, Flask callback should redirect browser to frontend pages:

- Success: `{WEB_APP_BASE_URL}/discord/success?username={discord_username}`
- Error: `{WEB_APP_BASE_URL}/discord/error?error={error_code}`

Supported error codes on frontend error page:

- `missing_params`
- `invalid_token`
- `oauth_not_configured`
- `token_exchange_failed`
- `no_access_token`
- `user_info_failed`
- `no_discord_id`
- `verification_failed`
- `server_error`

## Backend Data to Persist

For Discord users, backend should persist at least:

- Linkage fields (`discord_user_id`, verification state, etc)
- `selectedPersonality` or mapped persona
- `selectedPhoto`
- `selectedAudio`

This ensures backend bot/runtime has all onboarding preferences.

## Frontend Routing Already Implemented

Frontend already supports:

- Discord option in onboarding channel selector
- Discord setup page at `/discord-chat`
- Invite button + verification button UI
- Callback pages:
  - `/discord/success`
  - `/discord/error`

No additional frontend changes are required for this contract.
