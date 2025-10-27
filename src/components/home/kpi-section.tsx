"use client";

import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { DollarSign, Users, Clock, TrendingUp } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";

export function KPISection() {
  return (
    <section className="relative py-12 sm:py-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95 backdrop-blur-sm" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Key Performance Indicators
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground px-4">
            Real-time overview of PhilHealth's operational metrics
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <KPIStatCard
            title="Total Benefit Payouts (2024)"
            value={formatCurrency(127500000000)}
            icon={DollarSign}
            description="Year-to-date disbursements"
            trend={{ value: 8.5, isPositive: true }}
          />
          <KPIStatCard
            title="Active Members"
            value={formatNumber(52400000)}
            icon={Users}
            description="Nationwide coverage"
            trend={{ value: 3.2, isPositive: true }}
          />
          <KPIStatCard
            title="Avg. Processing Time"
            value="12 days"
            icon={Clock}
            description="Claims turnaround"
            trend={{ value: 15, isPositive: true }}
          />
          <KPIStatCard
            title="Approval Rate"
            value="94.3%"
            icon={TrendingUp}
            description="Claims success rate"
            trend={{ value: 2.1, isPositive: true }}
          />
        </motion.div>
      </div>
    </section>
  );
}
