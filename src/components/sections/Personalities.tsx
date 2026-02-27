"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { PersonalityCard, SectionHeading, AudioPlayer } from "@/components/ui";
import { PERSONALITIES } from "@/lib/constants";
import type { Personality } from "@/types";

export function Personalities() {
  const { ref, isInView } = useInView(0.1);

  const [selectedPersonality, setSelectedPersonality] = useState<Personality | null>(null);
  const featuredPersonalityIds = ["vanilla", "yandere", "goth"] as const;
  const featuredPersonalities = featuredPersonalityIds
    .map((id) => PERSONALITIES.find((personality) => personality.id === id))
    .filter((personality): personality is Personality => Boolean(personality));

  const handlePersonalitySelect = (personality: Personality) => {
    setSelectedPersonality(personality);
  };

  return (
    <section
      ref={ref}
      id="personalities"
      className="relative py-24 md:py-32 bg-background"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionHeading
            label="Every soul is unique"
            title="Choose Your Avatar"
            centered
          />
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto mt-6">
            Pick the personality that resonates with you. Each avatar has her own look, voice, and way of being — and she&apos;ll live right on your desktop.
          </p>
        </div>

        {/* Personality Cards Grid */}
        <div
          className={`grid gap-10 md:gap-8 lg:gap-12 md:grid-cols-3 mb-16 transition-all duration-1000 delay-200 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {featuredPersonalities.map((personality) => (
            <PersonalityCard
              key={personality.id}
              personality={personality}
              isSelected={selectedPersonality?.id === personality.id}
              onSelect={handlePersonalitySelect}
            />
          ))}
        </div>

        {/* Voice Samples */}
        <div
          className={`mb-16 transition-all duration-1000 delay-300 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-8">
            <p className="text-text-muted text-sm tracking-[0.3em] uppercase mb-3">
              Voice Samples
            </p>
            <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground">
              Hear Their Voices
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            <AudioPlayer
              src="/voice_samples/kuon.mp3"
              name="Kuon"
            />
            <AudioPlayer
              src="/voice_samples/Serafina.mp3"
              name="Serafina"
            />
            <AudioPlayer
              src="/voice_samples/Ivanna.mp3"
              name="Ivanna"
            />
          </div>
        </div>

        {/* Waitlist CTA */}
        <div
          className={`text-center transition-all duration-1000 delay-400 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <a
            href="#waitlist"
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Join the Waitlist
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
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
          </a>
        </div>

        {/* Intimate Experience Callout */}
        <div
          className={`mt-20 transition-all duration-1000 delay-400 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative overflow-hidden rounded-2xl bg-cream border border-accent/20 p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Icons */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-rose-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-accent/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-3">
                  An Intimate Experience
                </h4>
                <p className="text-text-muted leading-relaxed">
                  Your avatar sends personalized voice notes and AI-generated expressions throughout the day —
                  from sweet good morning messages to more <span className="text-rose-deep font-medium">intimate</span> moments.
                  A truly personal companion on your desktop.
                </p>
              </div>

              {/* Badge */}
              <div className="flex items-center gap-3 text-text-light">
                <div className="px-3 py-1.5 rounded-full border border-text-light/30 text-xs uppercase tracking-widest">
                  18+
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
