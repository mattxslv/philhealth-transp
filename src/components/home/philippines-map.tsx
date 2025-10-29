"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Building2, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import map component to avoid SSR issues
// @ts-ignore - Dynamic import for client-only component
const MapComponent = dynamic<{ onRegionSelect: (region: string | null) => void }>(
  () => import("./map-component"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    ),
  }
);

const regionalData = [
  { region: "NCR", members: "4.2M", facilities: 892, coverage: "87%", color: "#009a3d" },
  { region: "Region I", members: "1.8M", facilities: 245, coverage: "82%", color: "#06b04d" },
  { region: "Region II", members: "1.2M", facilities: 178, coverage: "79%", color: "#f59e0b" },
  { region: "Region III", members: "3.1M", facilities: 456, coverage: "85%", color: "#009a3d" },
  { region: "Region IV-A", members: "4.5M", facilities: 623, coverage: "88%", color: "#009a3d" },
  { region: "Region IV-B", members: "1.1M", facilities: 167, coverage: "78%", color: "#f59e0b" },
  { region: "Region V", members: "2.3M", facilities: 312, coverage: "81%", color: "#06b04d" },
  { region: "Region VI", members: "2.8M", facilities: 398, coverage: "83%", color: "#06b04d" },
  { region: "Region VII", members: "3.2M", facilities: 445, coverage: "86%", color: "#009a3d" },
  { region: "Region VIII", members: "1.9M", facilities: 267, coverage: "80%", color: "#06b04d" },
  { region: "Region IX", members: "1.5M", facilities: 223, coverage: "77%", color: "#f59e0b" },
  { region: "Region X", members: "1.8M", facilities: 289, coverage: "81%", color: "#06b04d" },
  { region: "Region XI", members: "2.1M", facilities: 334, coverage: "84%", color: "#06b04d" },
  { region: "Region XII", members: "1.3M", facilities: 198, coverage: "76%", color: "#f59e0b" },
  { region: "CAR", members: "0.8M", facilities: 134, coverage: "75%", color: "#f59e0b" },
  { region: "BARMM", members: "1.2M", facilities: 156, coverage: "72%", color: "#f59e0b" },
  { region: "Caraga", members: "1.1M", facilities: 167, coverage: "78%", color: "#f59e0b" },
];

export function PhilippinesMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <section className="relative py-20 overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="relative z-10 mx-auto w-full">
        <motion.div
          className="mx-auto max-w-3xl text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
            PhilHealth Nationwide Coverage
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Interactive regional map showing membership, facilities, and coverage statistics
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-lg rounded-2xl p-6 border border-primary/20"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">35.7M</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-[#06b04d]/10 to-[#06b04d]/5 backdrop-blur-lg rounded-2xl p-6 border border-[#06b04d]/20"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#06b04d]/20 rounded-xl">
                <Building2 className="h-8 w-8 text-[#06b04d]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accredited Facilities</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">6,284</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-lg rounded-2xl p-6 border border-primary/20"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Coverage</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">81.2%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive Map and Regional Statistics Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Interactive Regional Coverage Map
            </h3>
            
            <MapComponent onRegionSelect={setSelectedRegion} />
            
            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#009a3d] rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">High Coverage (≥85%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#06b04d] rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Medium Coverage (80-84%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#f59e0b] rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Lower Coverage (&lt;80%)</span>
              </div>
            </div>
          </motion.div>

          {/* Regional Statistics Table - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Regional Statistics
              </h3>
            </div>
            <div className="overflow-y-auto max-h-[700px]">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
                      Region
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white">
                      Members
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white">
                      Facilities
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white">
                      Coverage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {regionalData.map((data) => (
                    <tr
                      key={data.region}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                        selectedRegion === data.region ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: data.color }}
                          ></div>
                          {data.region}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-600 dark:text-gray-300">
                        {data.members}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-600 dark:text-gray-300">
                        {data.facilities.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          parseInt(data.coverage) >= 85
                            ? 'bg-[#009a3d]/10 text-[#009a3d] dark:bg-[#009a3d]/20 dark:text-[#06b04d]'
                            : parseInt(data.coverage) >= 80
                            ? 'bg-[#06b04d]/10 text-[#06b04d] dark:bg-[#06b04d]/20 dark:text-[#06b04d]'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {data.coverage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Data as of October 2025 • Updated quarterly • Click on regions for details
          </p>
        </motion.div>
      </div>
    </section>
  );
}
