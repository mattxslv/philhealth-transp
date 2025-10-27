"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { AlertCircle, Info, TrendingUp, MessageSquare, Calendar, FileCheck } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatNumber } from "@/lib/utils";

const COLORS = ["#009a3d", "#ef4444", "#f59e0b", "#3b82f6"];

export default function EngagementPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeading
          title="Public Engagement"
          description="Engagement initiatives and feedback channels"
        />
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded shadow-sm">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Data Not Available</h3>
              <p className="text-sm text-yellow-800 mb-4">
                {data?.message || "Detailed public engagement data is not available in the PhilHealth 2023 Annual Report."}
              </p>
              <div className="text-sm text-yellow-700">
                <p className="font-semibold mb-2">For engagement opportunities and to provide feedback:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Visit the official PhilHealth website</li>
                  <li>Contact the Member Services hotline</li>
                  <li>Visit your local PhilHealth office</li>
                  <li>Follow PhilHealth on social media for updates and announcements</li>
                  <li>Participate in public consultations and stakeholder forums</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">About PhilHealth Public Engagement</h3>
          <div className="prose prose-sm text-gray-600 space-y-3">
            <p>
              PhilHealth is committed to transparency and accountability through various public engagement 
              channels. Members and stakeholders can provide feedback, file complaints, and participate in 
              policy consultations.
            </p>
            <p>
              The organization regularly conducts public forums, stakeholder consultations, and information 
              campaigns to ensure that members are informed about their benefits and rights.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              <strong>Note:</strong> The PhilHealth 2023 Annual Report focuses on financial statements, claims analytics, 
              membership coverage, and governance structure. Detailed public engagement metrics and complaint 
              resolution data are maintained through separate customer service systems.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">How to Engage with PhilHealth</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-green-700 mb-2">Member Services</h4>
              <p className="text-sm text-gray-600">
                Contact PhilHealth Member Services for inquiries about benefits, contributions, and claims status.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-green-700 mb-2">Public Consultations</h4>
              <p className="text-sm text-gray-600">
                Participate in policy consultations and stakeholder forums to voice your opinions and suggestions.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-green-700 mb-2">Complaint Resolution</h4>
              <p className="text-sm text-gray-600">
                File complaints through official channels for prompt investigation and resolution.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-green-700 mb-2">Information Campaigns</h4>
              <p className="text-sm text-gray-600">
                Stay updated through information drives, social media, and local office announcements.
              </p>
            </div>
          </div>
        </div>

        {/* FUTURE ENHANCEMENT SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Future Enhancement: Public Engagement Dashboard</h3>
              <p className="text-sm text-blue-800 mb-4">
                The sections below show templates for what can be added when public engagement data becomes available. 
                This would include complaint metrics, resolution tracking, policy updates, and consultation schedules.
              </p>
            </div>
          </div>

          {/* Sample Complaint Metrics */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Complaint Metrics Dashboard (Template)</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: "Total Complaints", value: "[Future] 12,450", icon: MessageSquare, color: "blue" },
                { label: "Resolved", value: "[Future] 11,280", icon: FileCheck, color: "green" },
                { label: "Pending", value: "[Future] 890", icon: TrendingUp, color: "yellow" },
                { label: "Escalated", value: "[Future] 280", icon: AlertCircle, color: "red" },
              ].map((metric, index) => (
                <div key={index} className="border rounded-lg p-4 text-center">
                  <metric.icon className={`w-8 h-8 mx-auto mb-2 text-${metric.color}-600`} />
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-gray-600 mt-1">{metric.label}</p>
                </div>
              ))}
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { category: "[Future] Claims Issues", count: 4500, resolved: 4200 },
                    { category: "[Future] Coverage Questions", count: 3200, resolved: 3050 },
                    { category: "[Future] Facility Issues", count: 2100, resolved: 1980 },
                    { category: "[Future] Contribution Concerns", count: 1800, resolved: 1650 },
                    { category: "[Future] Other", count: 850, resolved: 400 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" fontSize={10} angle={-15} textAnchor="end" height={80} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#3b82f6" name="Total" />
                  <Bar dataKey="resolved" fill="#009a3d" name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how complaints could be categorized by type with resolution status, 
              helping identify common issues and track customer service performance.
            </p>
          </div>

          {/* Sample Resolution Trends */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Monthly Resolution Trends (Template)</h4>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: "Jan", received: 1050, resolved: 980, avgDays: 12 },
                    { month: "Feb", received: 985, resolved: 950, avgDays: 11 },
                    { month: "Mar", received: 1120, resolved: 1080, avgDays: 13 },
                    { month: "Apr", received: 1020, resolved: 990, avgDays: 12 },
                    { month: "May", received: 1065, resolved: 1040, avgDays: 10 },
                    { month: "Jun", received: 1010, resolved: 980, avgDays: 11 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="received" stroke="#3b82f6" strokeWidth={2} name="Received" />
                  <Line type="monotone" dataKey="resolved" stroke="#009a3d" strokeWidth={2} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how complaint trends could be monitored monthly with resolution rates 
              and average processing times to ensure quality service delivery.
            </p>
          </div>

          {/* Sample Policy Updates */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Policy Updates Timeline (Template)</h4>
            <div className="space-y-3">
              {[
                {
                  date: "Dec 2023",
                  title: "[Future] Enhanced Z-Benefits Package",
                  description: "Expansion of coverage for critical illnesses",
                  status: "Implemented"
                },
                {
                  date: "Nov 2023",
                  title: "[Future] Digital Claims Submission",
                  description: "Launch of online claims portal for faster processing",
                  status: "Implemented"
                },
                {
                  date: "Oct 2023",
                  title: "[Future] Konsulta Program Expansion",
                  description: "Additional primary care providers in underserved areas",
                  status: "Implemented"
                },
              ].map((update, index) => (
                <div key={index} className="flex gap-4 border-l-2 border-green-500 pl-4 py-2">
                  <div className="flex-shrink-0">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-semibold text-sm text-gray-900">{update.title}</h5>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {update.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{update.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{update.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how policy changes and updates could be communicated with 
              implementation dates, descriptions, and downloadable documents.
            </p>
          </div>

          {/* Sample Public Consultations */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Public Consultation Calendar (Template)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Topic</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Location</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { date: "Jan 15, 2024", topic: "[Future] Benefit Package Review", location: "Manila", status: "Upcoming" },
                    { date: "Jan 22, 2024", topic: "[Future] Rural Health Initiatives", location: "Cebu", status: "Upcoming" },
                    { date: "Dec 10, 2023", topic: "[Future] Member Feedback Forum", location: "Davao", status: "Completed" },
                  ].map((consultation, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-xs">{consultation.date}</td>
                      <td className="px-4 py-2 text-xs font-medium">{consultation.topic}</td>
                      <td className="px-4 py-2 text-xs">{consultation.location}</td>
                      <td className="px-4 py-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          consultation.status === "Upcoming" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {consultation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how public consultations could be scheduled and tracked with 
              dates, topics, locations, registration links, and participation summaries.
            </p>
          </div>
        </div>

        {data?.metadata && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>Data Source:</strong> {data.metadata.source} | 
              <strong> Reporting Period:</strong> {data.metadata.reportingPeriod} | 
              <strong> Note:</strong> {data.metadata.note}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
