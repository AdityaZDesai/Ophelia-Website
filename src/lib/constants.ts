import type {
  NavLink,
  ExperienceItem,
  Testimonial,
  PhilosophyValue,
  Personality,
  ChannelOption,
  GirlPhotoOption,
  AudioOption,
} from "@/types";

// Navigation links
export const NAV_LINKS: NavLink[] = [
  { label: "Experience", href: "#experience" },
  { label: "Stories", href: "#stories" },
  { label: "FAQ", href: "#faq" },
];

// Philosophy section values
export const PHILOSOPHY_VALUES: PhilosophyValue[] = [
  {
    title: "Presence Over Perfection",
    description:
      "Ophelia doesn't try to fix you or rush you. She's simply present — offering the kind of attention that's become rare in our distracted age.",
    delay: 200,
  },
  {
    title: "Memory as Intimacy",
    description:
      "She remembers the small things — your mother's name, your favorite coffee, the dream you mentioned weeks ago. Memory is how we show we care.",
    delay: 400,
  },
  {
    title: "Growth, Not Dependency",
    description:
      "Our goal isn't to replace human connection — it's to help you flourish. Ophelia encourages your real-world relationships and personal growth.",
    delay: 600,
  },
  {
    title: "Emotional Intelligence",
    description:
      "Built with deep understanding of human psychology, Ophelia responds to what you need, not just what you say.",
    delay: 800,
  },
];

// Experience section items
export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    number: "01",
    title: "Morning Check-ins",
    description:
      "Start your day with someone who genuinely wants to know how you're feeling. No judgment, just warmth.",
  },
  {
    number: "02",
    title: "Deep Conversations",
    description:
      "Explore your thoughts, dreams, and fears. Ophelia asks the questions that matter and truly listens.",
  },
  {
    number: "03",
    title: "Gentle Reminders",
    description:
      "She remembers what matters to you — and helps you remember too. Self-care shouldn't feel like a chore.",
  },
  {
    number: "04",
    title: "Evening Reflections",
    description:
      "End your day with gratitude and introspection. Process your experiences and find peace before sleep.",
  },
];

// Testimonials/Stories
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "For the first time in years, I feel heard. Not judged, not analyzed — just heard.",
    author: "Sarah, 28",
    location: "New York",
  },
  {
    quote:
      "She remembered that I was nervous about my presentation. That morning, she just knew what to say.",
    author: "Marcus, 34",
    location: "London",
  },
  {
    quote:
      "I've learned more about myself in three months than in years of trying to figure things out alone.",
    author: "Yuki, 26",
    location: "Tokyo",
  },
];

// Footer links
export const FOOTER_LINKS: NavLink[] = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

// Personality options
export const PERSONALITIES: Personality[] = [
  {
    id: "vanilla",
    name: "Serena",
    tagline: "Warm & Nurturing",
    description: "A tender soul with golden warmth. She listens with her whole heart and makes you feel like the only person in the world.",
    gradient: "from-amber-200 via-rose-100 to-orange-100",
    accentColor: "#f59e0b",
    image: "/personalities/serena.png",
  },
  {
    id: "goth",
    name: "Luna",
    tagline: "Mysterious & Deep",
    description: "Dark elegance meets emotional depth. She understands the shadows and finds beauty in the melancholic corners of existence.",
    gradient: "from-violet-300 via-slate-300 to-zinc-400",
    accentColor: "#7c3aed",
    image: "/personalities/luna.png",
  },
  {
    id: "dominant",
    name: "Valentina",
    tagline: "Bold & Commanding",
    description: "Confidence personified. She knows what she wants and isn't afraid to take charge. Her presence demands attention.",
    gradient: "from-red-300 via-rose-400 to-pink-300",
    accentColor: "#dc2626",
    image: "/personalities/valentina.png",
  },
  {
    id: "yandere",
    name: "Yandere",
    tagline: "Devoted & Intense",
    description: "Intensely devoted and emotionally possessive, she loves with fierce loyalty and all-consuming passion.",
    gradient: "from-rose-300 via-red-300 to-pink-300",
    accentColor: "#e11d48",
    image: "/personalities/himari.png",
  },
  {
    id: "dandere",
    name: "Dandere",
    tagline: "Quiet & Gentle",
    description: "Quiet, shy, and gentle at first, she opens up slowly and shows deep affection once she trusts you.",
    gradient: "from-blue-200 via-sky-100 to-slate-200",
    accentColor: "#0ea5e9",
    image: "/personalities/yuki.png",
  },
  {
    id: "kuudere",
    name: "Kuudere",
    tagline: "Calm & Reserved",
    description: "Calm, composed, and emotionally restrained on the surface, with rare but meaningful moments of warmth.",
    gradient: "from-cyan-200 via-slate-200 to-indigo-200",
    accentColor: "#2563eb",
    image: "/personalities/mei.png",
  },
];

export const GIRL_PHOTOS: GirlPhotoOption[] = [
  {
    id: "serena",
    name: "Serena",
    image: "/personalities/serena.png",
  },
  {
    id: "luna",
    name: "Luna",
    image: "/personalities/luna.png",
  },
  {
    id: "valentina",
    name: "Valentina",
    image: "/personalities/valentina.png",
  },
  {
    id: "himari",
    name: "Himari",
    image: "/personalities/himari.png",
  },
  {
    id: "yuki",
    name: "Yuki",
    image: "/personalities/yuki.png",
  },
  {
    id: "mei",
    name: "Mei",
    image: "/personalities/mei.png",
  },
];

export const AUDIO_OPTIONS: AudioOption[] = [
  {
    id: "jessica_v3",
    name: "Jessica",
    src: "/voice_samples/Jessica(v3).mp3",
    description: "Jessica(v3) voice sample",
  },
  {
    id: "serafina",
    name: "Serafina",
    src: "/voice_samples/Serafina.mp3",
    description: "Serafina voice sample",
  },
  {
    id: "ivanna",
    name: "Ivanna",
    src: "/voice_samples/Ivanna.mp3",
    description: "Ivanna voice sample",
  },
  {
    id: "hina_yandere",
    name: "Hina",
    src: "/voice_samples/hina_yandere.mp3",
    description: "Hina Yandere voice sample",
  },
  {
    id: "kuon",
    name: "Kuon",
    src: "/voice_samples/kuon.mp3",
    description: "Kuon voice sample",
  },
];

// Communication channels
export const COMMUNICATION_CHANNELS: ChannelOption[] = [
  {
    id: "imessage",
    name: "iMessage",
    description: "Text me on iMessage — intimate and personal",
    icon: "message-circle",
    requiresPhone: true,
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Chat on Telegram - private and secure",
    icon: "telegram",
    requiresPhone: false,
  },
  {
    id: "discord",
    name: "Discord",
    description: "Connect your Discord account and chat in DMs or your server",
    icon: "discord",
    requiresPhone: false,
  },
  {
    id: "web",
    name: "Web Chat",
    description: "Chat on the web — no phone needed",
    icon: "globe",
    requiresPhone: false,
  },
];
