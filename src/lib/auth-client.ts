"use client";

import { createAuthClient } from "better-auth/react";

// #region agent log
// Use current window origin to avoid port mismatch issues
const debugBaseURL = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
fetch('http://127.0.0.1:7242/ingest/83f7ebfb-fb98-414f-a762-f20f439aa009',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-client.ts:6',message:'Auth client baseURL',data:{baseURL:debugBaseURL,windowOrigin:typeof window !== 'undefined' ? window.location.origin : 'SSR'},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A',runId:'post-fix'})}).catch(()=>{});
// #endregion

export const authClient = createAuthClient({
  baseURL: debugBaseURL,
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

