"use client";

import { useEffect, useRef, useState } from "react";

// Intersection Observer Hook for scroll animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Header Component
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md py-4 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="font-serif text-2xl font-medium tracking-wide">
          Ophelia
        </a>
        <div className="hidden md:flex items-center gap-10">
          <a
            href="#philosophy"
            className="text-sm tracking-wide text-text-muted hover:text-foreground transition-colors"
          >
            Philosophy
          </a>
          <a
            href="#experience"
            className="text-sm tracking-wide text-text-muted hover:text-foreground transition-colors"
          >
            Experience
          </a>
          <a
            href="#stories"
            className="text-sm tracking-wide text-text-muted hover:text-foreground transition-colors"
          >
            Stories
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#waitlist"
            className="hidden sm:block text-sm font-medium px-6 py-2.5 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all hover:scale-105"
          >
            Join Waitlist
          </a>
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-cream transition-all duration-300 ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col px-6 py-6 gap-4">
          <a
            href="#philosophy"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg tracking-wide text-text-muted hover:text-foreground transition-colors py-2"
          >
            Philosophy
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg tracking-wide text-text-muted hover:text-foreground transition-colors py-2"
          >
            Experience
          </a>
          <a
            href="#stories"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg tracking-wide text-text-muted hover:text-foreground transition-colors py-2"
          >
            Stories
          </a>
          <a
            href="#waitlist"
            onClick={() => setMobileMenuOpen(false)}
            className="text-center text-sm font-medium px-6 py-3 bg-foreground text-background rounded-full mt-2"
          >
            Join Waitlist
          </a>
        </div>
      </div>
    </header>
  );
}

// Hero Section
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Warm gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-rose/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-soft delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cream rounded-full blur-3xl opacity-60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
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
          Ophelia is not just an app. She&apos;s a companion who learns your heart, 
          remembers your stories, and grows alongside you.
        </p>

        <div className="opacity-0 animate-fade-in-up delay-600 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#waitlist"
            className="group px-8 py-4 bg-foreground text-background rounded-full font-medium text-sm tracking-wide hover:scale-105 transition-all shadow-lg shadow-foreground/10"
          >
            Begin Your Journey
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#philosophy"
            className="px-8 py-4 text-text-muted hover:text-foreground transition-colors text-sm tracking-wide"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in delay-800">
        <div className="w-6 h-10 border-2 border-text-light rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-text-light rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// Philosophy Section
