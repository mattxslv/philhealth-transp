import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Hero } from "@/components/home/hero";
import { FundsChart } from "@/components/home/funds-chart";
import { KPISection } from "@/components/home/kpi-section";
import { PhilippinesMap } from "@/components/home/philippines-map";
import { PolicyUpdates } from "@/components/home/policy-updates";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-0 -mt-20 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-12 2xl:-mx-16">
        {/* Hero - Light cream background */}
        <div className="bg-[#fafaf8]">
          <Hero />
        </div>
        
        {/* KPI Section - White background */}
        <div id="fund-performance" className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-white py-16">
          <KPISection />
        </div>
        
        {/* Philippines Map - Light cream background */}
        <div id="nationwide-coverage" className="bg-[#fafaf8]">
          <PhilippinesMap />
        </div>
        
        {/* Funds Chart - White background */}
        <div id="incoming-outgoing-funds" className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-white">
          <FundsChart />
        </div>
        
        {/* Policy Updates - Light cream background */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-[#fafaf8] py-16">
          <PolicyUpdates />
        </div>
      </div>
    </DashboardLayout>
  );
}

