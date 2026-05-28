import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  color: string;
  kandinsky?: string;
  title: string;
  description: string;
}

export function ToolHeader({ icon: Icon, color, title, description }: Props) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5" style={{ color }} />
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
