"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { YearSelector } from "@/components/ui/year-selector";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { DataCardSkeleton } from "@/components/ui/skeleton";
import { FileText, DollarSign, Calendar, Download, AlertCircle, Building2 } from "lucide-react";

export default function GovernancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(2023);

  useEffect(() => {
    axios.get("/data/governance-2023.json")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading governance data:", err);
        setLoading(false);
      });
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Year Selector */}
        <YearSelector
          selectedYear={selectedYear}
          availableYears={[2023]}
          onYearChange={setSelectedYear}
          hasDetailedBreakdown={false}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Board Meetings */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 p-6 text-white shadow-lg transition-all hover:shadow-xl group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <Calendar className="h-8 w-8 mb-4 opacity-90" />
              <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">Board Meetings</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.corporateGovernance.totalBoardMeetings)}</p>
              <p className="text-sm text-white/70 dark:text-white/80">Held in {selectedYear}</p>
            </div>
          </div>

          {/* Board Resolutions */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-800 p-6 text-white shadow-lg transition-all hover:shadow-xl group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <FileText className="h-8 w-8 mb-4 opacity-90" />
              <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">Board Resolutions</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.corporateGovernance.totalBoardResolutions)}</p>
              <p className="text-sm text-white/70 dark:text-white/80">Passed in {selectedYear}</p>
            </div>
          </div>

          {/* Annual Reports Available */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 dark:from-orange-600 dark:to-orange-800 p-6 text-white shadow-lg transition-all hover:shadow-xl group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <Download className="h-8 w-8 mb-4 opacity-90" />
              <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">Annual Reports</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">22</p>
              <p className="text-sm text-white/70 dark:text-white/80">Available (2003-2024)</p>
            </div>
          </div>

          {/* Executive Compensation */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 p-6 text-white shadow-lg transition-all hover:shadow-xl group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <DollarSign className="h-8 w-8 mb-4 opacity-90" />
              <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">Executive Compensation</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatCurrency(data.boardOfDirectors.boardCompensation2023.totalHonorarium)}</p>
              <p className="text-sm text-white/70 dark:text-white/80">Board Total {selectedYear}</p>
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Board Meeting Minutes</h3>
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
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Complete meeting minutes with discussion summaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Agenda items and topics discussed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Attendance records and voting results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Resolutions passed and their implementation status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Downloadable PDF documents for each meeting</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Preview Template */}
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h5 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Preview: How Minutes Will Be Displayed</h5>
              <div className="space-y-2">
                {[
                  { date: "December 15, 2023", title: "Regular Board Meeting #12", resolutions: 8, attendance: "13/13" },
                  { date: "November 20, 2023", title: "Regular Board Meeting #11", resolutions: 10, attendance: "12/13" },
                  { date: "October 10, 2023", title: "Special Board Meeting", resolutions: 5, attendance: "13/13" },
                ].map((meeting, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{meeting.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{meeting.date} • {meeting.resolutions} resolutions • Attendance: {meeting.attendance}</p>
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Annual Reports</h3>
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
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">📥 Download Annual Reports</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                    Access all 22 annual reports from 2003 to 2024. Each report includes: financial statements, 
                    operational highlights, member statistics, policy changes, and strategic initiatives.
                  </p>
                  <Link
                    href="/downloads/annual-reports"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Executive Compensation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Salaries and benefits of key officials</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Board Compensation */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Board of Directors Honorarium</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{selectedYear}</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(data.boardOfDirectors.boardCompensation2023.totalHonorarium)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{data.corporateGovernance.totalBoardMembers} board members</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">2022</p>
                  <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{formatCurrency(data.boardOfDirectors.boardCompensation2022.totalHonorarium)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Previous year comparison</p>
                </div>
              </div>
            </div>

            {/* Key Management Personnel */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Key Management Personnel</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{selectedYear}</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(data.executiveOfficers.compensation2023.keyManagementPersonnel.total)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total compensation</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">2022</p>
                  <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{formatCurrency(data.executiveOfficers.compensation2022.keyManagementPersonnel.total)}</p>
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Organizational Structure</h3>
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
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Interactive organizational chart</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Department and division descriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Regional office structure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Key personnel by department</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Policy Decisions</h3>
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
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Board resolutions with full text and voting records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Policy circulars and memoranda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Implementation guidelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Regulatory changes affecting members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Searchable database of all policy documents</span>
                  </li>
                </ul>
              </div>
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
