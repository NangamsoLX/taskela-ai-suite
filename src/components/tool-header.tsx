import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  color: string;
  kandinsky: string;
  title: string;
  description: string;
}

export function ToolHeader({ icon: Icon, color, kandinsky, title, description }: Props) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: color, color: "white" }}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="tracking-label">{kandinsky}</p>
        <h1 className="mt-1 text-3xl font-bold">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
