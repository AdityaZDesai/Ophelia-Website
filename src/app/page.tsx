import { Header, Footer } from "@/components/layout";
import {
  Hero,
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
      <Philosophy />
      <Experience />
      <Quote />
      <Stories />
      <Waitlist />
      <Footer />
    </main>
  );
}
