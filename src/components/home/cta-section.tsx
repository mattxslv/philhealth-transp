import Link from "next/link";
import { FileText, Activity, Building2, FileCheck, Users, ShieldCheck } from "lucide-react";

const features = [
  {
    name: "Financial Reports",
    description: "See how we spend the funds. Every peso, accounted for!",
    icon: FileText,
    href: "/financials",
  },
  {
    name: "Claims Analytics",
    description: "Real-time data on approval rates and processing times. Nothing hidden!",
    icon: Activity,
    href: "/claims",
  },
  {
    name: "Accredited Facilities",
    description: "Find hospitals near you. 6,000+ facilities nationwide!",
    icon: Building2,
    href: "/facilities",
  },
  {
    name: "Procurement Records",
    description: "What we bought, how much, from whom. Full transparency in bidding!",
    icon: FileCheck,
    href: "/procurement",
  },
  {
    name: "Coverage Statistics",
    description: "How many members do we have? See enrollment trends and membership data.",
    icon: Users,
    href: "/coverage",
  },
  {
    name: "Governance",
    description: "Board resolutions, minutes, policies—everything is here for you.",
    icon: ShieldCheck,
    href: "/governance",
  },
];

export function CTASection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explore Our Data
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about PhilHealth—open and accessible for everyone
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.name}
              href={feature.href}
              className="group relative rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:border-primary"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
