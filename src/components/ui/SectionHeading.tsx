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
      <p className="text-neon-purple text-sm tracking-[0.3em] uppercase mb-6 font-medium">
        {label}
      </p>
      <h2 className="font-display text-4xl md:text-6xl font-semibold">{title}</h2>
    </div>
  );
}
