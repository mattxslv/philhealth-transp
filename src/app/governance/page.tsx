"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeading } from "@/components/ui/page-heading";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Users, FileText, DollarSign, Shield, Info, Calendar, Vote, Eye } from "lucide-react";

export default function GovernancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/data/governance-2023.json")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading governance data:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading governance data...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeading
          title="Corporate Governance"
          description="Official governance structure from PhilHealth 2023 Annual Report"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPIStatCard
            title="Board Members"
            value={formatNumber(data.corporateGovernance.totalBoardMembers)}
            icon={Users}
            description="Board of Directors"
          />
          <KPIStatCard
            title="Board Meetings"
            value={formatNumber(data.corporateGovernance.totalBoardMeetings)}
            icon={FileText}
            description="Held in 2023"
          />
          <KPIStatCard
            title="Board Resolutions"
            value={formatNumber(data.corporateGovernance.totalBoardResolutions)}
            icon={FileText}
            description="Passed in 2023"
          />
          <KPIStatCard
            title="Board Compensation"
            value={formatCurrency(data.boardOfDirectors.boardCompensation2023.totalHonorarium)}
            icon={DollarSign}
            description="Total for 2023"
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Board of Directors (2023)</h3>
          <div className="space-y-4">
            {data.boardOfDirectors.composition.map((member: any, index: number) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.position}</p>
                    {member.title && <p className="text-sm text-gray-500">{member.title} - {member.department}</p>}
                    {member.credentials && <p className="text-xs text-gray-500">{member.credentials}</p>}
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{member.sector}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Senior Vice Presidents</h3>
            <div className="space-y-3">
              {data.executiveOfficers.seniorVicePresidents.map((svp: any, index: number) => (
                <div key={index} className="flex justify-between items-start border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{svp.name}</p>
                    <p className="text-xs text-gray-600">{svp.sector}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Executive Compensation</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Key Management Personnel (2023)</span>
                <span className="font-semibold">{formatCurrency(data.executiveOfficers.compensation2023.keyManagementPersonnel.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Key Management Personnel (2022)</span>
                <span className="font-semibold">{formatCurrency(data.executiveOfficers.compensation2022.keyManagementPersonnel.total)}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Board Honorarium (2023)</span>
                  <span className="font-semibold">{formatCurrency(data.boardOfDirectors.boardCompensation2023.totalHonorarium)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">Board Honorarium (2022)</span>
                  <span className="font-semibold">{formatCurrency(data.boardOfDirectors.boardCompensation2022.totalHonorarium)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Corporate Values</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Vision:</p>
              <p className="text-sm text-gray-600">{data.corporateValues.vision}</p>
              <p className="text-xs text-gray-500 italic">{data.corporateValues.visionEnglish}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Mission:</p>
              <p className="text-sm text-gray-600">{data.corporateValues.mission}</p>
              <p className="text-xs text-gray-500 italic">{data.corporateValues.missionEnglish}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Core Values:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {data.corporateValues.coreValues.map((value: string, index: number) => (
                  <div key={index} className="text-xs bg-green-50 text-green-800 px-3 py-2 rounded">
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FUTURE ENHANCEMENT SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Future Enhancement: Advanced Governance Transparency</h3>
              <p className="text-sm text-blue-800 mb-4">
                The sections below show templates for what can be added when more detailed governance data becomes available. 
                This would include detailed board member profiles, meeting minutes, voting records, and resolution tracking.
              </p>
            </div>
          </div>

          {/* Sample Board Member Profiles */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Enhanced Board Member Profiles (Template)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "[Future] Board Member A",
                  position: "Chairperson",
                  sector: "Government",
                  term: "2022-2025",
                  attendance: "95%",
                  committees: ["Executive Committee", "Audit Committee"]
                },
                {
                  name: "[Future] Board Member B",
                  position: "Vice-Chairperson",
                  sector: "Private",
                  term: "2023-2026",
                  attendance: "92%",
                  committees: ["Finance Committee", "Risk Management"]
                }
              ].map((member, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-semibold text-gray-900">{member.name}</h5>
                      <p className="text-sm text-gray-600">{member.position}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {member.sector}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>Term: {member.term}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Vote className="w-3 h-3" />
                      <span>Attendance: {member.attendance}</span>
                    </div>
                    <div className="mt-2">
                      <p className="font-medium">Committee Memberships:</p>
                      {member.committees.map((committee, idx) => (
                        <span key={idx} className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs mr-1 mt-1">
                          {committee}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how board member profiles could include: biographical information, 
              educational background, professional experience, committee assignments, attendance records, 
              and disclosure of potential conflicts of interest.
            </p>
          </div>

          {/* Sample Meeting Minutes */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Board Meeting Minutes Access (Template)</h4>
            <div className="space-y-2">
              {[
                { date: "December 2023", title: "[Future] Regular Board Meeting #12", status: "Published", topics: 5 },
                { date: "November 2023", title: "[Future] Regular Board Meeting #11", status: "Published", topics: 7 },
                { date: "October 2023", title: "[Future] Special Board Meeting", status: "Published", topics: 3 },
                { date: "September 2023", title: "[Future] Regular Board Meeting #10", status: "Published", topics: 6 },
              ].map((meeting, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{meeting.title}</p>
                      <p className="text-xs text-gray-500">{meeting.date} • {meeting.topics} agenda items</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {meeting.status}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how board meeting minutes could be made accessible with: 
              date, agenda items, attendees, resolutions passed, and downloadable PDF documents.
            </p>
          </div>

          {/* Sample Resolution Tracking */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Sample Board Resolution Tracking (Template)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Resolution No.</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { number: "[Future] 2023-145", title: "Budget Approval FY 2024", date: "Dec 15, 2023", status: "Implemented" },
                    { number: "[Future] 2023-144", title: "Policy Amendment - Claims Processing", date: "Dec 1, 2023", status: "In Progress" },
                    { number: "[Future] 2023-143", title: "Facility Accreditation Standards", date: "Nov 20, 2023", status: "Implemented" },
                  ].map((resolution, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-xs">{resolution.number}</td>
                      <td className="px-4 py-2 text-xs">{resolution.title}</td>
                      <td className="px-4 py-2 text-xs">{resolution.date}</td>
                      <td className="px-4 py-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          resolution.status === "Implemented" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {resolution.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              * This template shows how board resolutions could be tracked with: resolution number, 
              title, description, voting record, implementation status, and related documents.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-800">
            <strong>Data Source:</strong> {data.metadata.source} | 
            <strong> Reporting Period:</strong> {data.metadata.reportingPeriod}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
