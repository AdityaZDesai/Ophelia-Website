import type { Testimonial } from "@/types";

interface TestimonialCardProps extends Testimonial {
  isInView: boolean;
  index: number;
}

export function TestimonialCard({
  quote,
  author,
  location,
  isInView,
  index,
}: TestimonialCardProps) {
  return (
    <div
      className={`bg-background p-8 md:p-10 rounded-2xl transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="text-4xl text-rose mb-6">&ldquo;</div>
      <p className="text-lg leading-relaxed mb-8">{quote}</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose to-accent flex items-center justify-center text-background text-sm font-medium">
          {author[0]}
        </div>
        <div>
          <p className="font-medium text-sm">{author}</p>
          <p className="text-text-light text-xs">{location}</p>
        </div>
      </div>
    </div>
  );
}

