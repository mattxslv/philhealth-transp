import { cn } from "@/lib/utils";

interface PageHeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeading({ title, description, className }: PageHeadingProps) {
  return (
    <div className={cn("space-y-2 sm:space-y-3", className)}>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">{description}</p>
      )}
    </div>
  );
}
