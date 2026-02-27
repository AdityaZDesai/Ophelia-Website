import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://harmonica.chat";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/onboarding", "/chat", "/imessage-chat", "/whatsapp-chat", "/discord-chat", "/telegram-chat"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
