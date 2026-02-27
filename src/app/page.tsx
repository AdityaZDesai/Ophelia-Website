import { Header, Footer } from "@/components/layout";
import {
  Hero,
  Messaging,
  Personalities,
  Experience,
  Stories,
  Waitlist,
  FAQ,
} from "@/components/sections";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Messaging />
      <Personalities />
      <Experience />
      <Stories />
      <FAQ />
      <Waitlist />
      <Footer />
    </main>
  );
}
