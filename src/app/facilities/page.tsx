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
import { formatNumber } from "@/lib/utils";
import { Building2, Hospital, Users, MapPin, CheckCircle, AlertCircle, Info } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = ["#009a3d", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

const facilityColumns: ColumnDef<any>[] = [
  { accessorKey: "name", header: "Facility Name" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "level", header: "Level" },
  { accessorKey: "region", header: "Region" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}>
          {status === "Active" ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
          {status}
        </span>
      );
    },
  },
];

export default function FacilitiesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2023);

  useEffect(() => {
    axios.get("/data/facilities-2023.json")
      .then(res => {
        console.log("Facilities data loaded:", res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading facilities data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading facilities data...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-red-600">Error loading data: {error}</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data || !data.hospitals) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-yellow-600">No facilities data available</div>
        </div>
      </DashboardLayout>
    );
  }

  // Facility Type Doughnut Chart
  const typeData = {
    labels: ['Government', 'Private'],
    datasets: [{
      data: [
        data.hospitals?.byOwnership?.government?.count || 0,
        data.hospitals?.byOwnership?.private?.count || 0
      ],
      backgroundColor: COLORS,
      borderColor: "#fff",
      borderWidth: 3,
      hoverOffset: 15,
    }]
  };

  const typeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: { padding: 12, font: { size: 11 } }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => `${formatNumber(context.parsed)} facilities`
        }
      }
    }
  };

  // Hospital Level Bar Chart
  const levelData = {
    labels: ['Level 1', 'Level 2', 'Level 3'],
    datasets: [{
      label: "Facilities",
      data: [
        data.hospitals?.byLevel?.level1?.total || 0,
        data.hospitals?.byLevel?.level2?.total || 0,
        data.hospitals?.byLevel?.level3?.total || 0
      ],
      backgroundColor: "rgba(0, 154, 61, 0.8)",
      borderColor: "rgb(0, 154, 61)",
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const levelOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => formatNumber(context.parsed.y) + " facilities"
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  const sampleFacilities = [
    { name: "[Future] Philippine General Hospital", type: "Hospital", level: "Tertiary", region: "NCR", status: "Active" },
    { name: "[Future] Lung Center of the Philippines", type: "Hospital", level: "Tertiary", region: "NCR", status: "Active" },
    { name: "[Future] National Kidney Institute", type: "Hospital", level: "Tertiary", region: "NCR", status: "Active" },
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Total Facilities"
            value={formatNumber(data.summary?.totalHealthcareFacilities || 0)}
            icon={Building2}
            description="Accredited nationwide"
          />
          <KPIStatCard
            title="Hospitals"
            value={formatNumber(data.summary?.totalHospitals || 0)}
            icon={Hospital}
            description="Hospital facilities"
          />
          <KPIStatCard
            title="Healthcare Professionals"
            value={formatNumber(data.summary?.totalHealthcareProfessionals || 0)}
            icon={Users}
            description="Accredited professionals"
          />
          <KPIStatCard
            title="Other Facilities"
            value={formatNumber(data.summary?.totalOtherFacilities || 0)}
            icon={MapPin}
            description="Clinics, centers, etc."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Facilities by Type" description="Distribution across healthcare facility categories">
            <div className="h-[350px]">
              <Doughnut data={typeData} options={typeOptions} />
            </div>
          </ChartCard>

          <ChartCard title="Hospitals by Level" description="Classification of hospital facilities">
            <div className="h-[350px]">
              <Bar data={levelData} options={levelOptions} />
            </div>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-lg shadow-md border border-green-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Konsulta Program</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">{formatNumber(data.konsultaProgram?.totalProviders || 0)}</p>
            <p className="text-sm text-gray-600">Facilities ({data.konsultaProgram?.coverageRate || 0}%)</p>
          </div>
          <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg shadow-md border border-blue-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">TB-DOTS</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">{formatNumber(data.tbDotsProgram?.totalProviders || 0)}</p>
            <p className="text-sm text-gray-600">Facilities ({data.tbDotsProgram?.coverageRate || 0}%)</p>
          </div>
          <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-lg shadow-md border border-purple-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">MCP</h3>
            <p className="text-3xl font-bold text-purple-600 mb-2">{formatNumber(data.mcpProgram?.totalProviders || 0)}</p>
            <p className="text-sm text-gray-600">Facilities ({data.mcpProgram?.coverageRate || 0}%)</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Future Enhancement: Facility Directory</h3>
              <p className="text-sm text-blue-800 mb-4">
                The section below shows a template for searchable facility listings when detailed data becomes available.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Facility Listing (Template)</h4>
            <DataTable columns={facilityColumns} data={sampleFacilities} pageSize={5} />
            <p className="text-xs text-gray-500 mt-3 italic">
              * Template showing how facilities could be listed with search and filter capabilities
            </p>
          </div>
        </div>

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
