"use client";

import { useEffect, useState } from "react";
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
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { motion } from "framer-motion";

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

const COLORS = ["#009a3d", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function DataVisualization() {
  // Quick Stats Data
  const membershipData = {
    labels: ["Direct Contributors", "Indirect Contributors", "Senior Citizens", "Indigents"],
    datasets: [{
      data: [35, 28, 22, 15],
      backgroundColor: COLORS,
      borderColor: "#fff",
      borderWidth: 3,
      hoverOffset: 15,
    }]
  };

  const membershipOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { padding: 15, font: { size: 11 }, color: "#374151" }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed}%`
        }
      }
    }
  };

  // Regional Coverage Data
  const regionalData = {
    labels: ["NCR", "Region IV-A", "Region III", "Region VII", "Region VI"],
    datasets: [{
      label: "Members (Millions)",
      data: [15.2, 12.8, 9.5, 8.3, 7.1],
      backgroundColor: "rgba(0, 154, 61, 0.8)",
      borderColor: "#009a3d",
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const regionalOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => `${context.parsed.y}M members`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          callback: (value: any) => `${value}M`,
          color: "#6b7280"
        },
        grid: { color: "rgba(0, 0, 0, 0.05)" }
      },
      x: {
        ticks: { color: "#6b7280" },
        grid: { display: false }
      }
    }
  };

  // Growth Trends Data
  const growthData = {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Total Members",
        data: [95.3, 98.7, 102.4, 106.8, 112.9],
        borderColor: "#009a3d",
        backgroundColor: "rgba(0, 154, 61, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#009a3d",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Claims Processed",
        data: [8.5, 9.2, 10.1, 11.5, 12.7],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      }
    ]
  };

  const growthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { padding: 15, font: { size: 12 }, usePointStyle: true, color: "#374151" }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return label === "Total Members" ? `${label}: ${value}M` : `${label}: ${value}M`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { 
          callback: (value: any) => `${value}M`,
          color: "#6b7280"
        },
        grid: { color: "rgba(0, 0, 0, 0.05)" }
      },
      x: {
        ticks: { color: "#6b7280" },
        grid: { display: false }
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            PhilHealth at a Glance
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Visual insights into our membership, coverage, and growth trends
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Membership Distribution</h3>
            <div className="h-[300px]">
              <Doughnut data={membershipData} options={membershipOptions} />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Top 5 Regions by Membership</h3>
            <div className="h-[300px]">
              <Bar data={regionalData} options={regionalOptions} />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">5-Year Growth Trends</h3>
          <div className="h-[350px]">
            <Line data={growthData} options={growthOptions} />
          </div>
        </motion.div>

        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-gray-500">
            Data represents sample statistics for visualization purposes. View detailed reports in respective sections.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
