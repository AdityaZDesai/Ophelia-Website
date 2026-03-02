import type { Metadata } from "next";
import { Noto_Sans_JP, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://harmonica.chat";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "harmonica | AI Girlfriend Desktop Companion",
    template: "%s | harmonica",
  },
  description:
    "harmonica is a premium desktop AI girlfriend that lives on your screen, grows personality over time, and shares real moments with you.",
  openGraph: {
    title: "harmonica | AI Girlfriend Desktop Companion",
    description:
      "An always-on desktop AI girlfriend with anime presence, evolving emotions, and shared experiences like music, videos, and travel planning.",
    type: "website",
    siteName: "harmonica",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "harmonica | AI Girlfriend Desktop Companion",
    description:
      "A premium desktop AI girlfriend experience with always-on presence and evolving emotional behavior.",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${syne.variable} ${notoSansJp.variable} antialiased`}>{children}</body>
    </html>
  );
}
