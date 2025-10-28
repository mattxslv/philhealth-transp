"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { YearSelector } from "@/components/ui/year-selector";
import { AlertCircle, Info, TrendingUp, MessageSquare, Calendar, FileCheck } from "lucide-react";
import { formatNumber } from "@/lib/utils";
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
  const [selectedYear, setSelectedYear] = useState<number>(2023);

  useEffect(() => {
    axios.get("/data/engagement.json")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading engagement data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading engagement data...</div>
        </div>
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
        {/* Year Selector */}
        <YearSelector
          selectedYear={selectedYear}
          availableYears={[2023]}
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

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-200 shadow-sm">
          <div className="flex items-start mb-6">
            <Info className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Future Enhancement: Complaint Analytics</h2>
              <p className="text-gray-700 mb-6">
                Once complaint data becomes available, this section will display interactive visualizations of complaint types, resolution trends, and satisfaction metrics.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Complaint Distribution (Sample)</h3>
              <div className="h-[300px]">
                <Pie data={complaintsPieData} options={complaintsPieOptions} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Trends (Sample)</h3>
              <div className="h-[300px]">
                <Bar data={trendsBarData} options={trendsBarOptions} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Future: Resolution Time Trends</h3>
            <p className="text-sm text-gray-600 mb-4">Track average resolution time improvements over months</p>
            <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Line chart showing resolution time trends will appear here</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-lg border border-green-200 shadow-sm">
          <div className="flex items-start mb-6">
            <Info className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Future Enhancement: Policy Updates Feed</h2>
              <p className="text-gray-700 mb-6">
                This section will display recent policy updates, circulars, and announcements affecting members.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white p-4 rounded-lg shadow border border-green-100">
                <div className="flex items-start">
                  <FileCheck className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Policy Update #{item}</h4>
                    <p className="text-sm text-gray-600 mb-2">Description of policy changes or announcements</p>
                    <p className="text-xs text-gray-500">Date: Future data</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg border border-purple-200 shadow-sm">
          <div className="flex items-start mb-6">
            <Info className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Future Enhancement: Public Consultation Calendar</h2>
              <p className="text-gray-700 mb-6">
                View upcoming public consultations, town halls, and stakeholder engagement events.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-purple-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3].map((item) => (
                  <tr key={item}>
                    <td className="px-4 py-4 text-sm text-gray-900">Consultation Event #{item}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">Future Date</td>
                    <td className="px-4 py-4 text-sm text-gray-600">Location TBD</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Calendar className="w-3 h-3 mr-1" />
                        Public
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This page displays template structures for future engagement data. Actual metrics will be populated as they become available from PhilHealth official sources.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
