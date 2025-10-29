"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { YearSelector } from "@/components/ui/year-selector";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { DataCardSkeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { ExportButton } from "@/components/ui/export-button";
import { FileText, DollarSign, Calendar, Download, AlertCircle, Building2 } from "lucide-react";

export default function GovernancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ type: "network" | "notfound" | "generic"; message?: string } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2007);

  const loadData = () => {
    setLoading(true);
    setError(null);
    
    axios.get("/data/governance-2007.json")
      .then(res => {
        if (!res.data) {
          setError({ type: "notfound", message: "Governance data is not available at this time." });
          setLoading(false);
          return;
        }
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading governance data:", err);
        if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
          setError({ type: "network", message: "Unable to load governance data. Please check your connection." });
        } else if (err.response?.status === 404) {
          setError({ type: "notfound", message: "Governance data file was not found." });
        } else {
          setError({ type: "generic", message: "An unexpected error occurred while loading governance data." });
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <DataCardSkeleton key={i} />
            ))}
          </div>
        </div>
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
              Corporate governance, board activities, and transparency initiatives
            </p>
          </div>
          <ExportButton
            data={data}
            filename={`philhealth-governance-${selectedYear}`}
          />
        </div>

        {/* Year Selector */}
        <YearSelector
          selectedYear={selectedYear}
          availableYears={[2007]}
          onYearChange={setSelectedYear}
          hasDetailedBreakdown={false}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Board Meetings */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative"><p className="text-sm font-medium text-muted-foreground mb-2">Board Meetings</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.corporateGovernance.totalBoardMeetings)}</p>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Held in {selectedYear}</p>
            </div>
          </div>

          {/* Board Resolutions */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative"><p className="text-sm font-medium text-muted-foreground mb-2">Board Resolutions</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.corporateGovernance.totalBoardResolutions)}</p>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Passed in {selectedYear}</p>
            </div>
          </div>

          {/* Annual Reports Available */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative"><p className="text-sm font-medium text-muted-foreground mb-2">Annual Reports</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">22</p>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Available (2003-2024)</p>
            </div>
          </div>

          {/* Executive Compensation */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative"><p className="text-sm font-medium text-muted-foreground mb-2">Executive Compensation</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatCurrency(data.boardOfDirectors.boardCompensation2007.totalHonorarium)}</p>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Board Total {selectedYear}</p>
            </div>
          </div>
        </div>

        {/* Board Meeting Minutes - FUTURE ENHANCEMENT */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground">Board Meeting Minutes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{data.corporateGovernance.totalBoardMeetings} meetings held in {selectedYear}</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Future Enhancement</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                  Detailed board meeting minutes, agendas, and voting records will be made available here. This section will include:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">ï¿½</span>
                    <span>Complete meeting minutes with discussion summaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">ï¿½</span>
                    <span>Agenda items and topics discussed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">ï¿½</span>
                    <span>Attendance records and voting results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">ï¿½</span>
                    <span>Resolutions passed and their implementation status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">ï¿½</span>
                    <span>Downloadable PDF documents for each meeting</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Preview Template */}
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h5 className="text-md font-semibold mb-3 text-gray-700 dark:text-muted-foreground">Preview: How Minutes Will Be Displayed</h5>
              <div className="space-y-2">
                {[
                  { date: "December 15, 2007", title: "Regular Board Meeting #12", resolutions: 8, attendance: "13/13" },
                  { date: "November 20, 2007", title: "Regular Board Meeting #11", resolutions: 10, attendance: "12/13" },
                  { date: "October 10, 2007", title: "Special Board Meeting", resolutions: 5, attendance: "13/13" },
                ].map((meeting, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{meeting.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{meeting.date} â€¢ {meeting.resolutions} resolutions â€¢ Attendance: {meeting.attendance}</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Annual Reports - AVAILABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <Download className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground">Annual Reports</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive overview of achievements, challenges, and plans</p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Download className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">22 Annual Reports Available (2003-2024)</h4>
                <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-4">
                  PhilHealth annual reports provide comprehensive overviews of organizational achievements, financial performance,
                  challenges faced, and strategic plans for the future.
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-3">ðŸ“¥ Download Annual Reports</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                    Access all 22 annual reports from 2003 to 2024. Each report includes: financial statements, 
                    operational highlights, member statistics, policy changes, and strategic initiatives.
                  </p>
                  <Link
                    href="/downloads/annual-reports"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-foreground text-sm font-medium rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    View All Annual Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Compensation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground">Executive Compensation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Salaries and benefits of key officials</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Board Compensation */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Board of Directors Honorarium</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-2">{selectedYear}</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(data.boardOfDirectors.boardCompensation2007.totalHonorarium)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{data.corporateGovernance.totalBoardMembers} board members</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-2">2006</p>
                  <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{formatCurrency(data.boardOfDirectors.boardCompensation2006.totalHonorarium)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Previous year comparison</p>
                </div>
              </div>
            </div>

            {/* Key Management Personnel */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Key Management Personnel</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-2">{selectedYear}</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(data.executiveOfficers.compensation2007.keyManagementPersonnel.total)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total compensation</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-2">2006</p>
                  <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{formatCurrency(data.executiveOfficers.compensation2006.keyManagementPersonnel.total)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Previous year comparison</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organizational Structure - FUTURE ENHANCEMENT */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground">Organizational Structure</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Departments, units, and reporting relationships</p>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">Future Enhancement</h4>
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
                  A detailed organizational chart and structure will be displayed here, including:
                </p>
                <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">ï¿½</span>
                    <span>Interactive organizational chart</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">ï¿½</span>
                    <span>Department and division descriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">ï¿½</span>
                    <span>Regional office structure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">ï¿½</span>
                    <span>Key personnel by department</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">ï¿½</span>
                    <span>Contact information for each unit</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Decisions - FUTURE ENHANCEMENT */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
              <FileText className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground">Policy Decisions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{data.corporateGovernance.totalBoardResolutions} resolutions passed in {selectedYear}</p>
            </div>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2">Future Enhancement</h4>
                <p className="text-sm text-teal-800 dark:text-teal-200 mb-4">
                  Detailed policy decisions, resolutions, and circulars will be accessible here, including:
                </p>
                <ul className="text-sm text-teal-700 dark:text-teal-300 space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">ï¿½</span>
                    <span>Board resolutions with full text and voting records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">ï¿½</span>
                    <span>Policy circulars and memoranda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">ï¿½</span>
                    <span>Implementation guidelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">ï¿½</span>
                    <span>Regulatory changes affecting members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">ï¿½</span>
                    <span>Searchable database of all policy documents</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-foreground mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q:</span> How often does the PhilHealth Board meet?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 pl-6">
                A: The PhilHealth Board holds regular meetings as mandated by the corporation's charter. In 2007,
                there were {formatNumber(data.corporateGovernance.totalBoardMeetings)} board meetings to discuss policy, 
                operations, and strategic initiatives.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-foreground mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q:</span> Where can I access PhilHealth's official documents?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 pl-6">
                A: PhilHealth publishes various documents including annual reports, financial statements, circulars, 
                and board resolutions on the official website. You can also request documents through the Freedom of Information (FOI) program.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-foreground mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q:</span> How does PhilHealth ensure transparency in its operations?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 pl-6">
                A: PhilHealth adheres to good governance principles through regular audits by the Commission on Audit (COA), 
                publication of financial reports, disclosure of board resolutions, and active participation in transparency initiatives. 
                The organization is committed to accountability and public trust.
              </p>
            </div>
          </div>
        </div>

        {/* Data Source */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-emerald-500 dark:border-emerald-400 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              <strong>Data Source:</strong> PhilHealth Annual Report {selectedYear} (Official Audited Data) | 
              <strong> Last Updated:</strong> December 31, {selectedYear}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}









