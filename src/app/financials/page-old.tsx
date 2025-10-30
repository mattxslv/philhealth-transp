"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { KPICard } from "@/components/ui/kpi-card";
import { YearSelector } from "@/components/ui/year-selector";
import { PageLoadingSkeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp, TrendingDown, Wallet, PiggyBank, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { ErrorMessage } from "@/components/ui/error-message";
import { ExportButton } from "@/components/ui/export-button";
import { FAQSection, financialFAQs } from "@/components/ui/faq";
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
import { Doughnut, Line, Bar } from "react-chartjs-2";

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

const COLORS = [
  "#009a3d", // PhilHealth primary green
  "#10b981", // Emerald green
  "#22c55e", // Light green
  "#fbbf24", // Yellow
  "#f59e0b", // Amber
  "#d97706", // Dark amber
  "#84cc16", // Lime green
  "#eab308"  // Yellow-500
];

export default function FinancialsPage() {
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [annualReportData, setAnnualReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ type: "network" | "notfound" | "generic"; message?: string } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({
    assets: false,
    revenue: false,
    expenses: false,
    netIncome: false
  });

  const loadData = () => {
    setLoading(true);
    setError(null);
    
    // Load both statistics-charts and annual-report data for the selected year
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
        console.error("Error loading financials data:", err);
        if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
          setError({ type: "network", message: "Unable to load financial data. Please check your connection." });
        } else if (err.response?.status === 404) {
          setError({ type: "notfound", message: "Financial data files were not found." });
        } else {
          setError({ type: "generic", message: "An unexpected error occurred while loading financial data." });
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  const toggleCard = (cardKey: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardKey]: !prev[cardKey]
    }));
  };

  const toggleAllCards = () => {
    const allExpanded = Object.values(expandedCards).every(val => val);
    setExpandedCards({
      assets: !allExpanded,
      revenue: !allExpanded,
      expenses: !allExpanded,
      netIncome: !allExpanded
    });
  };
  
  // Parse numbers from string format (e.g., "P148,300,000,000")
  const parseNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    return parseFloat(value.replace(/[₱,P]/g, '').replace(/,/g, ''));
  };

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

  // Extract financial data from statistics and annual report
  const totalRevenue = parseNumber(statisticsData.premiumCollections?.total || 0);
  const totalExpenses = parseNumber(statisticsData.benefitPayments?.total || 0);
  const netIncome = totalRevenue - totalExpenses;
  
  // Get breakdown data for charts
  const revenueBreakdown = statisticsData.premiumCollections?.breakdown || {};
  const expenseBreakdown = statisticsData.benefitPayments?.breakdown || {};
  
  // Available years (2008-2024)
  const availableYears = Array.from({ length: 17 }, (_, i) => 2024 - i);
  
  // Revenue Sources Doughnut - handle both 2007 and modern data structures
  const revenueData = {
    labels: revenueBreakdown?.revenueBySource 
      ? revenueBreakdown.revenueBySource.map((item: any) => item.source)
      : ["Direct Contributors", "Indirect Contributors"],
    datasets: [{
      data: revenueBreakdown?.revenueBySource
        ? revenueBreakdown.revenueBySource.map((item: any) => item.amount / 1000000000)
        : [
            (revenueBreakdown?.directContributors?.revenue || 0) / 1000000000,
            (revenueBreakdown?.indirectContributors?.revenue || 0) / 1000000000
          ],
      backgroundColor: COLORS,
      borderColor: "#fff",
      borderWidth: 3,
      hoverOffset: 15,
    }]
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: { padding: 10, font: { size: 11 } }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed;
            // Check if we have percentage data in the source
            const sourceData = latestData.breakdown?.revenueBySource?.[context.dataIndex];
            const percentage = sourceData?.percentage ? ` (${sourceData.percentage}%)` : '';
            return `${label}: â‚±${value.toFixed(2)}B${percentage}`;
          }
        }
      }
    }
  };



  // Revenue Trends Line Chart - using actual annual data
  const annualTrends = data.annualReports?.slice(0, 4).reverse() || [];
  
  const lineData = {
    labels: annualTrends.map((t: any) => t.year?.toString() || ""),
    datasets: [
      {
        label: "Revenue",
        data: annualTrends.map((t: any) => (t.revenue || 0) / 1000000000),
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
      },
      {
        label: "Expenses",
        data: annualTrends.map((t: any) => (t.expenditures || 0) / 1000000000),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { padding: 15, font: { size: 12 }, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y}B`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${value}B`
        },
        grid: { color: "rgba(0, 0, 0, 0.05)" }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  // Benefit Payments by Sector - Horizontal Bar Chart
  const benefitPaymentsData = {
    labels: latestData.breakdown?.benefitPaymentsBySector?.map((item: any) => item.sector) || [],
    datasets: [{
      label: "Benefit Payments",
      data: latestData.breakdown?.benefitPaymentsBySector?.map((item: any) => item.amount / 1000000000) || [],
      backgroundColor: [
        "#009a3d", // Private Sector - PhilHealth green
        "#10b981", // Government Sector - emerald green
        "#22c55e", // Indigent Program - light green
        "#fbbf24", // Individually Paying - yellow
        "#f59e0b", // Non-paying - amber
        "#d97706", // OFW - darker amber
      ],
      borderColor: "#fff",
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const benefitPaymentsOptions = {
    indexAxis: 'y' as const,
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
          label: (context: any) => {
            const item = latestData.breakdown?.benefitPaymentsBySector?.[context.dataIndex];
            return `â‚±${context.parsed.x.toFixed(2)}B (${item?.percentage || 0}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `â‚±${value}B`
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  // MOOE Breakdown - Horizontal Bar Chart
  const mooeData = {
    labels: latestData.operationalExpenses?.mooe?.map((item: any) => item.category) || [],
    datasets: [{
      label: "MOOE Amount",
      data: latestData.operationalExpenses?.mooe?.map((item: any) => item.amount / 1000000) || [],
      backgroundColor: "#009a3d",
      borderColor: "#fff",
      borderWidth: 2,
      borderRadius: 6,
    }]
  };

  const mooeOptions = {
    indexAxis: 'y' as const,
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
          label: (context: any) => `â‚±${context.parsed.x.toFixed(2)}M`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `â‚±${value}M`
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-0">
        {/* Header Section - White background */}
        <div className="bg-white py-8 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <ExportButton
              data={data}
              filename={`philhealth-financials-${selectedYear}`}
              formatData={(data) => {
                const yearData = data.annualReports?.find((r: any) => r.year === selectedYear);
                return [{
                  Year: selectedYear,
                  'Total Assets': yearData?.totalAssets || 0,
                  'Total Revenue': yearData?.revenue || 0,
                  'Total Expenses': yearData?.expenditures || 0,
                  'Net Income': yearData?.netIncome || 0,
                }];
              }}
            />
          </div>

          {/* Year Selector */}
          <div className="mt-6">
            <YearSelector
              selectedYear={selectedYear}
              availableYears={availableYears}
              onYearChange={setSelectedYear}
              hasDetailedBreakdown={false}
              expandedCards={expandedCards}
              onToggleAll={toggleAllCards}
            />
          </div>
        </div>

        {/* KPI Cards Section - White background */}
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Assets Card */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-white shadow-sm hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="relative">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                  
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2 break-words">{formatCurrency(latestData.totalAssets || 0)}</p>
                
                {/* Trend Indicator */}
                {assetsTrend && (
                  <div className="flex items-center gap-1.5 mb-2">
                    {assetsTrend.direction === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : assetsTrend.direction === "down" ? (
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    ) : null}
                    <span className={`text-xs font-semibold ${
                      assetsTrend.direction === "up" ? "text-green-600 dark:text-green-400" : 
                      assetsTrend.direction === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                    }`}>
                      {assetsTrend.direction === "up" ? "+" : assetsTrend.direction === "down" ? "-" : ""}
                      {assetsTrend.value.toFixed(1)}% {assetsTrend.label}
                    </span>
                  </div>
                )}
                
                <p className="text-muted-foreground text-xs">As of December 31, {selectedYear}</p>
              </div>
            </div>
            {expandedCards.assets && assetDetails && (
              <div className="bg-muted/50 p-5 border-t border-border">
                <div className="space-y-4">
                  {/* Current Assets */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-foreground font-semibold text-sm">Current Assets</span>
                      <span className="font-bold text-foreground">{formatCurrency(assetDetails.currentAssets?.totalCurrentAssets || 0)}</span>
                    </div>
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-muted-foreground text-xs">?? Cash & Cash Equivalents</span>
                        <span className="text-foreground text-xs font-medium">{formatCurrency(assetDetails.currentAssets?.cashAndCashEquivalents || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-muted-foreground text-xs">?? Investments (HTM)</span>
                        <span className="text-foreground text-xs font-medium">{formatCurrency(assetDetails.currentAssets?.investments?.heldToMaturity || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-muted-foreground text-xs">?? Investments (AFS)</span>
                        <span className="text-foreground text-xs font-medium">{formatCurrency(assetDetails.currentAssets?.investments?.availableForSale || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-muted-foreground text-xs">?? Receivables</span>
                        <span className="text-foreground text-xs font-medium">{formatCurrency(
                          (assetDetails.currentAssets?.receivables?.premiumContributions || 0) +
                          (assetDetails.currentAssets?.receivables?.dueFromAgencies || 0) +
                          (assetDetails.currentAssets?.receivables?.accruedInterest || 0) +
                          (assetDetails.currentAssets?.receivables?.others || 0)
                        )}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Non-Current Assets */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-foreground font-semibold text-sm">Non-Current Assets</span>
                      <span className="font-bold text-foreground">{formatCurrency(assetDetails.nonCurrentAssets?.totalNonCurrentAssets || 0)}</span>
                    </div>
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-muted-foreground text-xs">?? Investments (HTM)</span>
                        <span className="text-foreground text-xs font-medium">{formatCurrency(assetDetails.nonCurrentAssets?.investments?.heldToMaturity || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-muted-foreground text-xs">?? Property, Plant & Equipment</span>
                        <span className="text-foreground text-xs font-medium">{formatCurrency(assetDetails.nonCurrentAssets?.propertyPlantEquipment?.net || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-muted-foreground text-xs">?? Intangible Assets</span>
                        <span className="text-foreground text-xs font-medium">{formatCurrency(assetDetails.nonCurrentAssets?.intangibleAssets?.net || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total Revenue Card */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-white shadow-sm hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="relative">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2 break-words">{formatCurrency(latestData.revenue || 0)}</p>
                
                {/* Trend Indicator */}
                {revenueTrend && (
                  <div className="flex items-center gap-1.5 mb-2">
                    {revenueTrend.direction === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : revenueTrend.direction === "down" ? (
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    ) : null}
                    <span className={`text-xs font-semibold ${
                      revenueTrend.direction === "up" ? "text-green-600 dark:text-green-400" : 
                      revenueTrend.direction === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                    }`}>
                      {revenueTrend.direction === "up" ? "+" : revenueTrend.direction === "down" ? "-" : ""}
                      {revenueTrend.value.toFixed(1)}% {revenueTrend.label}
                    </span>
                  </div>
                )}
                
                <p className="text-muted-foreground text-xs">For the year {selectedYear}</p>
              </div>
            </div>
            {expandedCards.revenue && revenueDetails && (
              <div className="bg-muted/50 p-5 border-t border-border">
                <div className="space-y-4">
                  {/* Premium Contributions */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-foreground font-semibold text-sm">Premium Contributions</span>
                      <span className="font-bold text-foreground">{formatCurrency(revenueDetails.premiumContributions?.totalPremiumContributions || 0)}</span>
                    </div>
                    
                    {/* Direct Contributors */}
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted">
                        <span className="text-foreground text-xs font-medium">?? Direct Contributors</span>
                        <span className="text-foreground font-semibold text-xs">{formatCurrency(revenueDetails.premiumContributions?.directContributors?.total || 0)}</span>
                      </div>
                      <div className="ml-4 space-y-1.5">
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-muted hover:bg-muted/80 transition-colors">
                          <span className="text-muted-foreground text-xs"> Employed Private</span>
                          <span className="text-muted-foreground text-xs">{formatCurrency(revenueDetails.premiumContributions?.directContributors?.employedPrivateSector || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-muted hover:bg-muted/80 transition-colors">
                          <span className="text-muted-foreground text-xs"> Employed Government</span>
                          <span className="text-muted-foreground text-xs">{formatCurrency(revenueDetails.premiumContributions?.directContributors?.employedGovernmentSector || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-muted hover:bg-muted/80 transition-colors">
                          <span className="text-muted-foreground text-xs"> Informal Sector</span>
                          <span className="text-muted-foreground text-xs">{formatCurrency(revenueDetails.premiumContributions?.directContributors?.informalSector || 0)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Indirect Contributors */}
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted">
                        <span className="text-foreground text-xs font-medium">??? Indirect Contributors</span>
                        <span className="text-foreground font-semibold text-xs">{formatCurrency(revenueDetails.premiumContributions?.indirectContributors?.total || 0)}</span>
                      </div>
                      <div className="ml-4 space-y-1.5">
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-muted hover:bg-muted/80 transition-colors">
                          <span className="text-muted-foreground text-xs"> Indigent Program</span>
                          <span className="text-muted-foreground text-xs">{formatCurrency(revenueDetails.premiumContributions?.indirectContributors?.indigentProgram || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-muted hover:bg-muted/80 transition-colors">
                          <span className="text-muted-foreground text-xs"> Senior Citizens</span>
                          <span className="text-muted-foreground text-xs">{formatCurrency(revenueDetails.premiumContributions?.indirectContributors?.seniorCitizens || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-muted hover:bg-muted/80 transition-colors">
                          <span className="text-muted-foreground text-xs"> Sponsored Program</span>
                          <span className="text-muted-foreground text-xs">{formatCurrency(revenueDetails.premiumContributions?.indirectContributors?.sponsoredProgram || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Other Revenue */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                      <span className="text-foreground text-sm">?? Investment Income</span>
                      <span className="font-semibold text-foreground text-sm">{formatCurrency(revenueDetails.investmentIncome?.total || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                      <span className="text-foreground text-sm">?? Other Income</span>
                      <span className="font-semibold text-foreground text-sm">{formatCurrency(revenueDetails.otherIncome?.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total Expenses Card */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-white shadow-sm hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="relative"><p className="text-muted-foreground dark:text-foreground text-sm font-medium mb-2">Total Expenses</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2 break-words">{formatCurrency(latestData.expenditures || 0)}</p>
                
                {/* Trend Indicator */}
                {expensesTrend && (
                  <div className="flex items-center gap-1.5 mb-2">
                    {expensesTrend.direction === "up" ? (
                      <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                    ) : expensesTrend.direction === "down" ? (
                      <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : null}
                    <span className={`text-xs font-semibold ${
                      expensesTrend.direction === "up" ? "text-red-600 dark:text-red-400" : 
                      expensesTrend.direction === "down" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                    }`}>
                      {expensesTrend.direction === "up" ? "+" : expensesTrend.direction === "down" ? "-" : ""}
                      {expensesTrend.value.toFixed(1)}% {expensesTrend.label}
                    </span>
                  </div>
                )}
                
                <p className="text-muted-foreground dark:text-muted-foreground text-xs">For the year {selectedYear}</p>
              </div>
            </div>
            {expandedCards.expenses && expenseDetails && (
              <div className="bg-muted/50 p-5 border-t border-border">
                <div className="space-y-4">
                  {/* Benefit Expense */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-foreground font-semibold text-sm">Benefit Expense</span>
                      <span className="font-bold text-foreground">{formatCurrency(expenseDetails.benefitExpense?.netBenefitExpense || 0)}</span>
                    </div>
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-muted-foreground text-xs">?? Before IBNP Adjustment</span>
                        <span className="text-foreground text-xs font-medium">{formatCurrency(expenseDetails.benefitExpense?.beforeIBNPAdjustment || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-muted-foreground text-xs">?? IBNP Adjustment</span>
                        <span className="text-foreground text-xs font-medium">{formatCurrency(expenseDetails.benefitExpense?.ibnpAdjustment || 0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Operating Expenses */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-foreground font-semibold text-sm">Operating Expenses</span>
                      <span className="font-bold text-foreground">{formatCurrency(expenseDetails.operatingExpenses?.totalOperatingExpenses || 0)}</span>
                    </div>
                    
                    {/* Personnel Services */}
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted">
                        <span className="text-foreground text-xs font-medium">????? Personnel Services</span>
                        <span className="text-foreground font-semibold text-xs">{formatCurrency(expenseDetails.operatingExpenses?.personnelServices?.total || 0)}</span>
                      </div>
                      <div className="ml-4 space-y-1.5">
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-muted hover:bg-muted/80 transition-colors">
                          <span className="text-muted-foreground text-xs"> Salaries & Wages</span>
                          <span className="text-muted-foreground text-xs">{formatCurrency(expenseDetails.operatingExpenses?.personnelServices?.salariesAndWages || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-muted hover:bg-muted/80 transition-colors">
                          <span className="text-muted-foreground text-xs"> Bonuses & Allowances</span>
                          <span className="text-muted-foreground text-xs">{formatCurrency(expenseDetails.operatingExpenses?.personnelServices?.bonusesAndAllowances || 0)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Other Operating Expenses */}
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-foreground text-xs">?? Maintenance & Operations</span>
                        <span className="text-foreground text-xs font-medium">{formatCurrency(expenseDetails.operatingExpenses?.maintenanceAndOperatingExpenses?.total || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <span className="text-foreground text-xs">?? Depreciation & Amortization</span>
                        <span className="text-foreground text-xs font-medium">{formatCurrency(expenseDetails.operatingExpenses?.depreciationAndAmortization || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Net Income Card */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-white shadow-sm hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="relative"><p className="text-muted-foreground dark:text-foreground text-sm font-medium mb-2">Net Income</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2 break-words">{formatCurrency(latestData.netIncome || 0)}</p>
                
                {/* Trend Indicator */}
                {netIncomeTrend && (
                  <div className="flex items-center gap-1.5 mb-2">
                    {netIncomeTrend.direction === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : netIncomeTrend.direction === "down" ? (
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    ) : null}
                    <span className={`text-xs font-semibold ${
                      netIncomeTrend.direction === "up" ? "text-green-600 dark:text-green-400" : 
                      netIncomeTrend.direction === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                    }`}>
                      {netIncomeTrend.direction === "up" ? "+" : netIncomeTrend.direction === "down" ? "-" : ""}
                      {netIncomeTrend.value.toFixed(1)}% {netIncomeTrend.label}
                    </span>
                  </div>
                )}
                
                <p className="text-muted-foreground dark:text-muted-foreground text-xs">For the year {selectedYear}</p>
              </div>
            </div>
            {expandedCards.netIncome && (
              <div className="bg-muted/50 p-5 border-t border-border">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted">
                    <span className="text-foreground text-sm">?? Total Revenue</span>
                    <span className="font-semibold text-foreground">{formatCurrency(latestData.revenue || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted">
                    <span className="text-foreground text-sm">?? Total Expenses</span>
                    <span className="font-semibold text-foreground">({formatCurrency(latestData.expenditures || 0)})</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-3 rounded-lg bg-white/20 border-t-2 border-white/30">
                    <span className="text-foreground font-bold text-base">?? Net Income</span>
                    <span className="text-foreground font-bold text-base">{formatCurrency(latestData.netIncome || 0)}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                      <span className="text-muted-foreground text-xs">?? Net Income Margin</span>
                      <span className="font-bold text-foreground text-sm">{((latestData.netIncome / latestData.revenue) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section - White background */}
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue vs Expenses Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">Revenue vs Expenses Trend</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Historical comparison of revenue and expenses</p>
              </div>
              <div className="h-[350px]">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>

            {/* Benefit Payments by Sector Chart */}
            {latestData.breakdown?.benefitPaymentsBySector && latestData.breakdown.benefitPaymentsBySector.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">Benefit Payments by Sector</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Distribution of â‚±{(latestData.expenses?.benefitPayments?.total / 1000000000 || 0).toFixed(2)}B across member sectors</p>
                </div>
                <div className="h-[400px]">
                  <Bar data={benefitPaymentsData} options={benefitPaymentsOptions} />
                </div>
              </div>
            )}

            {/* MOOE Breakdown Chart */}
            {latestData.operationalExpenses?.mooe && latestData.operationalExpenses.mooe.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">MOOE Breakdown</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Maintenance and Other Operating Expenses for {selectedYear}</p>
                </div>
                <div className="h-[450px]">
                  <Bar data={mooeData} options={mooeOptions} />
                </div>
              </div>
            )}
          </div> {/* Close grid */}
        </div> {/* Close bg-white Charts section */}

        {/* Operational Expenses Section */}
        {latestData.operationalExpenses && (
          <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">Administrative & Operational Expenses</h2>
              <p className="text-gray-600 dark:text-gray-400">Detailed breakdown of operational costs for {selectedYear}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Personal Services */}
              {latestData.operationalExpenses.personalServices && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-4">Personal Services</h3>
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(latestData.operationalExpenses.personalServices.total)}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {latestData.operationalExpenses.personalServices.breakdown.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.category}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-foreground">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MOOE Summary */}
              {latestData.operationalExpenses.mooe && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-4">Maintenance & Other Operating Expenses (MOOE)</h3>
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total MOOE</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(latestData.operationalExpenses.mooe.reduce((sum: number, item: any) => sum + item.amount, 0))}
                    </p>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {latestData.operationalExpenses.mooe.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.category}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-foreground">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cash Flow Statement */}
        {latestData.cashFlow && (
          <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">Cash Flow Statement</h2>
              <p className="text-gray-600 dark:text-gray-400">Movement of cash and cash equivalents for {selectedYear}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Operating Activities */}
              {latestData.cashFlow.operatingActivities && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-4">Operating Activities</h3>
                  <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Cash</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(latestData.cashFlow.operatingActivities.netCash)}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {latestData.cashFlow.operatingActivities.details && latestData.cashFlow.operatingActivities.details.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.item}</span>
                        <span className={`text-sm font-semibold ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Investing Activities */}
              {latestData.cashFlow.investingActivities && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-4">Investing Activities</h3>
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Cash</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(latestData.cashFlow.investingActivities.netCash)}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {latestData.cashFlow.investingActivities.details && latestData.cashFlow.investingActivities.details.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.item}</span>
                        <span className={`text-sm font-semibold ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cash Equivalents */}
            {latestData.cashFlow.cashEquivalentsEndYear && (
              <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cash and Cash Equivalents (End of Year)</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(latestData.cashFlow.cashEquivalentsEndYear)}
                    </p>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center">
                    <span className="text-2xl text-white">ðŸ’°</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Receivables */}
        {latestData.receivables && (
          <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">Receivables</h2>
              <p className="text-gray-600 dark:text-gray-400">Outstanding amounts due to PhilHealth as of {selectedYear}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Total Receivables */}
              <div className="bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-900/20 dark:to-gray-800 rounded-2xl p-6 shadow-lg border border-cyan-200 dark:border-cyan-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-foreground mb-4">Total Receivables</h3>
                <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                  {formatCurrency(latestData.receivables.total)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current receivables</p>
              </div>

              {/* Breakdown */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-foreground mb-4">Breakdown by Type</h3>
                <div className="space-y-3">
                  {latestData.receivables.breakdown && latestData.receivables.breakdown.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.type}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-foreground">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Long-term PCSO Receivables */}
            {latestData.receivables.longTermPCSO && (
              <div className="mt-6 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-foreground mb-4">Long-term PCSO Receivables</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Balance</p>
                    <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      {formatCurrency(latestData.receivables.longTermPCSO.totalBalance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Receivable</p>
                    <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      {formatCurrency(latestData.receivables.longTermPCSO.currentReceivable)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Long-term Balance</p>
                    <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      {formatCurrency(latestData.receivables.longTermPCSO.longTermBalance)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <FAQSection faqs={financialFAQs} />
        </div>

        {/* Data Source Footer */}
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="bg-white border-l-4 border-primary p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <p className="text-sm font-medium">
                <strong>Data Source:</strong> PhilHealth Annual Report {selectedYear} (Official Audited Data) | 
                <strong> Last Updated:</strong> December 31, {selectedYear}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
