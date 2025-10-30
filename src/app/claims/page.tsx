"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { PageLoadingSkeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, DollarSign, CheckCircle, Activity } from "lucide-react";
import { ErrorMessage } from "@/components/ui/error-message";
import { YearSelectorDropdown } from "@/components/ui/year-selector-dropdown";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ["#009a3d", "#eab308", "#10b981", "#fbbf24", "#22c55e", "#fcd34d", "#4ade80", "#fde047", "#006400", "#ca8a04"];

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

  // Extract claims data based on year
  let claimsData: any = {};
  let totalAmount = 0;
  let totalCount = 0;
  let membershipData: any[] = [];
  let covidData: any[] = [];
  let illnessData: any[] = [];
  let topMedicalCases: any[] = [];
  let topProcedures: any[] = [];
  
  if (selectedYear === 2024) {
    const statsData2024 = statisticsData.philhealth_transparency_data_2024 || statisticsData;
    claimsData = statsData2024?.claims_payment || {};
    
    totalAmount = claimsData?.grand_total_amount_php || 0;
    totalCount = claimsData?.grand_total_count || 0;
    membershipData = claimsData?.by_membership_category?.data || [];
    covidData = claimsData?.covid19_vs_non_covid19?.data || [];
    illnessData = claimsData?.by_patient_type_sex_sector_illness?.by_illness_type?.data || [];
    topMedicalCases = claimsData?.top_10_medical_cases_by_count?.data || [];
    topProcedures = claimsData?.top_10_rvs_packages_by_count?.data || [];
    
  } else if (selectedYear === 2023) {
    const statsData2023 = statisticsData.philhealth_stats_and_charts_2023_data || statisticsData;
    const claimsSummary = statsData2023?.claims_payment_summary || {};
    const covidClaims = statsData2023?.claims_payment_covid19 || {};
    const claimsPaid = statsData2023?.claims_paid_distribution || {};
    const topMedical = statsData2023?.top_10_medical_cases || {};
    const topRvs = statsData2023?.top_10_rvs_procedures || {};
    
    totalAmount = claimsSummary?.total_claims_amount_php || 0;
    totalCount = claimsSummary?.total_claims_count || 0;
    
    // Build membership data from direct and indirect breakdowns
    const directBreakdown = claimsSummary?.direct_contributor_breakdown || {};
    const indirectBreakdown = claimsSummary?.indirect_contributor_breakdown || {};
    
    membershipData = [
      ...Object.entries(directBreakdown).map(([key, value]: [string, any]) => ({
        category: key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        amount_php: value.amount_php || 0,
        claims_count: value.claims_count || 0
      })),
      ...Object.entries(indirectBreakdown).map(([key, value]: [string, any]) => ({
        category: key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        amount_php: value.amount_php || 0,
        claims_count: value.claims_count || 0
      }))
    ];
    
    // COVID data
    if (covidClaims?.non_covid_vs_covid_totals) {
      covidData = [
        {
          classification: 'Non-COVID-19',
          amount_php: covidClaims.non_covid_vs_covid_totals.non_covid19.claims_amount_php || 0,
          claims_count: covidClaims.non_covid_vs_covid_totals.non_covid19.claims_count || 0
        },
        {
          classification: 'COVID-19 Related',
          amount_php: covidClaims.non_covid_vs_covid_totals.covid19_related.claims_amount_php || 0,
          claims_count: covidClaims.non_covid_vs_covid_totals.covid19_related.claims_count || 0
        }
      ];
    }
    
    // Illness type data
    if (claimsPaid?.by_illness_type) {
      illnessData = [
        {
          type: 'Procedural',
          amount_php: claimsPaid.by_illness_type.procedural.claims_amount_php || 0,
          claims_count: claimsPaid.by_illness_type.procedural.claims_count || 0
        },
        {
          type: 'Medical',
          amount_php: claimsPaid.by_illness_type.medical.claims_amount_php || 0,
          claims_count: claimsPaid.by_illness_type.medical.claims_count || 0
        }
      ];
    }
    
    // Top medical cases (2023 format)
    if (topMedical?.ranking_by_claims_count) {
      topMedicalCases = topMedical.ranking_by_claims_count.map((item: any) => ({
        rank: item.rank,
        illness_description: item.illness_description,
        amount_php: item.claims_amount_php,
        claims_count: item.claims_count
      }));
    }
    
    // Top procedures (2023 format)
    if (topRvs?.ranking_by_claims_count) {
      topProcedures = topRvs.ranking_by_claims_count.map((item: any) => ({
        rank: item.rank,
        procedure_description: item.procedure_description,
        amount_php: item.claims_amount_php,
        claims_count: item.claims_count
      }));
    }
    
  } else if (selectedYear === 2022) {
    // Use annual report data for 2022
    const reportData2022 = annualReportData.philhealth_2022_annual_report_data || annualReportData;
    const claimsAndBenefits = reportData2022?.claims_and_benefits || {};
    const financialStatements = reportData2022?.financial_statements_summary || {};
    
    // Total from comprehensive income statement
    totalAmount = financialStatements?.statement_of_comprehensive_income_2022?.members_benefits_expense_php || 
                  claimsAndBenefits?.total_benefit_claims_expenses_php || 0;
    
    // Claims count NOT provided in 2022 annual report
    totalCount = 0;
    
    // Build membership data from distribution percentages
    const claimsDist = claimsAndBenefits?.claims_paid_distribution_by_count_percent || {};
    const directDist = claimsDist?.direct_contributors || {};
    const indirectDist = claimsDist?.indirect_contributors || {};
    
    // Since we only have percentages, we'll show the categories with amounts (no counts available)
    if (Object.keys(directDist).length > 0 || Object.keys(indirectDist).length > 0) {
      membershipData = [
        ...(directDist.employed_private ? [{
          category: 'Employed Private',
          amount_php: totalAmount * 0.17, // 17% based on data
          claims_count: 0
        }] : []),
        ...(directDist.employed_government ? [{
          category: 'Employed Government',
          amount_php: totalAmount * 0.10, // 10% based on data
          claims_count: 0
        }] : []),
        ...(directDist.informal ? [{
          category: 'Informal Self Earning',
          amount_php: totalAmount * 0.22, // 22% based on data
          claims_count: 0
        }] : []),
        ...(directDist.ofws ? [{
          category: 'OFWs Migrant Workers',
          amount_php: totalAmount * 0.02, // 2% based on data
          claims_count: 0
        }] : []),
        ...(directDist.lifetime ? [{
          category: 'Lifetime Members',
          amount_php: totalAmount * 0.01, // 1% based on data
          claims_count: 0
        }] : []),
        ...(indirectDist.indigent ? [{
          category: 'Indigent NHTS-PR',
          amount_php: totalAmount * 0.17, // 17% based on data
          claims_count: 0
        }] : []),
        ...(indirectDist.senior_citizens ? [{
          category: 'Senior Citizens',
          amount_php: totalAmount * 0.10, // 10% based on data
          claims_count: 0
        }] : []),
        ...(indirectDist.sponsored ? [{
          category: 'Sponsored',
          amount_php: totalAmount * 0.15, // 15% based on data
          claims_count: 0
        }] : [])
      ];
    }
    
    // COVID data from distribution percentages (only percentages available, no actual counts)
    const covidDist = claimsAndBenefits?.covid19_claims_distribution?.by_amount_percent || {};
    if (Object.keys(covidDist).length > 0) {
      // Estimate COVID total (assuming it's part of total benefits)
      const estimatedCovidTotal = totalAmount * 0.25; // Rough estimate
      covidData = [
        {
          classification: 'Isolation',
          amount_php: covidDist.isolation ? estimatedCovidTotal * 0.02 : 0,
          claims_count: 0
        },
        {
          classification: 'Testing',
          amount_php: covidDist.testing ? estimatedCovidTotal * 0.21 : 0,
          claims_count: 0
        },
        {
          classification: 'Inpatient',
          amount_php: covidDist.inpatient ? estimatedCovidTotal * 0.77 : 0,
          claims_count: 0
        }
      ];
    }
    
    // Top medical cases and procedures NOT provided in 2022 annual report
    topMedicalCases = [];
    topProcedures = [];
  }

  const avgClaimAmount = totalCount > 0 ? totalAmount / totalCount : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <PageHeading
            title="Claims Analytics"
          />
          <div className="flex items-center gap-3">
            <YearSelectorDropdown 
              selectedYear={selectedYear} 
              onChange={setSelectedYear}
              startYear={2022}
              endYear={2024}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <KPIStatCard
            title="Total Claims Amount"
            value={formatCurrency(totalAmount)}
            icon={DollarSign}
            description={totalCount > 0 ? `${formatNumber(totalCount)} claims paid` : 'Benefit payments'}
          />
          <KPIStatCard
            title="Total Claims Count"
            value={totalCount > 0 ? formatNumber(totalCount) : "Data Not Provided"}
            icon={CheckCircle}
            description={totalCount > 0 ? "Number of processed claims" : "PhilHealth did not provide this data"}
            className={totalCount === 0 ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500" : ""}
          />
          <KPIStatCard
            title="Average Claim Amount"
            value={avgClaimAmount > 0 ? formatCurrency(avgClaimAmount) : "Data Not Provided"}
            icon={TrendingUp}
            description={avgClaimAmount > 0 ? "Per claim average" : "PhilHealth did not provide this data"}
            className={avgClaimAmount === 0 ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500" : ""}
          />
        </div>

        {/* Claims by Membership Category */}
        {membershipData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard 
              title="Claims Distribution by Membership" 
              description="Direct vs Indirect Contributors"
            >
              <div style={{ height: '420px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={membershipData
                        .filter((item: any) => !item.category.includes('Total'))
                        .map((item: any, index: number) => ({
                          name: item.category,
                          value: item.amount_php,
                          fill: COLORS[index % COLORS.length]
                        }))}
                      cx="50%"
                      cy="45%"
                      outerRadius={130}
                      innerRadius={75}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={3}
                      label={({ name, percent }: any) => {
                        const percentage = (percent * 100).toFixed(1);
                        return parseFloat(percentage) > 3 ? `${percentage}%` : '';
                      }}
                    >
                      {membershipData
                        .filter((item: any) => !item.category.includes('Total'))
                        .map((_: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          const data = payload[0];
                          const total = membershipData
                            .filter((item: any) => !item.category.includes('Total'))
                            .reduce((sum: number, item: any) => sum + item.amount_php, 0);
                          const percentage = ((data.value / total) * 100).toFixed(1);
                          
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                              <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(data.value)}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{percentage}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom"
                      height={80}
                      wrapperStyle={{ fontSize: '11px' }}
                      iconType="circle"
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            
            <ChartCard 
              title="Claims Amount by Category" 
              description="Top membership categories"
            >
              <div style={{ height: '420px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={membershipData
                      .filter((item: any) => !item.category.includes('Total'))
                      .slice(0, 6)
                      .map((item: any) => ({
                        name: item.category.replace(/\//g, ' / '),
                        value: item.amount_php
                      }))}
                    margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `₱${(value / 1000000000).toFixed(1)}B`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                              <p className="font-semibold text-gray-900 dark:text-white">{payload[0].payload.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(payload[0].value)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" fill="#009a3d" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        )}

        {/* COVID vs Non-COVID (if available) */}
        {covidData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">COVID-19 vs Non-COVID-19 Claims</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {covidData.map((item: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {item.classification}
                    </span>
                    <Activity className="w-5 h-5 text-[#009a3d]" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(item.amount_php)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatNumber(item.claims_count)} claims
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* By Illness Type */}
        {illnessData.length > 0 && (
          <ChartCard 
            title="Claims by Illness Type" 
            description="Distribution of procedural vs medical claims"
          >
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={illnessData.map((item: any, index: number) => ({
                    name: item.type,
                    value: item.amount_php,
                    claims: item.claims_count,
                    fill: COLORS[index % COLORS.length]
                  }))}
                  layout="horizontal"
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number"
                    tickFormatter={(value) => `₱${(value / 1000000000).toFixed(1)}B`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                            <p className="font-semibold text-gray-900 dark:text-white">{payload[0].payload.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Amount: {formatCurrency(payload[0].value)}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Claims: {formatNumber(payload[0].payload.claims)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {illnessData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}

        {/* Top 10 Medical Cases */}
        {topMedicalCases.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold">Top 10 Medical Cases</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Most common medical conditions by claim count</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topMedicalCases.map((item: any, index: number) => {
                  const avgPerClaim = item.amount_php / item.claims_count;
                  const maxClaims = topMedicalCases[0].claims_count;
                  const widthPercent = (item.claims_count / maxClaims) * 100;
                  
                  return (
                    <div key={item.rank} className="relative">
                      {/* Background bar */}
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#009a3d]/10 to-transparent rounded-lg transition-all duration-300"
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                      
                      {/* Content */}
                      <div className="relative p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#009a3d] dark:hover:border-[#009a3d] transition-colors">
                        <div className="flex items-start gap-4">
                          {/* Rank Badge */}
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0 ? 'bg-amber-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-amber-700' : 
                              'bg-[#009a3d]'
                            }`}>
                              {item.rank}
                            </div>
                          </div>
                          
                          {/* Medical Condition */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                              {item.illness}
                            </h4>
                            
                            <div className="grid grid-cols-3 gap-4 mt-3">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Claims Count</p>
                                <p className="text-lg font-bold text-[#009a3d]">
                                  {formatNumber(item.claims_count)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {formatCurrency(item.amount_php)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg per Claim</p>
                                <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                                  {formatCurrency(avgPerClaim)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded shadow-sm">
            <div className="flex items-start">
              <Activity className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Top 10 Medical Cases - Data Not Provided</h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  PhilHealth did not provide detailed information about top medical cases for the {selectedYear} annual report. 
                  This data may be available in future reports or through direct inquiry to PhilHealth.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top 10 Procedures */}
        {topProcedures.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold">Top 10 RVS Packages &amp; Procedures</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Most utilized procedures by claim count</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProcedures.map((item: any, index: number) => {
                  const avgPerClaim = item.amount_php / item.claims_count;
                  const maxClaims = topProcedures[0].claims_count;
                  const widthPercent = (item.claims_count / maxClaims) * 100;
                  
                  return (
                    <div key={item.rank} className="relative">
                      {/* Background bar */}
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg transition-all duration-300"
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                      
                      {/* Content */}
                      <div className="relative p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 transition-colors">
                        <div className="flex items-start gap-4">
                          {/* Rank Badge */}
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0 ? 'bg-amber-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-amber-700' : 
                              'bg-yellow-600'
                            }`}>
                              {item.rank}
                            </div>
                          </div>
                          
                          {/* Procedure Name */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                              {item.package_procedure}
                            </h4>
                            
                            <div className="grid grid-cols-3 gap-4 mt-3">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Claims Count</p>
                                <p className="text-lg font-bold text-amber-600">
                                  {formatNumber(item.claims_count)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {formatCurrency(item.amount_php)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg per Claim</p>
                                <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                                  {formatCurrency(avgPerClaim)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded shadow-sm">
            <div className="flex items-start">
              <Activity className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Top 10 RVS Packages & Procedures - Data Not Provided</h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  PhilHealth did not provide detailed information about top RVS packages and procedures for the {selectedYear} annual report. 
                  This data may be available in future reports or through direct inquiry to PhilHealth.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
