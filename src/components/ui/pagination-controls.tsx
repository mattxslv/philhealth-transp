"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationControlsProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Show fewer pages on mobile
  const showPages = pages.filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center justify-center gap-1 sm:gap-2", className)}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="min-h-[44px] min-w-[44px] rounded-md border border-input bg-background p-2 hover:bg-accent disabled:pointer-events-none disabled:opacity-50 touch-manipulation"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>

      <div className="hidden sm:flex items-center gap-2">
        {showPages.map((page, index) => {
          const prevPage = showPages[index - 1];
          const showEllipsis = prevPage && page - prevPage > 1;

          return (
            <div key={page} className="flex items-center gap-2">
              {showEllipsis && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
              <button
                onClick={() => onPageChange(page)}
                className={cn(
                  "min-h-[44px] rounded-md border px-4 py-2 text-sm font-medium transition-colors touch-manipulation",
                  page === currentPage
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background hover:bg-accent"
                )}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            </div>
          );
        })}
      </div>

      {/* Mobile page indicator */}
      <div className="flex sm:hidden items-center px-3 py-2 text-sm font-medium text-muted-foreground">
        {currentPage} / {totalPages}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="min-h-[44px] min-w-[44px] rounded-md border border-input bg-background p-2 hover:bg-accent disabled:pointer-events-none disabled:opacity-50 touch-manipulation"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>
    </nav>
  );
}
