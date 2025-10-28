"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { ChartCard } from "@/components/ui/chart-card";
import { YearSelector } from "@/components/ui/year-selector";
import { formatNumber } from "@/lib/utils";
import { Users, UserCheck, Percent, TrendingUp, Info } from "lucide-react";
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
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const COLORS = ["#009a3d", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function CoveragePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(2023);

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

  const membershipLabels = [
    "Employed Private",
    "Employed Government",
    "Informal Sector",
    "Indigents",
    "Senior Citizens",
    "Sponsored",
    "OFWs"
  ];

  const membershipValues = [
    data.membershipByCategory.directContributors.subcategories.employedPrivate.total,
    data.membershipByCategory.directContributors.subcategories.employedGovernment.total,
    data.membershipByCategory.directContributors.subcategories.informal.total,
    data.membershipByCategory.indirectContributors.subcategories.indigents.total,
    data.membershipByCategory.indirectContributors.subcategories.seniorCitizens.total,
    data.membershipByCategory.indirectContributors.subcategories.sponsored.total,
    data.membershipByCategory.directContributors.subcategories.ofws.total
  ];

  // Pie Chart for Membership
  const pieData = {
    labels: membershipLabels,
    datasets: [{
      data: membershipValues,
      backgroundColor: COLORS,
      borderColor: "#fff",
      borderWidth: 3,
      hoverOffset: 15,
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          padding: 12,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => `${formatNumber(context.parsed)} members`
        }
      }
    }
  };

  // Regional Distribution Bar Chart
  const sampleRegions = [
    { region: "NCR", members: 15234567 },
    { region: "Region IV-A", members: 12345678 },
    { region: "Region III", members: 9876543 },
    { region: "Region VII", members: 8765432 },
    { region: "Region VI", members: 7654321 },
  ];

  const barData = {
    labels: sampleRegions.map(r => r.region),
    datasets: [{
      label: "Registered Members",
      data: sampleRegions.map(r => r.members),
      backgroundColor: "rgba(0, 154, 61, 0.8)",
      borderColor: "rgb(0, 154, 61)",
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const barOptions = {
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
          label: (context: any) => formatNumber(context.parsed.y) + " members"
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            if (value >= 1000000) return (value / 1000000).toFixed(0) + "M";
            return formatNumber(value);
          }
        },
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

  // Historical Growth Line Chart
  const sampleHistory = [
    { year: "2020", members: 95000000 },
    { year: "2021", members: 98500000 },
    { year: "2022", members: 101200000 },
    { year: "2023", members: 106200000 },
    { year: "2024", members: 109500000 },
  ];

  const lineData = {
    labels: sampleHistory.map(h => h.year),
    datasets: [{
      label: "Total Membership Growth",
      data: sampleHistory.map(h => h.members),
      borderColor: "#009a3d",
      backgroundColor: "rgba(0, 154, 61, 0.1)",
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: "#009a3d",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
    }]
  };

  const lineOptions = {
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
          label: (context: any) => formatNumber(context.parsed.y) + " members"
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => (value / 1000000).toFixed(0) + "M"
        },
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
          <KPIStatCard
            title="Total Membership"
            value={formatNumber(data.overview.totalMembership)}
            icon={Users}
            description="Registered members & dependents"
          />
          <KPIStatCard
            title="Direct Contributors"
            value={formatNumber(data.membershipByCategory.directContributors.total)}
            icon={UserCheck}
            description="Employed & self-earning"
          />
          <KPIStatCard
            title="Indirect Contributors"
            value={formatNumber(data.membershipByCategory.indirectContributors.total)}
            icon={Users}
            description="Sponsored & indigents"
          />
          <KPIStatCard
            title="Coverage Rate"
            value="100%"
            icon={Percent}
            description="Universal health coverage"
          />
        </div>

        {/* Membership Breakdown Pie Chart */}
        <ChartCard
          title="Membership by Category"
          description="Distribution of members across different enrollment categories"
        >
          <div className="h-[400px]">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </ChartCard>

        {/* FUTURE ENHANCEMENT SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Future Enhancement: Regional & Historical Data</h3>
              <p className="text-sm text-blue-800 mb-4">
                The sections below show templates for regional distribution and historical growth trends when detailed data becomes available.
              </p>
            </div>
          </div>

          {/* Regional Distribution */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Regional Distribution (Template)</h4>
            <div className="h-[300px]">
              <Bar data={barData} options={barOptions} />
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * Bar chart template showing top 5 regions by membership
            </p>
          </div>

          {/* Historical Trends */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Historical Growth (Template)</h4>
            <div className="h-[300px]">
              <Line data={lineData} options={lineOptions} />
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * Line chart template showing membership growth over years
            </p>
          </div>

          {/* Sample Enrollment Patterns */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Enrollment Patterns (Template)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-1">New Enrollments</p>
                <p className="text-2xl font-bold text-green-600">2.5M</p>
                <p className="text-xs text-gray-500 mt-1"> 12% from last year</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Renewals</p>
                <p className="text-2xl font-bold text-blue-600">94.3M</p>
                <p className="text-xs text-gray-500 mt-1">96% retention rate</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Active Members</p>
                <p className="text-2xl font-bold text-purple-600">103.8M</p>
                <p className="text-xs text-gray-500 mt-1">98% of total</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * Template showing enrollment statistics and trends
            </p>
          </div>
        </div>

        {/* Data Source */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-800">
            <strong>Data Source:</strong> {data.metadata.source} | 
            <strong> Reporting Period:</strong> {data.metadata.reportingPeriod}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
