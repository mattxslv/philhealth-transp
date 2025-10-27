"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EChartsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function EChartsCard({ title, description, children, className }: EChartsCardProps) {
  return (
    <div className={cn(
      "rounded-2xl border-2 border-border/50 bg-card shadow-xl hover:shadow-2xl transition-all duration-300",
      "backdrop-blur-sm bg-gradient-to-br from-card/95 to-card/90",
      className
    )}>
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
