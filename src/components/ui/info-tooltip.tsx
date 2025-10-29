"use client";

import { Info } from "lucide-react";
import { useState } from "react";

interface InfoTooltipProps {
  content: string;
  title?: string;
}

export function InfoTooltip({ content, title }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-primary/10 transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-label="More information"
      >
        <Info className="w-4 h-4 text-muted-foreground" />
      </button>
      
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 bg-popover border border-border rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-popover border-r border-b border-border"></div>
          {title && (
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
          )}
          <p className="text-xs text-muted-foreground leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
}
