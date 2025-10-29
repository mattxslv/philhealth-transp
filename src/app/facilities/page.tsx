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
import { ExportButton } from "@/components/ui/export-button";
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
            <ExportButton
              data={{ facilities: otherFacilities, summary: accreditationData }}
              filename={`philhealth-facilities-${selectedYear}`}
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
              : `${healthcareProfessionals?.physicians?.total || 0} Physicians, ${healthcareProfessionals?.other?.total || 0} Others`}
            className={totalProfessionals === 0 
              ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500" 
              : ""}
          />
        </div>

        {/* Government vs Private Distribution */}
        {totalFacilities > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedYear === 2022 && hospitalsSummary?.government === 0 && hospitalsSummary?.private === 0 ? (
              <>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Government vs Private Facilities
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                    Data Not Provided
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    PhilHealth did not provide the government vs private breakdown for hospital facilities in the 2022 annual report. 
                    Only total facility counts and percentages by level were published.
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Facilities by Type
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                    Data Not Provided
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    PhilHealth did not provide the government vs private breakdown for hospitals in the 2022 annual report.
                  </p>
                </div>
              </>
            ) : (
              <>
                <ChartCard 
                  title="Government vs Private Facilities" 
                  description="Distribution of all accredited facilities"
                >
                  <div style={{ height: '360px' }}>
                    <Doughnut 
                      data={{
                        labels: ['Government Facilities', 'Private Facilities'],
                        datasets: [{
                          data: [
                            (hospitalsSummary?.government || 0) + (otherFacilitiesSummary?.government || 0),
                            (hospitalsSummary?.private || 0) + (otherFacilitiesSummary?.private || 0)
                          ],
                          backgroundColor: ['#009a3d', '#eab308'],
                          borderColor: "#fff",
                          borderWidth: 3,
                        }]
                      }} 
                      options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.parsed || 0;
                              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${label}: ${formatNumber(value)} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </ChartCard>
              
              <ChartCard 
                title="Facilities by Type" 
                description="Hospitals vs Other Facilities"
              >
                <div style={{ height: '360px' }}>
                  <Bar 
                    data={{
                      labels: ['Hospitals', 'Other Facilities'],
                      datasets: [
                        {
                          label: 'Government',
                          data: [hospitalsSummary?.government || 0, otherFacilitiesSummary?.government || 0],
                          backgroundColor: '#009a3d',
                        },
                        {
                          label: 'Private',
                          data: [hospitalsSummary?.private || 0, otherFacilitiesSummary?.private || 0],
                          backgroundColor: '#eab308',
                        }
                      ]
                    }} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: ${formatNumber(context.parsed.y || 0)}`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: { stacked: true },
                        y: { 
                          stacked: true,
                          ticks: {
                            callback: function(value) {
                              return formatNumber(Number(value));
                            }
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </ChartCard>
            </>
            )}
          </div>
        )}

        {/* Hospital Levels Distribution */}
        {hospitalLevels.length > 0 && (
          selectedYear === 2022 && hospitalLevels.every((l: any) => l.government === 0 && l.private === 0) ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Hospital Distribution by Level
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                Data Not Provided
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                PhilHealth did not provide the government vs private breakdown by hospital level in the 2022 annual report. 
                Only percentage distributions were published:
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                {hospitalLevels.map((level: any) => (
                  <li key={level.level} className="flex justify-between">
                    <span className="font-medium">{level.level}:</span>
                    <span>{level.percentage || '0%'} ({level.total || 0} hospitals)</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ChartCard 
              title="Hospital Distribution by Level" 
              description="Classification of accredited hospitals"
            >
              <div style={{ height: '360px' }}>
                <Bar 
                    data={{
                    labels: hospitalLevels.map((item: any) => item.level),
                    datasets: [
                      {
                        label: 'Government',
                        data: hospitalLevels.map((item: any) => item.government || 0),
                        backgroundColor: '#009a3d',
                      },
                      {
                        label: 'Private',
                        data: hospitalLevels.map((item: any) => item.private || 0),
                        backgroundColor: '#eab308',
                      }
                    ]
                  }}
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${formatNumber(context.parsed.y || 0)}`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: { stacked: true },
                      y: { 
                        stacked: true,
                        ticks: {
                          callback: function(value) {
                            return formatNumber(Number(value));
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </ChartCard>
          )
        )}

        {/* Other Facilities Detail Table */}
        {otherFacilities.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold">Other Accredited Facilities</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Breakdown of specialized facilities</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Facility Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Government
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Private
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {otherFacilities.map((item: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {item.facility || item.facility_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                        {formatNumber(item.government)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                        {formatNumber(item.private)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                        {formatNumber((item.government || 0) + (item.private || 0))}
                      </td>
                    </tr>
                  ))}
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
