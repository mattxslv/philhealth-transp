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
          description="Comprehensive breakdown of members across different categories with detailed statistics and growth metrics"
        >
          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Total Categories</div>
              <div className="font-bold text-primary">{data.membershipByCategory.length}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Largest Category</div>
              <div className="font-bold text-xs">{data.membershipByCategory.reduce((max: any, c: any) => c.count > (max?.count || 0) ? c : max).category}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Total Members</div>
              <div className="font-bold">{formatNumber(data.membershipByCategory.reduce((sum: number, c: any) => sum + c.count, 0))}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Coverage Rate</div>
              <div className="font-bold text-primary">{data.overview.contributionRate}%</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.membershipByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={(entry: any) => `${entry.category}: ${entry.percentage}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.membershipByCategory.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => formatNumber(value)}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm mb-3">Category Details</h4>
              {data.membershipByCategory.map((category: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div>
                      <div className="text-sm font-medium">{category.category}</div>
                      <div className="text-xs text-muted-foreground">Member Count</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{formatNumber(category.count)}</div>
                    <div className="text-xs text-muted-foreground">{category.percentage}% of total</div>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Total Membership</span>
                  <span className="text-sm font-bold text-primary">
                    {formatNumber(data.membershipByCategory.reduce((sum: number, c: any) => sum + c.count, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Regional Distribution */}
        <ChartCard
          title="Membership by Region"
          description="Geographic distribution analysis of PhilHealth members across all regions with comparative insights"
        >
          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Total Regions</div>
              <div className="font-bold text-primary">{data.regionalDistribution.length}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Highest Region</div>
              <div className="font-bold text-xs">{data.regionalDistribution.reduce((max: any, r: any) => r.members > (max?.members || 0) ? r : max).region}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Average per Region</div>
              <div className="font-bold">{formatNumber(data.regionalDistribution.reduce((sum: number, r: any) => sum + r.members, 0) / data.regionalDistribution.length)}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">National Coverage</div>
              <div className="font-bold text-primary">Nationwide</div>
            </div>
          </div>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.regionalDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="region" 
                  fontSize={11} 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} 
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  label={{ value: 'Members (Millions)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6b7280' } }}
                />
                <Tooltip 
                  formatter={(value: any) => formatNumber(value)}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="rect"
                />
                <Bar dataKey="members" fill="#009a3d" name="Members" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Historical Trends */}
        <ChartCard
          title="Historical Membership and Contribution Trends"
          description="Multi-year analysis of membership growth and contribution rate efficiency with trend indicators"
        >
          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Current Members</div>
              <div className="font-bold text-primary">{formatNumber(data.historicalTrends[data.historicalTrends.length - 1].members)}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">5-Year Growth</div>
              <div className="font-bold text-primary">
                {formatPercent(((data.historicalTrends[data.historicalTrends.length - 1].members - data.historicalTrends[0].members) / data.historicalTrends[0].members) * 100)}
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Current Rate</div>
              <div className="font-bold">{data.historicalTrends[data.historicalTrends.length - 1].contributionRate}%</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Trend Status</div>
              <div className="font-bold text-primary">Growing</div>
            </div>
          </div>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.historicalTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="year" 
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  yAxisId="left" 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} 
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  label={{ value: 'Members (Millions)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6b7280' } }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  domain={[80, 90]} 
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  label={{ value: 'Contribution Rate (%)', angle: 90, position: 'insideRight', style: { fontSize: 11, fill: '#6b7280' } }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="line"
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="members" 
                  stroke="#009a3d" 
                  strokeWidth={3} 
                  name="Total Members"
                  dot={{ fill: '#009a3d', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="contributionRate" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  name="Contribution Rate %"
                  dot={{ fill: '#ef4444', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Monthly Contributions */}
        <ChartCard
          title="Monthly Contribution Collections (2024)"
          description="Detailed monthly trend of contribution collections with cumulative totals and collection efficiency metrics"
        >
          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Total Collections</div>
              <div className="font-bold text-primary">{formatCurrency(data.monthlyContributions.reduce((sum: number, m: any) => sum + m.amount, 0))}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Average Monthly</div>
              <div className="font-bold">{formatCurrency(data.monthlyContributions.reduce((sum: number, m: any) => sum + m.amount, 0) / 12)}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Highest Month</div>
              <div className="font-bold text-xs">{data.monthlyContributions.reduce((max: any, m: any) => m.amount > (max?.amount || 0) ? m : max).month}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground text-xs">Collection Status</div>
              <div className="font-bold text-primary">On Track</div>
            </div>
          </div>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyContributions}>
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
                <Bar dataKey="amount" fill="#009a3d" name="Contributions" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
