import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function KPIStatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: KPIStatCardProps) {
  // Determine font size based on value length
  const valueString = String(value);
  const isLongNumber = valueString.length > 15;
  
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 sm:p-6 shadow-sm transition-all hover:shadow-md h-full flex flex-col",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
        </div>
        <div className="rounded-lg bg-primary/10 p-2 sm:p-3 flex-shrink-0">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
      </div>
      
      <div className="flex-1 max-w-full overflow-hidden">
        <p className={cn(
          "font-bold text-foreground leading-tight overflow-hidden",
          isLongNumber ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
        )}>{value}</p>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      {trend && (
        <div
          className={cn(
            "mt-3 flex items-center gap-1 text-sm font-medium",
            trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}
        >
          {trend.isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>
            {trend.isPositive ? "+" : ""}
            {trend.value}% from last period
          </span>
        </div>
      )}
    </div>
  );
}
