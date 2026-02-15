"use client";

import { useSearchParams } from "next/navigation";

export default function DiscordSuccessPage() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-6 sm:p-6">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-black/40">
        <h1 className="font-cormorant text-3xl sm:text-4xl text-white tracking-wide">
          Discord Connected
        </h1>
        <p className="mt-3 font-jakarta text-sm sm:text-base text-white/70 leading-relaxed">
          {username
            ? `@${username} is now linked. You can start chatting with Ophelia in Discord.`
            : "Your Discord account is now linked. You can start chatting with Ophelia in Discord."}
        </p>

        <div className="mt-6">
          <a
            href="/discord-chat"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-jakarta font-medium text-sm hover:bg-white/90 transition-all duration-300"
          >
            Back to Discord setup
          </a>
        </div>
      </div>
    </main>
  );
}
