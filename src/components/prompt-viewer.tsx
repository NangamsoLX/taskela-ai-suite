import { ChevronDown, Code2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function PromptViewer({ prompt }: { prompt: string }) {
  return (
    <Collapsible className="mt-4 rounded-lg border bg-muted/40">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
        <span className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5" />
          View Prompt (Transparency)
        </span>
        <ChevronDown className="h-3.5 w-3.5 transition-transform data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words px-3 pb-3 pt-1 text-xs text-foreground/80 font-mono">
{prompt}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}
