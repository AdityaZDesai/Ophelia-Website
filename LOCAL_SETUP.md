# Local Development Setup Guide

This guide will help you run the frontend website locally for testing.

## Prerequisites

1. **Node.js** (v18 or higher)
   - Check if installed: `node --version`
   - Download: https://nodejs.org/

2. **npm** or **yarn** or **pnpm**
   - Usually comes with Node.js
   - Check: `npm --version`

3. **Backend API running**
   - The Flask backend should be running on `http://localhost:5000`
   - See the main repo's `SETUP.md` for backend setup

## Quick Start

### 1. Install Dependencies

```bash
cd LoveHarmoica-Website
npm install
```

Or if using yarn:
```bash
yarn install
```

Or if using pnpm:
```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root of the frontend project:

```env
# Backend API URL (where your Flask API is running)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# App URL (for Better Auth)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database URL (for Better Auth - should match your backend database)
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://postgres:password@localhost:5432/gf_chatbot

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here-generate-random-string
BETTER_AUTH_URL=http://localhost:3000

# Optional: Social Login (Google/GitHub)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GITHUB_CLIENT_ID=your-github-client-id
# GITHUB_CLIENT_SECRET=your-github-client-secret
```

**To generate a secret key:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 3. Start the Development Server

```bash
npm run dev
```

Or:
```bash
yarn dev
```

Or:
```bash
pnpm dev
```

### 4. Open in Browser

The site will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000 (should be running separately)

## Testing the Discord Integration

### 1. Make Sure Backend is Running

```bash
# In the backend repo (gf_learning_ai)
python run.py
```

The backend should be running on `http://localhost:5000`

### 2. Make Sure Discord Bot is Running (Optional)

If you want to test Discord integration:
```bash
# In the backend repo
python discord_bot.py
```

### 3. Test the Flow

1. **Open the frontend:** http://localhost:3000
2. **Sign up / Log in** using Better Auth
3. **Go to onboarding:** Select Discord as communication channel
4. **Complete Discord OAuth:** Click the verification link
5. **Verify:** You should be redirected back to success page

## Common Issues

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
npm run dev -- -p 3001
```

Then update `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Backend Connection Errors

Make sure:
- Backend is running on `http://localhost:5000`
- `NEXT_PUBLIC_BACKEND_URL` is set correctly in `.env.local`
- No CORS issues (backend should allow localhost:3000)

### Database Connection Issues

Make sure:
- PostgreSQL is running
- `DATABASE_URL` in `.env.local` matches your backend database
- Database credentials are correct

### Better Auth Issues

Make sure:
- `BETTER_AUTH_SECRET` is set (use a random string)
- `BETTER_AUTH_URL` matches your frontend URL
- Database tables are created (Better Auth will create them automatically)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Project Structure

```
LoveHarmoica-Website/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── onboarding/   # Onboarding flow
│   │   ├── discord/      # Discord OAuth pages
│   │   └── chat/         # Chat interface
│   ├── components/       # React components
│   ├── lib/              # Utilities and config
│   └── types/            # TypeScript types
├── public/               # Static assets
├── .env.local           # Environment variables (create this)
└── package.json         # Dependencies
```

## Testing Checklist

- [ ] Frontend starts on http://localhost:3000
- [ ] Can sign up / log in
- [ ] Onboarding page loads
- [ ] Can select Discord channel
- [ ] Discord OAuth link is generated
- [ ] Can complete Discord verification
- [ ] Redirects to success page
- [ ] Backend API calls work
- [ ] Database connection works

## Next Steps

1. Test the full user flow
2. Test Discord bot integration
3. Test other communication channels (WhatsApp, iMessage, Web)
4. Check console for any errors
5. Test on different browsers

## Need Help?

- Check browser console for errors
- Check backend logs for API errors
- Verify all environment variables are set
- Make sure all services are running (PostgreSQL, Redis, etc.)

