"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatNumber } from "@/lib/utils";
import { Building2, Hospital, Users, TrendingUp, MapPin, CheckCircle, AlertCircle, Info } from "lucide-react";

const COLORS = ["#009a3d", "#2e7d32", "#66bb6a", "#4caf50", "#81c784", "#a5d6a7", "#c8e6c9"];

// Future enhancement: Facility columns for detailed listing
const facilityColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Facility Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "level",
    header: "Level",
  },
  {
    accessorKey: "region",
    header: "Region",
  },
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

  useEffect(() => {
    axios.get("/data/facilities-2023.json")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading facilities data:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading facilities data...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Prepare chart data from official 2023 data
  const hospitalsByLevel = [
    { name: "Level 1", value: data.hospitals.byLevel.level1, percentage: 42 },
    { name: "Level 2", value: data.hospitals.byLevel.level2, percentage: 20 },
    { name: "Level 3", value: data.hospitals.byLevel.level3, percentage: 7 },
    { name: "Infirmary", value: data.hospitals.byLevel.infirmary, percentage: 31 },
  ];

  const hospitalsByOwnership = [
    { name: "Private", value: data.hospitals.byOwnership.private.total, percentage: data.hospitals.byOwnership.private.percentage },
    { name: "Government", value: data.hospitals.byOwnership.government.total, percentage: data.hospitals.byOwnership.government.percentage },
  ];

  const otherFacilitiesData = [
    { name: "MCP Providers", value: data.otherAccreditedFacilities.mcpProviders },
    { name: "Dialysis Clinics", value: data.otherAccreditedFacilities.dialysisClinics },
    { name: "Animal Bite Centers", value: data.otherAccreditedFacilities.animalBiteCenters },
    { name: "Konsulta Providers", value: data.otherAccreditedFacilities.konsultaProviders },
    { name: "Ambulatory Surgical", value: data.otherAccreditedFacilities.ambulatorySurgical },
    { name: "HIV/AIDS Centers", value: data.otherAccreditedFacilities.hivAidsCenters },
  ];

  // Future enhancement: Sample facility data (template for when detailed data becomes available)
  const sampleFacilityData = [
    { 
      name: "[Future] Sample Hospital Name",
      type: "Hospital",
      level: "Level 3",
      region: "NCR",
      status: "Active",
      note: "Template for future detailed facility listings"
    },
    { 
      name: "[Future] Sample Dialysis Clinic",
      type: "Dialysis Clinic",
      level: "N/A",
      region: "Region IV-A",
      status: "Active",
      note: "Template for future detailed facility listings"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeading
          title="Healthcare Facilities"
          description="Official facilities data from PhilHealth 2023 Annual Report"
        />

        {/* Official 2023 Statistics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Total Facilities"
            value={formatNumber(data.summary.totalHealthcareFacilities)}
            icon={Building2}
            description="9% increase from 2022"
          />
          <KPIStatCard
            title="Hospitals"
            value={formatNumber(data.summary.totalHospitals)}
            icon={Hospital}
            description="Accredited hospitals"
          />
          <KPIStatCard
            title="Other Facilities"
            value={formatNumber(data.summary.totalOtherFacilities)}
            icon={Building2}
            description="Primary care and specialty"
          />
          <KPIStatCard
            title="Healthcare Professionals"
            value={formatNumber(data.summary.totalHealthcareProfessionals)}
            icon={Users}
            description="Accredited professionals"
          />
        </div>

        {/* Official Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Hospitals by Level"
            description="Distribution of hospitals by classification level"
          >
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hospitalsByLevel}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${entry.percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {hospitalsByLevel.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Hospitals by Ownership"
            description="Private vs Government hospitals"
          >
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hospitalsByOwnership}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                  <Bar dataKey="value" fill="#009a3d" name="Hospitals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ChartCard
          title="Other Accredited Facilities"
          description="Distribution by facility type"
        >
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={otherFacilitiesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis type="category" dataKey="name" fontSize={11} width={150} />
                <Tooltip formatter={(value: any) => formatNumber(value)} />
                <Bar dataKey="value" fill="#009a3d" name="Facilities" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Konsulta Program Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Konsulta Program Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Providers</p>
              <p className="text-2xl font-bold text-green-700">{formatNumber(data.konsultaProgram.totalProviders)}</p>
              <p className="text-xs text-gray-500 mt-1">
                Government: {formatNumber(data.konsultaProgram.governmentProviders)} | 
                Private: {formatNumber(data.konsultaProgram.privateProviders)}
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Coverage</p>
              <p className="text-2xl font-bold text-green-700">{data.konsultaProgram.coverageRate}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatNumber(data.konsultaProgram.lgUsWithProviders)} of {formatNumber(data.konsultaProgram.totalLGUs)} LGUs
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Registrations</p>
              <p className="text-2xl font-bold text-green-700">{formatNumber(data.konsultaProgram.totalRegistrations)}</p>
              <p className="text-xs text-gray-500 mt-1">Benefit Expense: ₱{formatNumber(data.konsultaProgram.benefitExpense)}</p>
            </div>
          </div>
        </div>

        {/* FUTURE ENHANCEMENT SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Future Enhancement: Detailed Facility Directory</h3>
              <p className="text-sm text-blue-800 mb-4">
                The section below shows a template for what can be added when detailed facility data becomes available. 
                This would include facility names, locations, contact information, accreditation status, and services offered.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Facility Listing (Template)</h4>
            <DataTable 
              columns={facilityColumns} 
              data={sampleFacilityData} 
              pageSize={5}
            />
            <p className="text-xs text-gray-500 mt-3 italic">
              * This is a template showing how individual facilities could be listed with details such as:
              facility name, type, level, region, city, address, contact number, accreditation date, 
              status (Active/Inactive), services offered, bed capacity, etc.
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
