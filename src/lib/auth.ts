import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import { appendFileSync } from "fs";

// #region agent log
const logAuthConfig = (data: Record<string, unknown>) => {
  try {
    appendFileSync('/Users/adityadesai/Desktop/projects/gf_frontend/.cursor/debug.log', JSON.stringify({...data, timestamp: Date.now(), sessionId: 'debug-session', runId: 'config-check'}) + '\n');
  } catch {}
};
logAuthConfig({
  location: 'auth.ts:config',
  message: 'Auth config loading',
  data: {
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    googleClientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
    betterAuthUrl: process.env.BETTER_AUTH_URL,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
  },
  hypothesisId: 'F'
});
// #endregion

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.BETTER_AUTH_URL || "",
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        defaultValue: null,
      },
      phoneVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      selectedPersonality: {
        type: "string",
        required: false,
        defaultValue: null,
      },
      selectedPhoto: {
        type: "string",
        required: false,
        defaultValue: null,
      },
      selectedAudio: {
        type: "string",
        required: false,
        defaultValue: null,
      },
      communicationChannel: {
        type: "string",
        required: false,
        defaultValue: null,
      },
      onboardingCompleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
  plugins: [nextCookies()],
});

export type Auth = typeof auth;
