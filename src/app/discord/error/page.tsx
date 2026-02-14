"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const ERROR_MESSAGES: Record<string, string> = {
  missing_params: "Missing required parameters. Please try again.",
  invalid_token: "Invalid verification token. Please start over.",
  oauth_not_configured: "Discord OAuth is not configured. Please contact support.",
  token_exchange_failed: "Failed to exchange authorization code. Please try again.",
  no_access_token: "Failed to get access token. Please try again.",
  user_info_failed: "Failed to get Discord user info. Please try again.",
  no_discord_id: "Failed to get Discord ID. Please try again.",
  verification_failed: "Failed to verify account. Please contact support.",
  server_error: "An error occurred. Please try again later.",
};

export default function DiscordErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "server_error";
  const errorMessage = ERROR_MESSAGES[error] || "An unknown error occurred.";

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="font-cormorant text-3xl md:text-4xl text-white mb-4">
          Discord Verification Failed
        </h1>
        <p className="font-jakarta text-white/60 mb-8">
          {errorMessage}
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-jakarta font-medium rounded-xl hover:bg-white/90 transition-all"
          >
            Try Again
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </Link>
          <button
            onClick={() => router.push("/")}
            className="block w-full font-jakarta text-sm text-white/50 hover:text-white transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </main>
  );
}

