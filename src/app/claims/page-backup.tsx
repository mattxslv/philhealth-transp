"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { PageLoadingSkeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react";
import { ErrorMessage } from "@/components/ui/error-message";
import { ExportButton } from "@/components/ui/export-button";
import { YearSelectorDropdown } from "@/components/ui/year-selector-dropdown";
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
import { Doughnut, Bar } from "react-chartjs-2";

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

const COLORS = ["#009a3d", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export default function ClaimsPage() {
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [annualReportData, setAnnualReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ type: "network" | "notfound" | "generic"; message?: string } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const loadData = () => {
    setLoading(true);
    setError(null);
    
    Promise.all([
      axios.get(`/data/statistics-charts-${selectedYear}.json`),
      axios.get(`/data/annual-report-${selectedYear}.json`)
    ])
      .then(([statsRes, reportRes]) => {
        setStatisticsData(statsRes.data);
        setAnnualReportData(reportRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading claims data:", err);
        if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
          setError({ type: "network", message: "Unable to load claims data. Please check your connection." });
        } else if (err.response?.status === 404) {
          setError({ type: "notfound", message: "Claims data files were not found." });
        } else {
          setError({ type: "generic", message: "An unexpected error occurred while loading claims data." });
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  const parseNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    return parseFloat(value.replace(/[₱,P]/g, '').replace(/,/g, ''));
  };

  if (loading || !statisticsData || !annualReportData) {
    return (
      <DashboardLayout>
        <PageLoadingSkeleton />
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

  const benefitPayments = statisticsData.benefitPayments || {};
  const totalClaims = parseNumber(benefitPayments.total || 0);
  const claimsProcessed = benefitPayments.claimsProcessed ? 
    parseFloat(benefitPayments.claimsProcessed.replace(/,/g, '')) : 0;
  const avgClaimAmount = claimsProcessed > 0 ? totalClaims / claimsProcessed : 0;
  
  const breakdown = benefitPayments.breakdown || {};
  
  // Claims Distribution Chart
  const claimsData = {
    labels: Object.keys(breakdown).map(key => key.replace(/([A-Z])/g, ' $1').trim()),
    datasets: [{
      data: Object.values(breakdown).map((item: any) => parseNumber(item.amount || 0) / 1000000000),
      backgroundColor: COLORS,
      borderColor: "#fff",
      borderWidth: 3,
    }]
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Claims Analytics</h1>
            <p className="text-muted-foreground mt-1">Operational data and benefit payments - {selectedYear}</p>
          </div>
          <div className="flex items-center gap-3">
            <YearSelectorDropdown selectedYear={selectedYear} onChange={setSelectedYear} />
            <ExportButton
              data={{ statisticsData, annualReportData }}
              filename={`philhealth-claims-${selectedYear}`}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Total Benefit Payments"
            value={formatCurrency(totalClaims)}
            icon={DollarSign}
            description="Total claims paid"
          />
          <KPIStatCard
            title="Claims Processed"
            value={formatNumber(claimsProcessed)}
            icon={CheckCircle}
            description="Number of claims"
          />
          <KPIStatCard
            title="Average Claim Amount"
            value={formatCurrency(avgClaimAmount)}
            icon={TrendingUp}
            description="Per claim average"
          />
          <KPIStatCard
            title="Beneficiaries"
            value={statisticsData.metadata?.totalBeneficiaries || "N/A"}
            icon={Clock}
            description="Total beneficiaries"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Benefit Payments by Category" description={`${selectedYear} claims distribution`}>
            <Doughnut data={claimsData} options={{ responsive: true, maintainAspectRatio: false }} />
          </ChartCard>
          
          <ChartCard title="Payment Breakdown" description={`${selectedYear} detailed view`}>
            <Bar 
              data={{
                labels: Object.keys(breakdown).map(key => key.replace(/([A-Z])/g, ' $1').trim()),
                datasets: [{
                  label: 'Amount (Billions)',
                  data: Object.values(breakdown).map((item: any) => parseNumber(item.amount || 0) / 1000000000),
                  backgroundColor: COLORS[0],
                }]
              }} 
              options={{ responsive: true, maintainAspectRatio: false }} 
            />
          </ChartCard>
        </div>

        {/* Additional Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Membership Info */}
          {statisticsData.membership && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-xl font-bold mb-4">Membership Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Members</span>
                  <span className="font-semibold">{statisticsData.membership.totalRegisteredMembers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Covered Lives</span>
                  <span className="font-semibold">{statisticsData.membership.coveredLives}</span>
                </div>
              </div>
            </div>
          )}

          {/* Accreditation Info */}
          {statisticsData.accreditation && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-xl font-bold mb-4">Accredited Facilities</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Hospitals</span>
                  <span className="font-semibold">{statisticsData.accreditation.hospitals?.total || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Healthcare Professionals</span>
                  <span className="font-semibold">{statisticsData.accreditation.healthcareProfessionals || "N/A"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
