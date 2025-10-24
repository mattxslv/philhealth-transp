import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "default";

interface StatusChipProps {
  status: string;
  type?: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
};

export function StatusChip({ status, type = "default", className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        statusStyles[type],
        className
      )}
    >
      {status}
    </span>
  );
}
