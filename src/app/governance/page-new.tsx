"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { formatNumber } from "@/lib/utils";
import { PageLoadingSkeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { ExportButton } from "@/components/ui/export-button";
import { FileText, DollarSign, Calendar, Download, AlertCircle, Building2 } from "lucide-react";

export default function GovernancePage() {
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [annualReportData, setAnnualReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ type: "network" | "notfound" | "generic"; message?: string } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const loadData = () => {
    setLoading(true);
    setError(null);
    
    Promise.all([
      axios.get(`/data/statistics-charts-${selectedYear}.json`),
      axios.get(`/data/annual-report-${selectedYear}.json`)
    ])
      .then(([statsRes, reportRes]) => {
        setStatisticsData(statsRes.data);
        setAnnualReportData(reportRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading governance data:", err);
        if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
          setError({ type: "network", message: "Unable to load governance data. Please check your connection." });
        } else if (err.response?.status === 404) {
          setError({ type: "notfound", message: "Governance data files were not found." });
        } else {
          setError({ type: "generic", message: "An unexpected error occurred while loading governance data." });
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  if (loading || !statisticsData || !annualReportData) {
    return (
      <DashboardLayout>
        <PageLoadingSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage
          type={error.type}
          message={error.message}
          onRetry={loadData}
          showHomeButton={true}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with Export */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Governance & Transparency</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Corporate governance, policies, and transparency initiatives - {selectedYear}
            </p>
          </div>
          <ExportButton
            data={{ statisticsData, annualReportData }}
            filename={`philhealth-governance-${selectedYear}`}
          />
        </div>

        {/* Year Selector */}
        <div className="flex justify-center">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Array.from({ length: 17 }, (_, i) => 2024 - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Annual Report Theme */}
        <div className="bg-gradient-to-r from-[#009a3d] to-[#007a30] text-white rounded-lg p-8 shadow-lg">
          <div className="flex items-start gap-4">
            <FileText className="w-12 h-12 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedYear} Annual Report</h2>
              <p className="text-xl opacity-90">{annualReportData.theme}</p>
              {annualReportData.pdfUrl && (
                <a 
                  href={annualReportData.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-[#009a3d] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Full Report ({annualReportData.fileSize})
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Vision, Mission, Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {annualReportData.vision && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#009a3d]" />
                Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{annualReportData.vision}</p>
            </div>
          )}
          
          {annualReportData.mission && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#009a3d]" />
                Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{annualReportData.mission}</p>
            </div>
          )}

          {annualReportData.coreValues && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#009a3d]" />
                Core Values
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{annualReportData.coreValues}</p>
            </div>
          )}
        </div>

        {/* Key Personnel */}
        {annualReportData.keyPersonnel && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4">Key Personnel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(annualReportData.keyPersonnel).map(([position, name]) => (
                <div key={position} className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="text-gray-600 dark:text-gray-400">{position.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-semibold">{name as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones & Achievements */}
        {statisticsData.milestones && statisticsData.milestones.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4">Milestones & Achievements</h3>
            <ul className="space-y-3">
              {statisticsData.milestones.map((milestone: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#009a3d] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{milestone}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Coverage Statistics */}
        {annualReportData.coverage && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4">Coverage Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(annualReportData.coverage).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="text-gray-600 dark:text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-semibold">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefit Enhancements */}
        {annualReportData.benefitEnhancements && annualReportData.benefitEnhancements.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4">Benefit Enhancements ({selectedYear})</h3>
            <div className="space-y-4">
              {annualReportData.benefitEnhancements.map((enhancement: any, index: number) => (
                <div key={index} className="border-l-4 border-[#009a3d] pl-4">
                  <h4 className="font-semibold text-lg">{enhancement.package}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{enhancement.enhancement}</p>
                  {enhancement.percentageIncrease && (
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                      +{enhancement.percentageIncrease}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Benefit Packages */}
        {annualReportData.newBenefitPackages && annualReportData.newBenefitPackages.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4">New Benefit Packages ({selectedYear})</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {annualReportData.newBenefitPackages.map((packageName: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#009a3d] rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">{packageName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
