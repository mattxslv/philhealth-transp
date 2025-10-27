"use client";

import { cn } from "@/lib/utils";

interface ModernChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ModernChartCard({
  title,
  description,
  children,
  className,
}: ModernChartCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="p-4 sm:p-6 border-b border-border/50">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
}
