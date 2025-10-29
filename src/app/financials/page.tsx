"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { PageLoadingSkeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
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

const COLORS = [
  "#009a3d", "#eab308", "#10b981", "#fbbf24",
  "#22c55e", "#fcd34d", "#4ade80", "#fde047"
];

export default function FinancialsPage() {
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
        console.log(`📊 Loading data for year ${selectedYear}`);
        console.log('Statistics data keys:', Object.keys(statsRes.data));
        console.log('Annual report data keys:', Object.keys(reportRes.data));
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

  const parseNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[₱,P\s]/g, '').replace(/billion/gi, '000000000').replace(/million/gi, '000000');
      return parseFloat(cleaned) || 0;
    }
    return 0;
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

  // Extract data based on year structure
  let totalRevenue = 0;
  let totalExpenses = 0;
  let revenueBreakdown: any = {};
  let expenseBreakdown: any = {};

  console.log(`🔍 Processing data for year ${selectedYear}`);

  if (selectedYear === 2024) {
    // 2024 structure
    const statsData2024 = statisticsData.philhealth_transparency_data_2024 || statisticsData;
    console.log('2024 - statsData2024 keys:', Object.keys(statsData2024 || {}));
    totalRevenue = statsData2024?.premium_contributions?.data?.total || 0;
    totalExpenses = statsData2024?.benefit_expense?.by_membership_category?.total_amount_php || 0;
    console.log('2024 - Revenue:', totalRevenue, 'Expenses:', totalExpenses);
    
    // Revenue breakdown from premium contributions
    revenueBreakdown = {
      'Employed: Private': statsData2024?.premium_contributions?.data?.direct_contributors_breakdown?.find((x: any) => x.category === 'Employed: Private')?.amount_php || 0,
      'Employed: Government': statsData2024?.premium_contributions?.data?.direct_contributors_breakdown?.find((x: any) => x.category === 'Employed: Government')?.amount_php || 0,
      'Informal Economy': statsData2024?.premium_contributions?.data?.direct_contributors_breakdown?.find((x: any) => x.category === 'Informal Economy')?.amount_php || 0,
      'Indigents/NHTS-PR': statsData2024?.premium_contributions?.data?.indirect_contributors_breakdown?.find((x: any) => x.category === 'Indigents / NHTS-PR')?.amount_php || 0,
      'Senior Citizens': statsData2024?.premium_contributions?.data?.indirect_contributors_breakdown?.find((x: any) => x.category === 'Senior Citizens')?.amount_php || 0,
      'Sponsored': statsData2024?.premium_contributions?.data?.indirect_contributors_breakdown?.find((x: any) => x.category === 'Sponsored')?.amount_php || 0,
    };
    
    // Expense breakdown from benefit expense
    const benefitData = statsData2024?.benefit_expense?.by_membership_category;
    expenseBreakdown = {
      'Employed: Private': benefitData?.direct_contributors?.breakdown?.find((x: any) => x.category === 'Employed: Private')?.amount_php || 0,
      'Employed: Government': benefitData?.direct_contributors?.breakdown?.find((x: any) => x.category === 'Employed: Government')?.amount_php || 0,
      'Informal': benefitData?.direct_contributors?.breakdown?.find((x: any) => x.category === 'Informal')?.amount_php || 0,
      'Lifetime Members': benefitData?.direct_contributors?.breakdown?.find((x: any) => x.category === 'Lifetime Members')?.amount_php || 0,
      'Indigents/NHTS-PR': benefitData?.indirect_contributors?.breakdown?.find((x: any) => x.category === 'Indigents / NHTS-PR')?.amount_php || 0,
      'Senior Citizens': benefitData?.indirect_contributors?.breakdown?.find((x: any) => x.category === 'Senior Citizens')?.amount_php || 0,
      'Sponsored Program': benefitData?.indirect_contributors?.breakdown?.find((x: any) => x.category === 'Sponsored Program')?.amount_php || 0,
    };
  } else if (selectedYear === 2023) {
    // 2023 structure
    const statsData2023 = statisticsData.philhealth_stats_and_charts_2023_data || statisticsData;
    console.log('2023 - statsData2023 keys:', Object.keys(statsData2023 || {}));
    totalRevenue = statsData2023?.premium_contributions?.total_contributions || 0;
    totalExpenses = statsData2023?.claims_payment_summary?.total_claims_amount_php || 0;
    console.log('2023 - Revenue:', totalRevenue, 'Expenses:', totalExpenses);
    
    // Revenue breakdown
    revenueBreakdown = {
      'Employed: Private': statsData2023?.premium_contributions?.direct_contributors_breakdown?.employed_private || 0,
      'Employed: Government': statsData2023?.premium_contributions?.direct_contributors_breakdown?.employed_government || 0,
      'Informal Economy': statsData2023?.premium_contributions?.direct_contributors_breakdown?.informal_economy || 0,
      'Indigents/NHTS-PR': statsData2023?.premium_contributions?.indirect_contributors_breakdown?.indigents_nhts_pr || 0,
      'Senior Citizens': statsData2023?.premium_contributions?.indirect_contributors_breakdown?.senior_citizens || 0,
      'Sponsored': statsData2023?.premium_contributions?.indirect_contributors_breakdown?.sponsored || 0,
    };
    
    // Expense breakdown from claims payment summary
    const claimsSummary = statsData2023?.claims_payment_summary;
    expenseBreakdown = {
      'Employed: Private': claimsSummary?.direct_contributor_breakdown?.employed_private?.amount_php || 0,
      'Employed: Government': claimsSummary?.direct_contributor_breakdown?.employed_government?.amount_php || 0,
      'Informal': claimsSummary?.direct_contributor_breakdown?.informal_self_earning?.amount_php || 0,
      'Lifetime Members': claimsSummary?.direct_contributor_breakdown?.lifetime_members?.amount_php || 0,
      'Indigents/NHTS-PR': claimsSummary?.indirect_contributor_breakdown?.indigent_nhts_pr?.amount_php || 0,
      'Senior Citizens': claimsSummary?.indirect_contributor_breakdown?.senior_citizen?.amount_php || 0,
      'Sponsored Program': claimsSummary?.indirect_contributor_breakdown?.sponsored?.amount_php || 0,
    };
  } else if (selectedYear === 2022) {
    // 2022 structure
    const statsData2022 = statisticsData.philhealth_2023_annual_report_data || statisticsData;
    console.log('2022 - statsData2022 keys:', Object.keys(statsData2022 || {}));
    totalRevenue = statsData2022?.premium_contributions?.total_contributions_php || 0;
    
    // Calculate total expenses from benefit_claims_expenses for 2022
    const benefitClaims2022 = statsData2022?.claims_and_benefits?.benefit_claims_expenses?.['2022_php'];
    totalExpenses = (
      (benefitClaims2022?.members_benefits_direct_contributors || 0) +
      (benefitClaims2022?.members_benefits_indirect_contributors || 0) +
      (benefitClaims2022?.interim_financing_mechanism || 0)
    );
    console.log('2022 - Revenue:', totalRevenue, 'Expenses:', totalExpenses);
    
    // Revenue breakdown
    revenueBreakdown = {
      'Employed: Private': statsData2022?.premium_contributions?.direct_contributors_breakdown?.employed_private_php || 0,
      'Employed: Government': statsData2022?.premium_contributions?.direct_contributors_breakdown?.employed_government_php || 0,
      'Informal Economy': statsData2022?.premium_contributions?.direct_contributors_breakdown?.informal_economy_php || 0,
      'Indigents/NHTS-PR': statsData2022?.premium_contributions?.indirect_contributors_breakdown?.indigents_nhts_pr_php || 0,
      'Senior Citizens': statsData2022?.premium_contributions?.indirect_contributors_breakdown?.senior_citizens_php || 0,
      'Sponsored': statsData2022?.premium_contributions?.indirect_contributors_breakdown?.sponsored_php || 0,
    };
    
    // Expense breakdown for 2022 - use the benefit claims data
    const directTotal = benefitClaims2022?.members_benefits_direct_contributors || 0;
    const indirectTotal = benefitClaims2022?.members_benefits_indirect_contributors || 0;
    
    // Distribute direct contributor expenses proportionally
    const directRevenueTotal = (
      (statsData2022?.premium_contributions?.direct_contributors_breakdown?.employed_private_php || 0) +
      (statsData2022?.premium_contributions?.direct_contributors_breakdown?.employed_government_php || 0) +
      (statsData2022?.premium_contributions?.direct_contributors_breakdown?.informal_economy_php || 0)
    );
    
    const indirectRevenueTotal = (
      (statsData2022?.premium_contributions?.indirect_contributors_breakdown?.indigents_nhts_pr_php || 0) +
      (statsData2022?.premium_contributions?.indirect_contributors_breakdown?.senior_citizens_php || 0) +
      (statsData2022?.premium_contributions?.indirect_contributors_breakdown?.sponsored_php || 0)
    );
    
    expenseBreakdown = {
      'Employed: Private': directRevenueTotal > 0 ? ((revenueBreakdown['Employed: Private'] / directRevenueTotal) * directTotal) : 0,
      'Employed: Government': directRevenueTotal > 0 ? ((revenueBreakdown['Employed: Government'] / directRevenueTotal) * directTotal) : 0,
      'Informal Economy': directRevenueTotal > 0 ? ((revenueBreakdown['Informal Economy'] / directRevenueTotal) * directTotal) : 0,
      'Indigents/NHTS-PR': indirectRevenueTotal > 0 ? ((revenueBreakdown['Indigents/NHTS-PR'] / indirectRevenueTotal) * indirectTotal) : 0,
      'Senior Citizens': indirectRevenueTotal > 0 ? ((revenueBreakdown['Senior Citizens'] / indirectRevenueTotal) * indirectTotal) : 0,
      'Sponsored': indirectRevenueTotal > 0 ? ((revenueBreakdown['Sponsored'] / indirectRevenueTotal) * indirectTotal) : 0,
    };
  }

  console.log('💰 Final calculated - Revenue:', totalRevenue, 'Expenses:', totalExpenses);


  const netIncome = totalRevenue - totalExpenses;
  
  // Revenue Doughnut Chart
  const revenueData = {
    labels: Object.keys(revenueBreakdown),
    datasets: [{
      data: Object.values(revenueBreakdown).map((amount: any) => parseNumber(amount) / 1000000000),
      backgroundColor: COLORS,
      borderColor: "#fff",
      borderWidth: 3,
    }]
  };

  // Expense Bar Chart
  const expenseData = {
    labels: Object.keys(expenseBreakdown),
    datasets: [{
      label: 'Expenses (Billions)',
      data: Object.values(expenseBreakdown).map((amount: any) => parseNumber(amount) / 1000000000),
      backgroundColor: COLORS[0],
    }]
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Financial Information</h1>
            <p className="text-muted-foreground mt-1">Comprehensive financial data and statements - {selectedYear}</p>
          </div>
          <div className="flex items-center gap-3">
            <YearSelectorDropdown 
              selectedYear={selectedYear} 
              onChange={setSelectedYear}
              startYear={2022}
              endYear={2024}
            />
            <ExportButton
              data={{ statisticsData, annualReportData }}
              filename={`philhealth-financials-${selectedYear}`}
            />
          </div>
        </div>

        {/* Financial Overview Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Financial Overview {selectedYear}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            PhilHealth&apos;s financial performance demonstrates our commitment to providing comprehensive healthcare coverage 
            to all Filipinos while maintaining fiscal responsibility and sustainability.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">Revenue Efficiency</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{((totalRevenue / totalExpenses) * 100).toFixed(1)}%</p>
              <p className="text-xs text-green-600 dark:text-green-400">Revenue to Expense Ratio</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">Benefit Coverage</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{((totalExpenses / totalRevenue) * 100).toFixed(1)}%</p>
              <p className="text-xs text-green-600 dark:text-green-400">Benefits as % of Revenue</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">Financial Position</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{netIncome >= 0 ? 'Surplus' : 'Deficit'}</p>
              <p className="text-xs text-green-600 dark:text-green-400">{formatCurrency(Math.abs(netIncome))}</p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            description="Premium collections"
          />
          <KPIStatCard
            title="Benefit Expenses"
            value={formatCurrency(totalExpenses)}
            icon={Wallet}
            description="Claims paid to members"
          />
          <KPIStatCard
            title="Net Income"
            value={formatCurrency(netIncome)}
            icon={netIncome >= 0 ? TrendingUp : TrendingDown}
            description={netIncome >= 0 ? "Surplus" : "Deficit"}
          />
          <KPIStatCard
            title="Operating Expenses"
            value={formatCurrency(
              selectedYear === 2024 ? 15899508020 :
              selectedYear === 2023 ? 9403308012 :
              14834196488
            )}
            icon={Wallet}
            description="Administrative costs"
          />
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Premium Contributions" description={`${selectedYear} revenue sources by contributor type`}>
            <div className="h-[360px]">
              <Doughnut data={revenueData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: { 
                    position: 'bottom',
                    labels: {
                      padding: 12,
                      font: { size: 11 },
                      boxWidth: 15
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return [
                          `${label}`,
                          `Amount: ₱${value.toFixed(2)}B`,
                          `Share: ${percentage}%`
                        ];
                      }
                    }
                  }
                }
              }} />
            </div>
          </ChartCard>
          
          <ChartCard title="Benefit Expense Distribution" description={`${selectedYear} benefit payments by category`}>
            <div className="h-[360px]">
              <Bar data={expenseData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.parsed.y || 0;
                        return `₱${value.toFixed(2)}B`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `₱${value}B`
                    }
                  }
                }
              }} />
            </div>
          </ChartCard>
        </div>

        {/* Detailed Breakdown Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Breakdown Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Premium Contributions Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(revenueBreakdown).map(([category, amount]: [string, any]) => {
                const percentage = ((parseNumber(amount) / totalRevenue) * 100).toFixed(1);
                return (
                  <div key={category} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="text-sm font-bold text-primary">{percentage}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-4">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {formatCurrency(parseNumber(amount))}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 border-t-2 border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-white">Total Revenue</span>
                  <span className="font-bold text-primary text-lg">{formatCurrency(totalRevenue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Breakdown Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Benefit Expense Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(expenseBreakdown).map(([category, amount]: [string, any]) => {
                const percentage = ((parseNumber(amount) / totalExpenses) * 100).toFixed(1);
                return (
                  <div key={category} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="text-sm font-bold text-primary">{percentage}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-4">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {formatCurrency(parseNumber(amount))}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 border-t-2 border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-white">Total Expenses</span>
                  <span className="font-bold text-primary text-lg">{formatCurrency(totalExpenses)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statement of Comprehensive Income */}
        {annualReportData?.financial_statements?.statement_of_comprehensive_income && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4">Statement of Comprehensive Income</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              For the year ended December 31, {selectedYear}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Item</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">{selectedYear}</th>
                    {annualReportData.financial_statements.statement_of_comprehensive_income.revenue_and_expenses[0]?.[selectedYear - 1] && (
                      <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">{selectedYear - 1}</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {annualReportData.financial_statements.statement_of_comprehensive_income.revenue_and_expenses.map((row: any, idx: number) => (
                    <tr key={idx} className={row.item.includes('TOTAL') || row.item.includes('NET') ? 'font-bold bg-gray-50 dark:bg-gray-900' : ''}>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {row.item.includes('Less:') && <span className="ml-4" />}
                        {row.item}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                        {formatCurrency(row[selectedYear.toString()] || row[selectedYear] || 0)}
                      </td>
                      {row[selectedYear - 1] !== undefined && (
                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                          {formatCurrency(row[(selectedYear - 1).toString()] || row[selectedYear - 1] || 0)}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cash Flow Summary */}
        {annualReportData?.financial_statements?.statement_of_cash_flows && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4">Statement of Cash Flows</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              For the year ended December 31, {selectedYear}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Operating Activities</h4>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(annualReportData.financial_statements.statement_of_cash_flows.operating_activities?.net_cash_operating?.[selectedYear.toString()] || 0)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Net cash from operations</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Investing Activities</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(annualReportData.financial_statements.statement_of_cash_flows.investing_activities?.net_cash_investing?.[selectedYear.toString()] || 0)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Net cash from investments</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Financing Activities</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(annualReportData.financial_statements.statement_of_cash_flows.financing_activities?.net_cash_financing?.[selectedYear.toString()] || 0)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Net cash from financing</p>
              </div>
            </div>
          </div>
        )}

        {/* Financial Position Summary */}
        {annualReportData?.financial_statements?.statement_of_financial_position && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-xl font-bold mb-4">Assets Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Current Assets</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(annualReportData.financial_statements.statement_of_financial_position.current_assets?.[selectedYear.toString()] || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Non-Current Assets</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(annualReportData.financial_statements.statement_of_financial_position.non_current_assets?.[selectedYear.toString()] || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300 dark:border-gray-600">
                  <span className="font-bold text-gray-900 dark:text-white text-lg">Total Assets</span>
                  <span className="font-bold text-primary text-lg">
                    {formatCurrency(annualReportData.financial_statements.statement_of_financial_position.TOTAL_ASSETS?.[selectedYear.toString()] || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-xl font-bold mb-4">Liabilities & Equity</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Current Liabilities</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(annualReportData.financial_statements.statement_of_financial_position.current_liabilities?.[selectedYear.toString()] || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Non-Current Liabilities</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(annualReportData.financial_statements.statement_of_financial_position.non_current_liabilities?.[selectedYear.toString()] || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">Total Equity</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      annualReportData.financial_statements.statement_of_financial_position.equity?.find((e: any) => e.item === 'Total Equity')?.[selectedYear.toString()] || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300 dark:border-gray-600">
                  <span className="font-bold text-gray-900 dark:text-white text-lg">Total Liabilities & Equity</span>
                  <span className="font-bold text-primary text-lg">
                    {formatCurrency(annualReportData.financial_statements.statement_of_financial_position.TOTAL_LIABILITIES_AND_EQUITY?.[selectedYear.toString()] || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Financial Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Key Financial Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Revenue Composition</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Direct contributors (employed private, government, informal) account for approximately{' '}
                <span className="font-bold text-primary">
                  {(((parseNumber(revenueBreakdown['Employed: Private'] || 0) + 
                      parseNumber(revenueBreakdown['Employed: Government'] || 0) + 
                      parseNumber(revenueBreakdown['Informal Economy'] || 0)) / totalRevenue) * 100).toFixed(1)}%
                </span>{' '}
                of total premium contributions.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Benefit Utilization</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Benefits-to-revenue ratio stands at{' '}
                <span className="font-bold text-primary">
                  {((totalExpenses / totalRevenue) * 100).toFixed(1)}%
                </span>, demonstrating effective benefit delivery to members.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Financial Sustainability</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Operating margin of{' '}
                <span className="font-bold text-primary">
                  {((netIncome / totalRevenue) * 100).toFixed(1)}%
                </span>{' '}
                reflects PhilHealth&apos;s commitment to fiscal responsibility while maximizing member benefits.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Coverage Equity</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Indirect contributors (indigents, senior citizens, sponsored) receive{' '}
                <span className="font-bold text-primary">
                  {(((parseNumber(expenseBreakdown['Indigents/NHTS-PR'] || 0) + 
                      parseNumber(expenseBreakdown['Senior Citizens'] || 0) + 
                      parseNumber(expenseBreakdown['Sponsored Program'] || 0)) / totalExpenses) * 100).toFixed(1)}%
                </span>{' '}
                of benefit expenses, ensuring equitable healthcare access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
