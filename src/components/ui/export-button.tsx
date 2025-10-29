"use client";

import { Download, FileJson, FileSpreadsheet, Printer, Copy } from "lucide-react";
import { useState } from "react";
import { downloadCSV, downloadJSON, printPage, copyToClipboard } from "@/lib/export";
import { useToast } from "./toast";

interface ExportButtonProps {
  data: any;
  filename: string;
  formatData?: (data: any) => any;
  headers?: string[];
}

export function ExportButton({ data, filename, formatData, headers }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  const handleExportCSV = () => {
    try {
      const exportData = formatData ? formatData(data) : data;
      const dataArray = Array.isArray(exportData) ? exportData : [exportData];
      downloadCSV(dataArray, filename, headers);
      showToast({
        type: "success",
        title: "Export Successful",
        message: `Data exported as ${filename}.csv`,
      });
      setIsOpen(false);
    } catch (error) {
      showToast({
        type: "error",
        title: "Export Failed",
        message: "Failed to export data as CSV",
      });
    }
  };

  const handleExportJSON = () => {
    try {
      const exportData = formatData ? formatData(data) : data;
      downloadJSON(exportData, filename);
      showToast({
        type: "success",
        title: "Export Successful",
        message: `Data exported as ${filename}.json`,
      });
      setIsOpen(false);
    } catch (error) {
      showToast({
        type: "error",
        title: "Export Failed",
        message: "Failed to export data as JSON",
      });
    }
  };

  const handlePrint = () => {
    printPage();
    setIsOpen(false);
  };

  const handleCopy = async () => {
    const exportData = formatData ? formatData(data) : data;
    const success = await copyToClipboard(exportData);
    if (success) {
      showToast({
        type: "success",
        title: "Copied!",
        message: "Data copied to clipboard",
      });
    } else {
      showToast({
        type: "error",
        title: "Copy Failed",
        message: "Failed to copy data to clipboard",
      });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-sm"
        aria-label="Export data"
        aria-expanded={isOpen}
      >
        <Download className="w-4 h-4" />
        <span className="font-medium">Export</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-2 space-y-1">
              <button
                onClick={handleExportCSV}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Export as CSV
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Excel compatible format
                  </p>
                </div>
              </button>

              <button
                onClick={handleExportJSON}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <FileJson className="w-4 h-4 text-[#009a3d]" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Export as JSON
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Raw data format
                  </p>
                </div>
              </button>

              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <Copy className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Copy to Clipboard
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Copy as JSON
                  </p>
                </div>
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <Printer className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Print Page
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Print or save as PDF
                  </p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
