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
    case "discord":
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      );
    case "telegram":
      return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.5 4.5L10.7 14.6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.5 4.5l-6.2 15.1a1 1 0 01-1.8.1l-2.8-4.4-4.8-1.8a1 1 0 01.1-1.9L21.5 4.5z" />
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 max-w-5xl mx-auto">
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
