"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { StatusChip } from "@/components/ui/status-chip";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileCheck, DollarSign, TrendingUp, FileText } from "lucide-react";

export default function ProcurementPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading procurement data...</div>
        </div>
      </DashboardLayout>
    );
  }

  const procurementColumns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Contract ID",
    },
    {
      accessorKey: "projectName",
      header: ({ column }) => <SortableHeader column={column}>Project Name</SortableHeader>,
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div className="font-medium">{row.original.projectName}</div>
          <div className="text-sm text-muted-foreground">{row.original.category}</div>
        </div>
      ),
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => row.original.vendor || "—",
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <SortableHeader column={column}>Contract Value</SortableHeader>,
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusChip
          status={row.original.status}
          type={row.original.status === "Awarded" ? "success" : "warning"}
        />
      ),
    },
    {
      accessorKey: "awardDate",
      header: ({ column }) => <SortableHeader column={column}>Award Date</SortableHeader>,
      cell: ({ row }) => row.original.awardDate ? formatDate(row.original.awardDate) : "Pending",
    },
    {
      accessorKey: "procurementMethod",
      header: "Method",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.procurementMethod}</span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Total Contracts"
            value={data.summary.totalContracts.toString()}
            icon={FileCheck}
            description="All procurement contracts"
          />
          <KPIStatCard
            title="Total Contract Value"
            value={formatCurrency(data.summary.totalValue)}
            icon={DollarSign}
            description="Aggregate value"
          />
          <KPIStatCard
            title="Awarded Contracts"
            value={data.summary.awarded.toString()}
            icon={TrendingUp}
            description="Completed bidding"
          />
          <KPIStatCard
            title="Open Bids"
            value={data.summary.open.toString()}
            icon={FileText}
            description="Active procurement"
          />
        </div>

        {/* Info Box */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Procurement Transparency</h3>
          <p className="text-sm text-muted-foreground">
            All procurement activities follow the Government Procurement Reform Act (RA 9184) and implementing rules. 
            Contract documents, bidding procedures, and vendor evaluations are conducted in accordance with transparency 
            and fair competition principles. For detailed procurement documents and bid opportunities, please contact our 
            Procurement Division.
          </p>
        </div>

        {/* Contracts Table */}
        <div>
          <h2 className="text-2xl font-bold mb-4">All Procurement Contracts</h2>
          <DataTable columns={procurementColumns} data={data.contracts} pageSize={12} />
        </div>

        {/* Footer Note */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Contract amounts are in Philippine Pesos (PHP). Open bids are currently accepting submissions. 
            For procurement inquiries, contact: <a href="mailto:procurement@philhealth.gov.ph" className="text-primary hover:underline">procurement@philhealth.gov.ph</a>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
