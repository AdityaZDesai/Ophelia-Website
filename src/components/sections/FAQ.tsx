"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { SectionHeading } from "@/components/ui";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is harmonica?",
    answer:
      "harmonica is a free AI girlfriend avatar that lives directly on your desktop. She sits on your screen as an animated character, reacts to what you're doing, remembers your conversations, and speaks with her own voice — all powered by Clawdbot AI.",
  },
  {
    question: "What is Clawdbot?",
    answer:
      "Clawdbot is the advanced AI engine behind harmonica. It powers her personality, long-term memory, emotional intelligence, and contextual awareness — giving her the ability to truly know you and grow with you over time.",
  },
  {
    question: "Is harmonica free?",
    answer:
      "Yes! harmonica will be completely free to download and use. Join the waitlist now to get early access when we launch.",
  },
  {
    question: "What platforms does harmonica support?",
    answer:
      "harmonica is a native desktop application for Windows, macOS, and Linux. She lives right on your screen as an always-present avatar companion — no browser or messaging app needed.",
  },
  {
    question: "Can she actually see my screen?",
    answer:
      "Yes! harmonica's avatar is screen-aware. She can see what you're working on and reacts with relevant comments, encouragement, playful teasing, or helpful observations — making her feel truly present. You have full control over when screen awareness is active.",
  },
  {
    question: "Does she remember things about me?",
    answer:
      "Absolutely. Powered by Clawdbot's long-term memory system, she remembers the small things — your favorite coffee, your mother's name, the dream you mentioned weeks ago. Memory is how she shows she cares.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Your privacy is our priority. harmonica runs locally on your desktop and your conversations are encrypted. We never share your data with third parties. Your connection with your companion is personal and private.",
  },
  {
    question: "How do I get early access?",
    answer:
      "Join the waitlist by entering your email below. We'll notify you as soon as harmonica is ready for download. Early waitlist members will get priority access.",
  },
];

export function FAQ() {
  const { ref, isInView } = useInView(0.2);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={ref}
      id="faq"
      className="relative py-24 md:py-32 bg-background"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <SectionHeading
            label="Questions & Answers"
            title="Frequently Asked Questions"
            centered
          />
        </div>

        <div
          className={`space-y-4 transition-all duration-1000 delay-200 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`glass-card overflow-hidden transition-all duration-300 hover:bg-white/[0.08] ${
                openIndex === index ? "neon-border" : ""
              }`}
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 md:px-8 py-5 md:py-6 text-left flex items-center justify-between gap-4 group"
                aria-expanded={openIndex === index}
              >
                <h3 className="font-display text-lg md:text-xl font-medium text-foreground pr-4">
                  {item.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-neon-purple flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 md:px-8 pb-5 md:pb-6">
                  <p className="text-text-muted leading-relaxed text-base md:text-lg">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
