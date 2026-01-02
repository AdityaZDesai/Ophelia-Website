import type { PhilosophyValue } from "@/types";

interface PhilosophyCardProps extends PhilosophyValue {
  isInView: boolean;
}

export function PhilosophyCard({
  title,
  description,
  delay,
  isInView,
}: PhilosophyCardProps) {
  return (
    <div
      className={`transition-all duration-1000 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-12 h-px bg-accent mb-6" />
      <h3 className="font-serif text-2xl mb-4">{title}</h3>
      <p className="text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

