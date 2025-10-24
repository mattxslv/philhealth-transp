"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, Download, Users, CheckCircle, DollarSign } from "lucide-react";

export default function GovernancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/data/governance.json")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading governance data:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading governance data...</div>
        </div>
      </DashboardLayout>
    );
  }

  const compensationColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "compensation",
      header: ({ column }) => <SortableHeader column={column}>Base Salary</SortableHeader>,
      cell: ({ row }) => formatCurrency(row.original.compensation),
    },
    {
      accessorKey: "allowances",
      header: "Allowances",
      cell: ({ row }) => formatCurrency(row.original.allowances),
    },
    {
      accessorKey: "benefits",
      header: "Benefits",
      cell: ({ row }) => formatCurrency(row.original.benefits),
    },
    {
      accessorKey: "totalCompensation",
      header: ({ column }) => <SortableHeader column={column}>Total</SortableHeader>,
      cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.original.totalCompensation)}</span>,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeading
          title="Governance & Leadership"
          description="Board composition, meeting minutes, executive compensation, and organizational policies"
        />

        {/* Annual Reports */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Annual Reports</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.annualReports.map((report: any) => (
              <div key={report.year} className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {report.year}
                  </span>
                  <a
                    href={report.downloadUrl}
                    className="rounded-md p-2 hover:bg-accent transition-colors"
                    aria-label={`Download ${report.title}`}
                  >
                    <Download className="h-5 w-5 text-primary" />
                  </a>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{report.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                <p className="text-xs text-muted-foreground">Published: {formatDate(report.publishDate)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Board Meetings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Board Meeting Minutes</h2>
          </div>
          <div className="space-y-4">
            {data.boardMeetings.map((meeting: any) => (
              <div key={meeting.id} className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-semibold">{meeting.type}</span>
                      <span className="text-sm text-muted-foreground">{formatDate(meeting.date)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Agenda:</strong> {meeting.agenda}
                    </p>
                  </div>
                  <a
                    href={meeting.minutesUrl}
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Minutes
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Compensation */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Executive Compensation (Annual)</h2>
          </div>
          <DataTable columns={compensationColumns} data={data.boardMembers} pageSize={10} />
        </div>

        {/* Resolutions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Recent Board Resolutions</h2>
          </div>
          <div className="space-y-3">
            {data.resolutions.map((resolution: any) => (
              <div key={resolution.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted-foreground">{resolution.id}</span>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {resolution.category}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatDate(resolution.dateApproved)}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{resolution.title}</h3>
                <p className="text-sm text-muted-foreground">{resolution.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Reports */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Commission on Audit (COA) Reports</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.auditReports.map((audit: any) => (
              <div key={audit.year} className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl font-bold text-primary">{audit.year}</span>
                  <a
                    href={audit.downloadUrl}
                    className="rounded-md p-2 hover:bg-accent transition-colors"
                    aria-label={`Download ${audit.title}`}
                  >
                    <Download className="h-5 w-5 text-primary" />
                  </a>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{audit.title}</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Opinion:</strong> <span className="text-green-600 dark:text-green-400">{audit.auditOpinion}</span></p>
                  <p><strong>Findings:</strong> {audit.findings}</p>
                  <p><strong>Recommendations:</strong> {audit.recommendations}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
