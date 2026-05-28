export function SimBanner({ color }: { color: string }) {
  return (
    <div
      className="mb-6 rounded-lg border px-4 py-2 text-xs text-muted-foreground"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        borderColor: "rgba(255, 255, 255, 0.06)",
        borderLeft: `2px solid ${color}`,
      }}
    >
      🤖 Powered by AI — Responses are generated in real-time. Always verify AI-generated content before use.
    </div>
  );
}
