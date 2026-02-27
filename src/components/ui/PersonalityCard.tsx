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
        group flex flex-col overflow-hidden rounded-2xl text-left transition-all duration-500
        hover:scale-[1.02] hover:shadow-2xl
        ${isSelected
          ? "ring-2 ring-offset-4 ring-offset-[#0a0a0f] shadow-2xl scale-[1.02]"
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
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <img
          src={personality.image}
          alt={personality.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col min-h-[240px] p-6 bg-background-secondary">
        {/* Name & Tagline */}
        <div className="mb-2">
          <h3 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2 tracking-tight">
            {personality.name}
          </h3>
          <p
            className="font-sans text-sm font-medium tracking-wider uppercase"
            style={{ color: personality.accentColor }}
          >
            {personality.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="text-text-muted text-sm leading-relaxed">
          {personality.description}
        </p>

        {/* Selection Indicator */}
        <div className="mt-6 flex items-center gap-3">
          <div
            className={`
              w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center
              ${isSelected ? "border-neon-purple bg-neon-purple" : "border-foreground/40"}
            `}
          >
            {isSelected && (
              <svg
                className="w-3 h-3 text-white"
                viewBox="0 0 12 12"
                fill="none"
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
          <span className="text-text-muted text-sm">
            {isSelected ? "Selected" : "Choose me"}
          </span>
        </div>
      </div>

      </button>
  );
}
