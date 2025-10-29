"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { ChartCard } from "@/components/ui/chart-card";
import { YearSelector } from "@/components/ui/year-selector";
import { formatNumber } from "@/lib/utils";
import { PageLoadingSkeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { ExportButton } from "@/components/ui/export-button";
import { FAQSection, coverageFAQs } from "@/components/ui/faq";
import { Users, UserCheck, Percent, TrendingUp, TrendingDown, DollarSign, CheckCircle, Info } from "lucide-react";
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
import { Pie, Bar, Line } from "react-chartjs-2";

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

const COLORS = ["#009a3d", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function CoveragePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ type: "network" | "notfound" | "generic"; message?: string } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2007);
  const [previousYearData, setPreviousYearData] = useState<any>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    
    // Load both current and previous year data
    Promise.all([
      axios.get("/data/coverage.json"),
      axios.get("/data/coverage-2022.json").catch(() => null)
    ])
      .then(([currentRes, previousRes]) => {
        if (!currentRes.data) {
          setError({ type: "notfound", message: "Coverage data is not available at this time." });
          setLoading(false);
          return;
        }
        setData(currentRes.data);
        setPreviousYearData(previousRes?.data || null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading coverage data:", err);
        if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
          setError({ type: "network", message: "Unable to load coverage data. Please check your connection." });
        } else if (err.response?.status === 404) {
          setError({ type: "notfound", message: "Coverage data file was not found." });
        } else {
          setError({ type: "generic", message: "An unexpected error occurred while loading coverage data." });
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

  // Calculate trends
  const calculateTrend = (current: number, previous: number | undefined) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      direction: change > 0 ? "up" as const : change < 0 ? "down" as const : "neutral" as const,
      label: "vs last year"
    };
  };

  const membersTrend = calculateTrend(
    data.totalMembers,
    previousYearData?.totalMembers
  );
  const directTrend = calculateTrend(
    data.membershipByCategory.directContributors.total,
    previousYearData?.membershipByCategory?.directContributors?.total
  );
  const indirectTrend = calculateTrend(
    data.membershipByCategory.indirectContributors.total,
    previousYearData?.membershipByCategory?.indirectContributors?.total
  );
  const coverageRate = (data.totalMembers / 114000000) * 100; // Based on PH population
  const previousCoverageRate = previousYearData ? (previousYearData.totalMembers / 114000000) * 100 : undefined;
  const coverageTrend = calculateTrend(coverageRate, previousCoverageRate);

  const membershipLabels = [
    "Employed Private",
    "Employed Government",
    "Informal Sector",
    "Indigents",
    "Senior Citizens",
    "Sponsored",
    "OFWs"
  ];

  const membershipValues = [
    data.membershipByCategory.directContributors.subcategories.employedPrivate.total,
    data.membershipByCategory.directContributors.subcategories.employedGovernment.total,
    data.membershipByCategory.directContributors.subcategories.informal.total,
    data.membershipByCategory.indirectContributors.subcategories.indigents.total,
    data.membershipByCategory.indirectContributors.subcategories.seniorCitizens.total,
    data.membershipByCategory.indirectContributors.subcategories.sponsored.total,
    data.membershipByCategory.directContributors.subcategories.ofws.total
  ];

  // Pie Chart for Membership
  const pieData = {
    labels: membershipLabels,
    datasets: [{
      data: membershipValues,
      backgroundColor: COLORS,
      borderColor: "#fff",
      borderWidth: 3,
      hoverOffset: 15,
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          padding: 12,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => `${formatNumber(context.parsed)} members`
        }
      }
    }
  };

  // Regional Distribution Bar Chart
  const sampleRegions = [
    { region: "NCR", members: 15234567 },
    { region: "Region IV-A", members: 12345678 },
    { region: "Region III", members: 9876543 },
    { region: "Region VII", members: 8765432 },
    { region: "Region VI", members: 7654321 },
  ];

  const barData = {
    labels: sampleRegions.map(r => r.region),
    datasets: [{
      label: "Registered Members",
      data: sampleRegions.map(r => r.members),
      backgroundColor: "rgba(0, 154, 61, 0.8)",
      borderColor: "rgb(0, 154, 61)",
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => formatNumber(context.parsed.y) + " members"
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            if (value >= 1000000) return (value / 1000000).toFixed(0) + "M";
            return formatNumber(value);
          }
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Historical Growth Line Chart
  const sampleHistory = [
    { year: "2020", members: 95000000 },
    { year: "2021", members: 98500000 },
    { year: "2022", members: 101200000 },
    { year: "2007", members: 64500000 },
    { year: "2024", members: 109500000 },
  ];

  const lineData = {
    labels: sampleHistory.map(h => h.year),
    datasets: [{
      label: "Total Membership Growth",
      data: sampleHistory.map(h => h.members),
      borderColor: "#009a3d",
      backgroundColor: "rgba(0, 154, 61, 0.1)",
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: "#009a3d",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
    }]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => formatNumber(context.parsed.y) + " members"
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => (value / 1000000).toFixed(0) + "M"
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with Export */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Coverage Statistics</h1>
            <p className="text-muted-foreground mt-1">Membership and coverage data across all categories</p>
          </div>
          <ExportButton
            data={data}
            filename={`philhealth-coverage-${selectedYear}`}
            formatData={(data) => {
              return [{
                'Total Members': data.overview.totalBeneficiaries,
                'Direct Contributors': data.membershipByCategory.directContributors.total,
                'Indirect Contributors': data.membershipByCategory.indirectContributors.total,
                'Coverage Rate': data.overview.coverageRate + '%',
                'Total Dependents': data.overview.totalDependents,
              }];
            }}
          />
        </div>

        {/* Year Selector */}
        <YearSelector
          selectedYear={selectedYear}
          availableYears={[2007]}
          onYearChange={setSelectedYear}
          hasDetailedBreakdown={false}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Membership */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative">
              <p className="text-sm font-medium text-muted-foreground mb-2">Total Membership</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.overview.totalBeneficiaries)}</p>
              
              {/* Trend Indicator */}
              {membersTrend && (
                <div className="flex items-center gap-1.5 mb-2">
                  {membersTrend.direction === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : membersTrend.direction === "down" ? (
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : null}
                  <span className={`text-xs font-semibold ${
                    membersTrend.direction === "up" ? "text-green-600 dark:text-green-400" : 
                    membersTrend.direction === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                  }`}>
                    {membersTrend.direction === "up" ? "+" : membersTrend.direction === "down" ? "-" : ""}
                    {membersTrend.value.toFixed(1)}% {membersTrend.label}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Registered members & dependents</p>
            </div>
          </div>

          {/* Direct Contributors */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative">`n              <p className="text-sm font-medium text-muted-foreground mb-2">Direct Contributors</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.membershipByCategory.directContributors.total)}</p>
              
              {/* Trend Indicator */}
              {directTrend && (
                <div className="flex items-center gap-1.5 mb-2">
                  {directTrend.direction === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : directTrend.direction === "down" ? (
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : null}
                  <span className={`text-xs font-semibold ${
                    directTrend.direction === "up" ? "text-green-600 dark:text-green-400" : 
                    directTrend.direction === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                  }`}>
                    {directTrend.direction === "up" ? "+" : directTrend.direction === "down" ? "-" : ""}
                    {directTrend.value.toFixed(1)}% {directTrend.label}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Employed & paying members</p>
            </div>
          </div>

          {/* Indirect Contributors */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative">`n              <p className="text-sm font-medium text-muted-foreground mb-2">Indirect Contributors</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.membershipByCategory.indirectContributors.total)}</p>
              
              {/* Trend Indicator */}
              {indirectTrend && (
                <div className="flex items-center gap-1.5 mb-2">
                  {indirectTrend.direction === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : indirectTrend.direction === "down" ? (
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : null}
                  <span className={`text-xs font-semibold ${
                    indirectTrend.direction === "up" ? "text-green-600 dark:text-green-400" : 
                    indirectTrend.direction === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                  }`}>
                    {indirectTrend.direction === "up" ? "+" : indirectTrend.direction === "down" ? "-" : ""}
                    {indirectTrend.value.toFixed(1)}% {indirectTrend.label}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Sponsored & indigents</p>
            </div>
          </div>

          {/* Coverage Rate */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative">`n              <p className="text-sm font-medium text-muted-foreground mb-2">Coverage Rate</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">100%</p>
              
              {/* Trend Indicator */}
              {coverageTrend && (
                <div className="flex items-center gap-1.5 mb-2">
                  {coverageTrend.direction === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : coverageTrend.direction === "down" ? (
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : null}
                  <span className={`text-xs font-semibold ${
                    coverageTrend.direction === "up" ? "text-green-600 dark:text-green-400" : 
                    coverageTrend.direction === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                  }`}>
                    {coverageTrend.direction === "up" ? "+" : coverageTrend.direction === "down" ? "-" : ""}
                    {coverageTrend.value.toFixed(1)}% {coverageTrend.label}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Universal health coverage</p>
            </div>
          </div>
        </div>

        {/* Membership Breakdown Pie Chart */}
        <ChartCard
          title="Membership by Category"
          description="Distribution of members across different enrollment categories"
        >
          <div className="h-[400px]">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </ChartCard>

        {/* Regional Coverage Distribution */}
        {data?.regionalCoverage && (
          <ChartCard
            title="Regional Coverage Distribution"
            description="Membership and beneficiaries across major regions of the Philippines"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {data.regionalCoverage.byRegion.map((region: any, index: number) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold mb-3 text-gray-900">{region.region}</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Members</p>
                      <p className="text-xl font-bold text-emerald-600">{formatNumber(region.members)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Beneficiaries</p>
                      <p className="text-xl font-bold text-blue-600">{formatNumber(region.beneficiaries)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Coverage Rate</p>
                      <p className="text-xl font-bold text-purple-600">{region.coverageRate}%</p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">{region.percentage}% of total</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )}

        {/* Demographic Breakdown by Employment Status */}
        {data?.demographicBreakdown?.byEmploymentStatus && (
          <ChartCard
            title="Membership by Employment Status"
            description="Distribution of members and beneficiaries across employment categories"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.demographicBreakdown.byEmploymentStatus.map((item: any, index: number) => {
                const colors = [
                  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
                  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
                  { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
                  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
                  { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
                ];
                const color = colors[index % colors.length];
                
                return (
                  <div key={index} className={`${color.bg} border ${color.border} rounded-lg p-5 hover:shadow-md transition-shadow`}>
                    <h4 className={`text-md font-semibold mb-3 ${color.text}`}>{item.status}</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Members</p>
                        <p className="text-lg font-bold text-gray-900">{formatNumber(item.members)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Beneficiaries</p>
                        <p className="text-lg font-bold text-gray-900">{formatNumber(item.beneficiaries)}</p>
                      </div>
                      <div className="pt-2 border-t border-gray-300">
                        <p className={`text-sm font-semibold ${color.text}`}>{item.percentage}% of total</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        )}

        {/* Coverage Analysis - Milestones and Challenges */}
        {data?.coverageAnalysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Milestones */}
            {data.coverageAnalysis.milestones && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  2007 Milestones
                </h3>
                <div className="space-y-3">
                  {data.coverageAnalysis.milestones.map((milestone: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-emerald-200">
                      <p className="text-sm font-semibold text-emerald-700 mb-1">{milestone.value}</p>
                      <p className="text-xs text-gray-600">{milestone.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges */}
            {data.coverageAnalysis.challenges && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Challenges & Areas for Improvement
                </h3>
                <div className="space-y-3">
                  {data.coverageAnalysis.challenges.map((challenge: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                      <p className="text-sm font-semibold text-amber-700 mb-1">{challenge.area}</p>
                      <p className="text-xs text-gray-600">{challenge.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAQ Section */}
        <FAQSection faqs={coverageFAQs} />

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









