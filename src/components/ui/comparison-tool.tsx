"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ComparisonToolProps {
  data: any[];
  selectedYear: number;
  onCompare: (year1: number, year2: number) => void;
}

export function ComparisonTool({ data, selectedYear, onCompare }: ComparisonToolProps) {
  const [compareYear, setCompareYear] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const availableYears = data.map((d) => d.year).filter((y) => y !== selectedYear);

  const handleCompare = () => {
    if (compareYear) {
      onCompare(selectedYear, compareYear);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
      >
        Compare Years
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
          <h3 className="text-sm font-semibold mb-3">Compare with:</h3>
          <div className="space-y-2 mb-4">
            {availableYears.map((year) => (
              <label key={year} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="compareYear"
                  value={year}
                  checked={compareYear === year}
                  onChange={() => setCompareYear(year)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{year}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCompare}
              disabled={!compareYear}
              className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Compare
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-2 bg-muted text-muted-foreground rounded text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface ComparisonResultProps {
  label: string;
  currentValue: number;
  previousValue: number;
  formatter?: (value: number) => string;
}

export function ComparisonResult({ label, currentValue, previousValue, formatter }: ComparisonResultProps) {
  const difference = currentValue - previousValue;
  const percentChange = previousValue !== 0 ? ((difference / previousValue) * 100) : 0;
  const isPositive = difference > 0;
  const isNeutral = difference === 0;

  const formatValue = formatter || ((v) => v.toLocaleString());

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{formatValue(previousValue)}</span>
        <span className="text-sm">→</span>
        <span className="text-sm font-semibold">{formatValue(currentValue)}</span>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isNeutral ? 'text-muted-foreground' : isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {isNeutral ? (
            <Minus className="w-4 h-4" />
          ) : isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(percentChange).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
