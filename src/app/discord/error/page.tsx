"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  missing_params: "The verification callback is missing required parameters. Please try again.",
  invalid_token: "Your verification token is invalid or expired. Start onboarding again.",
  oauth_not_configured: "Discord OAuth is not configured on the backend yet.",
  token_exchange_failed: "Discord token exchange failed. Please retry verification.",
  no_access_token: "Discord did not return an access token. Please retry.",
  user_info_failed: "Failed to load your Discord profile. Please retry.",
  no_discord_id: "Discord account ID was missing in the OAuth response.",
  verification_failed: "We could not verify your Discord account. Please try again.",
  server_error: "A server error occurred during Discord verification.",
};

export default function DiscordErrorPage() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || "server_error";

  const message = useMemo(() => {
    return ERROR_MESSAGES[errorCode] || "Discord verification failed. Please try again.";
  }, [errorCode]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-6 sm:p-6">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-black/40">
        <h1 className="font-cormorant text-3xl sm:text-4xl text-white tracking-wide">
          Discord Verification Failed
        </h1>
        <p className="mt-3 font-jakarta text-sm sm:text-base text-white/70 leading-relaxed">
          {message}
        </p>

        <p className="mt-3 font-jakarta text-xs text-white/40">Error code: {errorCode}</p>

        <div className="mt-6">
          <a
            href="/discord-chat"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-jakarta font-medium text-sm hover:bg-white/90 transition-all duration-300"
          >
            Retry Discord setup
          </a>
        </div>
      </div>
    </main>
  );
}
