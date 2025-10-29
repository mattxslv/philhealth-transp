"use client";

import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

export function KPISection() {
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [annualReportData, setAnnualReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Always fetch the latest data (2024)
    Promise.all([
      axios.get(`/data/statistics-charts-2024.json`),
      axios.get(`/data/annual-report-2024.json`)
    ])
      .then(([statsRes, reportRes]) => {
        setStatisticsData(statsRes.data);
        setAnnualReportData(reportRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading KPI data:", err);
        setLoading(false);
      });
  }, []);

  // Parse the values from the JSON data
  const parseNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    // Remove currency symbols, commas, parentheses, "billion", and other text, then convert to number
    const cleaned = value.replace(/[₱,P()]/g, '').replace(/billion|million|restated/gi, '').replace(/,/g, '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Financial Performance data from annual report (raw values in PHP)
  const totalAssets = annualReportData?.philhealth_annual_report_2024?.financial_statements?.statement_of_financial_position?.assets?.TOTAL_ASSETS?.["2024"]
    ? parseNumber(annualReportData.philhealth_annual_report_2024.financial_statements.statement_of_financial_position.assets.TOTAL_ASSETS["2024"])
    : 612639975995;
  
  const premiumContributions = annualReportData?.philhealth_annual_report_2024?.financial_statements?.statement_of_comprehensive_income?.revenue_and_expenses?.find((item: any) => item.item === "Premium contributions")?.["2024"]
    ? parseNumber(annualReportData.philhealth_annual_report_2024.financial_statements.statement_of_comprehensive_income.revenue_and_expenses.find((item: any) => item.item === "Premium contributions")["2024"])
    : 239573300339;
  
  const benefitClaimsExpenses = annualReportData?.philhealth_annual_report_2024?.financial_statements?.statement_of_comprehensive_income?.revenue_and_expenses?.find((item: any) => item.item === "Less: Benefit claims expenses")?.["2024"]
    ? parseNumber(annualReportData.philhealth_annual_report_2024.financial_statements.statement_of_comprehensive_income.revenue_and_expenses.find((item: any) => item.item === "Less: Benefit claims expenses")["2024"])
    : 185451901932;
  
  const netOperatingIncome = annualReportData?.philhealth_annual_report_2024?.financial_statements?.statement_of_comprehensive_income?.revenue_and_expenses?.find((item: any) => item.item === "NET OPERATING INCOME (LOSS)")?.["2024"]
    ? parseNumber(annualReportData.philhealth_annual_report_2024.financial_statements.statement_of_comprehensive_income.revenue_and_expenses.find((item: any) => item.item === "NET OPERATING INCOME (LOSS)")["2024"])
    : 38221890387;

  // Calculate claims ratio (how much of premiums go to benefits)
  const claimsRatio = premiumContributions > 0 ? ((benefitClaimsExpenses / premiumContributions) * 100).toFixed(1) : "0.0";
  const claimsRatioNum = parseFloat(claimsRatio);
  
  // Additional metrics from statistics data
  const totalBeneficiaries = statisticsData?.philhealth_transparency_data_2024?.registered_members_dependents?.data?.total_all?.beneficiaries_total
    ? (statisticsData.philhealth_transparency_data_2024.registered_members_dependents.data.total_all.beneficiaries_total / 1000000).toFixed(2)
    : 102.75;
  
  const totalMembers = statisticsData?.philhealth_transparency_data_2024?.registered_members_dependents?.data?.total_all?.members
    ? (statisticsData.philhealth_transparency_data_2024.registered_members_dependents.data.total_all.members / 1000000).toFixed(2)
    : 58.70;
  
  const coverage = "91.0%"; // Based on 102.75M / 112.88M population
  
  const totalHospitals = statisticsData?.philhealth_transparency_data_2024?.accreditation?.health_care_providers_institutions?.summary?.find((item: any) => item.category === "Hospitals")?.total
    ? statisticsData.philhealth_transparency_data_2024.accreditation.health_care_providers_institutions.summary.find((item: any) => item.category === "Hospitals").total.toLocaleString()
    : "1,908";
  
  const totalHealthcareProfessionals = statisticsData?.philhealth_transparency_data_2024?.accreditation?.health_care_professionals?.total_professionals
    ? statisticsData.philhealth_transparency_data_2024.accreditation.health_care_professionals.total_professionals
    : 52205;

  return (
    <section className="relative pt-4 pb-12 overflow-hidden bg-transparent">
      <div className="mx-auto w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Fund Performance Overview
          </h2>
          <p className="text-lg text-muted-foreground">
            Transparency in action - 2024 Financial Year
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Main Metrics - Premium Contributions vs Benefit Claims */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Premium Contributions */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Premium Contributions (2024)
                </p>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary break-words">
                  ₱{premiumContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total member contributions received
                </p>
              </div>

              {/* Benefit Claims Expenses */}
              <div className="space-y-3 text-left md:text-right">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Benefit Claims Expenses (2024)
                </p>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground break-words">
                  ₱{benefitClaimsExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total benefits paid to members
                </p>
              </div>
            </div>

            {/* Progress Bar - Claims Ratio */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Claims-to-Premium Ratio</span>
                <span className={`font-bold ${claimsRatioNum > 85 ? 'text-orange-600' : 'text-primary'}`}>{claimsRatio}%</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${claimsRatioNum > 85 ? 'bg-orange-500' : 'bg-primary'}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min(claimsRatioNum, 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {claimsRatio}% of premium contributions paid as benefit claims (Target: 85%+)
              </p>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{totalBeneficiaries}M</p>
                <p className="text-sm text-muted-foreground mt-1">Total Beneficiaries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{coverage}</p>
                <p className="text-sm text-muted-foreground mt-1">Coverage Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{totalHospitals}</p>
                <p className="text-sm text-muted-foreground mt-1">Hospitals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{(totalHealthcareProfessionals / 1000).toFixed(1)}K</p>
                <p className="text-sm text-muted-foreground mt-1">Healthcare Professionals</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
