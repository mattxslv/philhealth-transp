import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { formatNumber, formatCurrency } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: number; // percentage change (e.g., 5.2 for +5.2%)
    direction: "up" | "down" | "neutral";
    label?: string; // e.g., "vs last year"
  };
  gradientFrom: string;
  gradientTo: string;
  format?: "number" | "currency" | "percentage" | "none";
}

export function KPICard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  gradientFrom,
  gradientTo,
  format = "none",
}: KPICardProps) {
  // Format the value based on type
  const formattedValue = () => {
    if (format === "currency") {
      return formatCurrency(Number(value));
    } else if (format === "number") {
      return formatNumber(Number(value));
    } else if (format === "percentage") {
      return `${value}%`;
    }
    return value;
  };

  // Determine trend icon and color
  const TrendIcon = trend?.direction === "up" 
    ? TrendingUp 
    : trend?.direction === "down" 
    ? TrendingDown 
    : Minus;

  const trendColor = trend?.direction === "up"
    ? "text-green-300"
    : trend?.direction === "down"
    ? "text-red-300"
    : "text-gray-300";

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} p-6 text-white shadow-lg transition-all hover:shadow-xl group`}>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
      <div className="relative">
        <Icon className="h-8 w-8 mb-4 opacity-90" />
        <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formattedValue()}</p>
        
        {trend && (
          <div className="flex items-center gap-2 mb-2">
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-semibold">
                {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}
                {Math.abs(trend.value).toFixed(1)}%
              </span>
            </div>
            {trend.label && (
              <span className="text-xs text-white/70">{trend.label}</span>
            )}
          </div>
        )}
        
        {subtitle && (
          <p className="text-sm text-white/70 dark:text-white/80">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
