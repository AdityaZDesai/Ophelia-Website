"use client";

import { useInView } from "@/hooks/useInView";

export function Quote() {
  const { ref, isInView } = useInView(0.3);

  return (
    <section
      ref={ref}
      className="py-32 px-6 bg-foreground text-background overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center relative">
        {/* Decorative quote mark */}
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

