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

export const metadata: Metadata = {
  title: "harmoica — Where Connection Finds You",
  description: "harmoica is not just an app. It's a companion who understands, listens, and grows with you. Experience the warmth of genuine connection.",
  keywords: ["companion", "connection", "emotional support", "AI companion", "harmoica"],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "harmoica — Where Connection Finds You",
    description: "Experience the warmth of genuine connection.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${jakarta.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
