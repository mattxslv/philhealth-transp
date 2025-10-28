"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { DataTable } from "@/components/ui/data-table";
import { YearSelector } from "@/components/ui/year-selector";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { AlertCircle, Info, FileText, Calendar, DollarSign, Building, CheckCircle, Clock } from "lucide-react";

// Future enhancement: Procurement contract columns
const procurementColumns: ColumnDef<any>[] = [
  {
    accessorKey: "projectName",
    header: "Project Name",
  },
  {
    accessorKey: "vendor",
    header: "Vendor/Contractor",
  },
  {
    accessorKey: "amount",
    header: "Contract Amount",
    cell: ({ row }) => formatCurrency(row.getValue("amount")),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "awardDate",
    header: "Award Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColors: Record<string, string> = {
        "Awarded": "bg-green-100 text-green-800",
        "Ongoing": "bg-blue-100 text-blue-800",
        "Completed": "bg-gray-100 text-gray-800",
        "Pending": "bg-yellow-100 text-yellow-800",
      };
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
          {status === "Completed" && <CheckCircle className="w-3 h-3 mr-1" />}
          {status === "Ongoing" && <Clock className="w-3 h-3 mr-1" />}
          {status}
        </span>
      );
    },
  },
];

export default function ProcurementPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(2023);

  useEffect(() => {
    axios.get("/data/procurement.json")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading procurement data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading procurement data...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Sample procurement data (template for future use)
  const sampleProcurementData = [
    {
      projectName: "[Future] IT Infrastructure Modernization Phase 2",
      vendor: "Sample Technology Solutions Inc.",
      amount: 850000000,
      category: "IT Services",
      awardDate: "2024-08-15",
      status: "Awarded",
      procurementMethod: "Public Bidding"
    },
    {
      projectName: "[Future] Medical Equipment Procurement - 50 Hospitals",
      vendor: "Sample Medical Supplies Corp.",
      amount: 1250000000,
      category: "Medical Equipment",
      awardDate: "2024-07-20",
      status: "Ongoing",
      procurementMethod: "Public Bidding"
    },
    {
      projectName: "[Future] Office Supplies and Materials (Annual)",
      vendor: "Sample Office Supplies Inc.",
      amount: 125000000,
      category: "Office Supplies",
      awardDate: "2024-01-15",
      status: "Completed",
      procurementMethod: "Public Bidding"
    },
    {
      projectName: "[Future] Regional Office Renovation - Mindanao",
      vendor: "Sample Construction Corp.",
      amount: 450000000,
      category: "Construction",
      awardDate: "2024-06-10",
      status: "Ongoing",
      procurementMethod: "Public Bidding"
    },
  ];

  const procurementCategories = [
    { name: "IT Services", count: 15, totalAmount: 2500000000 },
    { name: "Medical Equipment", count: 8, totalAmount: 1800000000 },
    { name: "Construction", count: 12, totalAmount: 3200000000 },
    { name: "Office Supplies", count: 25, totalAmount: 450000000 },
    { name: "Consulting Services", count: 10, totalAmount: 680000000 },
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

        {/* Data Not Available Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded shadow-sm">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Data Not Available</h3>
              <p className="text-sm text-yellow-800 mb-4">
                {data?.message || "Detailed procurement contract data is not available in the PhilHealth 2023 Annual Report."}
              </p>
              <div className="text-sm text-yellow-700">
                <p className="font-semibold mb-2">For procurement information, please:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Visit the official PhilHealth procurement portal</li>
                  <li>Check the PhilHealth website for public bidding announcements</li>
                  <li>Contact the Procurement Department directly</li>
                  <li>Review the Philippine Government Electronic Procurement System (PhilGEPS)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* About Procurement */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">About PhilHealth Procurement</h3>
          <div className="prose prose-sm text-gray-600 space-y-3">
            <p>
              PhilHealth conducts procurement activities in accordance with the Government Procurement Policy Board (GPPB) 
              rules and regulations. All procurement activities follow transparent and competitive bidding processes.
            </p>
            <p>
              Public bidding opportunities and contract awards are regularly posted on the PhilGEPS portal 
              (Philippine Government Electronic Procurement System) and the PhilHealth official website.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              <strong>Note:</strong> The PhilHealth 2023 Annual Report focuses on financial statements, claims analytics, 
              membership coverage, and governance structure. Detailed procurement contract information is maintained 
              separately through the official procurement channels.
            </p>
          </div>
        </div>

        {/* FUTURE ENHANCEMENT SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Future Enhancement: Procurement Transparency Dashboard</h3>
              <p className="text-sm text-blue-800 mb-4">
                The sections below show templates for what can be added when detailed procurement data becomes available. 
                This would include contract listings, procurement timelines, vendor information, and budget allocations.
              </p>
            </div>
          </div>

          {/* Sample Contract Listing */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Sample Contract Listing (Template)
            </h4>
            <DataTable 
              columns={procurementColumns} 
              data={sampleProcurementData} 
              pageSize={5}
            />
            <p className="text-xs text-gray-500 mt-3 italic">
              * This is a template showing how procurement contracts could be listed with details such as:
              project name, vendor/contractor, contract amount, award date, procurement method, 
              status (Awarded/Ongoing/Completed), completion date, etc.
            </p>
          </div>

          {/* Sample Category Summary */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-md font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Sample Procurement by Category (Template)
            </h4>
            <div className="space-y-3">
              {procurementCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500">{category.count} contracts</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700">{formatCurrency(category.totalAmount)}</p>
                    <p className="text-xs text-gray-500">Total Value</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how procurement data could be categorized by: IT Services, Medical Equipment, 
              Construction, Office Supplies, Consulting Services, Professional Services, Maintenance, etc.
            </p>
          </div>

          {/* Future Features List */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mt-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Potential Future Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Procurement Timeline</p>
                  <p className="text-xs text-gray-600">Bidding schedule and award dates</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Vendor Directory</p>
                  <p className="text-xs text-gray-600">List of accredited suppliers</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Contract Documents</p>
                  <p className="text-xs text-gray-600">Bid documents and awards</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Budget Allocation</p>
                  <p className="text-xs text-gray-600">Annual procurement budget breakdown</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Source */}
        {data?.metadata && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>Data Source:</strong> {data.metadata.source} | 
              <strong> Reporting Period:</strong> {data.metadata.reportingPeriod} | 
              <strong> Note:</strong> {data.metadata.note}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
