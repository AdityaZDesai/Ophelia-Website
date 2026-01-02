// Navigation types
export interface NavLink {
  label: string;
  href: string;
}

// Experience card types
export interface ExperienceItem {
  number: string;
  title: string;
  description: string;
}

// Testimonial/Story types
export interface Testimonial {
  quote: string;
  author: string;
  location: string;
}

// Philosophy value types
export interface PhilosophyValue {
  title: string;
  description: string;
  delay: number;
}

// Personality types
export type PersonalityId = "vanilla" | "goth" | "dominant";

export interface Personality {
  id: PersonalityId;
  name: string;
  tagline: string;
  description: string;
  gradient: string;
  accentColor: string;
}

// Communication channel types
export type CommunicationChannel = "imessage" | "whatsapp" | "web";

export interface ChannelOption {
  id: CommunicationChannel;
  name: string;
  description: string;
  icon: string;
  requiresPhone: boolean;
}

// Auth types
export interface OnboardingData {
  selectedPersonality: PersonalityId;
  communicationChannel: CommunicationChannel;
  phone?: string;
}
