"use client";

import { Calendar } from "lucide-react";

interface YearSelectorDropdownProps {
  selectedYear: number;
  onChange: (year: number) => void;
  startYear?: number;
  endYear?: number;
}

export function YearSelectorDropdown({ 
  selectedYear, 
  onChange, 
  startYear = 2007, 
  endYear = 2024 
}: YearSelectorDropdownProps) {
  const years = Array.from(
    { length: endYear - startYear + 1 }, 
    (_, i) => endYear - i
  );

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Calendar className="w-4 h-4 text-primary" />
      <select
        value={selectedYear}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-transparent text-gray-900 dark:text-white font-semibold text-sm focus:outline-none cursor-pointer pr-8 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%277%27 viewBox=%270 0 12 7%27%3e%3cpath fill=%27%23009a3d%27 d=%27M6 7L0 0h12z%27/%3e%3c/svg%3e')] bg-no-repeat bg-right"
        style={{ maxHeight: '200px' }}
      >
        {years.map(year => (
          <option key={year} value={year} className="py-2">
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
