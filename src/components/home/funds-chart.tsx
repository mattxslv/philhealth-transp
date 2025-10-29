"use client";

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from 'recharts';
import { motion } from 'framer-motion';
import { InfoIcon } from 'lucide-react';
import { downloadCSV, downloadXLS } from '@/lib/export';

type FundCategory = 'contributions' | 'allocations' | 'expenses';

interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  [key: string]: string | number;
}

interface ListData {
  name: string;
  value: number;
  percentage: number;
}

const CHART_COLORS = {
  chart1: '#009a3d',  // PhilHealth primary green
  chart2: '#06b04d',  // PhilHealth light green
  chart3: '#0ac55b',  // Medium green
  chart4: '#34d168',  // Lighter green
  chart5: '#5edd7f',  // Very light green
  chart6: '#86e896',  // Lightest green
};

// Contributions data for pie chart
const contributionsData: ChartData[] = [
  { name: 'Formal Sector Employees', value: 89.5, color: CHART_COLORS.chart1, percentage: 37 },
  { name: 'Government Employees', value: 52.3, color: CHART_COLORS.chart2, percentage: 22 },
  { name: 'Sponsored Members (Indigent)', value: 43.2, color: CHART_COLORS.chart3, percentage: 18 },
  { name: 'Self-Employed/Informal Sector', value: 28.6, color: CHART_COLORS.chart4, percentage: 12 },
  { name: 'Overseas Filipino Workers', value: 15.9, color: CHART_COLORS.chart5, percentage: 7 },
  { name: 'Senior Citizens', value: 10.0, color: CHART_COLORS.chart6, percentage: 4 },
];

// Allocations data for list
const allocationsData: ListData[] = [
  { name: 'Inpatient Care Benefits', value: 127.5, percentage: 38 },
  { name: 'Outpatient Services', value: 85.2, percentage: 25 },
  { name: 'Primary Care Benefits', value: 48.9, percentage: 15 },
  { name: 'Catastrophic Coverage', value: 35.6, percentage: 11 },
  { name: 'Maternity Care', value: 22.4, percentage: 7 },
  { name: 'Preventive Services', value: 15.4, percentage: 4 },
];

// Expenses data for list
const expensesData: ListData[] = [
  { name: 'Hospital Claims Payment', value: 98.7, percentage: 42 },
  { name: 'Outpatient Reimbursements', value: 56.3, percentage: 24 },
  { name: 'Health Facility Subsidies', value: 32.1, percentage: 14 },
  { name: 'Administrative Operations', value: 18.5, percentage: 8 },
  { name: 'IT Systems & Infrastructure', value: 12.3, percentage: 5 },
  { name: 'Member Services', value: 9.8, percentage: 4 },
  { name: 'Fraud Prevention', value: 7.3, percentage: 3 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 shadow-lg">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
        <p className="text-sm text-[#009a3d] font-bold">₱{payload[0].value.toFixed(2)}B</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {payload[0].payload.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percentage }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="#000000" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-sm font-semibold"
    >
      {`${name} (${percentage}%)`}
    </text>
  );
};

