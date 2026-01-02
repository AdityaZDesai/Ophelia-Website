import type { ExperienceItem } from "@/types";

interface ExperienceCardProps extends ExperienceItem {
  isInView: boolean;
  index: number;
}

export function ExperienceCard({
  number,
  title,
  description,
  isInView,
  index,
}: ExperienceCardProps) {
  return (
    <div
      className={`group p-8 md:p-12 bg-cream rounded-2xl transition-all duration-700 hover:shadow-xl hover:shadow-accent/5 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <span className="text-accent text-sm font-medium tracking-wide">
        {number}
      </span>
      <h3 className="font-serif text-2xl md:text-3xl mt-4 mb-4 group-hover:text-accent-deep transition-colors">
        {title}
      </h3>
      <p className="text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

