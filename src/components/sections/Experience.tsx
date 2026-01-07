"use client";

import { useInView } from "@/hooks/useInView";
import { SectionHeading, ExperienceCard } from "@/components/ui";
import { EXPERIENCE_ITEMS } from "@/lib/constants";

export function Experience() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section id="experience" ref={ref} className="pt-16 md:pt-20 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className={`mb-20 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <SectionHeading
            label="The Experience"
            title="A day with Ophelia"
            centered
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {EXPERIENCE_ITEMS.map((item, index) => (
            <ExperienceCard
              key={item.number}
              {...item}
              isInView={isInView}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

