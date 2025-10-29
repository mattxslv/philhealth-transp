"use client";

import Link from "next/link";
import { FileText, Activity, Building2, FileCheck, Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    name: "Financial Reports",
    description: "See how we spend the funds. Every peso, accounted for!",
    icon: FileText,
    href: "/financials",
    gradient: "from-[#009a3d] to-[#06b04d]",
  },
  {
    name: "Claims Analytics",
    description: "Real-time data on approval rates and processing times. Nothing hidden!",
    icon: Activity,
    href: "/claims",
    gradient: "from-[#06b04d] to-[#10b981]",
  },
  {
    name: "Accredited Facilities",
    description: "Find hospitals near you. 6,000+ facilities nationwide!",
    icon: Building2,
    href: "/facilities",
    gradient: "from-[#009a3d] to-[#059669]",
  },
  {
    name: "Procurement Records",
    description: "What we bought, how much, from whom. Full transparency in bidding!",
    icon: FileCheck,
    href: "/procurement",
    gradient: "from-amber-500 to-yellow-600",
  },
  {
    name: "Coverage Statistics",
    description: "How many members do we have? See enrollment trends and membership data.",
    icon: Users,
    href: "/coverage",
    gradient: "from-[#06b04d] to-[#009a3d]",
  },
  {
    name: "Governance",
    description: "Board resolutions, minutes, policies—everything is here for you.",
    icon: ShieldCheck,
    href: "/governance",
    gradient: "from-[#10b981] to-[#06b04d]",
  },
];

export function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      
      {/* Content */}
      <div className="relative z-10 mx-auto w-full">
        <motion.div
          className="mx-auto max-w-3xl text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
            Explore Our Data
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to know about PhilHealth—open and accessible for everyone
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Link
                href={feature.href}
                className="group relative block h-full"
              >
                <div className="relative h-full bg-white/8 backdrop-blur-lg rounded-3xl p-8 border border-white/20 overflow-hidden transition-all duration-700 hover:bg-white/15 hover:border-white/30 hover:shadow-2xl hover:shadow-white/20">
                  {/* Enhanced gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-700`} />
                  
                  {/* Animated background sparkles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-8 right-8 w-1 h-1 bg-white/70 rounded-full animate-pulse delay-100"></div>
                    <div className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse delay-200"></div>
                  </div>
                  
                  {/* Icon with enhanced styling */}
                  <div className="mb-8">
                    <motion.div 
                      className={`inline-flex p-5 rounded-3xl bg-gradient-to-br ${feature.gradient} shadow-2xl relative overflow-hidden`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <feature.icon className="h-10 w-10 text-white relative z-10" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#009a3d] group-hover:to-[#06b04d] dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all duration-500">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
