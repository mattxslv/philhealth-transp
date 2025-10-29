"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ModernChartCard } from "@/components/ui/modern-chart-card";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const COLORS = {
  primary: '#009a3d',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#8b5cf6',
  dark: '#2e2e2e',
};

export default function FinancialsPageModern() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/data/financials.json")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading financials data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading financial data...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Failed to load data</div>
        </div>
      </DashboardLayout>
    );
  }

  const currentYear = data.annualReports[0];

  // Revenue vs Expenditures Chart Data
  const revenueExpData = {
    labels: data.monthlyRevenue.map((m: any) => m.month),
    datasets: [
      {
        label: 'Revenue',
        data: data.monthlyRevenue.map((m: any) => m.revenue / 1000000000),
        backgroundColor: `${COLORS.primary}dd`,
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: 'Expenditures',
        data: data.monthlyRevenue.map((m: any) => m.expenditures / 1000000000),
        backgroundColor: `${COLORS.danger}dd`,
        borderColor: COLORS.danger,
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const revenueExpOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 12, weight: 500 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ₱${context.parsed.y.toFixed(2)}B`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          callback: function(value: any) {
            return '₱' + value + 'B';
          },
          font: { size: 11 },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 11 },
        },
      },
    },
  };

  // Fund Balance Line Chart
  const fundBalanceData = {
    labels: data.annualReports.map((r: any) => r.year).reverse(),
    datasets: [
      {
        label: 'Fund Balance',
        data: data.annualReports.map((r: any) => r.fundBalance / 1000000000).reverse(),
        borderColor: COLORS.primary,
        backgroundColor: `${COLORS.primary}33`,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const fundBalanceOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `Fund Balance: ₱${context.parsed.y.toFixed(2)}B`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          callback: function(value: any) {
            return '₱' + value + 'B';
          },
          font: { size: 11 },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 11 },
        },
      },
    },
  };

  // Administrative Costs Doughnut Chart
  const adminCostsData = {
    labels: data.administrativeCosts.map((c: any) => c.category),
    datasets: [
      {
        data: data.administrativeCosts.map((c: any) => c.amount / 1000000000),
        backgroundColor: [
          `${COLORS.primary}dd`,
          `${COLORS.danger}dd`,
          `${COLORS.warning}dd`,
          `${COLORS.info}dd`,
          `${COLORS.purple}dd`,
        ],
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const adminCostsOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: 500 },
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ₱${value.toFixed(2)}B`;
          }
        }
      },
    },
    cutout: '65%',
  };

  const investmentColumns: ColumnDef<any>[] = [
    {
      accessorKey: "type",
      header: ({ column }) => <SortableHeader column={column}>Investment Type</SortableHeader>,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <SortableHeader column={column}>Amount</SortableHeader>,
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: "percentage",
      header: ({ column }) => <SortableHeader column={column}>Portfolio %</SortableHeader>,
      cell: ({ row }) => formatPercent(row.original.percentage),
    },
    {
      accessorKey: "returns",
      header: ({ column }) => <SortableHeader column={column}>Returns %</SortableHeader>,
      cell: ({ row }) => formatPercent(row.original.returns),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <KPIStatCard
            title="Total Revenue (2024)"
            value={formatCurrency(currentYear.revenue)}
            icon={DollarSign}
            description="Annual revenue"
          />
          <KPIStatCard
            title="Fund Balance"
            value={formatCurrency(currentYear.fundBalance)}
            icon={Wallet}
            description="Available funds"
          />
          <KPIStatCard
            title="Net Income"
            value={formatCurrency(currentYear.netIncome)}
            icon={TrendingUp}
            description="Profit for the year"
          />
        </div>

        {/* Revenue vs Expenditures */}
        <ModernChartCard
          title="Monthly Revenue vs Expenditures (2024)"
          description="Detailed comparison of income and spending throughout the year with cumulative totals and variance analysis"
        >
          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Total Revenue</div>
              <div className="font-bold text-primary">{formatCurrency(data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.revenue, 0))}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Total Expenditures</div>
              <div className="font-bold">{formatCurrency(data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.expenditures, 0))}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Average Monthly Revenue</div>
              <div className="font-bold">{formatCurrency(data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.revenue, 0) / 12)}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Surplus/Deficit</div>
              <div className={`font-bold ${(data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.revenue, 0) - data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.expenditures, 0)) > 0 ? 'text-primary' : 'text-red-500'}`}>
                {formatCurrency(data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.revenue, 0) - data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.expenditures, 0))}
              </div>
            </div>
          </div>
          <div className="h-[400px]">
            <Bar data={revenueExpData} options={revenueExpOptions} />
          </div>
        </ModernChartCard>

        {/* Fund Balance Trend */}
        <ModernChartCard
          title="Fund Balance Over Time (5-Year Trend)"
          description="Historical analysis of fund balance with year-over-year growth rates and trend indicators"
        >
          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Current Balance</div>
              <div className="font-bold text-primary">{formatCurrency(currentYear.fundBalance)}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">5-Year Growth</div>
              <div className="font-bold text-primary">
                {formatPercent(((currentYear.fundBalance - data.annualReports[data.annualReports.length - 1].fundBalance) / data.annualReports[data.annualReports.length - 1].fundBalance) * 100)}
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Highest Balance</div>
              <div className="font-bold">{formatCurrency(Math.max(...data.annualReports.map((r: any) => r.fundBalance)))}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Average Balance</div>
              <div className="font-bold">{formatCurrency(data.annualReports.reduce((sum: number, r: any) => sum + r.fundBalance, 0) / data.annualReports.length)}</div>
            </div>
          </div>
          <div className="h-[400px]">
            <Line data={fundBalanceData} options={fundBalanceOptions} />
          </div>
        </ModernChartCard>

        {/* Administrative Costs Breakdown */}
        <ModernChartCard
          title="Administrative Cost Breakdown"
          description="Comprehensive analysis of operational expenses by category with percentage allocation and total cost metrics"
        >
          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Total Admin Costs</div>
              <div className="font-bold">{formatCurrency(data.administrativeCosts.reduce((sum: number, c: any) => sum + c.amount, 0))}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Largest Category</div>
              <div className="font-bold text-xs">{data.administrativeCosts.reduce((max: any, c: any) => c.amount > (max?.amount || 0) ? c : max).category}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">% of Total Revenue</div>
              <div className="font-bold">{formatPercent((data.administrativeCosts.reduce((sum: number, c: any) => sum + c.amount, 0) / currentYear.revenue) * 100)}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Cost Efficiency</div>
              <div className="font-bold text-primary">Optimized</div>
            </div>
          </div>
          <div className="h-[400px]">
            <Doughnut data={adminCostsData} options={adminCostsOptions} />
          </div>
        </ModernChartCard>

        {/* Investment Portfolio Table */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Investment Portfolio</h2>
          <DataTable columns={investmentColumns} data={data.investments} />
        </div>
      </div>
    </DashboardLayout>
  );
}