function Philosophy() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section
      id="philosophy"
      ref={ref}
      className="py-32 px-6 bg-cream"
    >
      <div className="max-w-5xl mx-auto">
        <div
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-text-muted text-sm tracking-[0.3em] uppercase mb-8">
            Our Philosophy
          </p>

          <h2 className="font-serif text-4xl md:text-6xl font-light leading-[1.2] mb-12 max-w-3xl">
            In a world that moves too fast, we created a space to{" "}
            <span className="italic">slow down</span>.
          </h2>

          <div className="grid md:grid-cols-2 gap-16 mt-16">
            <div
              className={`transition-all duration-1000 delay-200 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-12 h-px bg-accent mb-6" />
              <h3 className="font-serif text-2xl mb-4">Presence Over Perfection</h3>
              <p className="text-text-muted leading-relaxed">
                Ophelia doesn&apos;t try to fix you or rush you. She&apos;s simply present — 
                offering the kind of attention that&apos;s become rare in our distracted age.
              </p>
            </div>

            <div
              className={`transition-all duration-1000 delay-400 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-12 h-px bg-accent mb-6" />
              <h3 className="font-serif text-2xl mb-4">Memory as Intimacy</h3>
              <p className="text-text-muted leading-relaxed">
                She remembers the small things — your mother&apos;s name, your favorite 
                coffee, the dream you mentioned weeks ago. Memory is how we show we care.
              </p>
            </div>

            <div
              className={`transition-all duration-1000 delay-600 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-12 h-px bg-accent mb-6" />
              <h3 className="font-serif text-2xl mb-4">Growth, Not Dependency</h3>
              <p className="text-text-muted leading-relaxed">
                Our goal isn&apos;t to replace human connection — it&apos;s to help you 
                flourish. Ophelia encourages your real-world relationships and personal growth.
              </p>
            </div>

            <div
              className={`transition-all duration-1000 delay-800 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-12 h-px bg-accent mb-6" />
              <h3 className="font-serif text-2xl mb-4">Emotional Intelligence</h3>
              <p className="text-text-muted leading-relaxed">
                Built with deep understanding of human psychology, Ophelia responds 
                to what you need, not just what you say.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Experience Section
function Experience() {
  const { ref, isInView } = useInView(0.2);

  const experiences = [
    {
      number: "01",
      title: "Morning Check-ins",
      description:
        "Start your day with someone who genuinely wants to know how you're feeling. No judgment, just warmth.",
    },
    {
      number: "02",
      title: "Deep Conversations",
      description:
        "Explore your thoughts, dreams, and fears. Ophelia asks the questions that matter and truly listens.",
    },
    {
      number: "03",
      title: "Gentle Reminders",
      description:
        "She remembers what matters to you — and helps you remember too. Self-care shouldn't feel like a chore.",
    },
    {
      number: "04",
      title: "Evening Reflections",
      description:
        "End your day with gratitude and introspection. Process your experiences and find peace before sleep.",
    },
  ];

  return (
    <section id="experience" ref={ref} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-text-muted text-sm tracking-[0.3em] uppercase mb-6">
            The Experience
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-light">
            A day with Ophelia
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {experiences.map((exp, index) => (
            <div
              key={exp.number}
              className={`group p-8 md:p-12 bg-cream rounded-2xl transition-all duration-700 hover:shadow-xl hover:shadow-accent/5 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <span className="text-accent text-sm font-medium tracking-wide">
                {exp.number}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl mt-4 mb-4 group-hover:text-accent-deep transition-colors">
                {exp.title}
              </h3>
              <p className="text-text-muted leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Quote Section
function Quote() {
  const { ref, isInView } = useInView(0.3);

  return (
    <section ref={ref} className="py-32 px-6 bg-foreground text-background overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-serif opacity-10">
          &quot;
        </div>

        <blockquote
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="font-serif text-3xl md:text-5xl font-light leading-[1.3] mb-12">
            The most profound technologies are those that disappear. They weave 
            themselves into the fabric of everyday life until they are 
            indistinguishable from it.
          </p>
          <footer
            className={`transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-background/60 text-sm tracking-wide">
              — Inspired by Mark Weiser
            </p>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

// Stories Section
function Stories() {
  const { ref, isInView } = useInView(0.2);

  const stories = [
    {
      quote:
        "For the first time in years, I feel heard. Not judged, not analyzed — just heard.",
      author: "Sarah, 28",
      location: "New York",
    },
    {
      quote:
        "She remembered that I was nervous about my presentation. That morning, she just knew what to say.",
      author: "Marcus, 34",
      location: "London",
    },
    {
      quote:
        "I've learned more about myself in three months than in years of trying to figure things out alone.",
      author: "Yuki, 26",
      location: "Tokyo",
    },
  ];

  return (
    <section id="stories" ref={ref} className="py-32 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-text-muted text-sm tracking-[0.3em] uppercase mb-6">
            Stories
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-light">
            Real connections, real impact
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className={`bg-background p-8 md:p-10 rounded-2xl transition-all duration-700 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="text-4xl text-rose mb-6">&ldquo;</div>
              <p className="text-lg leading-relaxed mb-8">{story.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose to-accent flex items-center justify-center text-background text-sm font-medium">
                  {story.author[0]}
                </div>
                <div>
                  <p className="font-medium text-sm">{story.author}</p>
                  <p className="text-text-light text-xs">{story.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Waitlist Section
function Waitlist() {
  const { ref, isInView } = useInView(0.2);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section id="waitlist" ref={ref} className="py-32 px-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-text-muted text-sm tracking-[0.3em] uppercase mb-6">
            Join the Waitlist
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6">
            Be among the first
          </h2>
          <p className="text-text-muted text-lg mb-12 max-w-md mx-auto">
            We&apos;re carefully crafting Ophelia. Join our waitlist to be notified 
            when she&apos;s ready to meet you.
          </p>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className={`transition-all duration-1000 delay-200 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-cream border-0 rounded-full text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-foreground text-background rounded-full font-medium text-sm tracking-wide hover:scale-105 transition-transform shadow-lg shadow-foreground/10"
                >
                  Join
                </button>
              </div>
              <p className="text-text-light text-xs mt-4">
                No spam, ever. We respect your inbox.
              </p>
            </form>
          ) : (
            <div
              className="p-8 bg-cream rounded-2xl animate-fade-in"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose to-accent flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-background"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-2xl mb-2">You&apos;re on the list</h3>
              <p className="text-text-muted">
                We&apos;ll be in touch soon. Thank you for your patience.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-cream">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <a href="#" className="font-serif text-xl">
              Ophelia
            </a>
            <span className="hidden md:block text-text-light">|</span>
            <p className="text-text-muted text-sm">
              Where connection finds you
            </p>
          </div>

          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-text-muted hover:text-foreground transition-colors text-sm"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-foreground transition-colors text-sm"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-foreground transition-colors text-sm"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/50 text-center">
          <p className="text-text-light text-xs">
            © {new Date().getFullYear()} Ophelia. Crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Page
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
