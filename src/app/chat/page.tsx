"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

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

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
      <div className="text-center">
        {/* Logo */}
        <h1 className="font-cormorant text-4xl md:text-5xl text-white mb-4">
          Ophelia
        </h1>
        
        {/* Welcome Message */}
        <div className="mb-8">
          <p className="font-jakarta text-xl text-white/80 mb-2">
            Welcome, {session?.user?.name || "friend"} 
          </p>
          <p className="font-jakarta text-white/50">
            Your companion is ready to meet you.
          </p>
        </div>

        {/* Placeholder for chat interface */}
        <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-rose-100 flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
            <div className="text-left">
              <p className="font-cormorant text-xl text-white">Serena</p>
              <p className="font-jakarta text-xs text-white/50">Online</p>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <p className="font-jakarta text-white/80 text-sm">
              Hello! I&apos;ve been waiting for you. How are you feeling today?
            </p>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 font-jakarta text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <button className="px-4 py-3 bg-white text-black rounded-xl font-jakarta text-sm font-medium hover:bg-white/90 transition-colors">
              Send
            </button>
          </div>
        </div>

        <p className="mt-8 font-jakarta text-xs text-white/30">
          This is a placeholder. Chat functionality coming soon.
        </p>
      </div>
    </main>
  );
}

