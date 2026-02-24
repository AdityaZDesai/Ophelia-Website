import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
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
    default: "harmonica — Free AI Girlfriend Chatbot on Telegram, iMessage & Discord",
    template: "%s | harmonica",
  },
  description:
    "harmonica is your free AI girlfriend chatbot. Chat on Telegram, iMessage, and Discord with voice notes, image generation, and real emotional connection. No subscription required.",
  keywords: [
    "AI girlfriend",
    "AI girlfriend chatbot",
    "free AI chatbot",
    "AI companion",
    "Telegram chatbot",
    "iMessage chatbot",
    "Discord chatbot",
    "AI voice notes",
    "AI image generation",
    "virtual girlfriend",
    "AI companion app",
    "free AI girlfriend",
    "emotional AI",
    "AI relationship",
    "harmonica",
  ],
  authors: [{ name: "harmonica" }],
  creator: "harmonica",
  publisher: "harmonica",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "harmonica — Free AI Girlfriend on Telegram, iMessage & Discord",
    description:
      "Your free AI girlfriend that chats on Telegram, iMessage, and Discord. Voice notes, image generation, and real emotional connection — no subscription needed.",
    type: "website",
    siteName: "harmonica",
    locale: "en_US",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "harmonica — Free AI Girlfriend Chatbot",
    description:
      "Chat with your AI girlfriend on Telegram, iMessage & Discord. Free voice notes, image generation, and genuine connection.",
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
        "harmonica is a free AI girlfriend chatbot available on Telegram, iMessage, and Discord with voice notes and image generation.",
      sameAs: [],
    },
    {
      "@type": "WebApplication",
      name: "harmonica",
      url: siteUrl,
      applicationCategory: "SocialNetworkingApplication",
      operatingSystem: "Web, iOS, Android",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free AI girlfriend chatbot with voice notes and image generation",
      },
      featureList: [
        "AI girlfriend chatbot",
        "Telegram integration",
        "iMessage integration",
        "Discord integration",
        "Voice notes",
        "AI image generation",
        "Memory and personality",
        "Multiple companion personalities",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does harmonica work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "harmonica is a free AI girlfriend chatbot that connects with you through Telegram, iMessage, Discord, and the web. She learns about you, remembers your conversations, and provides genuine emotional connection with voice notes and AI-generated images.",
          },
        },
        {
          "@type": "Question",
          name: "Is harmonica free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! harmonica is completely free to use. Chat with your AI girlfriend on Telegram, iMessage, or Discord at no cost, including voice notes and image generation.",
          },
        },
        {
          "@type": "Question",
          name: "What platforms does harmonica support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "harmonica is available on Telegram, iMessage, Discord, and the web. You can chat with your AI girlfriend on whichever platform you prefer.",
          },
        },
        {
          "@type": "Question",
          name: "What makes harmonica different from other AI companions?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "harmonica features genuine emotional intelligence, long-term memory, voice notes, AI image generation, and multiple personality types. She remembers your conversations and grows with you over time — all for free across Telegram, iMessage, and Discord.",
          },
        },
        {
          "@type": "Question",
          name: "Does harmonica support voice notes and images?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! harmonica can send personalized voice notes and AI-generated images. Your companion sends voice messages and creates images throughout the day for a truly personal connection.",
          },
        },
        {
          "@type": "Question",
          name: "Is my data private and secure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. Your conversations are encrypted and we never share your data with third parties. Your connection with harmonica is personal and private.",
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
        className={`${cormorant.variable} ${jakarta.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
