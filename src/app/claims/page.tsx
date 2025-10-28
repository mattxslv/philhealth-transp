"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { DataTable } from "@/components/ui/data-table";
import { YearSelector } from "@/components/ui/year-selector";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, DollarSign, Clock, Info, CheckCircle } from "lucide-react";
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
  RadialLinearScale,
} from "chart.js";
import { Doughnut, Bar, Line, PolarArea, Radar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const COLORS = ["#009a3d", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

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
  const [selectedYear, setSelectedYear] = useState<number>(2023);

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

  // Membership data for charts
  const membershipLabels = [
    "Employed Private",
    "Employed Govt",
    "Informal",
    "Indigents",
    "Senior Citizens",
    "Sponsored"
  ];
  
  const membershipValues = [
    data.byMembershipCategory.directContributors.breakdown.employedPrivate.amount / 1000000000,
    data.byMembershipCategory.directContributors.breakdown.employedGovernment.amount / 1000000000,
    data.byMembershipCategory.directContributors.breakdown.informalSelfEarning.amount / 1000000000,
    data.byMembershipCategory.indirectContributors.breakdown.indigents.amount / 1000000000,
    data.byMembershipCategory.indirectContributors.breakdown.seniorCitizens.amount / 1000000000,
    data.byMembershipCategory.indirectContributors.breakdown.sponsored.amount / 1000000000,
  ];

  const membershipCounts = [
    data.byMembershipCategory.directContributors.breakdown.employedPrivate.count,
    data.byMembershipCategory.directContributors.breakdown.employedGovernment.count,
    data.byMembershipCategory.directContributors.breakdown.informalSelfEarning.count,
    data.byMembershipCategory.indirectContributors.breakdown.indigents.count,
    data.byMembershipCategory.indirectContributors.breakdown.seniorCitizens.count,
    data.byMembershipCategory.indirectContributors.breakdown.sponsored.count,
  ];

  // Doughnut Chart for Membership Distribution
  const doughnutData = {
    labels: membershipLabels,
    datasets: [{
      label: "Claims Amount (B)",
      data: membershipValues,
      backgroundColor: COLORS,
      borderColor: "#fff",
      borderWidth: 3,
      hoverOffset: 15,
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        onClick: (e: any, legendItem: any, legend: any) => {
          const index = legendItem.index;
          const chart = legend.chart;
          const meta = chart.getDatasetMeta(0);
          
          meta.data[index].hidden = !meta.data[index].hidden;
          chart.update();
        },
        labels: {
          padding: 15,
          font: { size: 12 },
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (!data.datasets.length) return [];
            const meta = chart.getDatasetMeta(0);
            
            return data.labels.map((label: string, i: number) => ({
              text: `${label}: ${membershipValues[i].toFixed(2)}B`,
              fillStyle: COLORS[i],
              hidden: meta.data[i]?.hidden || false,
              index: i,
              strokeStyle: COLORS[i],
              lineWidth: 2
            }));
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 14, weight: "bold" as const },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context: any) => {
            return [
              `Amount: ₱${context.parsed.toFixed(2)}B`,
              `Claims: ${formatNumber(membershipCounts[context.dataIndex])}`
            ];
          }
        }
      }
    }
  };

  // Polar Area Chart for Age Distribution
  const ageData = data.byAgeGroup.slice(0, 8);
  const polarData = {
    labels: ageData.map((item: any) => item.ageRange),
    datasets: [{
      label: "Claims by Age",
      data: ageData.map((item: any) => item.count),
      backgroundColor: COLORS.map(color => color + "CC"),
      borderColor: COLORS,
      borderWidth: 2,
    }]
  };

  const polarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { 
          padding: 10,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => `${formatNumber(context.parsed.r)} claims`
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          display: false
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)"
        }
      }
    }
  };

  // Horizontal Bar Chart for Processing Flow
  const flowData = {
    labels: ["Claims Submitted", "Under Review", "Approved", "Pending"],
    datasets: [{
      label: "Amount (B)",
      data: [12.68, 12.68, 12.04, 0.64],
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(6, 182, 212, 0.8)",
        "rgba(0, 154, 61, 0.8)",
        "rgba(245, 158, 11, 0.8)",
      ],
      borderColor: [
        "rgb(59, 130, 246)",
        "rgb(6, 182, 212)",
        "rgb(0, 154, 61)",
        "rgb(245, 158, 11)",
      ],
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const flowOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => `${context.parsed.x.toFixed(2)}B`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        },
        ticks: {
          callback: (value: any) => `${value}B`
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  // Sample Monthly Trends
  const sampleMonthlyTrends = [
    { month: "Jan", claims: 1056, approved: 1003, denied: 53 },
    { month: "Feb", claims: 980, approved: 932, denied: 48 },
    { month: "Mar", claims: 1120, approved: 1066, denied: 54 },
    { month: "Apr", claims: 1050, approved: 999, denied: 51 },
    { month: "May", claims: 1089, approved: 1036, denied: 53 },
    { month: "Jun", claims: 1045, approved: 994, denied: 51 },
  ];

  const lineData = {
    labels: sampleMonthlyTrends.map(d => d.month),
    datasets: [
      {
        label: "Total Claims (000s)",
        data: sampleMonthlyTrends.map(d => d.claims),
        borderColor: "#009a3d",
        backgroundColor: "rgba(0, 154, 61, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#009a3d",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Approved (000s)",
        data: sampleMonthlyTrends.map(d => d.approved),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          padding: 15,
          font: { size: 12 },
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        mode: "index" as const,
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const sampleClaimsData = [
    {
      claimId: "[Future] PH-2023-001234",
      memberName: "Sample Patient A",
      facilityName: "Sample Hospital - NCR",
      claimType: "Inpatient",
      amount: 45000,
      status: "Approved",
    },
    {
      claimId: "[Future] PH-2023-001235",
      memberName: "Sample Patient B",
      facilityName: "Sample Clinic - Region III",
      claimType: "Outpatient",
      amount: 3200,
      status: "Approved",
    },
    {
      claimId: "[Future] PH-2023-001236",
      memberName: "Sample Patient C",
      facilityName: "Sample Hospital - Region IV-A",
      claimType: "Inpatient",
      amount: 125000,
      status: "Pending",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Year Selector */}
        <YearSelector
          selectedYear={selectedYear}
          availableYears={[2023]}
          onYearChange={setSelectedYear}
          hasDetailedBreakdown={false}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Claims */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-800 p-6 text-white shadow-lg transition-all hover:shadow-xl group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <TrendingUp className="h-8 w-8 mb-4 opacity-90" />
              <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">Total Claims</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.overview.totalClaims)}</p>
              <p className="text-sm text-white/70 dark:text-white/80">Claims processed in {selectedYear}</p>
            </div>
          </div>

          {/* Total Amount Paid */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 p-6 text-white shadow-lg transition-all hover:shadow-xl group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <DollarSign className="h-8 w-8 mb-4 opacity-90" />
              <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">Total Amount Paid</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatCurrency(data.overview.totalAmountPaid)}</p>
              <p className="text-sm text-white/70 dark:text-white/80">Benefits disbursed</p>
            </div>
          </div>

          {/* Avg Processing Time */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 dark:from-orange-600 dark:to-orange-800 p-6 text-white shadow-lg transition-all hover:shadow-xl group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <Clock className="h-8 w-8 mb-4 opacity-90" />
              <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">Avg Processing Time</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{data.overview.averageProcessingDays} days</p>
              <p className="text-sm text-white/70 dark:text-white/80">Turnaround time</p>
            </div>
          </div>

          {/* Approval Rate */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 p-6 text-white shadow-lg transition-all hover:shadow-xl group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <CheckCircle className="h-8 w-8 mb-4 opacity-90" />
              <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">Approval Rate</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">95%</p>
              <p className="text-sm text-white/70 dark:text-white/80">Successfully processed</p>
            </div>
          </div>
        </div>

        {/* Charts Row 1: Doughnut and Polar Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Claims by Membership Category"
            description="Distribution of claim amounts across different member types"
          >
            <div className="h-[400px]">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </ChartCard>

          <ChartCard
            title="Claims by Age Group"
            description="Polar area chart showing claim volume across age brackets"
          >
            <div className="h-[400px]">
              <PolarArea data={polarData} options={polarOptions} />
            </div>
          </ChartCard>
        </div>

        {/* Horizontal Bar Chart for Flow */}
        <ChartCard
          title="Claims Processing Flow"
          description="Horizontal bar chart showing progression through processing stages"
        >
          <div className="h-[350px]">
            <Bar data={flowData} options={flowOptions} />
          </div>
        </ChartCard>

        {/* Demographics Summary Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Patient Type</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${data.byPatientType.member.percentage}%` }}></div>
                  </div>
                  <span className="font-bold text-blue-600">{data.byPatientType.member.percentage}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dependent</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${data.byPatientType.dependent.percentage}%` }}></div>
                  </div>
                  <span className="font-bold text-green-600">{data.byPatientType.dependent.percentage}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-lg shadow-md border border-purple-100 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Sex Distribution</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Female</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${data.bySex.female.percentage}%` }}></div>
                  </div>
                  <span className="font-bold text-purple-600">{data.bySex.female.percentage}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Male</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${data.bySex.male.percentage}%` }}></div>
                  </div>
                  <span className="font-bold text-indigo-600">{data.bySex.male.percentage}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Illness Type</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Procedural</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${data.byIllnessType.procedural.percentage}%` }}></div>
                  </div>
                  <span className="font-bold text-green-600">{data.byIllnessType.procedural.percentage}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Medical</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${data.byIllnessType.medical.percentage}%` }}></div>
                  </div>
                  <span className="font-bold text-teal-600">{data.byIllnessType.medical.percentage}%</span>
                </div>
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
              </p>
            </div>
          </div>

          {/* Sample Monthly Trends */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Monthly Trends (Template)</h4>
            <div className="h-[300px]">
              <Line data={lineData} options={lineOptions} />
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * Line chart template with smooth curves and interactive tooltips
            </p>
          </div>

          {/* Sample Claims Table */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Individual Claims Tracking (Template)</h4>
            <DataTable columns={sampleClaimsColumns} data={sampleClaimsData} pageSize={5} />
            <p className="text-xs text-gray-500 mt-3 italic">
              * Template showing how individual claims could be tracked with detailed information
            </p>
          </div>
        </div>

        {/* Data Source */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-emerald-500 dark:border-emerald-400 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              <strong>Data Source:</strong> PhilHealth Annual Report {selectedYear} (Official Audited Data) | 
              <strong> Last Updated:</strong> December 31, {selectedYear}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
