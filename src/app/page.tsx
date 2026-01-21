"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Header, Footer } from "@/components/layout";
import {
  Hero,
  Messaging,
  Personalities,
  Experience,
  Stories,
  FAQ,
} from "@/components/sections";

function AuthRedirect() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending || !session) return;

    const redirect = async () => {
      try {
        const response = await fetch("/api/user/status");
        if (!response.ok) {
          router.push("/onboarding");
          return;
        }

        const status = await response.json();
        if (status?.onboardingCompleted) {
          router.push("/chat");
        } else {
          router.push("/onboarding");
        }
      } catch {
        router.push("/onboarding");
      }
    };

    redirect();
  }, [isPending, session, router]);

  return null;
}

export default function Home() {
  return (
    <main>
      <AuthRedirect />
      <Header />
      <Hero />
      <Messaging />
      <Personalities />
      <Experience />
      <Stories />
      <FAQ />
      <Footer />
    </main>
  );
}
