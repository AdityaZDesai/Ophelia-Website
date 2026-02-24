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
export type PersonalityId =
  | "vanilla"
  | "goth"
  | "dominant"
  | "yandere"
  | "dandere"
  | "kuudere";

export interface Personality {
  id: PersonalityId;
  name: string;
  tagline: string;
  description: string;
  gradient: string;
  accentColor: string;
  image: string;
}

export type GirlPhotoId = "serena" | "luna" | "valentina" | "himari" | "yuki" | "mei";

export interface GirlPhotoOption {
  id: GirlPhotoId;
  name: string;
  image: string;
}

export type AudioOptionId = "jessica_v3" | "serafina" | "ivanna" | "hina_yandere" | "kuon";

export interface AudioOption {
  id: AudioOptionId;
  name: string;
  src: string;
  description: string;
}

// Communication channel types
export type CommunicationChannel = "imessage" | "web" | "whatsapp" | "discord" | "telegram";

export interface ChannelOption {
  id: CommunicationChannel;
  name: string;
  description: string;
  icon: string;
  requiresPhone: boolean;
}

// Auth types
export interface OnboardingData {
  selectedPhoto: GirlPhotoId;
  selectedPersonality: PersonalityId;
  selectedAudio: AudioOptionId;
  communicationChannel: CommunicationChannel;
  phone?: string;
}
