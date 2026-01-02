interface SectionHeadingProps {
  label: string;
  title: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  label,
  title,
  centered = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <p className="text-text-muted text-sm tracking-[0.3em] uppercase mb-6">
        {label}
      </p>
      <h2 className="font-serif text-4xl md:text-6xl font-light">{title}</h2>
    </div>
  );
}

