"use client";

import { useInView } from "@/hooks/useInView";
import { SectionHeading, TestimonialCard } from "@/components/ui";
import { TESTIMONIALS } from "@/lib/constants";

export function Stories() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section id="stories" ref={ref} className="py-32 px-6 bg-background-secondary">
      <div className="max-w-6xl mx-auto">
        <div
          className={`mb-20 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <SectionHeading
            label="Early Testers"
            title="What people are saying"
            centered
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              {...testimonial}
              isInView={isInView}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
