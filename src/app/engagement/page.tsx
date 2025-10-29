import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Public Engagement",
  description: "PhilHealth public engagement initiatives, surveys, feedback, and community participation programs.",
};

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { YearSelector } from "@/components/ui/year-selector";
import { ExportButton } from "@/components/ui/export-button";
import { AlertCircle, Info, TrendingUp, MessageSquare, Calendar, FileCheck } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { PageLoadingSkeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const COLORS = ["#009a3d", "#ef4444", "#f59e0b", "#3b82f6"];

export default function EngagementPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ type: "network" | "notfound" | "generic"; message?: string } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2007);

  const loadData = () => {
    setLoading(true);
    setError(null);
    
    axios.get("/data/engagement.json")
      .then(res => {
        if (!res.data) {
          setError({ type: "notfound", message: "Engagement data is not available at this time." });
          setLoading(false);
          return;
        }
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading engagement data:", err);
        if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
          setError({ type: "network", message: "Unable to load engagement data. Please check your connection." });
        } else if (err.response?.status === 404) {
          setError({ type: "notfound", message: "Engagement data file was not found." });
        } else {
          setError({ type: "generic", message: "An unexpected error occurred while loading engagement data." });
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoadingSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage
          type={error.type}
          message={error.message}
          onRetry={loadData}
          showHomeButton={true}
        />
      </DashboardLayout>
    );
  }

  // Future Enhancement: Sample complaint data
  const sampleComplaints = [
    { type: "Claims Delay", count: 345 },
    { type: "Benefit Inquiry", count: 287 },
    { type: "Service Quality", count: 156 },
    { type: "Other", count: 92 }
  ];

  const complaintsPieData = {
    labels: sampleComplaints.map(c => c.type),
    datasets: [{
      data: sampleComplaints.map(c => c.count),
      backgroundColor: COLORS,
      borderColor: "#fff",
      borderWidth: 3,
      hoverOffset: 15,
    }]
  };

  const complaintsPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { padding: 15, font: { size: 11 } }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed} complaints`
        }
      }
    }
  };

  // Future Enhancement: Monthly complaint trends
  const sampleTrends = [
    { month: "Jan", count: 95 },
    { month: "Feb", count: 88 },
    { month: "Mar", count: 102 },
    { month: "Apr", count: 78 },
    { month: "May", count: 85 },
    { month: "Jun", count: 73 }
  ];

  const trendsBarData = {
    labels: sampleTrends.map(t => t.month),
    datasets: [{
      label: "Complaints",
      data: sampleTrends.map(t => t.count),
      backgroundColor: "rgba(59, 130, 246, 0.8)",
      borderColor: "rgb(59, 130, 246)",
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const trendsBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => `${context.parsed.y} complaints`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 20 },
        grid: { color: "rgba(0, 0, 0, 0.05)" }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with Export */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Public Engagement</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Stakeholder consultations, public feedback, and community outreach initiatives
            </p>
          </div>
          <ExportButton
            data={data}
            filename={`philhealth-engagement-${selectedYear}`}
          />
        </div>

        {/* Year Selector */}
        <YearSelector
          selectedYear={selectedYear}
          availableYears={[2007]}
          onYearChange={setSelectedYear}
          hasDetailedBreakdown={false}
        />

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded shadow-sm">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Data Availability Notice</h3>
              <p className="text-yellow-800">
                Detailed public engagement metrics are currently being compiled. The information below represents future data structure templates based on PhilHealth engagement initiatives.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Future Data</h3>
            <p className="text-sm text-gray-600 mb-2">Total Feedback</p>
            <p className="text-xs text-gray-500">Year-to-date metric</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <FileCheck className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Future Data</h3>
            <p className="text-sm text-gray-600 mb-2">Resolved Cases</p>
            <p className="text-xs text-gray-500">Resolution rate metric</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Future Data</h3>
            <p className="text-sm text-gray-600 mb-2">Satisfaction Rate</p>
            <p className="text-xs text-gray-500">Survey results</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Future Data</h3>
            <p className="text-sm text-gray-600 mb-2">Avg Response Time</p>
            <p className="text-xs text-gray-500">In business days</p>
          </div>
        </div>

        {/* Future Enhancement: Comprehensive Engagement Dashboard */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Future Enhancements: Public Engagement & Accountability</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                The following features are planned for implementation when engagement data becomes available:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Complaint Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200"> Complaint and Resolution Statistics</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Track how member grievances are handled, including complaint types, volumes, and resolution outcomes.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Total complaints by category and severity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Resolution rates and outcomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Average resolution time by complaint type</span>
                </li>
              </ul>
            </div>

            {/* Policy Updates */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">?? Policy Updates and Circulars</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Stay informed about new regulations, policy changes, and official circulars affecting PhilHealth members.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Recent policy updates and effective dates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Official circulars and memoranda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Impact summaries for members</span>
                </li>
              </ul>
            </div>

            {/* Contact Channels */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">?? Contact Information and Channels</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Clear and accessible contact channels for inquiries, feedback, and support requests.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Hotline numbers and email addresses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Regional office contact details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Social media and chat support</span>
                </li>
              </ul>
            </div>

            {/* Feedback System */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">?? Feedback System</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Interactive feedback portal for members to share experiences, suggestions, and concerns.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Online feedback submission forms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Satisfaction surveys and ratings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Real-time tracking of submitted feedback</span>
                </li>
              </ul>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700 md:col-span-2">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">?? Performance Metrics Against Targets</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Measurable goals and actual performance data to track PhilHealth's service quality and efficiency.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Service level agreements (SLAs) and achievement rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Target vs actual performance dashboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5"></span>
                  <span>Key performance indicators (KPIs) by department and region</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sample Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-300">Preview: Complaint Distribution (Template)</h4>
              <div className="h-[300px]">
                <Pie data={complaintsPieData} options={complaintsPieOptions} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
                * Template showing complaint types breakdown
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-300">Preview: Monthly Trends (Template)</h4>
              <div className="h-[300px]">
                <Bar data={trendsBarData} options={trendsBarOptions} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
                * Template showing complaint volume trends over time
              </p>
            </div>
          </div>

          <div className="mt-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-300 dark:border-blue-700">
            <p className="text-xs text-blue-800 dark:text-blue-200 italic">
              ?? <strong>Note:</strong> Public engagement data including complaint statistics and resolution metrics require integration with
              PhilHealth's Member Services and Grievance Management systems. We are working to make this information publicly accessible for transparency.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q:</span> How can I file a complaint or provide feedback to PhilHealth?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 pl-6">
                A: You can file complaints through PhilHealth's official hotline, email, website contact form, or by visiting 
                your local PhilHealth office. All complaints are documented and addressed according to established procedures.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q:</span> How does PhilHealth engage with stakeholders?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 pl-6">
                A: PhilHealth conducts regular consultations with various stakeholder groups including members, healthcare providers, 
                employers, civil society organizations, and government agencies. These consultations help shape policies and improve services.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q:</span> What is the average resolution time for complaints?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 pl-6">
                A: Resolution times vary depending on complaint complexity. Simple inquiries are typically addressed within 
                5-7 working days, while more complex cases may require additional investigation. PhilHealth is committed to 
                timely and fair resolution of all concerns.
              </p>
            </div>
          </div>
        </div>

        {/* Data Source */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-emerald-500 dark:border-emerald-400 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              <strong>Data Source:</strong> PhilHealth Annual Report {selectedYear} (Official Audited Data) | 
              <strong> Last Updated:</strong> December 31, {selectedYear}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


