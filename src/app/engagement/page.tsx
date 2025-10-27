"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { ChartCard } from "@/components/ui/chart-card";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatNumber, formatDate } from "@/lib/utils";
import { MessageSquare, Clock, CheckCircle, Calendar, TrendingUp, FileText } from "lucide-react";

export default function EngagementPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  if (loading || !data) {
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
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Total Complaints"
            value={formatNumber(data.complaintMetrics.totalComplaints)}
            icon={MessageSquare}
            description="Year to date"
          />
          <KPIStatCard
            title="Resolution Rate"
            value={`${data.complaintMetrics.resolutionRate}%`}
            icon={CheckCircle}
            description="Complaints resolved"
          />
          <KPIStatCard
            title="Avg Resolution Time"
            value={`${data.complaintMetrics.avgResolutionDays} days`}
            icon={Clock}
            description="Processing time"
          />
          <KPIStatCard
            title="Satisfaction Score"
            value={`${data.feedback.satisfactionScore}/5.0`}
            icon={TrendingUp}
            description="Member feedback"
          />
        </div>

        {/* Complaint Categories */}
        <ChartCard
          title="Complaint Categories Distribution"
          description="Breakdown of complaints by type"
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.complaintCategories} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={180} />
              <Tooltip formatter={(value: any) => formatNumber(value)} />
              <Legend />
              <Bar dataKey="count" fill="#009a3d" name="Complaints" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Resolution Time Trend */}
        <ChartCard
          title="Monthly Resolution Performance"
          description="Average resolution time trend throughout the year"
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.monthlyResolutions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgDays" fill="#009a3d" name="Avg Days to Resolve" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Policy Updates */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Recent Policy Updates</h2>
          </div>
          <div className="space-y-4">
            {data.policyUpdates.map((update: any) => (
              <div key={update.id} className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {update.category}
                  </span>
                  <span className="text-sm text-muted-foreground">{formatDate(update.date)}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{update.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{update.description}</p>
                <p className="text-xs text-muted-foreground">
                  <strong>Effective Date:</strong> {formatDate(update.effectiveDate)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Public Forums */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Public Forums & Consultations</h2>
          </div>
          <div className="space-y-4">
            {data.publicForums.map((forum: any) => (
              <div key={forum.id} className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{forum.title}</h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        forum.status === "Completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>
                        {forum.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Date:</strong> {formatDate(forum.date)}</p>
                      <p><strong>Location:</strong> {forum.location}</p>
                      {forum.attendees && <p><strong>Attendees:</strong> {formatNumber(forum.attendees)}</p>}
                      <p><strong>Topics:</strong> {forum.topics.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <div className="rounded-lg border border-border bg-card p-8">
          <h2 className="text-2xl font-bold mb-2">Submit Your Feedback</h2>
          <p className="text-sm text-muted-foreground mb-6">
            We value your input. Please share your comments, concerns, or suggestions to help us improve our services.
          </p>

          {submitted ? (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                Thank You for Your Feedback!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your message has been received and will be reviewed by our team.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
