"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { ChartCard } from "@/components/ui/chart-card";
import { formatNumber } from "@/lib/utils";
import { Users, UserCheck, Percent, TrendingUp, Info } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#009a3d", "#2e7d32", "#66bb6a", "#4caf50", "#81c784", "#a5d6a7", "#c8e6c9"];

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

  const membershipData = [
    { name: "Employed Private", value: data.membershipByCategory.directContributors.subcategories.employedPrivate.total },
    { name: "Employed Government", value: data.membershipByCategory.directContributors.subcategories.employedGovernment.total },
    { name: "Informal Sector", value: data.membershipByCategory.directContributors.subcategories.informal.total },
    { name: "Indigents", value: data.membershipByCategory.indirectContributors.subcategories.indigents.total },
    { name: "Senior Citizens", value: data.membershipByCategory.indirectContributors.subcategories.seniorCitizens.total },
    { name: "Sponsored", value: data.membershipByCategory.indirectContributors.subcategories.sponsored.total },
    { name: "OFWs", value: data.membershipByCategory.directContributors.subcategories.ofws.total }
  ];

  const contributorTypeData = [
    { name: "Direct Contributors", value: data.membershipByCategory.directContributors.total, percentage: data.membershipByCategory.directContributors.percentage },
    { name: "Indirect Contributors", value: data.membershipByCategory.indirectContributors.total, percentage: data.membershipByCategory.indirectContributors.percentage }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeading
          title="Membership Coverage"
          description="Official membership data from PhilHealth 2023 Annual Report"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Total Beneficiaries"
            value={formatNumber(data.overview.totalBeneficiaries)}
            icon={Users}
            description="Registered beneficiaries in 2023"
          />
          <KPIStatCard
            title="Registered Members"
            value={formatNumber(data.overview.registeredMembers)}
            icon={UserCheck}
            description="Primary members"
          />
          <KPIStatCard
            title="Coverage Rate"
            value="100%"
            icon={Percent}
            description="Of Philippine population"
          />
          <KPIStatCard
            title="Registration Rate"
            value="96%"
            icon={TrendingUp}
            description="Of target population"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Membership by Category"
            description="Distribution of members across different categories"
          >
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={membershipData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <YAxis type="category" dataKey="name" fontSize={11} width={140} />
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                  <Bar dataKey="value" fill="#009a3d" name="Members" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Direct vs Indirect Contributors"
            description="Distribution by contributor type"
          >
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contributorTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${entry.percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contributorTypeData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Direct Contributors Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Employed Private</span>
                <span className="font-semibold">{formatNumber(data.membershipByCategory.directContributors.subcategories.employedPrivate.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Employed Government</span>
                <span className="font-semibold">{formatNumber(data.membershipByCategory.directContributors.subcategories.employedGovernment.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Informal Sector</span>
                <span className="font-semibold">{formatNumber(data.membershipByCategory.directContributors.subcategories.informal.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">OFWs</span>
                <span className="font-semibold">{formatNumber(data.membershipByCategory.directContributors.subcategories.ofws.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lifetime Members</span>
                <span className="font-semibold">{formatNumber(data.membershipByCategory.directContributors.subcategories.lifetimeMembers.total)}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Indirect Contributors Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Indigents</span>
                <span className="font-semibold">{formatNumber(data.membershipByCategory.indirectContributors.subcategories.indigents.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Senior Citizens</span>
                <span className="font-semibold">{formatNumber(data.membershipByCategory.indirectContributors.subcategories.seniorCitizens.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sponsored</span>
                <span className="font-semibold">{formatNumber(data.membershipByCategory.indirectContributors.subcategories.sponsored.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* FUTURE ENHANCEMENT SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Future Enhancement: Advanced Coverage Analytics</h3>
              <p className="text-sm text-blue-800 mb-4">
                The sections below show templates for what can be added when more detailed coverage data becomes available. 
                This would include regional distribution, historical trends, demographic breakdowns, and contribution patterns.
              </p>
            </div>
          </div>

          {/* Sample Regional Distribution */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Regional Distribution (Template)</h4>
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { region: "[Future] NCR", members: 9500000, coverage: 98 },
                    { region: "[Future] Region III", members: 6200000, coverage: 96 },
                    { region: "[Future] Region IV-A", members: 8100000, coverage: 97 },
                    { region: "[Future] Region VII", members: 4800000, coverage: 95 },
                    { region: "[Future] Region XI", members: 3200000, coverage: 94 },
                  ]}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis type="category" dataKey="region" fontSize={11} width={120} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="members" fill="#009a3d" name="Members" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how membership could be visualized by region with coverage percentages, 
              helping identify areas needing increased enrollment efforts.
            </p>
          </div>

          {/* Sample Historical Trends */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Historical Trends (Template)</h4>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { year: "2020", members: 58000000, beneficiaries: 102000000 },
                    { year: "2021", members: 59500000, beneficiaries: 104000000 },
                    { year: "2022", members: 61000000, beneficiaries: 106500000 },
                    { year: "2023", members: 62200000, beneficiaries: 108500000 },
                    { year: "[Future] 2024", members: 64000000, beneficiaries: 110000000 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="members" stroke="#009a3d" strokeWidth={2} name="Members" />
                  <Line type="monotone" dataKey="beneficiaries" stroke="#3b82f6" strokeWidth={2} name="Beneficiaries" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how membership growth trends could be tracked over time, 
              including year-over-year comparisons and growth rate analysis.
            </p>
          </div>

          {/* Sample Monthly Contributions */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Monthly Enrollment Patterns (Template)</h4>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: "Jan", newMembers: 125000, renewals: 890000 },
                    { month: "Feb", newMembers: 118000, renewals: 850000 },
                    { month: "Mar", newMembers: 142000, renewals: 920000 },
                    { month: "Apr", newMembers: 135000, renewals: 885000 },
                    { month: "May", newMembers: 150000, renewals: 910000 },
                    { month: "Jun", newMembers: 128000, renewals: 875000 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="newMembers" stroke="#009a3d" strokeWidth={2} name="New Members" />
                  <Line type="monotone" dataKey="renewals" stroke="#f59e0b" strokeWidth={2} name="Renewals" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how monthly enrollment patterns could be analyzed, 
              tracking new member registrations, renewals, and seasonal trends.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-800">
            <strong>Data Source:</strong> {data.metadata.source} | 
            <strong> Reporting Period:</strong> {data.metadata.reportingPeriod} | 
            <strong> Population Covered:</strong> {formatNumber(data.overview.populationCovered)} Filipinos
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
