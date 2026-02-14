"use client";

import type { CommunicationChannel, ChannelOption } from "@/types";

interface ChannelSelectorProps {
  channels: ChannelOption[];
  selectedChannel: CommunicationChannel | null;
  onSelect: (channel: CommunicationChannel) => void;
}

const ChannelIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case "message-circle":
      return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case "phone":
      return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      );
    case "globe":
      return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12a9 9 0 111.764 5.33L3 21l3.67-1.764A9 9 0 013 12z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.5 9.5c.2-1 .9-1.5 1.7-1.5.8 0 1.4.5 1.7 1.5m-3.4 5c.8.9 1.9 1.5 3.4 1.5s2.6-.6 3.4-1.5" />
        </svg>
      );
    default:
      return null;
  }
};

export function ChannelSelector({
  channels,
  selectedChannel,
  onSelect,
}: ChannelSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
      {channels.map((channel) => {
        const isSelected = selectedChannel === channel.id;
        
        return (
          <button
            key={channel.id}
            onClick={() => onSelect(channel.id)}
            className={`
              group relative p-6 rounded-2xl text-left transition-all duration-300
              border-2 hover:scale-[1.02]
              ${isSelected 
                ? "bg-white/10 border-white shadow-lg" 
                : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
              }
            `}
          >
            {/* Icon */}
            <div
              className={`
                mb-4 transition-colors duration-300
                ${isSelected ? "text-white" : "text-white/50 group-hover:text-white/70"}
              `}
            >
              <ChannelIcon icon={channel.icon} />
            </div>
            
            {/* Name */}
            <h3 className="font-cormorant text-xl font-semibold text-white mb-2">
              {channel.name}
            </h3>
            
            {/* Description */}
            <p className="font-jakarta text-sm text-white/60 leading-relaxed">
              {channel.description}
            </p>
            
            {/* Selection indicator */}
            <div
              className={`
                absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all duration-300
                flex items-center justify-center
                ${isSelected ? "border-white bg-white" : "border-white/30"}
              `}
            >
              {isSelected && (
                <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none">
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
            
            {/* No phone badge for web */}
            {!channel.requiresPhone && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-jakarta text-xs text-emerald-400">No phone required</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
