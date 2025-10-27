"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";

const COLORS = ["#009a3d", "#2e2e2e", "#f59e0b", "#3b82f6", "#8b5cf6"];

export default function FinancialsPage() {
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
        <PageHeading
          title="Financial Information"
          description="Annual financial statements and audit reports - independently audited, with clear breakdowns of revenues, expenditures, and fund balances. Includes benefit payment data, investment portfolio details, and administrative costs breakdown."
        />

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
        <ChartCard
          title="Monthly Revenue vs Expenditures (2024)"
          description="Comparison of income and spending throughout the year"
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₱${(value / 1000000000).toFixed(0)}B`} />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="revenue" fill="#009a3d" name="Revenue" />
              <Bar dataKey="expenditures" fill="#2e2e2e" name="Expenditures" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Fund Balance Trend */}
        <ChartCard
          title="Fund Balance Over Time"
          description="Historical trend of available funds"
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data.annualReports.reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `₱${(value / 1000000000).toFixed(0)}B`} />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="fundBalance" stroke="#009a3d" strokeWidth={2} name="Fund Balance" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Administrative Costs Breakdown */}
        <ChartCard
          title="Administrative Cost Breakdown"
          description="Distribution of operational expenses"
        >
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data.administrativeCosts}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category} (${percentage}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="amount"
              >
                {data.administrativeCosts.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Investment Portfolio Table */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Investment Portfolio</h2>
          <DataTable columns={investmentColumns} data={data.investments} />
        </div>
      </div>
    </DashboardLayout>
  );
}
