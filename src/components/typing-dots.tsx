export function TypingDots({ color }: { color: string }) {
  return (
    <div className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full animate-pulse-dot"
          style={{ backgroundColor: color, animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
