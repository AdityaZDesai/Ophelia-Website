"use client";

import type { Personality } from "@/types";

interface PersonalityCardProps {
  personality: Personality;
  isSelected: boolean;
  onSelect: (personality: Personality) => void;
}

export function PersonalityCard({
  personality,
  isSelected,
  onSelect,
}: PersonalityCardProps) {
  return (
    <button
      onClick={() => onSelect(personality)}
      className={`
        group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-500
        hover:scale-[1.02] hover:shadow-2xl
        ${isSelected 
          ? "ring-2 ring-offset-4 ring-offset-[#0a0a0a] shadow-2xl scale-[1.02]" 
          : "hover:ring-1 hover:ring-white/20"
        }
      `}
      style={{
        borderColor: isSelected ? personality.accentColor : "transparent",
        boxShadow: isSelected 
          ? `0 20px 60px -15px ${personality.accentColor}40` 
          : undefined,
        ["--accent" as string]: personality.accentColor,
      }}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${personality.gradient} opacity-80 transition-opacity duration-500 group-hover:opacity-100`}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full min-h-[280px]">
        {/* Name & Tagline */}
        <div className="mb-auto">
          <h3 className="font-cormorant text-3xl md:text-4xl font-semibold text-white mb-2 tracking-tight">
            {personality.name}
          </h3>
          <p 
            className="font-jakarta text-sm font-medium tracking-wider uppercase"
            style={{ color: personality.accentColor }}
          >
            {personality.tagline}
          </p>
        </div>
        
        {/* Description */}
        <p className="font-jakarta text-white/90 text-sm leading-relaxed mt-6">
          {personality.description}
        </p>
        
        {/* Selection Indicator */}
        <div className="mt-6 flex items-center gap-3">
          <div
            className={`
              w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center
              ${isSelected ? "border-white bg-white" : "border-white/50"}
            `}
          >
            {isSelected && (
              <svg
                className="w-3 h-3"
                viewBox="0 0 12 12"
                fill="none"
                style={{ color: personality.accentColor }}
              >
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="font-jakarta text-white/70 text-sm">
            {isSelected ? "Selected" : "Choose me"}
          </span>
        </div>
      </div>
    </button>
  );
}

