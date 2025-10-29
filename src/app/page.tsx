import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Shield, FileCheck, BarChart3, Upload, Zap, CheckCircle, Database, Lock, UserX } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white -mt-24 -mb-4 sm:-mb-6 lg:-mb-8 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-12 2xl:-mx-16">
        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="text-center space-y-6">
              <p className="text-sm text-gray-600 font-medium tracking-wide uppercase">
                PhilHealth Transparency Portal
              </p>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Access PhilHealth Data with
                <br />
                <span className="text-[#4a7c59]">Complete Transparency</span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Get instant access to financial statements, claims analytics, and coverage reports 
                to understand how PhilHealth serves millions of Filipino families nationwide.
              </p>

              <div className="pt-4">
                <Link
                  href="/overview/fund-performance"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4a7c59] text-white font-semibold rounded-lg hover:bg-[#3d6449] transition-colors shadow-lg shadow-green-900/20"
                >
                  <BarChart3 className="w-5 h-5" />
                  Explore Performance Analytics
                </Link>
              </div>

              <div className="flex items-center justify-center gap-6 pt-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#4a7c59]" />
                  <span>Public Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#4a7c59]" />
                  <span>Real-time Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4a7c59]" />
                  <span>Verified Information</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-[#fafaf8] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Key Data Categories
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Access comprehensive PhilHealth information organized into major categories 
                for easy navigation and analysis of healthcare operations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Category 1 */}
              <div className="bg-transparent border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#e8f5e9] rounded-xl flex items-center justify-center mb-6">
                  <Database className="w-7 h-7 text-[#4a7c59]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Financial Transparency
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  View detailed financial statements, budget allocations, fund performance, 
                  and investment portfolios to understand how PhilHealth manages contributions.
                </p>
              </div>

              {/* Category 2 */}
              <div className="bg-transparent border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#e8f5e9] rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-[#4a7c59]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Claims & Coverage Data
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Analyze claims processing statistics, approval rates, benefit disbursements, 
                  and member coverage across different regions and benefit packages.
                </p>
              </div>

              {/* Category 3 */}
              <div className="bg-transparent border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#e8f5e9] rounded-xl flex items-center justify-center mb-6">
                  <FileCheck className="w-7 h-7 text-[#4a7c59]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Governance & Compliance
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Access board resolutions, procurement records, audit reports, and regulatory 
                  compliance documents ensuring accountability and transparency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Section */}
        <section className="py-20 bg-white px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Our Commitment to Transparency
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We believe every Filipino has the right to know how their healthcare contributions 
                are managed and utilized for the benefit of all members.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 mb-6">
                  <FileCheck className="w-12 h-12 text-[#4a7c59]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Open Government Data
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  In compliance with the Freedom of Information and Transparency Seal directives, 
                  we provide unrestricted access to public PhilHealth records and reports.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 mb-6">
                  <Shield className="w-12 h-12 text-[#4a7c59]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Accountability to Members
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Track how contributions are allocated, how claims are processed, and how funds 
                  are invested to serve the healthcare needs of over 100 million Filipinos.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 mb-6">
                  <BarChart3 className="w-12 h-12 text-[#4a7c59]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Evidence-Based Insights
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Use verified data for research, policy advocacy, or personal understanding 
                  of PhilHealth's performance and impact on Philippine healthcare.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="py-20 bg-[#fafaf8] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-[#e8f5e9] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-9 h-9 text-[#4a7c59]" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Data You Can Trust
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                All information on this portal comes from official PhilHealth sources and 
                is regularly updated to ensure accuracy and reliability.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-[#4a7c59] mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Official Source</h3>
                </div>
                <p className="text-gray-600">
                  Data sourced directly from PhilHealth's authenticated databases and annual reports
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-[#4a7c59] mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Regular Updates</h3>
                </div>
                <p className="text-gray-600">
                  Information is refreshed quarterly to reflect the latest financial and operational data
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-[#4a7c59] mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Privacy Protected</h3>
                </div>
                <p className="text-gray-600">
                  All data is aggregated and anonymized to protect individual member information
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#4a7c59] to-[#3d6449] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Start Exploring PhilHealth Data Today
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Access comprehensive reports, interactive dashboards, and verified information 
              to understand how PhilHealth serves Filipino families.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/financials"
                className="inline-block px-8 py-4 bg-white text-[#4a7c59] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                View Financial Reports
              </Link>
              <Link
                href="/claims"
                className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border-2 border-white/30"
              >
                Explore Claims Data
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

