"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { StatusChip } from "@/components/ui/status-chip";
import { SearchBar } from "@/components/ui/search-bar";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { ColumnDef } from "@tanstack/react-table";
import { Building2, Hospital, Home, Building } from "lucide-react";

export default function FacilitiesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    axios.get("/data/facilities.json")
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

  const regions = ["all", ...Array.from(new Set(data.facilities.map((f: any) => f.region)))] as string[];
  const types = ["all", ...Array.from(new Set(data.facilities.map((f: any) => f.type)))] as string[];
  const categories = ["all", ...Array.from(new Set(data.facilities.map((f: any) => f.category)))] as string[];

  const filteredFacilities = data.facilities.filter((facility: any) => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === "all" || facility.region === regionFilter;
    const matchesType = typeFilter === "all" || facility.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || facility.category === categoryFilter;
    
    return matchesSearch && matchesRegion && matchesType && matchesCategory;
  });

  const facilitiesColumns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Facility ID",
    },
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Facility Name</SortableHeader>,
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <StatusChip
          status={row.original.category}
          type={row.original.category === "Government" ? "info" : "default"}
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusChip
          status={row.original.status}
          type="success"
        />
      ),
    },
    {
      accessorKey: "beds",
      header: ({ column }) => <SortableHeader column={column}>Bed Capacity</SortableHeader>,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeading
          title="Accredited Facilities"
          description="Comprehensive directory of PhilHealth-accredited hospitals and healthcare providers"
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Total Facilities"
            value={data.summary.totalFacilities.toLocaleString()}
            icon={Building2}
            description="Nationwide network"
          />
          <KPIStatCard
            title="Tertiary Hospitals"
            value={data.summary.tertiaryHospitals.toLocaleString()}
            icon={Hospital}
            description="Specialized care"
          />
          <KPIStatCard
            title="Primary Clinics"
            value={data.summary.primaryClinics.toLocaleString()}
            icon={Home}
            description="Community health"
          />
          <KPIStatCard
            title="Government Facilities"
            value={data.summary.governmentOwned.toLocaleString()}
            icon={Building}
            description="Public healthcare"
          />
        </div>

        {/* Filters */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Search and Filter Facilities</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name or city..."
            />
            <FilterDropdown
              label="Region"
              value={regionFilter}
              onChange={setRegionFilter}
              options={regions.map(r => ({ value: r, label: r === "all" ? "All Regions" : r }))}
            />
            <FilterDropdown
              label="Type"
              value={typeFilter}
              onChange={setTypeFilter}
              options={types.map(t => ({ value: t, label: t === "all" ? "All Types" : t }))}
            />
            <FilterDropdown
              label="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categories.map(c => ({ value: c, label: c === "all" ? "All Categories" : c }))}
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Showing {filteredFacilities.length} of {data.facilities.length} facilities
          </p>
        </div>

        {/* Facilities Table */}
        <div>
          <DataTable columns={facilitiesColumns} data={filteredFacilities} pageSize={15} />
        </div>
      </div>
    </DashboardLayout>
  );
}
