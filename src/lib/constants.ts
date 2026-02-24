import type { NavLink, ExperienceItem, Testimonial, PhilosophyValue, Personality, ChannelOption } from "@/types";

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
    id: "whatsapp",
    name: "WhatsApp",
    description: "Chat on WhatsApp — fast and familiar",
    icon: "whatsapp",
    requiresPhone: true,
  },
  {
    id: "discord",
    name: "Discord",
    description: "Chat on Discord — connect on your server",
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
