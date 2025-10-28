"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

interface YearSelectorProps {
  selectedYear: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
  hasDetailedBreakdown?: boolean;
  expandedCards?: { [key: string]: boolean };
  onToggleAll?: () => void;
}

export function YearSelector({
  selectedYear,
  availableYears,
  onYearChange,
  hasDetailedBreakdown = false,
  expandedCards,
  onToggleAll,
}: YearSelectorProps) {
  const allExpanded = expandedCards ? Object.values(expandedCards).every(val => val) : false;

  return (
    <div className="flex justify-between items-center mt-8">
      <div className="flex items-center gap-3">
        <label htmlFor="year-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Year:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
        >
          {availableYears.map((year: number) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {hasDetailedBreakdown && (
          <>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Detailed breakdown available
            </span>
            {onToggleAll && expandedCards && (
              <button
                onClick={onToggleAll}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium text-sm"
              >
                {allExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Collapse All Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Expand All Details
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
