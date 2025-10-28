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
import { FacilityCardSkeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
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
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <FacilityCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage
          type="network"
          title="Failed to Load Facilities"
          message={`Unable to load facilities data: ${error}`}
          onRetry={() => window.location.reload()}
        />
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
          {/* Total Facilities */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-800 p-6 text-white shadow-lg transition-all hover:shadow-xl group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <Building2 className="h-8 w-8 mb-4 opacity-90" />
              <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">Total Facilities</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.summary?.totalHealthcareFacilities || 0)}</p>
              <p className="text-sm text-white/70 dark:text-white/80">Accredited nationwide</p>
            </div>
          </div>

          {/* Hospitals */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 p-6 text-white shadow-lg transition-all hover:shadow-xl group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <Hospital className="h-8 w-8 mb-4 opacity-90" />
              <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">Hospitals</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.summary?.totalHospitals || 0)}</p>
              <p className="text-sm text-white/70 dark:text-white/80">Hospital facilities</p>
            </div>
          </div>

          {/* Healthcare Professionals */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 dark:from-orange-600 dark:to-orange-800 p-6 text-white shadow-lg transition-all hover:shadow-xl group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <Users className="h-8 w-8 mb-4 opacity-90" />
              <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">Healthcare Professionals</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.summary?.totalHealthcareProfessionals || 0)}</p>
              <p className="text-sm text-white/70 dark:text-white/80">Accredited professionals</p>
            </div>
          </div>

          {/* Other Facilities */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 p-6 text-white shadow-lg transition-all hover:shadow-xl group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <MapPin className="h-8 w-8 mb-4 opacity-90" />
              <p className="text-sm font-medium text-white/80 dark:text-white/90 mb-1">Other Facilities</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.summary?.totalOtherFacilities || 0)}</p>
              <p className="text-sm text-white/70 dark:text-white/80">Clinics, centers, etc.</p>
            </div>
          </div>
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

        {/* Future Enhancement Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Future Enhancements: Searchable Facility Directory</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                The following features are planned for implementation to provide comprehensive facility information:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Searchable Database */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">🔍 Searchable Database</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Full-text search and filtering capabilities to find accredited hospitals and healthcare providers by name, location, or services.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Search by facility name, region, or city</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Filter by type, level, and ownership</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Sort by distance or rating</span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">📞 Contact & Location Details</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Complete contact information and precise addresses for every accredited facility.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Full street addresses with map integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Phone numbers and email addresses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Operating hours and emergency services</span>
                </li>
              </ul>
            </div>

            {/* Services Offered */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">🏥 Services Offered</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Detailed list of medical services, specialties, and PhilHealth benefit packages available at each facility.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Available medical specialties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>PhilHealth benefit packages covered</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Diagnostic and treatment capabilities</span>
                </li>
              </ul>
            </div>

            {/* Accreditation Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">✅ Accreditation Status & Quality</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Current accreditation status, validity dates, and quality ratings for transparency and informed choices.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Accreditation validity and expiration dates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Quality assessment scores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Compliance history and certifications</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sample Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700 mb-4">
            <h4 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Preview: Searchable Facility Directory (Template)</h4>
            <DataTable columns={facilityColumns} data={sampleFacilities} pageSize={5} />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
              * Template showing how facilities will be displayed with search, filter, and detailed information
            </p>
          </div>

          <div className="mt-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-300 dark:border-blue-700">
            <p className="text-xs text-blue-800 dark:text-blue-200 italic">
              💡 <strong>Note:</strong> Detailed facility information including addresses, contact details, and services offered requires
              integration with PhilHealth's facility accreditation database. We are coordinating with relevant departments to make this data publicly accessible.
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
