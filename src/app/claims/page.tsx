import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Claims Analytics",
  description: "Comprehensive analysis of PhilHealth claims data including processing times, amounts, and trends.",
};

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
import { PageLoadingSkeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { ExportButton } from "@/components/ui/export-button";
import { FAQSection, claimsFAQs } from "@/components/ui/faq";
import { TrendingUp, TrendingDown, DollarSign, Clock, Info, CheckCircle } from "lucide-react";
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
  const [error, setError] = useState<{ type: "network" | "notfound" | "generic"; message?: string } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2007);
  const [previousYearData, setPreviousYearData] = useState<any>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    
    // Load both current and previous year data for trend calculation
    Promise.all([
      axios.get("/data/claims.json"),
      axios.get("/data/claims-2022.json").catch(() => null) // Gracefully handle if 2022 doesn't exist
    ])
      .then(([currentRes, previousRes]) => {
        if (!currentRes.data) {
          setError({ type: "notfound", message: "Claims data is not available at this time." });
          setLoading(false);
          return;
        }
        setData(currentRes.data);
        setPreviousYearData(previousRes?.data || null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading claims data:", err);
        if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
          setError({ type: "network", message: "Unable to load claims data. Please check your connection." });
        } else if (err.response?.status === 404) {
          setError({ type: "notfound", message: "Claims data file was not found." });
        } else {
          setError({ type: "generic", message: "An unexpected error occurred while loading claims data." });
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
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

  // Calculate trends for KPI cards
  const calculateTrend = (current: number, previous: number | undefined) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      direction: change > 0 ? "up" as const : change < 0 ? "down" as const : "neutral" as const,
      label: "vs last year"
    };
  };

  const claimsTrend = calculateTrend(
    data.overview.totalClaims,
    previousYearData?.overview?.totalClaims
  );
  const amountTrend = calculateTrend(
    data.overview.totalAmountPaid,
    previousYearData?.overview?.totalAmountPaid
  );
  const processingTrend = calculateTrend(
    data.overview.averageProcessingDays,
    previousYearData?.overview?.averageProcessingDays
  );
  const approvalRate = (data.overview.approvedClaims / data.overview.totalClaims) * 100;
  const previousApprovalRate = previousYearData?.overview 
    ? (previousYearData.overview.approvedClaims / previousYearData.overview.totalClaims) * 100
    : undefined;
  const approvalTrend = calculateTrend(approvalRate, previousApprovalRate);

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
              `Amount: ?${context.parsed.toFixed(2)}B`,
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
      claimId: "[Future] PH-2007-001234",
      memberName: "Sample Patient A",
      facilityName: "Sample Hospital - NCR",
      claimType: "Inpatient",
      amount: 45000,
      status: "Approved",
    },
    {
      claimId: "[Future] PH-2007-001235",
      memberName: "Sample Patient B",
      facilityName: "Sample Clinic - Region III",
      claimType: "Outpatient",
      amount: 3200,
      status: "Approved",
    },
    {
      claimId: "[Future] PH-2007-001236",
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
        {/* Header with Export */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Claims Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive claims data and insights</p>
          </div>
          <ExportButton
            data={data}
            filename={`philhealth-claims-${selectedYear}`}
            formatData={(data) => {
              return [{
                'Total Claims': data.overview.totalClaims,
                'Total Amount': data.overview.totalAmount,
                'Average Claim': data.overview.averageClaim,
                'Approved Claims': data.overview.approvedClaims,
                'Approval Rate': ((data.overview.approvedClaims / data.overview.totalClaims) * 100).toFixed(2) + '%',
              }];
            }}
          />
        </div>

        {/* Year Selector */}
        <YearSelector
          selectedYear={selectedYear}
          availableYears={[2007]}
          onYearChange={setSelectedYear}
          hasDetailedBreakdown={false}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Claims */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative"><p className="text-sm font-medium text-muted-foreground mb-2">Total Claims</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.overview.totalClaims)}</p>
              
              {/* Trend Indicator */}
              {claimsTrend && (
                <div className="flex items-center gap-1.5 mb-2">
                  {claimsTrend.direction === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : claimsTrend.direction === "down" ? (
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : null}
                  <span className={`text-xs font-semibold ${
                    claimsTrend.direction === "up" ? "text-green-600 dark:text-green-400" : 
                    claimsTrend.direction === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                  }`}>
                    {claimsTrend.direction === "up" ? "+" : claimsTrend.direction === "down" ? "-" : ""}
                    {claimsTrend.value.toFixed(1)}% {claimsTrend.label}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Claims processed in {selectedYear}</p>
            </div>
          </div>

          {/* Total Amount Paid */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative"><p className="text-sm font-medium text-muted-foreground mb-2">Total Amount Paid</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatCurrency(data.overview.totalAmountPaid)}</p>
              
              {/* Trend Indicator */}
              {amountTrend && (
                <div className="flex items-center gap-1.5 mb-2">
                  {amountTrend.direction === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : amountTrend.direction === "down" ? (
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : null}
                  <span className={`text-xs font-semibold ${
                    amountTrend.direction === "up" ? "text-green-600 dark:text-green-400" : 
                    amountTrend.direction === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                  }`}>
                    {amountTrend.direction === "up" ? "+" : amountTrend.direction === "down" ? "-" : ""}
                    {amountTrend.value.toFixed(1)}% {amountTrend.label}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Benefits disbursed</p>
            </div>
          </div>

          {/* Avg Processing Time */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative"><p className="text-sm font-medium text-muted-foreground mb-2">Avg Processing Time</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{data.overview.averageProcessingDays} days</p>
              
              {/* Trend Indicator - Lower is better for processing time */}
              {processingTrend && (
                <div className="flex items-center gap-1.5 mb-2">
                  {processingTrend.direction === "up" ? (
                    <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : processingTrend.direction === "down" ? (
                    <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : null}
                  <span className={`text-xs font-semibold ${
                    processingTrend.direction === "up" ? "text-red-600 dark:text-red-400" : 
                    processingTrend.direction === "down" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                  }`}>
                    {processingTrend.direction === "up" ? "+" : processingTrend.direction === "down" ? "-" : ""}
                    {processingTrend.value.toFixed(1)}% {processingTrend.label}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Turnaround time</p>
            </div>
          </div>

          {/* Approval Rate */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative"><p className="text-sm font-medium text-muted-foreground mb-2">Approval Rate</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{approvalRate.toFixed(1)}%</p>
              
              {/* Trend Indicator */}
              {approvalTrend && (
                <div className="flex items-center gap-1.5 mb-2">
                  {approvalTrend.direction === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : approvalTrend.direction === "down" ? (
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : null}
                  <span className={`text-xs font-semibold ${
                    approvalTrend.direction === "up" ? "text-green-600 dark:text-green-400" : 
                    approvalTrend.direction === "down" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                  }`}>
                    {approvalTrend.direction === "up" ? "+" : approvalTrend.direction === "down" ? "-" : ""}
                    {approvalTrend.value.toFixed(1)}% {approvalTrend.label}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Successfully processed</p>
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

        {/* FAQ Section */}
        <FAQSection faqs={claimsFAQs} />

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










