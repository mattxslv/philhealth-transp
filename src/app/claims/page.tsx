"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { StatusChip } from "@/components/ui/status-chip";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { ColumnDef } from "@tanstack/react-table";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

const COLORS = ["#009a3d", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6"];

export default function ClaimsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/data/claims.json")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading claims data:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading claims data...</div>
        </div>
      </DashboardLayout>
    );
  }

  const claimsColumns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column}>Claim ID</SortableHeader>,
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <SortableHeader column={column}>Amount</SortableHeader>,
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusChip
          status={row.original.status}
          type={row.original.status === "Approved" ? "success" : "error"}
        />
      ),
    },
    {
      accessorKey: "processingDays",
      header: ({ column }) => <SortableHeader column={column}>Processing Days</SortableHeader>,
      cell: ({ row }) => `${row.original.processingDays} days`,
    },
    {
      accessorKey: "dateSubmitted",
      header: "Date Submitted",
      cell: ({ row }) => formatDate(row.original.dateSubmitted),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeading
          title="Claims Analytics"
          description="Comprehensive overview of claims processing, approval rates, and denial reasons"
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Total Claims"
            value={formatNumber(data.overview.totalClaims)}
            icon={TrendingUp}
            description="Year to date"
          />
          <KPIStatCard
            title="Approval Rate"
            value={`${data.overview.approvalRate}%`}
            icon={CheckCircle}
            description="Success rate"
          />
          <KPIStatCard
            title="Avg Processing Time"
            value={`${data.overview.averageProcessingDays} days`}
            icon={Clock}
            description="Turnaround time"
          />
          <KPIStatCard
            title="Total Disbursed"
            value={formatCurrency(data.overview.totalDisbursed)}
            icon={TrendingUp}
            description="Benefits paid"
          />
        </div>

        {/* Processing Time Trend */}
        <ChartCard
          title="Average Claims Processing Time (Monthly)"
          description="Trend of claim turnaround time in days"
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgDays" stroke="#009a3d" strokeWidth={2} name="Avg Days" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Approval vs Denial */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Monthly Claims Volume"
            description="Approved vs denied claims by month"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatNumber(value)} />
                <Legend />
                <Bar dataKey="approved" fill="#009a3d" name="Approved" />
                <Bar dataKey="denied" fill="#ef4444" name="Denied" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Denial Reasons Breakdown"
            description="Distribution of claim rejection causes"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.denialReasons}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.reason.split(' ')[0]} (${entry.percentage}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.denialReasons.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatNumber(value)} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Claims Table */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Claims</h2>
          <DataTable columns={claimsColumns} data={data.claimsData} pageSize={10} />
        </div>
      </div>
    </DashboardLayout>
  );
}
