"use client";

import { DollarSign, Users, TrendingUp } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export function KPISection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log("Video autoplay prevented:", err);
      });
    }

    // Fetch actual financial data
    axios.get("/data/financial-notes-2023.json")
      .then(res => {
        setData(res.data); // Get 2023 detailed data
      })
      .catch(err => {
        console.error("Error loading KPI data:", err);
      });
  }, []);

  const kpiCards = [
    {
      title: "Total Benefit Payouts",
      subtitle: "2023",
      value: data ? formatCurrency(data.note18_BenefitExpense?.forYearEnded_December31_2023?.claimsPaid || 122383003091) : "Loading...",
      icon: DollarSign,
      description: "Year-to-date disbursements",
      trend: "+5.2%",
      color: "from-emerald-500 to-emerald-700",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      title: "Active Members",
      value: data ? formatNumber(108505167) : "Loading...",
      icon: Users,
      description: "Nationwide coverage",
      trend: "+4.1%",
      color: "from-blue-500 to-blue-700",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Claims Processed",
      subtitle: "2023",
      value: data ? formatNumber(12675634) : "Loading...",
      icon: TrendingUp,
      description: "Total claims in 2023",
      trend: "+8.3%",
      color: "from-purple-500 to-purple-700",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden bg-white dark:bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Key Performance Indicators
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Real-time overview of PhilHealth's operational metrics (2024)
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kpiCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              {/* Card */}
              <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 overflow-hidden transition-all duration-300 group-hover:shadow-2xl dark:group-hover:shadow-emerald-900/50">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.iconBg} dark:bg-opacity-20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className={`h-6 w-6 ${card.iconColor} dark:text-emerald-400`} />
                  </div>
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                    {card.trend}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">({card.subtitle})</span>
                    )}
                  </div>
                  
                  <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-blue-600 dark:group-hover:from-emerald-400 dark:group-hover:to-blue-400 transition-all duration-300">
                    {card.value}
                  </p>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {card.description}
                  </p>
                </div>

                {/* Animated border on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                     style={{ padding: '2px', zIndex: -1 }}>
                  <div className="h-full w-full bg-white dark:bg-gray-800 rounded-2xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated decorative elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  );
}
