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

        {/* Interactive Map and Regional Statistics Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Interactive Regional Coverage Map
            </h3>
            
            <MapComponent onRegionSelect={setSelectedRegion} />
          </motion.div>

          {/* Coverage Statistics - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                2024 Coverage Statistics
              </h3>
              
              {/* Summary Stats as Text */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">58.7M</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Beneficiaries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">102.75M</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Coverage</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">91.0%</p>
                </div>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[700px]">
              {/* Membership Breakdown */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Membership Distribution
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Employed Sector</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">22,003,461 (37.49%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#009a3d] rounded-full" style={{ width: '37.49%' }}></div>
                    </div>
                    <div className="mt-2 ml-4 space-y-1">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>• Government</span>
                        <span>3,008,865</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>• Private</span>
                        <span>18,994,596</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Informal / Self-Earning</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">10,812,544 (18.42%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#06b04d] rounded-full" style={{ width: '18.42%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Indirect Contributors</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">21,458,882 (36.56%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#10b981] rounded-full" style={{ width: '36.56%' }}></div>
                    </div>
                    <div className="mt-2 ml-4 space-y-1">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>• Indigents/NHTS-PR</span>
                        <span>8,989,996</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>• Senior Citizens</span>
                        <span>9,948,757</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>• Sponsored Program</span>
                        <span>2,520,129</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">OFWs/Migrant Workers</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">3,044,054 (5.18%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#14b8a6] rounded-full" style={{ width: '5.18%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Lifetime Members</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">1,300,043 (2.21%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0ea5e9] rounded-full" style={{ width: '2.21%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Healthcare Facilities Breakdown */}
              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Accredited Healthcare Facilities
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Hospitals</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">2,925</span>
                  </div>
                  <div className="ml-4 space-y-2">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>• Government</span>
                      <span>1,327</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>• Private</span>
                      <span>1,598</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Primary Care Providers</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">6,150</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Maternity Clinics</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">1,725</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Ambulatory Surgery Centers</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">985</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Freestanding Dialysis</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">428</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Healthcare Professionals</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">375,400</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
