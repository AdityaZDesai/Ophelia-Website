"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { Button } from "@/components/ui";

export function Waitlist() {
  const { ref, isInView } = useInView(0.2);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section
      id="waitlist"
      ref={ref}
      className="py-32 px-6 relative overflow-hidden"
    >
      {/* Neon orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-neon-purple/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-neon-pink/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-neon-purple text-sm tracking-[0.3em] uppercase mb-6 font-medium">
            Join the Waitlist
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-semibold mb-6">
            Be among the first
          </h2>
          <p className="text-text-muted text-lg mb-12 max-w-md mx-auto">
            We&apos;re building something special. Join the waitlist to get early access
            when harmonica launches on desktop.
          </p>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className={`transition-all duration-1000 delay-200 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-white/5 backdrop-blur-sm border border-glass-border rounded-full text-sm text-foreground placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent"
                  required
                />
                <Button type="submit" size="lg">
                  Join
                </Button>
              </div>
              <p className="text-text-light text-xs mt-4">
                No spam, ever. We respect your inbox.
              </p>
            </form>
          ) : (
            <SuccessMessage />
          )}
        </div>
      </div>
    </section>
  );
}

function SuccessMessage() {
  return (
    <div className="p-8 glass-card neon-border animate-fade-in">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-lg shadow-neon-purple/30">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="font-display text-2xl font-semibold mb-2">You&apos;re on the list</h3>
      <p className="text-text-muted">
        We&apos;ll notify you as soon as harmonica is ready for download. Thank you for your patience.
      </p>
    </div>
  );
}
