"use client";

import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

export function KPISection() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Fetch actual financial data
    axios.get("/data/financials.json")
      .then(res => {
        // Get 2024 data
        const report2024 = res.data.annualReports.find((r: any) => r.year === 2024);
        setData(report2024);
      })
      .catch(err => {
        console.error("Error loading KPI data:", err);
      });
  }, []);

  const totalCollected = data?.revenue || 239573300339; // 2024 revenue
  const totalSpent = data?.claimsPaid || 128890795944; // 2024 claims paid
  const utilizationRate = ((totalSpent / totalCollected) * 100).toFixed(1);

  return (
    <section className="relative py-20 overflow-hidden bg-transparent">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div 
          className="text-center mb-16"
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

        <motion.div
          className="space-y-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Fund Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Total Collected */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Total Funds Collected in 2024
              </p>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary break-words">
                {formatCurrency(totalCollected)}
              </p>
              <p className="text-sm text-muted-foreground">
                Premium contributions from members
              </p>
            </div>

            {/* Total Spent */}
            <div className="space-y-3 text-left md:text-right">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Total Funds Utilized in 2024
              </p>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground break-words">
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-sm text-muted-foreground">
                Benefit claims paid to members
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Fund Utilization Rate</span>
              <span className="font-bold text-primary">{utilizationRate}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${utilizationRate}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {formatCurrency(totalCollected - totalSpent)} remaining in reserves
            </p>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{data?.beneficiaries ? (data.beneficiaries / 1000000).toFixed(1) : "112.9"}M</p>
              <p className="text-sm text-muted-foreground mt-1">Beneficiaries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{data?.claimsCount ? (data.claimsCount / 1000000).toFixed(1) : "12.7"}M</p>
              <p className="text-sm text-muted-foreground mt-1">Claims Processed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{formatCurrency(data?.reserveFund || 280574913605)}</p>
              <p className="text-sm text-muted-foreground mt-1">Reserve Fund</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{data?.claimsCount ? ((totalSpent / data.claimsCount)).toFixed(0) : "10,163"}</p>
              <p className="text-sm text-muted-foreground mt-1">Avg. Claim (₱)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
