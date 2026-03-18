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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://loveharmonica.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "harmonica | She lives on your desktop",
    template: "%s | harmonica",
  },
  description:
    "An AI girlfriend that stays on your screen — watching, reacting, remembering. Not an app you open. Not a chat you forget.",
  openGraph: {
    title: "harmonica | She lives on your desktop",
    description:
      "An AI girlfriend that stays on your screen — watching, reacting, remembering. Join the waitlist.",
    type: "website",
    siteName: "harmonica",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "harmonica | She lives on your desktop",
    description:
      "An AI girlfriend that stays on your screen — watching, reacting, remembering. Join the waitlist.",
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
