import type { NavLink, ExperienceItem, Testimonial, PhilosophyValue } from "@/types";

// Navigation links
export const NAV_LINKS: NavLink[] = [
  { label: "Philosophy", href: "#philosophy" },
  { label: "Experience", href: "#experience" },
  { label: "Stories", href: "#stories" },
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

