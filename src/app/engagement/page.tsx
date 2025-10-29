"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { 
  MessageSquare, 
  FileText, 
  Phone, 
  Target,
  BookOpen,
  Briefcase,
  DollarSign,
  FileCheck
} from "lucide-react";

export default function EngagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Public Engagement</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Transparency in public feedback, complaints resolution, and stakeholder communication
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            About This Page
          </h3>
          <p className="text-blue-800 dark:text-blue-200">
            This page is dedicated to public engagement and stakeholder communication information. The sections below represent key areas of transparency 
            that are essential for member satisfaction and accountability. Please note that PhilHealth has not provided detailed data for these specific 
            categories in their published annual reports (2024-2022).
          </p>
        </div>

        {/* Complaint and Resolution Statistics */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <MessageSquare className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Complaint and Resolution Statistics
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-3">
                How grievances are handled and resolved
              </p>
              <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded p-4">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ?? Data Not Provided by PhilHealth
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  PhilHealth has not published complaint and resolution statistics in their public annual reports. This information would typically include:
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-800 dark:text-yellow-200 mt-2 space-y-1 ml-4">
                  <li>Total number of complaints received (by category: claims, membership, service quality, etc.)</li>
                  <li>Resolution rates and average resolution time</li>
                  <li>Complaint channels used (hotline, email, walk-in, online portal)</li>
                  <li>Types of grievances (medical claims denial, billing issues, access problems)</li>
                  <li>Escalation statistics and member satisfaction scores</li>
                  <li>Trend analysis showing improvement or decline in complaint volumes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Updates and Circulars */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <FileText className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Policy Updates and Circulars
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-3">
                New regulations affecting members
              </p>
              <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded p-4">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ?? Data Not Provided by PhilHealth
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  PhilHealth has not published a comprehensive list of policy updates and circulars in their annual reports. This information would typically include:
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-800 dark:text-yellow-200 mt-2 space-y-1 ml-4">
                  <li>Circular numbers and issuance dates (e.g., Circular No. 2024-0001)</li>
                  <li>Policy titles and brief descriptions of changes</li>
                  <li>Effective dates and implementation timelines</li>
                  <li>Affected member categories or benefit packages</li>
                  <li>Impact summary (e.g., increased coverage, new requirements)</li>
                  <li>Links to full circular documents for detailed review</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Phone className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Contact Information
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-3">
                Clear channels for inquiries and feedback
              </p>
              <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded p-4">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ?? Data Not Provided by PhilHealth
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  PhilHealth has not published comprehensive contact information in their annual reports. This information would typically include:
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-800 dark:text-yellow-200 mt-2 space-y-1 ml-4">
                  <li>National hotline numbers with operating hours</li>
                  <li>Email addresses for different departments (claims, membership, complaints)</li>
                  <li>Regional office addresses and contact numbers</li>
                  <li>Online portal URLs for member services</li>
                  <li>Social media channels for quick inquiries</li>
                  <li>Helpdesk chat support availability</li>
                  <li>Mailing addresses for formal correspondence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics Against Targets */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Target className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Performance Metrics Against Targets
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-3">
                Measurable goals and actual performance
              </p>
              <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded p-4">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ?? Data Not Provided by PhilHealth
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  PhilHealth has not published performance metrics against targets in their annual reports. This information would typically include:
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-800 dark:text-yellow-200 mt-2 space-y-1 ml-4">
                  <li>Target vs. actual membership enrollment rates</li>
                  <li>Claims processing time targets vs. actual performance</li>
                  <li>Member satisfaction score goals and achievement levels</li>
                  <li>Service level agreements (SLAs) and compliance rates</li>
                  <li>Accreditation targets vs. actual facilities accredited</li>
                  <li>Coverage expansion goals vs. actual beneficiaries reached</li>
                  <li>Financial sustainability targets vs. actual reserve ratios</li>
                  <li>Quality improvement initiatives and success metrics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Transparency & Member Engagement
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Effective public engagement requires transparent communication about complaints handling, policy changes, contact channels, and performance tracking. 
            This page highlights areas where additional disclosure would enhance member satisfaction, trust, and PhilHealth's responsiveness to public needs.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> The absence of public engagement data does not necessarily indicate poor service. However, comprehensive disclosure of 
              complaint statistics, policy update timelines, accessible contact information, and performance metrics would align with international best practices 
              in public service transparency and strengthen member confidence in PhilHealth's commitment to continuous improvement.
            </p>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#009a3d]" />
            Additional Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/downloads/annual-reports"
              className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors border border-green-200 dark:border-green-800"
            >
              <FileText className="w-8 h-8 text-[#009a3d]" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Annual Reports</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download complete annual reports</p>
              </div>
            </Link>
            
            <Link 
              href="/governance"
              className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800"
            >
              <FileCheck className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Governance & Accountability</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Review governance transparency</p>
              </div>
            </Link>

            <Link 
              href="/financials"
              className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors border border-green-200 dark:border-green-800"
            >
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Financial Performance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">View financial statements</p>
              </div>
            </Link>

            <Link 
              href="/claims"
              className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors border border-yellow-200 dark:border-yellow-800"
            >
              <MessageSquare className="w-8 h-8 text-yellow-600" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Claims Analytics</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Review claims data</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
