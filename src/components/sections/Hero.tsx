import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-rose/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-soft delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cream rounded-full blur-3xl opacity-60" />
        <div className="absolute -top-8 right-[12%] w-64 h-64 rounded-full border border-accent/20" />
        <div className="absolute bottom-6 left-[14%] w-48 h-48 rounded-full border border-rose/25" />
        <div className="hidden md:block absolute top-40 right-8 rounded-2xl bg-white/65 border border-accent/20 px-4 py-3 shadow-lg rotate-3 animate-float">
          <p className="text-xs tracking-[0.2em] uppercase text-text-muted">iMessage</p>
          <p className="font-serif text-lg leading-none mt-1">Hey, I&apos;m here.</p>
        </div>
        <div className="hidden md:block absolute bottom-24 left-10 rounded-2xl bg-white/60 border border-accent/20 px-4 py-3 shadow-lg -rotate-2 animate-float delay-300">
          <p className="text-xs tracking-[0.2em] uppercase text-text-muted">Discord + Telegram</p>
          <p className="font-serif text-lg leading-none mt-1">Text me anytime.</p>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-8">
        <div className="opacity-0 animate-fade-in-up">
          <p className="text-text-muted text-sm tracking-[0.3em] uppercase mb-6">
            A companion who lives in your messages
          </p>
        </div>

        <h1 className="opacity-0 animate-fade-in-up delay-200 font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-8">
          Your AI companion, always close.
          <br />
          <span className="italic font-normal">Text her on iMessage, Discord, or Telegram.</span>
        </h1>

        <p className="opacity-0 animate-fade-in-up delay-400 text-lg md:text-xl text-text-muted max-w-xl mx-auto mb-12 font-light leading-relaxed">
          harmonica is more than chat. She listens, remembers what matters, and
          stays with you through everyday moments and deeper conversations, right
          inside the apps you already use.
        </p>

        <div className="opacity-0 animate-fade-in-up delay-600 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button as="a" href="#personalities" size="lg" className="group">
            Start Messaging
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Button>
          <Button as="a" href="#philosophy" variant="ghost" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
