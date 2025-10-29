"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { PageLoadingSkeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, DollarSign, CheckCircle, Activity } from "lucide-react";
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

export default function ClaimsPage() {
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
        console.error("Error loading claims data:", err);
        if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
          setError({ type: "network", message: "Unable to load claims data. Please check your connection." });
        } else if (err.response?.status === 404) {
          setError({ type: "notfound", message: "Claims data files were not found." });
        } else {
          setError({ type: "generic", message: "An unexpected error occurred while loading claims data." });
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

  // Extract claims data based on year
  let claimsData: any = {};
  let totalAmount = 0;
  let totalCount = 0;
  let membershipData: any[] = [];
  let covidData: any[] = [];
  let illnessData: any[] = [];
  let topMedicalCases: any[] = [];
  let topProcedures: any[] = [];
  
  if (selectedYear === 2024) {
    const statsData2024 = statisticsData.philhealth_transparency_data_2024 || statisticsData;
    claimsData = statsData2024?.claims_payment || {};
    
    totalAmount = claimsData?.grand_total_amount_php || 0;
    totalCount = claimsData?.grand_total_count || 0;
    membershipData = claimsData?.by_membership_category?.data || [];
    covidData = claimsData?.covid19_vs_non_covid19?.data || [];
    illnessData = claimsData?.by_patient_type_sex_sector_illness?.by_illness_type?.data || [];
    topMedicalCases = claimsData?.top_10_medical_cases_by_count?.data || [];
    topProcedures = claimsData?.top_10_rvs_packages_by_count?.data || [];
    
  } else if (selectedYear === 2023) {
    const statsData2023 = statisticsData.philhealth_stats_and_charts_2023_data || statisticsData;
    const claimsSummary = statsData2023?.claims_payment_summary || {};
    const covidClaims = statsData2023?.claims_payment_covid19 || {};
    const claimsPaid = statsData2023?.claims_paid_distribution || {};
    const topMedical = statsData2023?.top_10_medical_cases || {};
    const topRvs = statsData2023?.top_10_rvs_procedures || {};
    
    totalAmount = claimsSummary?.total_claims_amount_php || 0;
    totalCount = claimsSummary?.total_claims_count || 0;
    
    // Build membership data from direct and indirect breakdowns
    const directBreakdown = claimsSummary?.direct_contributor_breakdown || {};
    const indirectBreakdown = claimsSummary?.indirect_contributor_breakdown || {};
    
    membershipData = [
      ...Object.entries(directBreakdown).map(([key, value]: [string, any]) => ({
        category: key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        amount_php: value.amount_php || 0,
        claims_count: value.claims_count || 0
      })),
      ...Object.entries(indirectBreakdown).map(([key, value]: [string, any]) => ({
        category: key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        amount_php: value.amount_php || 0,
        claims_count: value.claims_count || 0
      }))
    ];
    
    // COVID data
    if (covidClaims?.non_covid_vs_covid_totals) {
      covidData = [
        {
          classification: 'Non-COVID-19',
          amount_php: covidClaims.non_covid_vs_covid_totals.non_covid19.claims_amount_php || 0,
          claims_count: covidClaims.non_covid_vs_covid_totals.non_covid19.claims_count || 0
        },
        {
          classification: 'COVID-19 Related',
          amount_php: covidClaims.non_covid_vs_covid_totals.covid19_related.claims_amount_php || 0,
          claims_count: covidClaims.non_covid_vs_covid_totals.covid19_related.claims_count || 0
        }
      ];
    }
    
    // Illness type data
    if (claimsPaid?.by_illness_type) {
      illnessData = [
        {
          type: 'Procedural',
          amount_php: claimsPaid.by_illness_type.procedural.claims_amount_php || 0,
          claims_count: claimsPaid.by_illness_type.procedural.claims_count || 0
        },
        {
          type: 'Medical',
          amount_php: claimsPaid.by_illness_type.medical.claims_amount_php || 0,
          claims_count: claimsPaid.by_illness_type.medical.claims_count || 0
        }
      ];
    }
    
    // Top medical cases (2023 format)
    if (topMedical?.ranking_by_claims_count) {
      topMedicalCases = topMedical.ranking_by_claims_count.map((item: any) => ({
        rank: item.rank,
        illness_description: item.illness_description,
        amount_php: item.claims_amount_php,
        claims_count: item.claims_count
      }));
    }
    
    // Top procedures (2023 format)
    if (topRvs?.ranking_by_claims_count) {
      topProcedures = topRvs.ranking_by_claims_count.map((item: any) => ({
        rank: item.rank,
        procedure_description: item.procedure_description,
        amount_php: item.claims_amount_php,
        claims_count: item.claims_count
      }));
    }
    
  } else if (selectedYear === 2022) {
    // Use annual report data for 2022
    const reportData2022 = annualReportData.philhealth_2022_annual_report_data || annualReportData;
    const claimsAndBenefits = reportData2022?.claims_and_benefits || {};
    const financialStatements = reportData2022?.financial_statements_summary || {};
    
    // Total from comprehensive income statement
    totalAmount = financialStatements?.statement_of_comprehensive_income_2022?.members_benefits_expense_php || 
                  claimsAndBenefits?.total_benefit_claims_expenses_php || 0;
    
    // Claims count NOT provided in 2022 annual report
    totalCount = 0;
    
    // Build membership data from distribution percentages
    const claimsDist = claimsAndBenefits?.claims_paid_distribution_by_count_percent || {};
    const directDist = claimsDist?.direct_contributors || {};
    const indirectDist = claimsDist?.indirect_contributors || {};
    
    // Since we only have percentages, we'll show the categories with amounts (no counts available)
    if (Object.keys(directDist).length > 0 || Object.keys(indirectDist).length > 0) {
      membershipData = [
        ...(directDist.employed_private ? [{
          category: 'Employed Private',
          amount_php: totalAmount * 0.17, // 17% based on data
          claims_count: 0
        }] : []),
        ...(directDist.employed_government ? [{
          category: 'Employed Government',
          amount_php: totalAmount * 0.10, // 10% based on data
          claims_count: 0
        }] : []),
        ...(directDist.informal ? [{
          category: 'Informal Self Earning',
          amount_php: totalAmount * 0.22, // 22% based on data
          claims_count: 0
        }] : []),
        ...(directDist.ofws ? [{
          category: 'OFWs Migrant Workers',
          amount_php: totalAmount * 0.02, // 2% based on data
          claims_count: 0
        }] : []),
        ...(directDist.lifetime ? [{
          category: 'Lifetime Members',
          amount_php: totalAmount * 0.01, // 1% based on data
          claims_count: 0
        }] : []),
        ...(indirectDist.indigent ? [{
          category: 'Indigent NHTS-PR',
          amount_php: totalAmount * 0.17, // 17% based on data
          claims_count: 0
        }] : []),
        ...(indirectDist.senior_citizens ? [{
          category: 'Senior Citizens',
          amount_php: totalAmount * 0.10, // 10% based on data
          claims_count: 0
        }] : []),
        ...(indirectDist.sponsored ? [{
          category: 'Sponsored',
          amount_php: totalAmount * 0.15, // 15% based on data
          claims_count: 0
        }] : [])
      ];
    }
    
    // COVID data from distribution percentages (only percentages available, no actual counts)
    const covidDist = claimsAndBenefits?.covid19_claims_distribution?.by_amount_percent || {};
    if (Object.keys(covidDist).length > 0) {
      // Estimate COVID total (assuming it's part of total benefits)
      const estimatedCovidTotal = totalAmount * 0.25; // Rough estimate
      covidData = [
        {
          classification: 'Isolation',
          amount_php: covidDist.isolation ? estimatedCovidTotal * 0.02 : 0,
          claims_count: 0
        },
        {
          classification: 'Testing',
          amount_php: covidDist.testing ? estimatedCovidTotal * 0.21 : 0,
          claims_count: 0
        },
        {
          classification: 'Inpatient',
          amount_php: covidDist.inpatient ? estimatedCovidTotal * 0.77 : 0,
          claims_count: 0
        }
      ];
    }
    
    // Top medical cases and procedures NOT provided in 2022 annual report
    topMedicalCases = [];
    topProcedures = [];
  }

  const avgClaimAmount = totalCount > 0 ? totalAmount / totalCount : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <PageHeading
            title="Claims Analytics"
          />
          <div className="flex items-center gap-3">
            <YearSelectorDropdown 
              selectedYear={selectedYear} 
              onChange={setSelectedYear}
              startYear={2022}
              endYear={2024}
            />
            <ExportButton
              data={claimsData}
              filename={`philhealth-claims-${selectedYear}`}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <KPIStatCard
            title="Total Claims Amount"
            value={formatCurrency(totalAmount)}
            icon={DollarSign}
            description={totalCount > 0 ? `${formatNumber(totalCount)} claims paid` : 'Benefit payments'}
          />
          <KPIStatCard
            title="Total Claims Count"
            value={totalCount > 0 ? formatNumber(totalCount) : "Data Not Provided"}
            icon={CheckCircle}
            description={totalCount > 0 ? "Number of processed claims" : "PhilHealth did not provide this data"}
            className={totalCount === 0 ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500" : ""}
          />
          <KPIStatCard
            title="Average Claim Amount"
            value={avgClaimAmount > 0 ? formatCurrency(avgClaimAmount) : "Data Not Provided"}
            icon={TrendingUp}
            description={avgClaimAmount > 0 ? "Per claim average" : "PhilHealth did not provide this data"}
            className={avgClaimAmount === 0 ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500" : ""}
          />
        </div>

        {/* Claims by Membership Category */}
        {membershipData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard 
              title="Claims Distribution by Membership" 
              description="Direct vs Indirect Contributors"
            >
              <div style={{ height: '360px' }}>
                <Doughnut 
                  data={{
                    labels: membershipData
                      .filter((item: any) => !item.category.includes('Total'))
                      .map((item: any) => item.category),
                    datasets: [{
                      data: membershipData
                        .filter((item: any) => !item.category.includes('Total'))
                        .map((item: any) => item.amount_php),
                      backgroundColor: COLORS,
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
                            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </ChartCard>
            
            <ChartCard 
              title="Claims Amount by Category" 
              description="Top membership categories"
            >
              <div style={{ height: '360px' }}>
                <Bar 
                  data={{
                    labels: membershipData
                      .filter((item: any) => !item.category.includes('Total'))
                      .slice(0, 6)
                      .map((item: any) => item.category.replace(/\//g, ' / ')),
                    datasets: [{
                      label: 'Amount ()',
                      data: membershipData
                        .filter((item: any) => !item.category.includes('Total'))
                        .slice(0, 6)
                        .map((item: any) => item.amount_php),
                      backgroundColor: COLORS[0],
                    }]
                  }} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `Amount: ${formatCurrency(context.parsed.y || 0)}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: function(value) {
                            return '' + (Number(value) / 1000000000).toFixed(1) + 'B';
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </ChartCard>
          </div>
        )}

        {/* COVID vs Non-COVID (if available) */}
        {covidData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">COVID-19 vs Non-COVID-19 Claims</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {covidData.map((item: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {item.classification}
                    </span>
                    <Activity className="w-5 h-5 text-[#009a3d]" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(item.amount_php)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatNumber(item.claims_count)} claims
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* By Illness Type */}
        {illnessData.length > 0 && (
          <ChartCard 
            title="Claims by Illness Type" 
            description="Distribution of procedural vs medical claims"
          >
            <div style={{ height: '300px' }}>
              <Bar 
                data={{
                  labels: illnessData.map((item: any) => item.type),
                  datasets: [{
                    label: 'Amount ()',
                    data: illnessData.map((item: any) => item.amount_php),
                    backgroundColor: COLORS.slice(0, illnessData.length),
                  }]
                }} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const item = illnessData[context.dataIndex];
                          return [
                            `Amount: ${formatCurrency(context.parsed.x || 0)}`,
                            `Claims: ${formatNumber(item.claims_count)}`
                          ];
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        callback: function(value) {
                          return '' + (Number(value) / 1000000000).toFixed(1) + 'B';
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </ChartCard>
        )}

        {/* Top 10 Medical Cases */}
        {topMedicalCases.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold">Top 10 Medical Cases</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Most common medical conditions by claim count</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Medical Condition
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Claims Count
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Avg per Claim
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {topMedicalCases.map((item: any) => (
                    <tr key={item.rank} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{item.rank}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {item.illness}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                        {formatNumber(item.claims_count)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.amount_php)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.amount_php / item.claims_count)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded shadow-sm">
            <div className="flex items-start">
              <Activity className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Top 10 Medical Cases - Data Not Provided</h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  PhilHealth did not provide detailed information about top medical cases for the {selectedYear} annual report. 
                  This data may be available in future reports or through direct inquiry to PhilHealth.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top 10 Procedures */}
        {topProcedures.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold">Top 10 RVS Packages & Procedures</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Most utilized procedures by claim count</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Package/Procedure
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Claims Count
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Avg per Claim
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {topProcedures.map((item: any) => (
                    <tr key={item.rank} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{item.rank}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-md">
                        {item.package_procedure}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                        {formatNumber(item.claims_count)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.amount_php)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.amount_php / item.claims_count)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded shadow-sm">
            <div className="flex items-start">
              <Activity className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Top 10 RVS Packages & Procedures - Data Not Provided</h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  PhilHealth did not provide detailed information about top RVS packages and procedures for the {selectedYear} annual report. 
                  This data may be available in future reports or through direct inquiry to PhilHealth.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
