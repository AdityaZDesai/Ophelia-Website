import { Header, Footer } from "@/components/layout";
import {
  Hero,
  Personalities,
  Philosophy,
  Experience,
  Quote,
  Stories,
  Waitlist,
} from "@/components/sections";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Personalities />
      <Philosophy />
      <Experience />
      <Quote />
      <Stories />
      <Waitlist />
      <Footer />
      </main>
  );
}
