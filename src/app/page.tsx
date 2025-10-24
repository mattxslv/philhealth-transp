import { Hero } from "@/components/home/hero";
import { KPISection } from "@/components/home/kpi-section";
import { CTASection } from "@/components/home/cta-section";
import { PolicyUpdates } from "@/components/home/policy-updates";

export default function Home() {
  return (
    <>
      <Hero />
      <KPISection />
      <CTASection />
      <PolicyUpdates />
    </>
  );
}
