import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function PromptViewer({ prompt }: { prompt: string }) {
  return (
    <Collapsible className="mt-6 group">
      <CollapsibleTrigger className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
        <span>View prompt</span>
        <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words border-l-2 border-border pl-3 text-xs text-muted-foreground font-mono">
{prompt}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}
