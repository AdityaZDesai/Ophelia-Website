import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Warm gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-rose/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-soft delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cream rounded-full blur-3xl opacity-60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-8">
        <div className="opacity-0 animate-fade-in-up">
          <p className="text-text-muted text-sm tracking-[0.3em] uppercase mb-6">
            A new kind of connection
          </p>
        </div>

        <h1 className="opacity-0 animate-fade-in-up delay-200 font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-8">
          She listens.
          <br />
          <span className="italic font-normal">She understands.</span>
        </h1>

        <p className="opacity-0 animate-fade-in-up delay-400 text-lg md:text-xl text-text-muted max-w-xl mx-auto mb-12 font-light leading-relaxed">
          harmoica is not just an app. She&apos;s a companion who learns your heart,
          remembers your stories, and grows alongside you.
        </p>

        <div className="opacity-0 animate-fade-in-up delay-600 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button as="a" href="#personalities" size="lg" className="group">
            Begin Your Journey
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
