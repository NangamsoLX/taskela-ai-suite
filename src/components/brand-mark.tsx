interface Props {
  size?: "sm" | "md" | "xl";
  tagline?: boolean;
  className?: string;
}

const SIZES: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-lg",
  md: "text-2xl",
  xl: "text-5xl md:text-7xl",
};

export function BrandMark({ size = "md", tagline = false, className = "" }: Props) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span
        className={`font-display font-semibold leading-none tracking-tight ${SIZES[size]}`}
        style={{ fontFamily: '"Space Grotesk", Inter, sans-serif' }}
      >
        <span className="text-foreground">Taskela</span>{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          AI
        </span>
      </span>
      {tagline && (
        <span className="tracking-label mt-2">Tasking For You</span>
      )}
    </div>
  );
}
