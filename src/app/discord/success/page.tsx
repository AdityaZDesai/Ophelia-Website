"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function DiscordSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "there";

  useEffect(() => {
    // Redirect to chat after 3 seconds
    const timer = setTimeout(() => {
      router.push("/chat");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="font-cormorant text-3xl md:text-4xl text-white mb-4">
          Discord Account Connected!
        </h1>
        <p className="font-jakarta text-white/60 mb-8">
          Welcome, <span className="text-white font-medium">{username}</span>!
        </p>
        <p className="font-jakarta text-white/60 mb-8">
          Your Discord account has been successfully linked. You can now chat with Ophelia on Discord!
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-jakarta font-medium rounded-xl hover:bg-white/90 transition-all"
          >
            Go to Chat
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
          <p className="font-jakarta text-xs text-white/40">
            Redirecting automatically in 3 seconds...
          </p>
        </div>
      </div>
    </main>
  );
}

