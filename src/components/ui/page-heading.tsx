import { cn } from "@/lib/utils";

interface PageHeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeading({ title, description, className }: PageHeadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-muted-foreground max-w-3xl">{description}</p>
      )}
    </div>
  );
}
