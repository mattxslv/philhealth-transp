import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Accredited Facilities",
  description: "Directory of PhilHealth accredited healthcare facilities including hospitals, clinics, and dialysis centers.",
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
import { formatNumber } from "@/lib/utils";
import { FacilityCardSkeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { ExportButton } from "@/components/ui/export-button";
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
  const [error, setError] = useState<{ type: "network" | "notfound" | "generic"; message?: string } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2007);

  const loadData = () => {
    setLoading(true);
    setError(null);
    
    axios.get("/data/facilities-2007.json")
      .then(res => {
        console.log("Facilities data loaded:", res.data);
        if (!res.data) {
          setError({ type: "notfound", message: "Facilities data is not available at this time." });
          setLoading(false);
          return;
        }
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading facilities data:", err);
        if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
          setError({ type: "network", message: "Unable to load facilities data. Please check your connection." });
        } else if (err.response?.status === 404) {
          setError({ type: "notfound", message: "Facilities data file was not found." });
        } else {
          setError({ type: "generic", message: "An unexpected error occurred while loading facilities data." });
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
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
          type={error.type}
          message={error.message}
          onRetry={loadData}
          showHomeButton={true}
        />
      </DashboardLayout>
    );
  }

  if (!data || !data.hospitals) {
    return (
      <DashboardLayout>
        <ErrorMessage
          type="notfound"
          title="No Data Available"
          message="Facilities data is not available at this time."
          showHomeButton={true}
        />
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
        {/* Header with Export */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Accredited Facilities</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Comprehensive list of PhilHealth-accredited healthcare facilities nationwide
            </p>
          </div>
          <ExportButton
            data={data}
            filename={`philhealth-facilities-${selectedYear}`}
          />
        </div>

        {/* Year Selector */}
        <YearSelector
          selectedYear={selectedYear}
          availableYears={[2007]}
          onYearChange={setSelectedYear}
          hasDetailedBreakdown={false}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Facilities */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative"><p className="text-sm font-medium text-muted-foreground mb-2">Total Facilities</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.summary?.totalHealthcareFacilities || 0)}</p>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Accredited nationwide</p>
            </div>
          </div>

          {/* Hospitals */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative"><p className="text-sm font-medium text-muted-foreground mb-2">Hospitals</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.summary?.totalHospitals || 0)}</p>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Hospital facilities</p>
            </div>
          </div>

          {/* Healthcare Professionals */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative"><p className="text-sm font-medium text-muted-foreground mb-2">Healthcare Professionals</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.summary?.totalHealthcareProfessionals || 0)}</p>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Accredited professionals</p>
            </div>
          </div>

          {/* Other Facilities */}
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="relative"><p className="text-sm font-medium text-muted-foreground mb-2">Other Facilities</p>
              <p className="text-2xl sm:text-3xl font-bold mb-2 break-words">{formatNumber(data.summary?.totalOtherFacilities || 0)}</p>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Clinics, centers, etc.</p>
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

        {/* Other Accredited Facilities */}
        {data.otherFacilities && data.otherFacilities.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-4">Other Accredited Facilities</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Beyond hospitals, PhilHealth accredits various healthcare providers and professionals
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.otherFacilities.map((facility: any, index: number) => (
                <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{facility.type}</h3>
                    <Hospital className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {formatNumber(facility.count)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Accredited</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regional Distribution */}
        {data.regionalDistribution && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-4">Regional Distribution</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Hospital facilities across major regions of the Philippines
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.regionalDistribution.byRegion && data.regionalDistribution.byRegion.map((region: any, index: number) => (
                <div key={index} className="p-5 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{region.region}</h3>
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatNumber(region.total)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Hospitals ({region.percentage}%)</p>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">{formatNumber(region.private)}</p>
                        <p className="text-gray-500 dark:text-gray-400">Private</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">{formatNumber(region.government)}</p>
                        <p className="text-gray-500 dark:text-gray-400">Government</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">?? Searchable Database</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Full-text search and filtering capabilities to find accredited hospitals and healthcare providers by name, location, or services.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Search by facility name, region, or city</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Filter by type, level, and ownership</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Sort by distance or rating</span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">?? Contact & Location Details</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Complete contact information and precise addresses for every accredited facility.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Full street addresses with map integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Phone numbers and email addresses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Operating hours and emergency services</span>
                </li>
              </ul>
            </div>

            {/* Services Offered */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">?? Services Offered</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Detailed list of medical services, specialties, and PhilHealth benefit packages available at each facility.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Available medical specialties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>PhilHealth benefit packages covered</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Diagnostic and treatment capabilities</span>
                </li>
              </ul>
            </div>

            {/* Accreditation Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">? Accreditation Status & Quality</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Current accreditation status, validity dates, and quality ratings for transparency and informed choices.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Accreditation validity and expiration dates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Quality assessment scores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Compliance history and certifications</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sample Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700 mb-4">
            <h4 className="text-md font-semibold mb-3 text-gray-700 dark:text-muted-foreground">Preview: Searchable Facility Directory (Template)</h4>
            <DataTable columns={facilityColumns} data={sampleFacilities} pageSize={5} />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
              * Template showing how facilities will be displayed with search, filter, and detailed information
            </p>
          </div>

          <div className="mt-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-300 dark:border-blue-700">
            <p className="text-xs text-blue-800 dark:text-blue-200 italic">
              ?? <strong>Note:</strong> Detailed facility information including addresses, contact details, and services offered requires
              integration with PhilHealth's facility accreditation database. We are coordinating with relevant departments to make this data publicly accessible.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-foreground mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q:</span> How can I verify if my hospital is PhilHealth-accredited?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 pl-6">
                A: You can check the accredited facilities list on this page or contact PhilHealth directly at their hotline. 
                All accredited facilities receive an official certificate and can bill PhilHealth directly for covered services.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-foreground mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q:</span> What are the requirements for facility accreditation?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 pl-6">
                A: Facilities must meet PhilHealth's quality and service standards, including proper licensing, qualified medical staff, 
                required equipment, and adherence to accreditation guidelines. Requirements vary by facility type and service level.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-foreground mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q:</span> Why are there regional differences in facility numbers?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 pl-6">
                A: The distribution of accredited facilities reflects population density, healthcare infrastructure development, 
                and regional healthcare needs. PhilHealth works to expand coverage in underserved areas through various programs.
              </p>
            </div>
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










