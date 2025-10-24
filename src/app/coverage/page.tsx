"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { Users, TrendingUp, DollarSign, Percent } from "lucide-react";

const COLORS = ["#009a3d", "#2e2e2e", "#f59e0b", "#3b82f6", "#8b5cf6"];

export default function CoveragePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/data/coverage.json")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading coverage data:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading coverage data...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeading
          title="Coverage Statistics"
          description="Enrollment overview, contribution rates, and membership trends"
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Total Members"
            value={formatNumber(data.overview.totalMembers)}
            icon={Users}
            description="Nationwide coverage"
          />
          <KPIStatCard
            title="Direct Contributors"
            value={formatNumber(data.overview.directContributors)}
            icon={Users}
            description="Active contributors"
          />
          <KPIStatCard
            title="Contribution Rate"
            value={`${data.overview.contributionRate}%`}
            icon={Percent}
            description="Collection efficiency"
          />
          <KPIStatCard
            title="Total Contributions"
            value={formatCurrency(data.overview.totalContributions)}
            icon={DollarSign}
            description="Year to date"
          />
        </div>

        {/* Membership by Category */}
        <ChartCard
          title="Membership Distribution by Category"
          description="Breakdown of members across different categories"
        >
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data.membershipByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.category} (${entry.percentage}%)`}
                outerRadius={130}
                fill="#8884d8"
                dataKey="count"
              >
                {data.membershipByCategory.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Regional Distribution */}
        <ChartCard
          title="Membership by Region"
          description="Geographic distribution of PhilHealth members"
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.regionalDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: any) => formatNumber(value)} />
              <Legend />
              <Bar dataKey="members" fill="#009a3d" name="Members" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Historical Trends */}
        <ChartCard
          title="Historical Membership and Contribution Trends"
          description="Growth of membership and contribution rates over the years"
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data.historicalTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <YAxis yAxisId="right" orientation="right" domain={[80, 90]} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="members" stroke="#009a3d" strokeWidth={2} name="Total Members" />
              <Line yAxisId="right" type="monotone" dataKey="contributionRate" stroke="#2e2e2e" strokeWidth={2} name="Contribution Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Monthly Contributions */}
        <ChartCard
          title="Monthly Contribution Collections (2024)"
          description="Trend of contribution collections and membership growth"
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.monthlyContributions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₱${(value / 1000000000).toFixed(1)}B`} />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="amount" fill="#009a3d" name="Contributions" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
