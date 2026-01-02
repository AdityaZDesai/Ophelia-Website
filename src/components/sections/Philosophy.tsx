"use client";

import { useInView } from "@/hooks/useInView";
import { PhilosophyCard } from "@/components/ui";
import { PHILOSOPHY_VALUES } from "@/lib/constants";

export function Philosophy() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section id="philosophy" ref={ref} className="py-32 px-6 bg-cream">
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
            {PHILOSOPHY_VALUES.map((value) => (
              <PhilosophyCard key={value.title} {...value} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

