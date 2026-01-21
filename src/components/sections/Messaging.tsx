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
            title="Talk to her anywhere"
            centered
          />
        </div>

        <div
          className={`grid md:grid-cols-1 gap-8 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* iMessage Card */}
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
              Connect seamlessly through iMessage. Your companion feels natural
              and personal, just like texting a close friend. Available on all
              your Apple devices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
