"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const rawUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "";
const TELEGRAM_BOT_USERNAME = rawUsername.replace(/^@/, "") || "your_bot_username";

export default function TelegramChatPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [authCode] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return sessionStorage.getItem("telegramAuthCode");
  });

  const telegramLink = useMemo(() => {
    if (!TELEGRAM_BOT_USERNAME) {
      return "https://t.me";
    }

    if (!authCode) {
      return `https://t.me/${TELEGRAM_BOT_USERNAME}`;
    }

    return `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${encodeURIComponent(authCode)}`;
  }, [authCode]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-white/50 font-jakarta">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-6 sm:p-6">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-cormorant text-3xl sm:text-4xl md:text-4xl text-white tracking-wide">
            Ophelia
          </h1>
          <p className="font-jakarta text-xs mt-2 text-white/50">
            Your Telegram connection is ready.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/40">
          <div className="flex flex-col items-center text-center gap-5 sm:gap-6">
            <div className="w-full max-w-lg bg-black/30 border border-white/10 rounded-2xl p-5 sm:p-6">
              <h2 className="font-cormorant text-2xl sm:text-3xl text-white mb-3">
                Connect with Telegram
              </h2>
              <p className="font-jakarta text-white/60 text-sm sm:text-base leading-relaxed">
                Tap below to open Telegram and send your connection code to @{TELEGRAM_BOT_USERNAME}.
              </p>

              {authCode && (
                <div className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2">
                  <span className="font-jakarta text-xs text-white/60">Your code</span>
                  <span className="font-mono text-sm text-white">{authCode}</span>
                </div>
              )}

              <div className="mt-6">
                <a
                  href={telegramLink}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-jakarta font-medium text-xs sm:text-sm hover:bg-white/90 transition-all duration-300 shadow-lg shadow-white/10"
                >
                  Open Telegram
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

              <p className="mt-3 font-jakarta text-[11px] text-white/50">
                If Telegram is already installed, this opens directly to your bot chat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
