import { AlertTriangle } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="mt-8 flex items-center justify-center gap-2 rounded-md border border-dashed bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
      <AlertTriangle className="h-3.5 w-3.5" />
      AI-generated content. Always verify before use.
    </div>
  );
}
