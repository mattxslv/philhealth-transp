"use client";

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

type FundCategory = 'contributions' | 'allocations' | 'expenses';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const CHART_COLORS = {
  chart1: 'hsl(var(--chart-1))',
  chart2: 'hsl(var(--chart-2))',
  chart3: 'hsl(var(--chart-3))',
  chart4: 'hsl(var(--chart-4))',
  chart5: 'hsl(var(--chart-5))',
};

// Data for 2024 based on financials.json
const contributionsData: ChartData[] = [
  { name: 'Direct Contributors', value: 199.22, color: CHART_COLORS.chart1 },
  { name: 'Indirect Contributors', value: 40.35, color: CHART_COLORS.chart2 },
];

const allocationsData: ChartData[] = [
  { name: 'Benefit Expense', value: 128.89, color: CHART_COLORS.chart1 },
  { name: 'Reserve Fund', value: 280.57, color: CHART_COLORS.chart3 },
  { name: 'Operational Costs', value: 56.56, color: CHART_COLORS.chart4 },
];

const expensesData: ChartData[] = [
  { name: 'Direct Contributors Claims', value: 92.41, color: CHART_COLORS.chart1 },
  { name: 'Indirect Contributors Claims', value: 87.09, color: CHART_COLORS.chart2 },
  { name: 'Administrative', value: 5.96, color: CHART_COLORS.chart5 },
];

const categoryConfig: Record<FundCategory, { title: string; data: ChartData[]; total: number }> = {
  contributions: {
    title: 'Contributions Received',
    data: contributionsData,
    total: 239.57,
  },
  allocations: {
    title: 'Fund Allocations',
    data: allocationsData,
    total: 465.02,
  },
  expenses: {
    title: 'Expenses',
    data: expensesData,
    total: 185.45,
  },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
        <p className="text-sm font-semibold text-foreground">{payload[0].name}</p>
        <p className="text-sm text-primary font-bold">₱{payload[0].value.toFixed(2)}B</p>
        <p className="text-xs text-muted-foreground">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export function FundsChart() {
  const [activeCategory, setActiveCategory] = useState<FundCategory>('contributions');
  const config = categoryConfig[activeCategory];

  return (
    <motion.div 
      className="w-full mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Incoming and Outgoing Funds
        </h2>
        <p className="text-muted-foreground text-lg">
          2024 Financial Overview
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {(Object.keys(categoryConfig) as FundCategory[]).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === category
                ? 'bg-primary text-white shadow-lg'
                : 'bg-card text-foreground border border-border hover:border-primary/50'
            }`}
          >
            {categoryConfig[category].title}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="bg-card rounded-2xl border border-border p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Chart */}
          <div className="w-full lg:w-1/2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={config.data.map(item => ({ ...item, total: config.total }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {config.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend & Total */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="bg-muted rounded-lg p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Total {config.title}</p>
              <p className="text-4xl font-bold text-primary">₱{config.total.toFixed(2)}B</p>
            </div>

            <div className="space-y-3">
              {config.data.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">₱{item.value.toFixed(2)}B</p>
                    <p className="text-xs text-muted-foreground">
                      {((item.value / config.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
