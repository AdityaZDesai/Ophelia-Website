import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://harmonica.chat";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "harmonica — AI Girlfriend Avatar for Your Desktop | Powered by Clawdbot",
    template: "%s | harmonica",
  },
  description:
    "harmonica is a free AI girlfriend avatar that lives on your desktop. She reacts to your screen, remembers everything, talks with her own voice, and keeps you company all day — powered by Clawdbot AI. Join the waitlist.",
  keywords: [
    "AI girlfriend",
    "AI girlfriend avatar",
    "desktop AI companion",
    "AI desktop pet",
    "virtual girlfriend desktop",
    "AI avatar companion",
    "desktop companion app",
    "AI waifu",
    "AI girlfriend for PC",
    "AI girlfriend for Mac",
    "desktop AI girlfriend",
    "Clawdbot",
    "AI companion avatar",
    "virtual companion desktop",
    "AI girlfriend app",
    "desktop pet girlfriend",
    "AI avatar with voice",
    "AI that lives on your computer",
    "harmonica",
    "free AI girlfriend",
  ],
  authors: [{ name: "harmonica" }],
  creator: "harmonica",
  publisher: "harmonica",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "harmonica — AI Girlfriend Avatar That Lives on Your Desktop",
    description:
      "A free AI girlfriend avatar that lives right on your desktop. She watches your screen, remembers everything, sends voice notes, and keeps you company all day. Powered by Clawdbot AI.",
    type: "website",
    siteName: "harmonica",
    locale: "en_US",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "harmonica — AI Girlfriend Avatar for Your Desktop",
    description:
      "She lives on your desktop. Reacts to your screen. Remembers everything. Talks with her own voice. Powered by Clawdbot AI. Join the waitlist.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "harmonica",
      url: siteUrl,
      logo: `${siteUrl}/favicon.svg`,
      description:
        "harmonica is a free AI girlfriend avatar that lives on your desktop, powered by Clawdbot AI with voice, memory, and screen awareness.",
      sameAs: [],
    },
    {
      "@type": "SoftwareApplication",
      name: "harmonica",
      url: siteUrl,
      applicationCategory: "DesktopApplication",
      operatingSystem: "Windows, macOS, Linux",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/PreOrder",
        description: "Free AI girlfriend desktop avatar with voice, memory, and screen awareness — powered by Clawdbot",
      },
      featureList: [
        "AI girlfriend avatar on your desktop",
        "Screen-aware reactions and commentary",
        "Long-term memory powered by Clawdbot",
        "Personalized voice notes and responses",
        "Multiple anime-style avatar personalities",
        "Morning check-ins and daily companionship",
        "AI-generated images and expressions",
        "Always-on desktop companion",
        "Works on Windows, macOS, and Linux",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is harmonica?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "harmonica is a free AI girlfriend avatar that lives directly on your desktop. She sits on your screen, reacts to what you're doing, remembers your conversations, and speaks with her own voice — powered by Clawdbot AI.",
          },
        },
        {
          "@type": "Question",
          name: "Is harmonica free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! harmonica will be completely free to download and use. Join the waitlist to get early access when it launches.",
          },
        },
        {
          "@type": "Question",
          name: "What platforms does harmonica support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "harmonica is a desktop application available for Windows, macOS, and Linux. She lives right on your screen as an always-present avatar companion.",
          },
        },
        {
          "@type": "Question",
          name: "What is Clawdbot?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Clawdbot is the advanced AI engine powering harmonica's personality, memory, and emotional intelligence. It enables long-term memory, contextual awareness, and genuine conversational depth.",
          },
        },
        {
          "@type": "Question",
          name: "Does the avatar react to my screen?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! harmonica's avatar is screen-aware. She can see what you're working on and react with relevant comments, encouragement, or playful observations — making her feel truly present on your desktop.",
          },
        },
        {
          "@type": "Question",
          name: "Is my data private and secure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. harmonica runs locally on your desktop. Your conversations are encrypted and we never share your data with third parties. Your connection with your companion is personal and private.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jakarta.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
