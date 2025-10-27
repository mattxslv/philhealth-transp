import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            PhilHealth Transparency Portal
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Promoting accountability and transparency in Philippine healthcare. Access comprehensive data on financial reports, claims processing, coverage statistics, and governance information.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/financials"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Explore Financial Data
            </Link>
            <Link
              href="/engagement"
              className="flex items-center gap-2 text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
            >
              Contact Us <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary/30 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </div>
    </section>
  );
}
