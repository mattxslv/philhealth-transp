"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { PageLoadingSkeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { ExportButton } from "@/components/ui/export-button";
import { YearSelectorDropdown } from "@/components/ui/year-selector-dropdown";
import { FileText, DollarSign, Calendar, Download, AlertCircle, Building2, Users, TrendingUp, Shield, BookOpen, FileCheck, Briefcase } from "lucide-react";

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
      axios.get(`/data/statistics-charts-${selectedYear}.json`).catch(err => {
        console.warn(`Statistics charts for ${selectedYear} not found, using empty data`);
        return { data: {} };
      }),
      axios.get(`/data/annual-report-${selectedYear}.json`).catch(err => {
        console.warn(`Annual report for ${selectedYear} not found, using empty data`);
        return { data: {} };
      })
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

  // Check if we have valid data
  if (!statisticsData && !annualReportData) {
    return (
      <DashboardLayout>
        <ErrorMessage
          type="notfound"
          message="No governance data available for the selected year."
          onRetry={loadData}
          showHomeButton={true}
        />
      </DashboardLayout>
    );
  }

  // Extract data based on year
  let reportData: any = {};
  let auditorReport: any = null;
  let financialStatements: any = null;
  let keyPersonnel: any = null;
  let vision: string = "";
  let mission: string = "";
  let coreValues: string = "";
  let theme: string = "";
  let pdfUrl: string = "";
  let fileSize: string = "";
  let benefitEnhancements: any[] = [];
  let coverage: any = null;

  if (selectedYear === 2024) {
    reportData = annualReportData.philhealth_annual_report_2024 || {};
    auditorReport = reportData.auditor_report || null;
    financialStatements = reportData.financial_statements || null;
    const mandateVision = reportData.mandate_and_vision || {};
    vision = mandateVision.vision || "";
    mission = mandateVision.mandate || "";
    coreValues = mandateVision.core_values?.join(", ") || "";
  } else if (selectedYear === 2023) {
    reportData = annualReportData;
    keyPersonnel = reportData.keyPersonnel || null;
    vision = reportData.vision || "";
    mission = reportData.mission || "";
    coreValues = reportData.coreValues || "";
    theme = reportData.theme || "";
    pdfUrl = reportData.pdfUrl || "";
    fileSize = reportData.fileSize || "";
    benefitEnhancements = reportData.benefitEnhancements || [];
    coverage = reportData.coverage || null;
  } else if (selectedYear === 2022) {
    reportData = annualReportData.philhealth_2022_annual_report_data || {};
    financialStatements = reportData.financial_statements_summary || null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Governance & Accountability</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Transparency in corporate governance and accountability measures
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            About This Page
          </h3>
          <p className="text-blue-800 dark:text-blue-200">
            This page is dedicated to governance and accountability information. The sections below represent key areas of transparency that are essential for public accountability. 
            Please note that PhilHealth has not provided detailed data for these specific categories in their published annual reports.
          </p>
        </div>

        {/* Board Meeting Minutes and Resolutions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <FileCheck className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Board Meeting Minutes and Resolutions
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-3">
                Decisions affecting policy and operations
              </p>
              <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded p-4">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ⚠️ Data Not Provided by PhilHealth
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  PhilHealth has not published board meeting minutes, resolutions, or detailed documentation of board decisions in their public annual reports. 
                  This information would include dates of meetings, attendance records, agenda items discussed, and specific resolutions passed affecting organizational policy and operations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Annual Reports */}
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                Annual Reports
              </h3>
              <p className="text-green-800 dark:text-green-200 mb-3">
                Comprehensive overview of achievements, challenges, and plans
              </p>
              <div className="bg-green-100 dark:bg-green-900/40 rounded p-4 mb-4">
                <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                  ✓ Annual Reports Available
                </p>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                  PhilHealth publishes annual reports containing financial highlights, membership statistics, and operational achievements. 
                  You can download and review these comprehensive documents.
                </p>
                <Link 
                  href="/downloads/annual-reports"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  View Annual Reports
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Compensation */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <DollarSign className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Executive Compensation
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-3">
                Salaries and benefits of key officials
              </p>
              <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded p-4">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ⚠️ Data Not Provided by PhilHealth
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  PhilHealth has not disclosed detailed executive compensation information in their public annual reports. 
                  This would typically include base salaries, bonuses, allowances, benefits, and total compensation packages for the President/CEO, senior vice presidents, 
                  board members, and other key management personnel. Such disclosure is a standard practice in corporate governance transparency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Procurement Contracts */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 dark:border-purple-600 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Briefcase className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Procurement Contracts
              </h3>
              <p className="text-purple-800 dark:text-purple-200 mb-3">
                Major purchases and vendor selections with amounts
              </p>
              <div className="bg-purple-100 dark:bg-purple-900/40 rounded p-4 mb-4">
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  ✓ Procurement Documents Available
                </p>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                  PhilHealth has published procurement-related documents and amendments. While comprehensive contract details with amounts and vendor selections 
                  are not fully disclosed, you can review available procurement documentation.
                </p>
                <Link 
                  href="/procurement"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  View Procurement Documents
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Transparency & Public Accountability
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Transparency in governance is essential for public trust and accountability. This page highlights areas where additional disclosure would enhance 
            public understanding of PhilHealth&apos;s governance practices, decision-making processes, and use of public funds.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> The absence of certain governance data does not necessarily indicate impropriety. However, comprehensive disclosure of 
              board decisions, executive compensation, and detailed procurement information would align with international best practices in public sector transparency 
              and strengthen public confidence in the organization.
            </p>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#009a3d]" />
            Additional Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/downloads/annual-reports"
              className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors border border-green-200 dark:border-green-800"
            >
              <FileText className="w-8 h-8 text-[#009a3d]" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Annual Reports</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download complete annual reports</p>
              </div>
            </Link>
            
            <Link 
              href="/procurement"
              className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-purple-200 dark:border-purple-800"
            >
              <Briefcase className="w-8 h-8 text-purple-600" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Procurement Documents</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">View available procurement files</p>
              </div>
            </Link>

            <Link 
              href="/financials"
              className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800"
            >
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Financial Performance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">View financial statements and reports</p>
              </div>
            </Link>

            <Link 
              href="/claims"
              className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors border border-yellow-200 dark:border-yellow-800"
            >
              <FileCheck className="w-8 h-8 text-yellow-600" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Claims Analytics</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Review claims data and statistics</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
