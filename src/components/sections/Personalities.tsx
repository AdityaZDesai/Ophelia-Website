"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "@/hooks/useInView";
import { PersonalityCard, AuthModal, SectionHeading } from "@/components/ui";
import { PERSONALITIES } from "@/lib/constants";
import type { Personality } from "@/types";

export function Personalities() {
  const { ref, isInView } = useInView(0.1);
  const router = useRouter();
  
  const [selectedPersonality, setSelectedPersonality] = useState<Personality | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handlePersonalitySelect = (personality: Personality) => {
    setSelectedPersonality(personality);
  };

  const handleContinue = () => {
    if (selectedPersonality) {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    router.push("/onboarding");
  };

  return (
    <>
      <section
        ref={ref}
        id="personalities"
        className="relative py-24 md:py-32 bg-[#0a0a0a]"
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          {/* Section Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <SectionHeading
              title="Choose Your Companion"
              subtitle="Every soul is unique. Select the presence that speaks to yours."
            />
          </div>

          {/* Personality Cards Grid */}
          <div
            className={`grid gap-6 md:grid-cols-3 mb-12 transition-all duration-1000 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {PERSONALITIES.map((personality) => (
              <PersonalityCard
                key={personality.id}
                personality={personality}
                isSelected={selectedPersonality?.id === personality.id}
                onSelect={handlePersonalitySelect}
              />
            ))}
          </div>

          {/* Continue Button */}
          <div
            className={`text-center transition-all duration-500 ${
              selectedPersonality
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <button
              onClick={handleContinue}
              disabled={!selectedPersonality}
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white text-black font-jakarta font-medium rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Continue with {selectedPersonality?.name || "..."}
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
            </button>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        selectedPersonality={selectedPersonality}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

