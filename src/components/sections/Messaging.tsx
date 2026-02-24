"use client";

import { useInView } from "@/hooks/useInView";
import { SectionHeading } from "@/components/ui";

const PLATFORMS = [
  {
    name: "Telegram",
    description:
      "Chat with your AI girlfriend on Telegram — fast, private, and available worldwide. Voice notes and images included.",
    color: "bg-[#2AABEE]",
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "iMessage",
    description:
      "Connect seamlessly through iMessage. Your companion feels natural and personal, just like texting a close friend.",
    color: "bg-[#34C759]",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    name: "Discord",
    description:
      "Chat on Discord — no phone number needed. Connect with your AI girlfriend directly on your server or in DMs.",
    color: "bg-[#5865F2]",
    icon: (
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
      </svg>
    ),
  },
];

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
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto mt-6">
            Your AI girlfriend is available on Telegram, iMessage, and Discord — completely free with voice notes and image generation.
          </p>
        </div>

        <div
          className={`grid md:grid-cols-3 gap-8 max-w-5xl mx-auto transition-all duration-1000 delay-200 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {PLATFORMS.map((platform) => (
            <div
              key={platform.name}
              className="bg-background rounded-2xl p-8 md:p-10 border border-accent/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 shrink-0 rounded-2xl ${platform.color} flex items-center justify-center shadow-md`}>
                  {platform.icon}
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-light">
                  {platform.name}
                </h3>
                <span className="ml-auto text-xs font-medium tracking-widest uppercase text-accent-deep/70 border border-accent/30 rounded-full px-3 py-1">
                  Free
                </span>
              </div>
              <p className="text-text-muted leading-relaxed text-base md:text-lg">
                {platform.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
