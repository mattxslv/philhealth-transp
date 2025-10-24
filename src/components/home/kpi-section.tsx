import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { DollarSign, Users, Clock, TrendingUp } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function KPISection() {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Key Performance Indicators
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real-time overview of PhilHealth's operational metrics
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </div>
    </section>
  );
}
