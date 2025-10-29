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
  "#009a3d", "#10b981", "#22c55e", "#fbbf24",
  "#f59e0b", "#d97706", "#84cc16", "#eab308"
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

  const totalRevenue = parseNumber(statisticsData.premiumCollections?.total || 0);
  const totalExpenses = parseNumber(statisticsData.benefitPayments?.total || 0);
  const netIncome = totalRevenue - totalExpenses;
  
  const revenueBreakdown = statisticsData.premiumCollections?.breakdown || {};
  const expenseBreakdown = statisticsData.benefitPayments?.breakdown || {};
  
  // Revenue Doughnut Chart
  const revenueData = {
    labels: Object.keys(revenueBreakdown).map(key => key.replace(/([A-Z])/g, ' $1').trim()),
    datasets: [{
      data: Object.values(revenueBreakdown).map((item: any) => parseNumber(item.amount || 0) / 1000000000),
      backgroundColor: COLORS,
      borderColor: "#fff",
      borderWidth: 3,
    }]
  };

  // Expense Bar Chart
  const expenseData = {
    labels: Object.keys(expenseBreakdown).map(key => key.replace(/([A-Z])/g, ' $1').trim()),
    datasets: [{
      label: 'Expenses (Billions)',
      data: Object.values(expenseBreakdown).map((item: any) => parseNumber(item.amount || 0) / 1000000000),
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
            <p className="text-muted-foreground mt-1">Comprehensive financial data - {selectedYear}</p>
          </div>
          <ExportButton
            data={{ statisticsData, annualReportData }}
            filename={`philhealth-financials-${selectedYear}`}
          />
        </div>

        {/* Year Selector */}
        <div className="flex justify-center">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Array.from({ length: 17 }, (_, i) => 2024 - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <KPIStatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            description="Premium collections"
          />
          <KPIStatCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            icon={Wallet}
            description="Benefit payments"
          />
          <KPIStatCard
            title="Net Income"
            value={formatCurrency(netIncome)}
            icon={netIncome >= 0 ? TrendingUp : TrendingDown}
            description={netIncome >= 0 ? "Surplus" : "Deficit"}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Revenue Sources" description={`${selectedYear} premium collections breakdown`}>
            <Doughnut data={revenueData} options={{ responsive: true, maintainAspectRatio: false }} />
          </ChartCard>
          
          <ChartCard title="Expense Distribution" description={`${selectedYear} benefit payments breakdown`}>
            <Bar data={expenseData} options={{ responsive: true, maintainAspectRatio: false }} />
          </ChartCard>
        </div>

        {/* Additional Info from Annual Report */}
        {annualReportData.financialHighlights && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4">Financial Highlights</h3>
            <div className="space-y-2">
              {Object.entries(annualReportData.financialHighlights).map(([key, value]: [string, any]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-semibold">{typeof value === 'string' ? value : formatCurrency(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
