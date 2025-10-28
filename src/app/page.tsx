import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Hero } from "@/components/home/hero";
import { KPISection } from "@/components/home/kpi-section";
import { CTASection } from "@/components/home/cta-section";
import { PolicyUpdates } from "@/components/home/policy-updates";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-0 -mt-20">
        <div className="-ml-6 lg:-ml-8 -mr-6 lg:-mr-8">
          <Hero />
        </div>
        <div className="-ml-6 lg:-ml-8 -mr-6 lg:-mr-8">
          <KPISection />
        </div>
        <div className="-ml-6 lg:-ml-8 -mr-6 lg:-mr-8">
          <CTASection />
        </div>
        <PolicyUpdates />
      </div>
    </DashboardLayout>
  );
}
