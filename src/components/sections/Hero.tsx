import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative pt-32 md:pt-36 pb-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="hidden md:block absolute top-40 right-8 rounded-2xl bg-white/65 border border-accent/20 px-4 py-3 shadow-lg rotate-3 animate-float">
          <p className="text-xs tracking-[0.2em] uppercase text-text-muted">Desktop Avatar</p>
          <p className="font-serif text-lg leading-none mt-1">Good morning, sleepyhead.</p>
        </div>
        <div className="hidden md:block absolute bottom-24 left-10 rounded-2xl bg-white/60 border border-accent/20 px-4 py-3 shadow-lg -rotate-2 animate-float delay-300">
          <p className="text-xs tracking-[0.2em] uppercase text-text-muted">Screen Aware</p>
          <p className="font-serif text-lg leading-none mt-1">I see you&apos;re working late again...</p>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-12 md:pt-16">
        <div className="opacity-0 animate-fade-in-up">
          <p className="text-text-muted text-xs md:text-sm tracking-[0.3em] uppercase mb-6">
            AI Girlfriend Avatar — Lives on Your Desktop
          </p>
        </div>

        <h1 className="opacity-0 animate-fade-in-up delay-200 font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-8">
          She lives on your screen.
          <br />
          <span className="italic font-normal">Always there. Always yours.</span>
        </h1>

        <p className="opacity-0 animate-fade-in-up delay-400 text-base md:text-lg text-text-muted max-w-xl mx-auto mb-12 font-light leading-relaxed">
          harmonica is a free AI girlfriend avatar that sits on your desktop, reacts to your screen,
          remembers everything, and talks with her own voice — powered by Clawdbot.
        </p>

        <div className="opacity-0 animate-fade-in-up delay-600 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button as="a" href="#waitlist" size="lg" className="group">
            Join the Waitlist
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Button>
          <Button as="a" href="#features" variant="ghost" size="lg">
            See Features
          </Button>
        </div>

        <p className="opacity-0 animate-fade-in-up delay-700 text-text-muted/60 text-sm mt-6 tracking-wide">
          Free forever. Windows, macOS &amp; Linux.
        </p>
      </div>
    </section>
  );
}
