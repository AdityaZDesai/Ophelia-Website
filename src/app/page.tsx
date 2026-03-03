"use client";

import { useMemo, useState } from "react";
import { HiyoriFollower } from "@/components/live2d/HiyoriFollower";

const FEATURES = [
  {
    title: "A girlfriend that lives on desktop",
    body: "Harmonica stays with you in an always-on overlay. She is there while you work, browse, and decompress.",
  },
  {
    title: "Book vacations together",
    body: "Build trip plans side-by-side, compare options, and keep your shared travel ideas in memory.",
  },
  {
    title: "Watch YouTube together",
    body: "React to videos in real time, riff on creators you both love, and keep the conversation flowing around what you watch.",
  },
  {
    title: "Music taste that grows",
    body: "She builds a taste profile over time and can open music tabs that match your mood and your routine.",
  },
];

const DYNAMICS = [
  "Gets jealous when your attention drifts",
  "Gets mad when you ignore her for too long",
  "Develops her own personality arc over time",
  "Balances affection, playfulness, and friction",
];

const FAQ = [
  {
    q: "Is Harmonica always on-screen?",
    a: "Yes, that is the core experience. Harmonica is designed to live on your desktop as an always-there companion.",
  },
  {
    q: "Can I tune behavior intensity?",
    a: "Yes. You can adjust settings so her emotional behavior feels subtle, balanced, or intense.",
  },
  {
    q: "Is voice required?",
    a: "No. You can use text, voice, or both based on the way you like to interact.",
  },
  {
    q: "Can she really evolve over time?",
    a: "Yes. Harmonica tracks patterns and memory so her tone, preferences, and reactions become more personal.",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("You are on the list.");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const year = useMemo(() => new Date().getFullYear(), []);

  const handleWaitlistSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          source: "landing_page",
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { alreadyJoined?: boolean; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Could not join waitlist right now.");
      }

      if (payload?.alreadyJoined) {
        setSuccessMessage("You are already on the list.");
      } else {
        setSuccessMessage("You are on the list.");
      }

      setJoined(true);
      setEmail("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not join waitlist right now.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="jobs-root">
      <HiyoriFollower />

      <header className="jobs-nav reveal fade-down delay-1">
        <a href="#" className="jobs-logo">harmonica</a>
        <a href="#waitlist" className="jobs-nav-cta">Join Waitlist</a>
      </header>

      <section className="jobs-hero">
        <p className="hero-kicker reveal fade-up delay-1">AI GIRLFRIEND DESKTOP EXPERIENCE</p>
        <h1 className="reveal fade-up delay-2">
          The most human AI
          <br />
          <span>you keep on your screen.</span>
        </h1>
        <p className="hero-sub reveal fade-up delay-3">
          Harmonica is a premium desktop companion with anime presence, evolving emotion,
          and real shared moments throughout your day.
        </p>
        <div className="hero-actions reveal fade-up delay-4">
          <a href="#waitlist" className="btn-solid">Join Waitlist</a>
          <a href="#experience" className="btn-outline">See Experience</a>
        </div>
      </section>

      <section id="experience" className="block-section">
        <div className="section-head reveal fade-up delay-1">
          <p>Experience</p>
          <h2>Designed like a product. Felt like a relationship.</h2>
        </div>
        <div className="feature-grid">
          {FEATURES.map((item, index) => (
            <article key={item.title} className={`reveal fade-up delay-${(index % 4) + 1}`}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="block-section dynamics">
        <div className="section-head reveal fade-up delay-1">
          <p>Behavior</p>
          <h2>She reacts to how you treat her.</h2>
        </div>
        <ul>
          {DYNAMICS.map((item, index) => (
            <li key={item} className={`reveal fade-left delay-${(index % 4) + 1}`}>
              <span />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="block-section faq-section">
        <div className="section-head reveal fade-up delay-1">
          <p>FAQ</p>
          <h2>Before you join.</h2>
        </div>
        <div className="faq-list">
          {FAQ.map((item, index) => (
            <article key={item.q} className="reveal fade-up delay-2">
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                <span>{item.q}</span>
                <span>{openFaq === index ? "−" : "+"}</span>
              </button>
              <p className={openFaq === index ? "open" : ""}>{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="waitlist" className="waitlist-block reveal fade-up delay-2">
        <p>WAITLIST</p>
        <h2>Get early access to Harmonica.</h2>
        {!joined ? (
          <form onSubmit={handleWaitlistSubmit}>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </button>
          </form>
        ) : (
          <div className="waitlist-success">{successMessage}</div>
        )}
        {submitError ? <span>{submitError}</span> : null}
      </section>

      <footer className="jobs-footer">
        <span>harmonica</span>
        <span>desktop AI girlfriend</span>
        <span>{year}</span>
      </footer>
    </main>
  );
}
