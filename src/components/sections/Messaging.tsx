"use client";

import { useInView } from "@/hooks/useInView";
import { SectionHeading } from "@/components/ui";

export function Messaging() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section
      ref={ref}
      id="messaging"
      className="relative py-24 md:py-32 bg-cream"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <SectionHeading
            label="Always Connected"
            title="Text her where you already chat"
            centered
          />
        </div>

        <div
          className={`grid gap-6 md:grid-cols-3 max-w-6xl mx-auto transition-all duration-1000 delay-200 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-background rounded-2xl p-8 md:p-10 border border-accent/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gray-400 flex items-center justify-center shadow-md">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-light">
                iMessage
              </h3>
            </div>
            <p className="text-text-muted leading-relaxed text-base md:text-lg">
              Chat with her like a real contact in your Messages app. Simple,
              personal, and always one tap away on your Apple devices.
            </p>
          </div>

          <div className="bg-background rounded-2xl p-8 md:p-10 border border-accent/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#5865F2] flex items-center justify-center shadow-md">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 9h.01M15 9h.01M8 14c1 1 2.2 1.5 4 1.5S15 15 16 14M5 5h14v10H9l-4 4V5z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-light">
                Discord
              </h3>
            </div>
            <p className="text-text-muted leading-relaxed text-base md:text-lg">
              Keep the vibe going in Discord DMs with quick replies, late-night
              talks, and a space that feels relaxed and familiar.
            </p>
          </div>

          <div className="bg-background rounded-2xl p-8 md:p-10 border border-accent/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#24A1DE] flex items-center justify-center shadow-md">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21.5 4.5L10.7 14.6"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21.5 4.5l-6.2 15.1a1 1 0 01-1.8.1l-2.8-4.4-4.8-1.8a1 1 0 01.1-1.9L21.5 4.5z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-light">
                Telegram
              </h3>
            </div>
            <p className="text-text-muted leading-relaxed text-base md:text-lg">
              Message her on Telegram when you want privacy, speed, and a clean
              place for everyday check-ins or deep conversations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
