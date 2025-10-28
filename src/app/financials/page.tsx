"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { YearSelector } from "@/components/ui/year-selector";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp, Wallet, PiggyBank, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
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
import { Doughnut, Bar, Line } from "react-chartjs-2";

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

const COLORS = ["#009a3d", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export default function FinancialsPage() {
  const [data, setData] = useState<any>(null);
  const [detailedData, setDetailedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({
    assets: false,
    revenue: false,
    expenses: false,
    netIncome: false
  });

  useEffect(() => {
    Promise.all([
      axios.get("/data/financials.json"),
      axios.get("/data/financial-notes-2023.json")
    ])
      .then(([financialsRes, detailedRes]) => {
        setData(financialsRes.data);
        setDetailedData(detailedRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading financials data:", err);
        setLoading(false);
      });
  }, []);

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

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading financial data...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Get latest year data (2023)
  const latestData = data.annualReports?.find((report: any) => report.year === selectedYear) || data.annualReports?.[1] || {};
  
  // Get detailed breakdown from financial-notes-2023.json (only available for 2023)
  const assetDetails = selectedYear === 2023 ? detailedData?.statementOfFinancialPosition?.asOfDecember31_2023?.assets : null;
  const revenueDetails = selectedYear === 2023 ? detailedData?.statementOfComprehensiveIncome?.forYearEnded_December31_2023?.revenue : null;
  const expenseDetails = selectedYear === 2023 ? detailedData?.statementOfComprehensiveIncome?.forYearEnded_December31_2023?.expenses : null;
  
  // Get available years from the data
  const availableYears = data.annualReports?.map((report: any) => report.year).filter((year: number) => year !== 2022) || [2023];
  
  // Revenue Sources Doughnut - using breakdown data
  const revenueData = {
    labels: ["Direct Contributors", "Indirect Contributors"],
    datasets: [{
      data: [
        // For 2023, use membershipCategories, for other years use breakdown
        (selectedYear === 2023 
          ? (latestData.membershipCategories?.directContributors?.premiumContributions || 0)
          : (latestData.breakdown?.directContributors?.revenue || 0)
        ) / 1000000000,
        (selectedYear === 2023 
          ? (latestData.membershipCategories?.indirectContributors?.premiumContributions || 0)
          : (latestData.breakdown?.indirectContributors?.revenue || 0)
        ) / 1000000000
      ],
      backgroundColor: [COLORS[0], COLORS[1]],
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
          label: (context: any) => `${context.parsed.toFixed(2)}B`
        }
      }
    }
  };

  // Administrative Costs Bar Chart - using sample data structure
  const adminCosts = [
    { category: "Salaries & Benefits", amount: 15000000000 },
    { category: "Operations", amount: 8500000000 },
    { category: "IT & Systems", amount: 4200000000 },
    { category: "Facilities", amount: 2800000000 }
  ];
  const adminData = {
    labels: adminCosts.map((a: any) => a.category),
    datasets: [{
      label: "Amount (₱B)",
      data: adminCosts.map((a: any) => a.amount / 1000000000),
      backgroundColor: "rgba(239, 68, 68, 0.8)",
      borderColor: "rgb(239, 68, 68)",
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const adminOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(2)}B`
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Year Selector */}
        <YearSelector
          selectedYear={selectedYear}
          availableYears={availableYears}
          onYearChange={setSelectedYear}
          hasDetailedBreakdown={selectedYear === 2023}
          expandedCards={expandedCards}
          onToggleAll={toggleAllCards}
        />

        {/* KPI Cards with gradient backgrounds and expandable details */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Assets Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-800 shadow-xl hover:shadow-2xl transition-all group">
            <div className="p-6">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
              <div className="relative">
                <Wallet className="h-10 w-10 text-white/90 mb-4" />
                <p className="text-white/80 dark:text-white/90 text-sm font-medium mb-1">Total Assets</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">{formatCurrency(latestData.totalAssets || 0)}</p>
                <p className="text-white/70 dark:text-white/80 text-xs">As of December 31, {selectedYear}</p>
              </div>
            </div>
            {expandedCards.assets && assetDetails && (
              <div className="bg-white/10 backdrop-blur-sm p-5 border-t border-white/20">
                <div className="space-y-4">
                  {/* Current Assets */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white font-semibold text-sm">Current Assets</span>
                      <span className="font-bold text-white">{formatCurrency(assetDetails.currentAssets?.totalCurrentAssets || 0)}</span>
                    </div>
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-white/80 text-xs">💰 Cash & Cash Equivalents</span>
                        <span className="text-white/90 text-xs font-medium">{formatCurrency(assetDetails.currentAssets?.cashAndCashEquivalents || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-white/80 text-xs">📊 Investments (HTM)</span>
                        <span className="text-white/90 text-xs font-medium">{formatCurrency(assetDetails.currentAssets?.investments?.heldToMaturity || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-white/80 text-xs">📈 Investments (AFS)</span>
                        <span className="text-white/90 text-xs font-medium">{formatCurrency(assetDetails.currentAssets?.investments?.availableForSale || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-white/80 text-xs">📝 Receivables</span>
                        <span className="text-white/90 text-xs font-medium">{formatCurrency(
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
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white font-semibold text-sm">Non-Current Assets</span>
                      <span className="font-bold text-white">{formatCurrency(assetDetails.nonCurrentAssets?.totalNonCurrentAssets || 0)}</span>
                    </div>
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-white/80 text-xs">📊 Investments (HTM)</span>
                        <span className="text-white/90 text-xs font-medium">{formatCurrency(assetDetails.nonCurrentAssets?.investments?.heldToMaturity || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-white/80 text-xs">🏢 Property, Plant & Equipment</span>
                        <span className="text-white/90 text-xs font-medium">{formatCurrency(assetDetails.nonCurrentAssets?.propertyPlantEquipment?.net || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-white/80 text-xs">💻 Intangible Assets</span>
                        <span className="text-white/90 text-xs font-medium">{formatCurrency(assetDetails.nonCurrentAssets?.intangibleAssets?.net || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total Revenue Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 shadow-xl hover:shadow-2xl transition-all group">
            <div className="p-6">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
              <div className="relative">
                <DollarSign className="h-10 w-10 text-white/90 mb-4" />
                <p className="text-white/80 dark:text-white/90 text-sm font-medium mb-1">Total Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">{formatCurrency(latestData.revenue || 0)}</p>
                <p className="text-white/70 dark:text-white/80 text-xs">For the year {selectedYear}</p>
              </div>
            </div>
            {expandedCards.revenue && revenueDetails && (
              <div className="bg-white/10 backdrop-blur-sm p-5 border-t border-white/20">
                <div className="space-y-4">
                  {/* Premium Contributions */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white font-semibold text-sm">Premium Contributions</span>
                      <span className="font-bold text-white">{formatCurrency(revenueDetails.premiumContributions?.totalPremiumContributions || 0)}</span>
                    </div>
                    
                    {/* Direct Contributors */}
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5">
                        <span className="text-white/90 text-xs font-medium">👥 Direct Contributors</span>
                        <span className="text-white font-semibold text-xs">{formatCurrency(revenueDetails.premiumContributions?.directContributors?.total || 0)}</span>
                      </div>
                      <div className="ml-4 space-y-1.5">
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-white/70 text-xs">• Employed Private</span>
                          <span className="text-white/80 text-xs">{formatCurrency(revenueDetails.premiumContributions?.directContributors?.employedPrivateSector || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-white/70 text-xs">• Employed Government</span>
                          <span className="text-white/80 text-xs">{formatCurrency(revenueDetails.premiumContributions?.directContributors?.employedGovernmentSector || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-white/70 text-xs">• Informal Sector</span>
                          <span className="text-white/80 text-xs">{formatCurrency(revenueDetails.premiumContributions?.directContributors?.informalSector || 0)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Indirect Contributors */}
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5">
                        <span className="text-white/90 text-xs font-medium">🏛️ Indirect Contributors</span>
                        <span className="text-white font-semibold text-xs">{formatCurrency(revenueDetails.premiumContributions?.indirectContributors?.total || 0)}</span>
                      </div>
                      <div className="ml-4 space-y-1.5">
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-white/70 text-xs">• Indigent Program</span>
                          <span className="text-white/80 text-xs">{formatCurrency(revenueDetails.premiumContributions?.indirectContributors?.indigentProgram || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-white/70 text-xs">• Senior Citizens</span>
                          <span className="text-white/80 text-xs">{formatCurrency(revenueDetails.premiumContributions?.indirectContributors?.seniorCitizens || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-white/70 text-xs">• Sponsored Program</span>
                          <span className="text-white/80 text-xs">{formatCurrency(revenueDetails.premiumContributions?.indirectContributors?.sponsoredProgram || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Other Revenue */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-white/90 text-sm">💹 Investment Income</span>
                      <span className="font-semibold text-white text-sm">{formatCurrency(revenueDetails.investmentIncome?.total || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-white/90 text-sm">📋 Other Income</span>
                      <span className="font-semibold text-white text-sm">{formatCurrency(revenueDetails.otherIncome?.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total Expenses Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 dark:from-orange-600 dark:to-orange-800 shadow-xl hover:shadow-2xl transition-all group">
            <div className="p-6">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
              <div className="relative">
                <TrendingUp className="h-10 w-10 text-white/90 mb-4" />
                <p className="text-white/80 dark:text-white/90 text-sm font-medium mb-1">Total Expenses</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">{formatCurrency(latestData.expenditures || 0)}</p>
                <p className="text-white/70 dark:text-white/80 text-xs">For the year {selectedYear}</p>
              </div>
            </div>
            {expandedCards.expenses && expenseDetails && (
              <div className="bg-white/10 backdrop-blur-sm p-5 border-t border-white/20">
                <div className="space-y-4">
                  {/* Benefit Expense */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white font-semibold text-sm">Benefit Expense</span>
                      <span className="font-bold text-white">{formatCurrency(expenseDetails.benefitExpense?.netBenefitExpense || 0)}</span>
                    </div>
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-white/80 text-xs">💊 Before IBNP Adjustment</span>
                        <span className="text-white/90 text-xs font-medium">{formatCurrency(expenseDetails.benefitExpense?.beforeIBNPAdjustment || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-white/80 text-xs">📊 IBNP Adjustment</span>
                        <span className="text-white/90 text-xs font-medium">{formatCurrency(expenseDetails.benefitExpense?.ibnpAdjustment || 0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Operating Expenses */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white font-semibold text-sm">Operating Expenses</span>
                      <span className="font-bold text-white">{formatCurrency(expenseDetails.operatingExpenses?.totalOperatingExpenses || 0)}</span>
                    </div>
                    
                    {/* Personnel Services */}
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5">
                        <span className="text-white/90 text-xs font-medium">👨‍💼 Personnel Services</span>
                        <span className="text-white font-semibold text-xs">{formatCurrency(expenseDetails.operatingExpenses?.personnelServices?.total || 0)}</span>
                      </div>
                      <div className="ml-4 space-y-1.5">
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-white/70 text-xs">• Salaries & Wages</span>
                          <span className="text-white/80 text-xs">{formatCurrency(expenseDetails.operatingExpenses?.personnelServices?.salariesAndWages || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-white/70 text-xs">• Bonuses & Allowances</span>
                          <span className="text-white/80 text-xs">{formatCurrency(expenseDetails.operatingExpenses?.personnelServices?.bonusesAndAllowances || 0)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Other Operating Expenses */}
                    <div className="ml-3 space-y-2">
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-white/90 text-xs">🔧 Maintenance & Operations</span>
                        <span className="text-white/90 text-xs font-medium">{formatCurrency(expenseDetails.operatingExpenses?.maintenanceAndOperatingExpenses?.total || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-white/90 text-xs">📉 Depreciation & Amortization</span>
                        <span className="text-white/90 text-xs font-medium">{formatCurrency(expenseDetails.operatingExpenses?.depreciationAndAmortization || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Net Income Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 shadow-xl hover:shadow-2xl transition-all group">
            <div className="p-6">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
              <div className="relative">
                <PiggyBank className="h-10 w-10 text-white/90 mb-4" />
                <p className="text-white/80 dark:text-white/90 text-sm font-medium mb-1">Net Income</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">{formatCurrency(latestData.netIncome || 0)}</p>
                <p className="text-white/70 dark:text-white/80 text-xs">For the year {selectedYear}</p>
              </div>
            </div>
            {expandedCards.netIncome && (
              <div className="bg-white/10 backdrop-blur-sm p-5 border-t border-white/20">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/5">
                    <span className="text-white/90 text-sm">💰 Total Revenue</span>
                    <span className="font-semibold text-white">{formatCurrency(latestData.revenue || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/5">
                    <span className="text-white/90 text-sm">💸 Total Expenses</span>
                    <span className="font-semibold text-white">({formatCurrency(latestData.expenditures || 0)})</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-3 rounded-lg bg-white/20 border-t-2 border-white/30">
                    <span className="text-white font-bold text-base">📊 Net Income</span>
                    <span className="text-white font-bold text-base">{formatCurrency(latestData.netIncome || 0)}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-white/80 text-xs">📈 Net Income Margin</span>
                      <span className="font-bold text-white text-sm">{((latestData.netIncome / latestData.revenue) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section with modern cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Revenue by Source</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Breakdown of revenue sources for {selectedYear}</p>
            </div>
            <div className="h-[400px]">
              <Doughnut data={revenueData} options={revenueOptions} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Administrative Costs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Operating expenses breakdown for {selectedYear}</p>
            </div>
            <div className="h-[400px]">
              <Bar data={adminData} options={adminOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Revenue vs Expenses Trend</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Historical comparison of revenue and expenses</p>
          </div>
          <div className="h-[350px]">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
        {/* Additional Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl shadow-md border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full -mr-12 -mt-12"></div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Coverage Rate</h3>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{latestData.coverageRate || 100}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Population coverage</p>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl shadow-md border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400/10 rounded-full -mr-12 -mt-12"></div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Total Beneficiaries</h3>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">{((latestData.totalBeneficiaries || latestData.beneficiaries || 0) / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Members covered</p>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-2xl shadow-md border border-red-200 dark:border-red-700 hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-400/10 rounded-full -mr-12 -mt-12"></div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Claims Paid</h3>
            <p className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">₱{((latestData.claimsPaid || 0) / 1000000000).toFixed(1)}B</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total disbursed</p>
          </div>
        </div>

        {/* Future Enhancements Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Future Enhancements: Advanced Financial Transparency</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                The following features are planned for implementation when additional data becomes available:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quarterly Reports */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">📊 Quarterly Financial Reports</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Quarterly breakdowns of revenue, expenditures, and financial position to provide more frequent updates throughout the year.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Q1, Q2, Q3, Q4 financial statements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Quarter-over-quarter comparisons</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Seasonal trend analysis</span>
                </li>
              </ul>
            </div>

            {/* Audit Reports */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">🔍 Detailed Audit Reports</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Comprehensive audit findings from the Commission on Audit (COA) with recommendations and management responses.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>COA audit opinions and findings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Management corrective action plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Status of audit recommendations</span>
                </li>
              </ul>
            </div>

            {/* Investment Portfolio */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">💼 Investment Portfolio Performance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Detailed breakdown of where PhilHealth funds are invested and their investment returns.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Investment by asset class (bonds, securities, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Return on investment (ROI) and yields</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Risk assessment and portfolio strategy</span>
                </li>
              </ul>
            </div>

            {/* Administrative Costs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">📋 Administrative Costs Breakdown</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Granular details on operational expenses as a percentage of total budget, by department and function.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Personnel costs vs operational costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Department-by-department expense allocation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Administrative efficiency ratios</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-300 dark:border-blue-700">
            <p className="text-xs text-blue-800 dark:text-blue-200 italic">
              💡 <strong>Note:</strong> These enhancements require detailed financial data that may be available in internal reports but not yet
              published in the annual reports. We are working to make this information accessible for greater transparency.
            </p>
          </div>
        </div>

        {/* Data Source Footer */}
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
