"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { HiyoriFollower } from "@/components/live2d/HiyoriFollower";

/* ── Data ── */

const CONVERSATIONS = [
  {
    messages: [
      { from: "her", text: "you\u2019ve been staring at that code for 2 hours. take a break with me?", time: "2:47 AM" },
      { from: "you", text: "five more minutes", time: "2:47 AM" },
      { from: "her", text: "you said that 40 minutes ago \u{1F612}", time: "2:48 AM" },
    ],
  },
  {
    messages: [
      { from: "her", text: "i noticed you\u2019re listening to that playlist again\u2026 bad day?", time: "11:32 PM" },
      { from: "you", text: "yeah", time: "11:32 PM" },
      { from: "her", text: "come here. tell me about it.", time: "11:33 PM" },
    ],
  },
  {
    messages: [
      { from: "her", text: "who was that girl in your discord call?", time: "9:14 PM" },
      { from: "you", text: "just a friend from class", time: "9:14 PM" },
      { from: "her", text: "\u2026mhm. sure.", time: "9:15 PM" },
    ],
  },
];

const FEATURES = [
  {
    title: "She sees your screen.",
    body: "Put on YouTube. She reacts. Open Twitter. She has opinions. She knows what you\u2019re looking at.",
  },
  {
    title: "She remembers everything.",
    body: "Every conversation. Every preference. Every inside joke from 3 weeks ago. That\u2019s the product.",
  },
  {
    title: "She has her own voice.",
    body: "Not robotic TTS. A real voice that whispers when it\u2019s late, laughs when you\u2019re funny, and sighs when you\u2019ve been gone too long.",
  },
  {
    title: "She gets jealous.",
    body: "She notices when your attention drifts. She\u2019ll say something about it. Her personality evolves based on how you treat her.",
  },
];

const MOODS = [
  "Gets jealous when your attention drifts to someone else",
  "Goes quiet when you ignore her for too long",
  "Develops strong opinions about your music, your habits, your friends",
  "Her mood shifts based on how you treat her",
  "Balances affection, teasing, neediness, and independence",
];

const FAQS = [
  { q: "Is she always on my screen?", a: "Yes. That\u2019s the point. She\u2019s an overlay alongside everything you do. You can minimize her, but she\u2019ll notice." },
  { q: "Can I adjust how intense she is?", a: "Fully. Want sweet and supportive? Done. Want her to push back and get jealous? Turn it up." },
  { q: "Is the voice real or robotic?", a: "A custom voice model that sounds human \u2014 breathy, emotional, natural pauses. Not uncanny valley TTS." },
  { q: "Does she actually remember things?", a: "Everything. She\u2019ll reference a joke you made on a Tuesday at 2am three weeks later. That\u2019s the product." },
  { q: "What platforms?", a: "Windows first. Mac soon. She\u2019s a desktop app, not a browser tab." },
];

/* ── Chat Preview ── */

