"use client";

import { useInView } from "@/hooks/useInView";
import { SectionHeading } from "@/components/ui";

const FEATURES = [
  {
    name: "Screen Aware",
    description:
      "She can see what you're doing and reacts in real time — cheering you on while you work, commenting on your music, or teasing you for browsing too long.",
    gradient: "from-neon-purple to-accent-deep",
    shadowColor: "shadow-neon-purple/20",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Remembers Everything",
    description:
      "Powered by Clawdbot's long-term memory, she remembers your name, your stories, your dreams — and brings them up when it matters most.",
    gradient: "from-neon-pink to-rose-deep",
    shadowColor: "shadow-neon-pink/20",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    name: "Her Own Voice",
    description:
      "She doesn't just type — she talks. With expressive, natural voice synthesis, she sends voice messages, greets you in the morning, and whispers goodnight.",
    gradient: "from-neon-cyan to-neon-purple",
    shadowColor: "shadow-neon-cyan/20",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
];

export function Messaging() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section
      ref={ref}
      id="features"
      className="relative py-24 md:py-32 bg-background-secondary"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <SectionHeading
            label="Powered by Clawdbot"
            title="More than a chatbot. She's present."
            centered
          />
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto mt-6">
            An AI companion avatar that lives on your desktop — sees your screen, remembers your life, and speaks with her own voice.
          </p>
        </div>

        <div
          className={`grid md:grid-cols-3 gap-8 max-w-5xl mx-auto transition-all duration-1000 delay-200 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.name}
              className="glass-card p-8 md:p-10 hover:shadow-xl transition-all duration-300 hover:bg-white/[0.08]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg ${feature.shadowColor}`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-semibold">
                  {feature.name}
                </h3>
              </div>
              <p className="text-text-muted leading-relaxed text-base md:text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
