"use client";

import Image from "next/image";
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
      className="group text-left transition-all duration-500 focus:outline-none"
    >
      {/* Image Container */}
      <div
        className={`
          relative aspect-[3/4] overflow-hidden rounded-3xl mb-6
          transition-all duration-500 ease-out
          ${isSelected 
            ? "ring-2 ring-accent-deep ring-offset-4 ring-offset-background shadow-2xl scale-[1.02]" 
            : "hover:shadow-xl hover:scale-[1.01]"
          }
        `}
      >
        <Image
          src={personality.image}
          alt={personality.name}
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
        
        {/* Minimal bottom gradient for depth */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      {/* Text Content - Clean & Minimal */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {/* Selection indicator */}
          <div
            className={`
              w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center flex-shrink-0
              ${isSelected 
                ? "border-accent-deep bg-accent-deep" 
                : "border-text-light group-hover:border-accent"
              }
            `}
          >
            {isSelected && (
              <svg className="w-2 h-2 text-white" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          
          <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-tight">
            {personality.name}
          </h3>
        </div>
        
        <p className="text-sm font-medium tracking-wide uppercase text-accent-deep pl-7">
          {personality.tagline}
        </p>
        
        <p className="text-text-muted text-sm leading-relaxed pl-7 pt-1">
          {personality.description}
        </p>
      </div>
    </button>
  );
}
