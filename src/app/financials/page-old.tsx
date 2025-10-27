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
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  tickFormatter={(value) => `₱${(value / 1000000000).toFixed(1)}B`} 
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  label={{ value: 'Amount (Billions)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6b7280' } }}
                />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="rect"
                />
                <Bar dataKey="revenue" fill="#009a3d" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenditures" fill="#ef4444" name="Expenditures" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Fund Balance Trend */}
        <ChartCard
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
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.annualReports.reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="year" 
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  tickFormatter={(value) => `₱${(value / 1000000000).toFixed(1)}B`} 
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  label={{ value: 'Fund Balance (Billions)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6b7280' } }}
                />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="fundBalance" 
                  stroke="#009a3d" 
                  strokeWidth={3} 
                  name="Fund Balance"
                  dot={{ fill: '#009a3d', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Administrative Costs Breakdown */}
        <ChartCard
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
          <div className="grid md:grid-cols-2 gap-6">
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.administrativeCosts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                    outerRadius={110}
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
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm mb-3">Cost Category Details</h4>
              {data.administrativeCosts.map((cost: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm font-medium">{cost.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{formatCurrency(cost.amount)}</div>
                    <div className="text-xs text-muted-foreground">{cost.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