export function FundsChart() {
  const [activeCategory, setActiveCategory] = useState<FundCategory>('contributions');

  const contributionsTotal = contributionsData.reduce((sum, item) => sum + item.value, 0);
  const allocationsTotal = allocationsData.reduce((sum, item) => sum + item.value, 0);
  const expensesTotal = expensesData.reduce((sum, item) => sum + item.value, 0);

  // Download handlers
  const handleDownloadCSV = () => {
    let data = [];
    let filename = '';
    
    switch (activeCategory) {
      case 'contributions':
        data = contributionsData.map(item => ({
          Category: item.name,
          'Amount (Billions)': item.value,
          'Percentage': `${item.percentage}%`
        }));
        filename = 'philhealth-contributions-2007';
        break;
      case 'allocations':
        data = allocationsData.map(item => ({
          Category: item.name,
          'Amount (Billions)': item.value,
          'Percentage': `${item.percentage}%`
        }));
        filename = 'philhealth-allocations-2007';
        break;
      case 'expenses':
        data = expensesData.map(item => ({
          Category: item.name,
          'Amount (Billions)': item.value,
          'Percentage': `${item.percentage}%`
        }));
        filename = 'philhealth-expenses-2007';
        break;
    }
    
    downloadCSV(data, filename);
  };

  const handleDownloadXLS = () => {
    let data = [];
    let filename = '';
    
    switch (activeCategory) {
      case 'contributions':
        data = contributionsData.map(item => ({
          Category: item.name,
          'Amount (Billions)': item.value,
          'Percentage': `${item.percentage}%`
        }));
        filename = 'philhealth-contributions-2007';
        break;
      case 'allocations':
        data = allocationsData.map(item => ({
          Category: item.name,
          'Amount (Billions)': item.value,
          'Percentage': `${item.percentage}%`
        }));
        filename = 'philhealth-allocations-2007';
        break;
      case 'expenses':
        data = expensesData.map(item => ({
          Category: item.name,
          'Amount (Billions)': item.value,
          'Percentage': `${item.percentage}%`
        }));
        filename = 'philhealth-expenses-2007';
        break;
    }
    
    downloadXLS(data, filename);
  };

  return (
    <motion.div 
      className="w-full mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Incoming and Outgoing Funds
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          2007 Financial Overview
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('contributions')}
          className={`px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            activeCategory === 'contributions'
              ? 'bg-primary'
              : 'bg-primary opacity-60 hover:opacity-100'
          }`}
        >
          Contributions received
        </button>
        <button
          onClick={() => setActiveCategory('allocations')}
          className={`px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            activeCategory === 'allocations'
              ? 'bg-primary'
              : 'bg-primary opacity-60 hover:opacity-100'
          }`}
        >
          Allocations
        </button>
        <button
          onClick={() => setActiveCategory('expenses')}
          className={`px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            activeCategory === 'expenses'
              ? 'bg-primary'
              : 'bg-primary opacity-60 hover:opacity-100'
          }`}
        >
          Expenses
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
        {activeCategory === 'contributions' && (
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Pie Chart with center label */}
            <div className="w-full lg:w-1/2 h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contributionsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={130}
                    paddingAngle={1}
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={{ stroke: '#009a3d', strokeWidth: 1.5 }}
                    isAnimationActive={false}
                  >
                    {contributionsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label
                      value={`₱${contributionsTotal.toFixed(1)}B`}
                      position="center"
                      className="text-4xl font-bold"
                      fill="#009a3d"
                      style={{ fontSize: '32px', fontWeight: 'bold' }}
                    />
                    <Label
                      value="Total Contributions"
                      position="center"
                      dy={30}
                      fill="#666"
                      style={{ fontSize: '14px' }}
                    />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* About Section */}
            <div className="w-full lg:w-1/2 space-y-8">
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white">About Contributions received</h3>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Cash received from resource partners within a calendar year. This chart does not include Regular Resources, Thematic Funding and Other Resources earmarked for Headquarters.
              </p>
              
              <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 uppercase text-base font-semibold">DO YOU WANT TO LEARN MORE?</p>
                <a href="/financials" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Visit Financial Overview
                </a>
              </div>

              <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 uppercase text-base font-semibold">PLAY WITH THE DATA</p>
                <div className="flex gap-4">
                  <button 
                    onClick={handleDownloadCSV}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Download CSV
                  </button>
                  <button 
                    onClick={handleDownloadXLS}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Download XLS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'allocations' && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Two column list */}
            <div className="w-full lg:w-2/3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Allocations</p>
                <p className="text-4xl font-bold text-[#009a3d]">₱{allocationsTotal.toFixed(1)}B</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">SORTED BY ALLOCATION AMOUNT</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {allocationsData.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#06b04d] font-bold">{index + 1}.</span>
                          <span className="text-base font-semibold text-gray-900 dark:text-white">{item.name}</span>
                        </div>
                        <p className="text-2xl font-bold text-[#009a3d]">₱ {item.value.toFixed(1)}B</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#06b04d]">{item.percentage}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#009a3d] to-[#06b04d] h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - About section */}
            <div className="w-full lg:w-1/3 space-y-8">
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white">About Allocations</h3>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Fund allocations represent the planned distribution of collected contributions across various healthcare benefit programs and services offered by PhilHealth.
              </p>
              
              <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold">DO YOU WANT TO LEARN MORE?</p>
                <a href="/financials" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Visit Financial Overview
                </a>
              </div>

              <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold">PLAY WITH THE DATA</p>
                <div className="flex gap-4">
                  <button onClick={handleDownloadCSV} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    Download CSV
                  </button>
                  <button onClick={handleDownloadXLS} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    Download XLS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'expenses' && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Two column list */}
            <div className="w-full lg:w-2/3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Expenses</p>
                <p className="text-4xl font-bold text-[#009a3d]">₱{expensesTotal.toFixed(1)}B</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">SORTED BY EXPENSE AMOUNT</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {expensesData.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#06b04d] font-bold">{index + 1}.</span>
                          <span className="text-base font-semibold text-gray-900 dark:text-white">{item.name}</span>
                        </div>
                        <p className="text-2xl font-bold text-[#009a3d]">₱ {item.value.toFixed(1)}B</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#06b04d]">{item.percentage}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#009a3d] to-[#06b04d] h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - About section */}
            <div className="w-full lg:w-1/3 space-y-8">
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white">About Expenses</h3>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Operating expenses include all costs incurred in running PhilHealth's operations, from healthcare claims payments to administrative costs and system infrastructure.
              </p>
              
              <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold">DO YOU WANT TO LEARN MORE?</p>
                <a href="/financials" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Visit Financial Overview
                </a>
              </div>

              <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold">PLAY WITH THE DATA</p>
                <div className="flex gap-4">
                  <button onClick={handleDownloadCSV} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    Download CSV
                  </button>
                  <button onClick={handleDownloadXLS} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    Download XLS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
