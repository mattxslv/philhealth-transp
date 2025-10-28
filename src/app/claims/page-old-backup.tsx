"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { BarChart, Bar, AreaChart, Area, Treemap, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, Users, DollarSign, Clock, Info, Activity, Target } from "lucide-react";
import ReactECharts from "echarts-for-react";

const COLORS = ["#009a3d", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

// Future enhancement: Sample claims columns
const sampleClaimsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "claimId",
    header: "Claim ID",
  },
  {
    accessorKey: "memberName",
    header: "Member Name",
  },
  {
    accessorKey: "facilityName",
    header: "Facility",
  },
  {
    accessorKey: "claimType",
    header: "Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.getValue("amount")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          status === "Approved" ? "bg-green-100 text-green-800" : 
          status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
          "bg-red-100 text-red-800"
        }`}>
          {status}
        </span>
      );
    },
  },
];

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

  // Prepare official membership category data for chart
  const membershipData = [
    {
      name: "Employed Private",
      amount: data.byMembershipCategory.directContributors.breakdown.employedPrivate.amount,
      count: data.byMembershipCategory.directContributors.breakdown.employedPrivate.count
    },
    {
      name: "Employed Government",
      amount: data.byMembershipCategory.directContributors.breakdown.employedGovernment.amount,
      count: data.byMembershipCategory.directContributors.breakdown.employedGovernment.count
    },
    {
      name: "Informal/Self-Earning",
      amount: data.byMembershipCategory.directContributors.breakdown.informalSelfEarning.amount,
      count: data.byMembershipCategory.directContributors.breakdown.informalSelfEarning.count
    },
    {
      name: "Indigents",
      amount: data.byMembershipCategory.indirectContributors.breakdown.indigents.amount,
      count: data.byMembershipCategory.indirectContributors.breakdown.indigents.count
    },
    {
      name: "Senior Citizens",
      amount: data.byMembershipCategory.indirectContributors.breakdown.seniorCitizens.amount,
      count: data.byMembershipCategory.indirectContributors.breakdown.seniorCitizens.count
    },
    {
      name: "Sponsored",
      amount: data.byMembershipCategory.indirectContributors.breakdown.sponsored.amount,
      count: data.byMembershipCategory.indirectContributors.breakdown.sponsored.count
    },
    {
      name: "Lifetime Members",
      amount: data.byMembershipCategory.directContributors.breakdown.lifetimeMembers.amount,
      count: data.byMembershipCategory.directContributors.breakdown.lifetimeMembers.count
    },
    {
      name: "OFWs",
      amount: data.byMembershipCategory.directContributors.breakdown.ofws.amount,
      count: data.byMembershipCategory.directContributors.breakdown.ofws.count
    }
  ];

  // COVID vs Non-COVID data
  const covidData = [
    {
      name: "Non-COVID Claims",
      amount: data.covidAnalysis.totalNonCovidClaims.amount,
      count: data.covidAnalysis.totalNonCovidClaims.count,
      percentage: data.covidAnalysis.totalNonCovidClaims.amountPercentage
    },
    {
      name: "COVID Claims",
      amount: data.covidAnalysis.totalCovidClaims.amount,
      count: data.covidAnalysis.totalCovidClaims.count,
      percentage: data.covidAnalysis.totalCovidClaims.amountPercentage
    }
  ];

  // Illness type data
  const illnessTypeData = [
    {
      name: "Procedural",
      percentage: data.byIllnessType.procedural.percentage,
      count: data.byIllnessType.procedural.count
    },
    {
      name: "Medical",
      percentage: data.byIllnessType.medical.percentage,
      count: data.byIllnessType.medical.count
    }
  ];

  // Sector data
  const sectorData = [
    {
      name: "Private",
      percentage: data.bySector.private.percentage,
      count: data.bySector.private.count
    },
    {
      name: "Government",
      percentage: data.bySector.government.percentage,
      count: data.bySector.government.count
    }
  ];

  // Sample future data - Monthly trends
  const sampleMonthlyTrends = [
    { month: "Jan", claims: 1056000, approved: 1003000, denied: 53000, avgDays: 58 },
    { month: "Feb", claims: 980000, approved: 932000, denied: 48000, avgDays: 59 },
    { month: "Mar", claims: 1120000, approved: 1066000, denied: 54000, avgDays: 57 },
    { month: "Apr", claims: 1050000, approved: 999000, denied: 51000, avgDays: 60 },
    { month: "May", claims: 1089000, approved: 1036000, denied: 53000, avgDays: 58 },
    { month: "Jun", claims: 1045000, approved: 994000, denied: 51000, avgDays: 59 },
  ];

  // Sample denial reasons
  const sampleDenialReasons = [
    { reason: "Incomplete Documentation", count: 125000, percentage: 38.5 },
    { reason: "Non-covered Benefit", count: 91000, percentage: 28.1 },
    { reason: "Exceeded Benefit Limit", count: 65000, percentage: 20.0 },
    { reason: "Expired Coverage", count: 32000, percentage: 9.8 },
    { reason: "Other", count: 12000, percentage: 3.7 },
  ];

  // Sample claims data
  const sampleClaimsData = [
    {
      claimId: "[Future] PH-2023-001234",
      memberName: "Sample Patient A",
      facilityName: "Sample Hospital - NCR",
      claimType: "Inpatient",
      amount: 45000,
      status: "Approved",
      dateSubmitted: "2023-08-15",
    },
    {
      claimId: "[Future] PH-2023-001235",
      memberName: "Sample Patient B",
      facilityName: "Sample Clinic - Region III",
      claimType: "Outpatient",
      amount: 3200,
      status: "Approved",
      dateSubmitted: "2023-08-14",
    },
    {
      claimId: "[Future] PH-2023-001236",
      memberName: "Sample Patient C",
      facilityName: "Sample Hospital - Region IV-A",
      claimType: "Inpatient",
      amount: 125000,
      status: "Pending",
      dateSubmitted: "2023-08-13",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeading
          title="Claims Analytics"
          description="Official claims data from PhilHealth 2023 Annual Report"
        />

        {/* Official 2023 Statistics - KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Total Claims"
            value={formatNumber(data.overview.totalClaims)}
            icon={TrendingUp}
            description="Claims processed in 2023"
          />
          <KPIStatCard
            title="Total Amount Paid"
            value={formatCurrency(data.overview.totalAmountPaid)}
            icon={DollarSign}
            description="Benefits disbursed"
          />
          <KPIStatCard
            title="Avg Processing Time"
            value={`${data.overview.averageProcessingDays} days`}
            icon={Clock}
            description="Turnaround time"
          />
          <KPIStatCard
            title="Benefit Expense"
            value={formatCurrency(data.overview.benefitExpense)}
            icon={DollarSign}
            description="After IBNP adjustment"
          />
        </div>

        {/* Official Charts - Claims by Membership Category */}
        <ChartCard
          title="Claims by Membership Category"
          description="Distribution of claims across different member types (Official 2023 Data)"
        >
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={membershipData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} tickFormatter={(value) => formatCurrency(value)} />
                <YAxis type="category" dataKey="name" fontSize={11} width={160} />
                <Tooltip formatter={(value: any, name: string) => [name === "amount" ? formatCurrency(value) : formatNumber(value), name === "amount" ? "Amount" : "Count"]} />
                <Legend wrapperStyle={{ fontSize: `12px` }} />
                <Bar dataKey="amount" fill="#009a3d" name="Amount Paid" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Official Charts - COVID vs Non-COVID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="COVID vs Non-COVID Claims"
            description="Breakdown of COVID-related and non-COVID claims"
          >
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={covidData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {covidData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Claims by Illness Type"
            description="Procedural vs Medical claims distribution"
          >
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={illnessTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {illnessTypeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index + 2]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Official Charts - Sector Distribution */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Claims by Sector"
            description="Private vs Government sector distribution"
          >
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {sectorData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index + 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Claims by Age Group"
            description="Distribution of claims across different age brackets"
          >
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byAgeGroup.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageRange" fontSize={10} />
                  <YAxis fontSize={12} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                  <Bar dataKey="count" fill="#009a3d" name="Claims" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Demographics Summary */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Patient Type Distribution</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member</span>
                <span className="font-semibold">{data.byPatientType.member.percentage}% ({formatNumber(data.byPatientType.member.count)} claims)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dependent</span>
                <span className="font-semibold">{data.byPatientType.dependent.percentage}% ({formatNumber(data.byPatientType.dependent.count)} claims)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Sex Distribution</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Female</span>
                <span className="font-semibold">{data.bySex.female.percentage}% ({formatNumber(data.bySex.female.count)} claims)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Male</span>
                <span className="font-semibold">{data.bySex.male.percentage}% ({formatNumber(data.bySex.male.count)} claims)</span>
              </div>
            </div>
          </div>
        </div>

        {/* FUTURE ENHANCEMENT SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Future Enhancement: Detailed Claims Analytics</h3>
              <p className="text-sm text-blue-800 mb-4">
                The sections below show templates for what can be added when more detailed claims data becomes available. 
                This would include monthly trends, denial analysis, individual claim tracking, and real-time processing metrics.
              </p>
            </div>
          </div>

          {/* Sample Monthly Trends */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Monthly Trends (Template)</h4>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleMonthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                  <Legend wrapperStyle={{ fontSize: `12px` }} />
                  <Line type="monotone" dataKey="claims" stroke="#009a3d" strokeWidth={2} name="Total Claims" />
                  <Line type="monotone" dataKey="approved" stroke="#3b82f6" strokeWidth={2} name="Approved" />
                  <Line type="monotone" dataKey="denied" stroke="#ef4444" strokeWidth={2} name="Denied" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how monthly claims trends could be tracked with metrics like total claims, 
              approval rates, denial rates, and processing times month-over-month.
            </p>
          </div>

          {/* Sample Denial Reasons */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Denial Reasons Analysis (Template)</h4>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sampleDenialReasons}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.reason.split(' ')[0]}: ${entry.percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {sampleDenialReasons.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how denial reasons could be categorized and analyzed to identify common issues 
              and improve documentation processes.
            </p>
          </div>

          {/* Sample Claims Table */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Individual Claims Tracking (Template)</h4>
            <DataTable 
              columns={sampleClaimsColumns} 
              data={sampleClaimsData} 
              pageSize={5}
            />
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how individual claims could be tracked with details such as: claim ID, 
              member name, facility, claim type, amount, status, submission date, processing time, 
              and assigned reviewer.
            </p>
          </div>
        </div>

        {/* Data Source */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-800">
            <strong>Data Source:</strong> {data.metadata.source} | 
            <strong> Reporting Period:</strong> {data.metadata.reportingPeriod} | 
            <strong> Note:</strong> {data.overview.notes}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
