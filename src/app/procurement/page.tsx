"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { DataTable } from "@/components/ui/data-table";
import { YearSelector } from "@/components/ui/year-selector";
import { ExportButton } from "@/components/ui/export-button";
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
  const [selectedYear, setSelectedYear] = useState<number>(2007);

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
        {/* Header with Export */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Procurement & Contracts</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Procurement activities, awarded contracts, and vendor information
            </p>
          </div>
          <ExportButton
            data={data || sampleProcurementData}
            filename={`philhealth-procurement-${selectedYear}`}
          />
        </div>

        {/* Year Selector */}
        <YearSelector
          selectedYear={selectedYear}
          availableYears={[2007]}
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
                {data?.message || "Detailed procurement contract data is not available in the PhilHealth 2007 Annual Report."}
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
              <strong>Note:</strong> The PhilHealth 2007 Annual Report focuses on financial statements, claims analytics, 
              membership coverage, and governance structure. Detailed procurement contract information is maintained 
              separately through the official procurement channels.
            </p>
          </div>
        </div>

        {/* FUTURE ENHANCEMENT SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Future Enhancements: Procurement Transparency</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                The following features are planned for implementation when procurement data becomes publicly available:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Government Contracts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">?? Government Contracts Database</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Complete listing of all procurement contracts with detailed information and downloadable documents.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Contract titles and descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Award dates and contract durations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Bidding documents and results</span>
                </li>
              </ul>
            </div>

            {/* Contractor Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">?? Contractor/Vendor Information</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Details about winning bidders and accredited suppliers providing goods and services to PhilHealth.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Company names and registration details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Contract award history</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Performance ratings and compliance</span>
                </li>
              </ul>
            </div>

            {/* Contract Amounts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">?? Contract Amounts & Dates</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Financial details including contract values, payment schedules, and important milestone dates.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Original and amended contract amounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Payment disbursement records</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Start, end, and extension dates</span>
                </li>
              </ul>
            </div>

            {/* Procurement by Category */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">?? Procurement by Category</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Breakdown of procurement activities organized by category for better oversight and analysis.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>IT services, medical equipment, construction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Total spending per category</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Year-over-year category trends</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sample Contract Listing */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700 mb-4">
            <h4 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Preview: Contract Listing with Status Tracking (Template)
            </h4>
            <DataTable 
              columns={procurementColumns} 
              data={sampleProcurementData} 
              pageSize={5}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
              * Template showing how contracts will be displayed with: project name, vendor, amount, category, dates, and real-time status
            </p>
          </div>

          <div className="mt-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-300 dark:border-blue-700">
            <p className="text-xs text-blue-800 dark:text-blue-200 italic">
              ?? <strong>Note:</strong> Detailed procurement data is managed by the PhilHealth Procurement Department and is subject to government
              procurement transparency requirements. We are working to integrate this data for public access in compliance with transparency laws.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q:</span> How does PhilHealth ensure transparency in procurement?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 pl-6">
                A: PhilHealth follows the Government Procurement Reform Act and publishes procurement opportunities, 
                bid results, and awarded contracts. All procurement processes undergo rigorous evaluation and are subject 
                to audit by the Commission on Audit (COA).
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q:</span> Can I access detailed information about specific contracts?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 pl-6">
                A: Yes, detailed contract information is available through the PhilHealth Transparency Seal and 
                can be requested via the Freedom of Information (FOI) program. This includes contract amounts, 
                vendors, timelines, and project status.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q:</span> How can vendors participate in PhilHealth procurement?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 pl-6">
                A: Interested vendors should monitor the PhilHealth procurement announcements and Philippine Government 
                Electronic Procurement System (PhilGEPS). Vendors must meet eligibility requirements and submit complete 
                documentation according to the bidding guidelines.
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