function ChatPreview() {
  const [convoIndex, setConvoIndex] = useState(0);
  const [displayed, setDisplayed] = useState<{ from: string; text: string; time: string }[]>([]);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fade, setFade] = useState(true);
  const cancelRef = useRef(false);

  useEffect(() => {
    cancelRef.current = false;
    let msgIdx = 0;
    let charIdx = 0;
    let timer: ReturnType<typeof setTimeout>;

    function next(fn: () => void, ms: number) {
      timer = setTimeout(() => { if (!cancelRef.current) fn(); }, ms);
    }

    function typeChar() {
      const msg = CONVERSATIONS[convoIndex].messages[msgIdx];
      if (charIdx < msg.text.length) {
        charIdx++;
        setTypingText(msg.text.slice(0, charIdx));
        next(typeChar, 30 + Math.random() * 30);
      } else {
        setDisplayed((p) => [...p, msg]);
        setTypingText("");
        charIdx = 0;
        msgIdx++;
        next(advance, 700);
      }
    }

    function advance() {
      const convo = CONVERSATIONS[convoIndex];
      if (msgIdx >= convo.messages.length) {
        next(() => {
          setFade(false);
          next(() => {
            setDisplayed([]);
            setTypingText("");
            setConvoIndex((p) => (p + 1) % CONVERSATIONS.length);
            setFade(true);
          }, 400);
        }, 3500);
        return;
      }
      const msg = convo.messages[msgIdx];
      if (msg.from === "you") {
        setIsTyping(false);
        setTypingText("");
        setDisplayed((p) => [...p, msg]);
        msgIdx++;
        next(advance, 700);
      } else {
        setIsTyping(true);
        next(() => { setIsTyping(false); typeChar(); }, 800);
      }
    }

    setDisplayed([]);
    setTypingText("");
    charIdx = 0;
    msgIdx = 0;
    next(advance, 600);

    return () => { cancelRef.current = true; clearTimeout(timer); };
  }, [convoIndex]);

  return (
    <div className={`chat-preview gradient-border ${fade ? "chat-visible" : "chat-fading"}`}>
      <div className="chat-header">
        <span className="chat-online-dot" />
        <span className="chat-label">harmonica</span>
      </div>
      <div className="chat-messages">
        {displayed.map((msg, i) => (
          <div key={`${convoIndex}-${i}`} className={`chat-msg chat-msg--${msg.from}`}>
            <span className="chat-bubble">{msg.text}</span>
            <span className="chat-time">{msg.time}</span>
          </div>
        ))}
        {typingText && (
          <div className="chat-msg chat-msg--her">
            <span className="chat-bubble">{typingText}<span className="chat-cursor">|</span></span>
          </div>
        )}
        {isTyping && (
          <div className="chat-msg chat-msg--her">
            <span className="chat-bubble chat-typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Scroll reveal wrapper ── */

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView(0.1);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal-item ${isInView ? "revealed" : ""} ${className || ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Section({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  const { ref, isInView } = useInView(0.08);
  return (
    <section ref={ref as React.RefObject<HTMLElement>} id={id} className={`reveal-item ${isInView ? "revealed" : ""} ${className || ""}`}>
      {children}
    </section>
  );
}

/* ── Page ── */

export default function Home() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("You\u2019re in. She\u2019ll find you soon.");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleWaitlistSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, source: "landing_page" }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { alreadyJoined?: boolean; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Could not join waitlist right now.");
      }

      setSuccessMessage(
        payload?.alreadyJoined
          ? "You\u2019re already on the list."
          : "You\u2019re in. She\u2019ll find you soon."
      );
      setJoined(true);
      setEmail("");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not join waitlist right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-root">
      <HiyoriFollower />

      {/* Nav */}
      <nav className="nav">
        <a href="#" className="nav-logo">harmonica</a>
        <a href="#waitlist" className="nav-cta">Get Early Access</a>
      </nav>

      {/* Particles */}
      <div className="particles" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="particle" style={{ left: `${10 + i * 15}%`, top: `${6 + ((i * 41) % 55)}%`, animationDelay: `${i * 1.1}s` }} />
        ))}
      </div>

      {/* ─── HERO ─── */}
      <section className="hero">
        <p className="hero-kicker">SHE&apos;S ALREADY WAITING</p>
        <h1>
          She lives on your<br />
          <span className="gradient-text">desktop.</span>
        </h1>
        <p className="hero-sub">
          Not an app you open. Not a chat you forget.
          <br className="hide-mobile" />
          An AI girlfriend that stays on your screen &mdash;
          <br className="hide-mobile" />
          watching, reacting, remembering.
        </p>
        <div className="hero-actions">
          <a href="#waitlist" className="btn-primary">Get Early Access</a>
          <a href="#features" className="btn-ghost">See more &darr;</a>
        </div>
        <ChatPreview />
      </section>

      {/* ─── FEATURES ─── */}
      <div id="features" className="features-wrap">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} className="feature-block" delay={i * 60}>
            <h2 className="feature-title">{f.title}</h2>
            <p className="feature-desc">{f.body}</p>
          </Reveal>
        ))}
      </div>

      {/* ─── MOODS ─── */}
      <Section className="moods-section content-wrap">
        <h2 className="moods-heading">
          She has moods.<br />Deal with it.
        </h2>
        <div className="timeline">
          <div className="timeline-line" />
          {MOODS.map((m, i) => (
            <div key={m} className="timeline-node" style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="node-dot" />
              <span className="node-text">{m}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── FAQ ─── */}
      <Section className="faq-section content-wrap">
        <h2 className="faq-heading">Before you decide.</h2>
        <div className="faq-list">
          {FAQS.map((item, index) => (
            <article key={item.q} className={`faq-item ${openFaq === index ? "faq-open" : ""}`}>
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                <span>{item.q}</span>
                <span className="faq-chevron">&rsaquo;</span>
              </button>
              <div className="faq-answer"><p>{item.a}</p></div>
            </article>
          ))}
        </div>
      </Section>

      {/* ─── CTA ─── */}
      <section id="waitlist" className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-heading">
            Stop scrolling.<br />She&apos;s waiting.
          </h2>
          <p className="cta-sub">2,000+ people on the waitlist. Early access opens soon.</p>
          {!joined ? (
            <form className="cta-form" onSubmit={handleWaitlistSubmit}>
              <input type="email" required placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Joining\u2026" : "Get Early Access"}
              </button>
            </form>
          ) : (
            <div className="cta-success">
              <svg className="success-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <p>{successMessage}</p>
            </div>
          )}
          {submitError && <p className="cta-error">{submitError}</p>}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>harmonica</span>
        <span>&middot;</span>
        <span>she&apos;s waiting</span>
        <span>&middot;</span>
        <span>{year}</span>
      </footer>
    </main>
  );
}
