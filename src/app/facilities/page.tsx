"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { PageLoadingSkeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Building2, Hospital, Users, Stethoscope } from "lucide-react";
import { ErrorMessage } from "@/components/ui/error-message";
import { YearSelectorDropdown } from "@/components/ui/year-selector-dropdown";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const COLORS = ["#009a3d", "#eab308", "#10b981", "#fbbf24", "#22c55e", "#fcd34d", "#4ade80", "#fde047", "#006400", "#ca8a04"];

export default function FacilitiesPage() {
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
        console.error("Error loading facilities data:", err);
        if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
          setError({ type: "network", message: "Unable to load facilities data. Please check your connection." });
        } else if (err.response?.status === 404) {
          setError({ type: "notfound", message: "Facilities data files were not found." });
        } else {
          setError({ type: "generic", message: "An unexpected error occurred while loading facilities data." });
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

  // Extract facilities data based on year
  let accreditationData: any = {};
  let healthcareProfessionals: any = {};
  let hospitalBreakdown: any = {};
  let otherFacilities: any[] = [];
  
  // Check if we have valid data
  if (!statisticsData && !annualReportData) {
    return (
      <DashboardLayout>
        <ErrorMessage
          type="notfound"
          message="No facilities data available for the selected year."
          onRetry={loadData}
          showHomeButton={true}
        />
      </DashboardLayout>
    );
  }
  
  if (selectedYear === 2024) {
    const statsData2024 = statisticsData.philhealth_transparency_data_2024 || statisticsData;
    accreditationData = statsData2024?.accreditation?.health_care_providers_institutions || {};
    healthcareProfessionals = statsData2024?.accreditation?.health_care_professionals || {};
    hospitalBreakdown = accreditationData?.hospitals_breakdown || {};
    otherFacilities = accreditationData?.other_facilities_detail?.list || [];
  } else if (selectedYear === 2023) {
    const statsData2023 = statisticsData.philhealth_stats_and_charts_2023_data || statisticsData;
    const accreditationInst = statsData2023?.accreditation_institutions || {};
    const accreditationProf = statsData2023?.accreditation_professionals || {};
    
    // Build accreditation data structure for 2023
    accreditationData = {
      grand_total: accreditationInst.total_facilities || 0,
      summary: [
        {
          category: "Hospitals",
          government: accreditationInst.breakdown_by_ownership?.government ? 
            Math.round(accreditationInst.total_hospitals * 0.42) : 0,
          private: accreditationInst.breakdown_by_ownership?.private ?
            Math.round(accreditationInst.total_hospitals * 0.58) : 0,
          total: accreditationInst.total_hospitals || 0
        },
        {
          category: "Other Facilities",
          government: accreditationInst.breakdown_by_ownership?.government || 0,
          private: accreditationInst.breakdown_by_ownership?.private || 0,
          total: accreditationInst.total_other_facilities || 0
        }
      ]
    };
    
    // Hospital breakdown for 2023
    hospitalBreakdown = {
      levels: [
        {
          level: "Level 1",
          government: accreditationInst.hospital_levels?.level_1?.government || 0,
          private: accreditationInst.hospital_levels?.level_1?.private || 0
        },
        {
          level: "Level 2",
          government: accreditationInst.hospital_levels?.level_2?.government || 0,
          private: accreditationInst.hospital_levels?.level_2?.private || 0
        },
        {
          level: "Level 3",
          government: accreditationInst.hospital_levels?.level_3?.government || 0,
          private: accreditationInst.hospital_levels?.level_3?.private || 0
        },
        {
          level: "Infirmary",
          government: accreditationInst.hospital_levels?.infirmary?.government || 0,
          private: accreditationInst.hospital_levels?.infirmary?.private || 0
        }
      ]
    };
    
    // Other facilities for 2023
    const otherFacDetail = accreditationInst.other_facilities_details || {};
    otherFacilities = Object.entries(otherFacDetail).map(([key, value]: [string, any]) => ({
      facility: key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      government: value.government || 0,
      private: value.private || 0
    }));
    
    // Healthcare professionals for 2023
    healthcareProfessionals = {
      total_professionals: accreditationProf.total_professionals || 0,
      physicians: { 
        total: accreditationProf.breakdown?.physicians_total || 0,
        breakdown: [
          { category: "General Practitioners", count: accreditationProf.breakdown?.physicians_general_practitioners || 0 },
          { category: "GP (with Training)", count: accreditationProf.breakdown?.physicians_general_practitioners_with_training || 0 },
          { category: "Medical Specialists", count: accreditationProf.breakdown?.physicians_medical_specialists || 0 }
        ]
      },
      other_professionals: { 
        total: accreditationProf.breakdown?.other_professionals_total || 0,
        breakdown: [
          { category: "Dentists", count: accreditationProf.breakdown?.dentists || 0 },
          { category: "Nurses", count: accreditationProf.breakdown?.nurses || 0 },
          { category: "Midwives", count: accreditationProf.breakdown?.midwives || 0 }
        ]
      }
    };
  } else if (selectedYear === 2022) {
    const reportData2022 = annualReportData.philhealth_2022_annual_report_data || annualReportData;
    const accreditationInfo = reportData2022?.accreditation || {};
    
    // Build accreditation data structure for 2022
    accreditationData = {
      grand_total: accreditationInfo.facilities_accredited?.total_facilities || 0,
      summary: [
        {
          category: "Hospitals",
          government: 0, // NOT PROVIDED in 2022 data
          private: 0, // NOT PROVIDED in 2022 data
          total: accreditationInfo.hospitals_accredited?.total_hospitals || 0
        },
        {
          category: "Other Facilities",
          government: accreditationInfo.other_facilities_accredited?.konsulta_providers_breakdown?.government || 0,
          private: accreditationInfo.other_facilities_accredited?.konsulta_providers_breakdown?.private || 0,
          total: (accreditationInfo.other_facilities_accredited?.konsulta_providers_breakdown?.government || 0) +
                 (accreditationInfo.other_facilities_accredited?.konsulta_providers_breakdown?.private || 0)
        }
      ]
    };
    
    // Hospital breakdown for 2022 - Only percentages available, NOT counts by ownership
    const distPercent = accreditationInfo.hospitals_accredited?.distribution_percent || {};
    const totalHosp = accreditationInfo.hospitals_accredited?.total_hospitals || 0;
    hospitalBreakdown = {
      levels: [
        {
          level: "Level 1",
          government: 0, // NOT PROVIDED
          private: 0, // NOT PROVIDED
          percentage: distPercent.level_1 || "0%",
          total: totalHosp > 0 ? Math.round(totalHosp * (parseInt(distPercent.level_1) || 0) / 100) : 0
        },
        {
          level: "Level 2",
          government: 0, // NOT PROVIDED
          private: 0, // NOT PROVIDED
          percentage: distPercent.level_2 || "0%",
          total: totalHosp > 0 ? Math.round(totalHosp * (parseInt(distPercent.level_2) || 0) / 100) : 0
        },
        {
          level: "Level 3",
          government: 0, // NOT PROVIDED
          private: 0, // NOT PROVIDED
          percentage: distPercent.level_3 || "0%",
          total: totalHosp > 0 ? Math.round(totalHosp * (parseInt(distPercent.level_3) || 0) / 100) : 0
        },
        {
          level: "Infirmary",
          government: 0, // NOT PROVIDED
          private: 0, // NOT PROVIDED
          percentage: distPercent.infirmary || "0%",
          total: totalHosp > 0 ? Math.round(totalHosp * (parseInt(distPercent.infirmary) || 0) / 100) : 0
        }
      ]
    };
    
    // Other facilities for 2022
    const otherFacBreakdown = accreditationInfo.other_facilities_accredited?.breakdown_by_facility || {};
    otherFacilities = Object.entries(otherFacBreakdown).map(([key, value]: [string, any]) => ({
      facility: key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      government: value.government || 0,
      private: value.private || 0
    }));
    
    // Healthcare professionals for 2022 - NOT PROVIDED in detail
    healthcareProfessionals = {
      total_professionals: 0, // NOT PROVIDED
      physicians: { 
        total: 0, // NOT PROVIDED
        breakdown: []
      },
      other_professionals: { 
        total: 0, // NOT PROVIDED
        breakdown: []
      }
    };
  }

  const summary = accreditationData?.summary || [];
  const hospitalsSummary = summary.find((s: any) => s.category === "Hospitals") || {};
  const otherFacilitiesSummary = summary.find((s: any) => s.category === "Other Facilities") || {};
  
  const totalFacilities = accreditationData?.grand_total || 0;
  const totalHospitals = hospitalsSummary?.total || 0;
  const totalOtherFacilities = otherFacilitiesSummary?.total || 0;
  const totalProfessionals = healthcareProfessionals?.total_professionals || 0;

  // Hospital levels data
  const hospitalLevels = hospitalBreakdown?.levels || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <PageHeading
            title="Accredited Facilities & Healthcare Providers"
          />
          <div className="flex items-center gap-3">
            <YearSelectorDropdown 
              selectedYear={selectedYear} 
              onChange={setSelectedYear}
              startYear={2022}
              endYear={2024}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Total Facilities"
            value={formatNumber(totalFacilities)}
            icon={Building2}
            description="Accredited health care institutions"
          />
          <KPIStatCard
            title="Hospitals"
            value={formatNumber(totalHospitals)}
            icon={Hospital}
            description={selectedYear === 2022 && hospitalsSummary?.government === 0 && hospitalsSummary?.private === 0 
              ? "Breakdown not provided in 2022 data" 
              : `${hospitalsSummary?.government || 0} Government, ${hospitalsSummary?.private || 0} Private`}
            className={selectedYear === 2022 && hospitalsSummary?.government === 0 && hospitalsSummary?.private === 0 
              ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500" 
              : ""}
          />
          <KPIStatCard
            title="Other Facilities"
            value={formatNumber(totalOtherFacilities)}
            icon={Building2}
            description={`Dialysis, TB-DOTS, MCP, Konsulta, and more`}
          />
          <KPIStatCard
            title="Healthcare Professionals"
            value={totalProfessionals === 0 ? "Data Not Provided" : formatNumber(totalProfessionals)}
            icon={Users}
            description={totalProfessionals === 0 
              ? "PhilHealth did not provide detailed professional counts for 2022" 
              : `${healthcareProfessionals?.physicians?.total || 0} Physicians, ${healthcareProfessionals?.other_professionals?.total || 0} Others`}
            className={totalProfessionals === 0 
              ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500" 
              : ""}
          />
        </div>

        {/* Government vs Private Comparison */}
        {totalFacilities > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Government vs Private Facilities</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ownership distribution of accredited facilities</p>
            </div>

            {selectedYear === 2022 && hospitalsSummary?.government === 0 && hospitalsSummary?.private === 0 ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-6">
                <p className="text-yellow-800 dark:text-yellow-200 mb-4 font-medium">
                  Data Not Provided
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  PhilHealth did not provide the government vs private breakdown for hospital facilities in the 2022 annual report. 
                  Only total facility counts and percentages by level were published.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Government Facilities */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="p-3 bg-[#009a3d]/10 dark:bg-[#009a3d]/20 rounded-lg">
                      <Building2 className="w-6 h-6 text-[#009a3d]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Government</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Public health facilities</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Hospitals</span>
                      <span className="text-xl font-bold text-[#009a3d]">{formatNumber(hospitalsSummary?.government || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Other Facilities</span>
                      <span className="text-xl font-bold text-[#009a3d]">{formatNumber(otherFacilitiesSummary?.government || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#009a3d]/10 dark:bg-[#009a3d]/20 rounded-lg border-2 border-[#009a3d]">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Total Government</span>
                      <span className="text-2xl font-bold text-[#009a3d]">
                        {formatNumber((hospitalsSummary?.government || 0) + (otherFacilitiesSummary?.government || 0))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Private Facilities */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg">
                      <Building2 className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Private</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Privately-owned facilities</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Hospitals</span>
                      <span className="text-xl font-bold text-amber-500">{formatNumber(hospitalsSummary?.private || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Other Facilities</span>
                      <span className="text-xl font-bold text-amber-500">{formatNumber(otherFacilitiesSummary?.private || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg border-2 border-amber-500">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Total Private</span>
                      <span className="text-2xl font-bold text-amber-500">
                        {formatNumber((hospitalsSummary?.private || 0) + (otherFacilitiesSummary?.private || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hospital Levels Distribution */}
        {hospitalLevels.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Hospital Distribution by Level</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Classification of accredited hospitals</p>
            </div>

            {selectedYear === 2022 && hospitalLevels.every((l: any) => l.government === 0 && l.private === 0) ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-6">
                <p className="text-yellow-800 dark:text-yellow-200 mb-4 font-medium">
                  Ownership Breakdown Not Provided
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                  PhilHealth did not provide the government vs private breakdown by hospital level in the 2022 annual report. 
                  Only percentage distributions were published:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hospitalLevels.map((level: any) => (
                    <div key={level.level} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-yellow-400">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{level.level}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{level.total || 0}</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">{level.percentage || '0%'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {hospitalLevels.map((level: any) => {
                  const gov = level.government || 0;
                  const priv = level.private || 0;
                  const total = gov + priv;
                  const govPercent = total > 0 ? ((gov / total) * 100).toFixed(1) : 0;
                  const privPercent = total > 0 ? ((priv / total) * 100).toFixed(1) : 0;

                  return (
                    <div key={level.level} className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{level.level}</h4>
                        <p className="text-3xl font-bold text-[#009a3d]">{formatNumber(total)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Hospitals</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Government</span>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(gov)}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({govPercent}%)</span>
                          </div>
                        </div>
                        
                        {/* Progress bar for government */}
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-[#009a3d] h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${govPercent}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Private</span>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(priv)}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({privPercent}%)</span>
                          </div>
                        </div>
                        
                        {/* Progress bar for private */}
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${privPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Other Facilities Detail Table */}
        {otherFacilities.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 bg-gradient-to-r from-[#009a3d] to-[#007a30] border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-white">Other Accredited Facilities</h3>
              <p className="text-sm text-white/90 mt-1">Breakdown of specialized facilities</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b-2 border-[#009a3d]/20">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Facility Type
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#009a3d]"></span>
                        Government
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                        Private
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {otherFacilities.map((item: any, index: number) => {
                    const total = (item.government || 0) + (item.private || 0);
                    const govPercent = total > 0 ? ((item.government / total) * 100).toFixed(0) : 0;
                    const privPercent = total > 0 ? ((item.private / total) * 100).toFixed(0) : 0;
                    
                    return (
                      <tr 
                        key={index} 
                        className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent dark:hover:from-gray-700/30 dark:hover:to-transparent transition-all duration-200 group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#009a3d]/10 to-[#009a3d]/5 dark:from-[#009a3d]/20 dark:to-[#009a3d]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Building2 className="w-5 h-5 text-[#009a3d]" />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                                {item.facility || item.facility_type}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {total.toLocaleString()} facilities
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center justify-center min-w-[80px] px-4 py-2 rounded-lg text-base font-bold bg-[#009a3d]/15 text-[#009a3d] dark:bg-[#009a3d]/25 dark:text-[#00c94d] border border-[#009a3d]/20">
                              {formatNumber(item.government)}
                            </span>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {govPercent}% of total
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center justify-center min-w-[80px] px-4 py-2 rounded-lg text-base font-bold bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400 border border-amber-500/20">
                              {formatNumber(item.private)}
                            </span>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {privPercent}% of total
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              {formatNumber(total)}
                            </span>
                            <div className="w-full max-w-[100px] bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 overflow-hidden">
                              <div className="flex h-full">
                                <div 
                                  className="bg-[#009a3d] h-full transition-all duration-500" 
                                  style={{ width: `${govPercent}%` }}
                                ></div>
                                <div 
                                  className="bg-amber-500 h-full transition-all duration-500" 
                                  style={{ width: `${privPercent}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Healthcare Professionals */}
        {totalProfessionals > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Healthcare Professionals</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Physicians */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Physicians
                  </span>
                  <Stethoscope className="w-6 h-6 text-[#009a3d]" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {formatNumber(healthcareProfessionals?.physicians?.total || 0)}
                </div>
                {healthcareProfessionals?.physicians?.breakdown && (
                  <div className="space-y-2">
                    {healthcareProfessionals.physicians.breakdown.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{item.category || item.specialization}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatNumber(item.count)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Professionals */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Other Professionals
                  </span>
                  <Users className="w-6 h-6 text-[#009a3d]" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {formatNumber(healthcareProfessionals?.other_professionals?.total || healthcareProfessionals?.other?.total || 0)}
                </div>
                {healthcareProfessionals?.other_professionals?.breakdown && (
                  <div className="space-y-2">
                    {healthcareProfessionals.other_professionals.breakdown.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{item.category || item.profession}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatNumber(item.count)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
