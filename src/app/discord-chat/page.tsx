"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

interface DiscordInviteResponse {
  invite_url?: string;
  error?: string;
}

export default function DiscordChatPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const verificationUrl = useMemo(() => {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem("discordVerificationUrl") ||
      sessionStorage.getItem("discordVerificationUrl")
    );
  }, []);

  const instructions = useMemo(() => {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem("discordInstructions") ||
      sessionStorage.getItem("discordInstructions")
    );
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        setInviteError(null);
        const response = await fetch("/api/discord/invite", {
          method: "GET",
        });
        const data: DiscordInviteResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load invite link");
        }

        if (data.invite_url) {
          setInviteUrl(data.invite_url);
        }
      } catch (error) {
        setInviteError(error instanceof Error ? error.message : "Failed to load invite link");
      }
    };

    fetchInvite();
  }, []);

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
            Your Discord connection is almost ready.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/40">
          <div className="space-y-6">
            <div className="bg-black/30 border border-white/10 rounded-2xl p-5 sm:p-6">
              <h2 className="font-cormorant text-2xl sm:text-3xl text-white mb-2">
                Step 1: Invite the bot
              </h2>
              <p className="font-jakarta text-white/60 text-sm sm:text-base leading-relaxed">
                Add the bot to your Discord server so it can respond in mentions and DMs.
              </p>

              <div className="mt-5">
                {inviteUrl ? (
                  <a
                    href={inviteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-jakarta font-medium text-xs sm:text-sm hover:bg-white/90 transition-all duration-300 shadow-lg shadow-white/10"
                  >
                    Invite Discord Bot
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 text-white/70 font-jakarta font-medium text-xs sm:text-sm cursor-not-allowed"
                  >
                    Loading invite link...
                  </button>
                )}
              </div>

              {inviteError && (
                <p className="mt-3 font-jakarta text-sm text-red-400">{inviteError}</p>
              )}
            </div>

            <div className="bg-black/30 border border-white/10 rounded-2xl p-5 sm:p-6">
              <h2 className="font-cormorant text-2xl sm:text-3xl text-white mb-2">
                Step 2: Verify your Discord account
              </h2>
              <p className="font-jakarta text-white/60 text-sm sm:text-base leading-relaxed">
                Complete Discord OAuth once to link your Discord user with your Ophelia account.
              </p>

              <div className="mt-5">
                {verificationUrl ? (
                  <a
                    href={verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-jakarta font-medium text-xs sm:text-sm hover:bg-white/90 transition-all duration-300 shadow-lg shadow-white/10"
                  >
                    Verify with Discord
                  </a>
                ) : (
                  <p className="font-jakarta text-sm text-red-400">
                    Verification link missing. Please run onboarding again.
                  </p>
                )}
              </div>

              <p className="mt-3 font-jakarta text-[11px] text-white/50">
                After successful verification, you will be redirected to the Discord success page.
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5">
              <h3 className="font-cormorant text-xl text-white mb-2">What to do next</h3>
              <p className="font-jakarta text-white/70 text-sm leading-relaxed">
                {instructions ||
                  "Once linked, message the bot in DM, mention it in your server, or enable all-message mode on the backend if configured."}
              </p>

              <button
                type="button"
                onClick={() => router.push("/onboarding?edit=1")}
                className="mt-3 font-jakarta text-xs text-white/60 hover:text-white transition-colors"
              >
                Edit setup
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
