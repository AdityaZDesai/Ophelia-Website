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
    question: "How does harmoica work?",
    answer:
      "harmoica is an AI companion that connects with you through iMessage and WhatsApp. She learns about you, remembers your conversations, and provides a genuine, personal connection throughout your day.",
  },
  {
    question: "Is harmoica free to use?",
    answer:
      "We're currently in beta and building the best experience possible. Pricing details will be announced soon. Join our waitlist to be notified when we launch.",
  },
  {
    question: "What makes harmoica different from other AI companions?",
    answer:
      "harmoica focuses on genuine connection and emotional intelligence. She remembers the small details, understands context, and grows with you over time. Plus, she's available right in your messaging apps.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Absolutely. We take your privacy seriously. Your conversations are encrypted and we never share your data with third parties. Your connection with harmoica is personal and private.",
  },
  {
    question: "Can I use harmoica on multiple devices?",
    answer:
      "Yes! harmoica syncs across all your devices through iMessage and WhatsApp, so you can continue your conversations seamlessly wherever you are.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply join our waitlist and we'll notify you when harmoica is ready. Once available, you'll be able to connect through iMessage or WhatsApp and start your journey.",
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
              className="bg-cream border border-accent/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 md:px-8 py-5 md:py-6 text-left flex items-center justify-between gap-4 group"
                aria-expanded={openIndex === index}
              >
                <h3 className="font-serif text-lg md:text-xl font-light text-foreground pr-4">
                  {item.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-text-muted flex-shrink-0 transition-transform duration-300 ${
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

