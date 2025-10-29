'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { InfoIcon } from 'lucide-react';
import { downloadCSV, downloadXLS } from '@/lib/export';
import axios from 'axios';

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
  chart1: '#006400',  // Dark green
  chart2: '#009a3d',  // PhilHealth primary green
  chart3: '#10b981',  // Emerald green
  chart4: '#22c55e',  // Light green
  chart5: '#eab308',  // Yellow
  chart6: '#fbbf24',  // Light yellow
};

export function FundsChart() {
  const [activeCategory, setActiveCategory] = useState<FundCategory>('contributions');
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load 2024 data
    axios.get('/data/statistics-charts-2024.json')
      .then(res => {
        setStatisticsData(res.data.philhealth_transparency_data_2024);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading funds data:", err);
        setLoading(false);
      });
  }, []);

  // Parse number from string format like "P148,300,000,000"
  const parseAmount = (value: string | number): number => {
    if (typeof value === 'number') return value / 1000000000; // Convert to billions
    const cleaned = value.replace(/[₱,P]/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num / 1000000000; // Convert to billions
  };

  // Calculate total contributions from 2024 data
  const totalContributions = statisticsData?.premium_contributions?.data?.total || 0;
  
  // Contributions data from 2024 JSON - using premium_contributions
  const contributionsData: ChartData[] = statisticsData ? [
    { 
      name: 'Private Sector', 
      value: parseAmount(statisticsData.premium_contributions?.data?.direct_contributors_breakdown?.find((x: any) => x.category === 'Employed: Private')?.amount_php || 0),
      color: CHART_COLORS.chart1, 
      percentage: Math.round((parseAmount(statisticsData.premium_contributions?.data?.direct_contributors_breakdown?.find((x: any) => x.category === 'Employed: Private')?.amount_php || 0) / parseAmount(totalContributions)) * 100)
    },
    { 
      name: 'Government Employees', 
      value: parseAmount(statisticsData.premium_contributions?.data?.direct_contributors_breakdown?.find((x: any) => x.category === 'Employed: Government')?.amount_php || 0),
      color: CHART_COLORS.chart2, 
      percentage: Math.round((parseAmount(statisticsData.premium_contributions?.data?.direct_contributors_breakdown?.find((x: any) => x.category === 'Employed: Government')?.amount_php || 0) / parseAmount(totalContributions)) * 100)
    },
    { 
      name: 'Informal Economy', 
      value: parseAmount(statisticsData.premium_contributions?.data?.direct_contributors_breakdown?.find((x: any) => x.category === 'Informal Economy')?.amount_php || 0),
      color: CHART_COLORS.chart3, 
      percentage: Math.round((parseAmount(statisticsData.premium_contributions?.data?.direct_contributors_breakdown?.find((x: any) => x.category === 'Informal Economy')?.amount_php || 0) / parseAmount(totalContributions)) * 100)
    },
    { 
      name: 'Indigents / NHTS-PR', 
      value: parseAmount(statisticsData.premium_contributions?.data?.indirect_contributors_breakdown?.find((x: any) => x.category === 'Indigents / NHTS-PR')?.amount_php || 0),
      color: CHART_COLORS.chart4, 
      percentage: Math.round((parseAmount(statisticsData.premium_contributions?.data?.indirect_contributors_breakdown?.find((x: any) => x.category === 'Indigents / NHTS-PR')?.amount_php || 0) / parseAmount(totalContributions)) * 100)
    },
    { 
      name: 'Senior Citizens', 
      value: parseAmount(statisticsData.premium_contributions?.data?.indirect_contributors_breakdown?.find((x: any) => x.category === 'Senior Citizens')?.amount_php || 0),
      color: CHART_COLORS.chart5, 
      percentage: Math.round((parseAmount(statisticsData.premium_contributions?.data?.indirect_contributors_breakdown?.find((x: any) => x.category === 'Senior Citizens')?.amount_php || 0) / parseAmount(totalContributions)) * 100)
    },
    { 
      name: 'Sponsored', 
      value: parseAmount(statisticsData.premium_contributions?.data?.indirect_contributors_breakdown?.find((x: any) => x.category === 'Sponsored')?.amount_php || 0),
      color: CHART_COLORS.chart6, 
      percentage: Math.round((parseAmount(statisticsData.premium_contributions?.data?.indirect_contributors_breakdown?.find((x: any) => x.category === 'Sponsored')?.amount_php || 0) / parseAmount(totalContributions)) * 100)
    },
  ].filter(item => item.value > 0) : [];

  // Calculate total claims
  const totalClaims = statisticsData?.claims_payment?.grand_total_amount_php || 0;

  // Allocations data from 2024 JSON (claims payment by membership category)
  const allocationsData: ListData[] = statisticsData ? [
    { 
      name: 'Private Sector', 
      value: parseAmount(statisticsData.claims_payment?.by_membership_category?.data?.find((x: any) => x.category === 'Employed: Private')?.amount_php || 0),
      percentage: Math.round((parseAmount(statisticsData.claims_payment?.by_membership_category?.data?.find((x: any) => x.category === 'Employed: Private')?.amount_php || 0) / parseAmount(totalClaims)) * 100)
    },
    { 
      name: 'Government Employees', 
      value: parseAmount(statisticsData.claims_payment?.by_membership_category?.data?.find((x: any) => x.category === 'Employed: Government')?.amount_php || 0),
      percentage: Math.round((parseAmount(statisticsData.claims_payment?.by_membership_category?.data?.find((x: any) => x.category === 'Employed: Government')?.amount_php || 0) / parseAmount(totalClaims)) * 100)
    },
    { 
      name: 'Informal/Self Earning', 
      value: parseAmount(statisticsData.claims_payment?.by_membership_category?.data?.find((x: any) => x.category === 'Informal/Self Earning')?.amount_php || 0),
      percentage: Math.round((parseAmount(statisticsData.claims_payment?.by_membership_category?.data?.find((x: any) => x.category === 'Informal/Self Earning')?.amount_php || 0) / parseAmount(totalClaims)) * 100)
    },
    { 
      name: 'Indigent/NHTS PR', 
      value: parseAmount(statisticsData.claims_payment?.by_membership_category?.data?.find((x: any) => x.category === 'Indigent/NHTS PR')?.amount_php || 0),
      percentage: Math.round((parseAmount(statisticsData.claims_payment?.by_membership_category?.data?.find((x: any) => x.category === 'Indigent/NHTS PR')?.amount_php || 0) / parseAmount(totalClaims)) * 100)
    },
    { 
      name: 'Senior Citizen', 
      value: parseAmount(statisticsData.claims_payment?.by_membership_category?.data?.find((x: any) => x.category === 'Senior Citizen')?.amount_php || 0),
      percentage: Math.round((parseAmount(statisticsData.claims_payment?.by_membership_category?.data?.find((x: any) => x.category === 'Senior Citizen')?.amount_php || 0) / parseAmount(totalClaims)) * 100)
    },
    { 
      name: 'Sponsored', 
      value: parseAmount(statisticsData.claims_payment?.by_membership_category?.data?.find((x: any) => x.category === 'Sponsored')?.amount_php || 0),
      percentage: Math.round((parseAmount(statisticsData.claims_payment?.by_membership_category?.data?.find((x: any) => x.category === 'Sponsored')?.amount_php || 0) / parseAmount(totalClaims)) * 100)
    },
  ].filter(item => item.value > 0) : [];

  // Expenses data from benefit expense breakdown (from annual report)
  console.log('Full statisticsData:', JSON.stringify(statisticsData, null, 2));
  console.log('Checking path: statisticsData?.benefit_expense?.by_membership_category');
  console.log('Result:', statisticsData?.benefit_expense?.by_membership_category);
  
  let expensesData: ListData[] = [];
  
  // Use benefit expense data from statistics-charts-2024.json
  if (statisticsData?.benefit_expense?.by_membership_category) {
    const benefitData = statisticsData.benefit_expense.by_membership_category;
    const totalBenefit = benefitData.total_amount_php || 0;
    
    console.log('Benefit expense data found:', benefitData);
    
    // Combine direct and indirect contributors
    const allCategories = [
      ...(benefitData.direct_contributors?.breakdown || []),
      ...(benefitData.indirect_contributors?.breakdown || []),
      ...(benefitData.other_expenses || [])
    ];
    
    console.log('All expense categories:', allCategories);
    
    expensesData = allCategories.map((item: any) => {
      const valueInBillions = parseAmount(item.amount_php);
      console.log(`Processing ${item.category}: ${item.amount_php} -> ${valueInBillions}B`);
      return {
        name: item.category,
        value: valueInBillions,
        percentage: Math.round((parseAmount(item.amount_php) / parseAmount(totalBenefit)) * 100)
      };
    });
    console.log('Final expensesData:', expensesData);
  } else {
    console.log('Expenses data path not found!');
    console.log('Available keys in statisticsData:', statisticsData ? Object.keys(statisticsData) : 'statisticsData is null');
  }

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
        filename = 'philhealth-contributions-2024';
        break;
      case 'allocations':
        data = allocationsData.map(item => ({
          Category: item.name,
          'Amount (Billions)': item.value,
          'Percentage': `${item.percentage}%`
        }));
        filename = 'philhealth-allocations-2024';
        break;
      case 'expenses':
        data = expensesData.map(item => ({
          Category: item.name,
          'Amount (Billions)': item.value,
          'Percentage': `${item.percentage}%`
        }));
        filename = 'philhealth-expenses-2024';
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
        filename = 'philhealth-contributions-2024';
        break;
      case 'allocations':
        data = allocationsData.map(item => ({
          Category: item.name,
          'Amount (Billions)': item.value,
          'Percentage': `${item.percentage}%`
        }));
        filename = 'philhealth-allocations-2024';
        break;
      case 'expenses':
        data = expensesData.map(item => ({
          Category: item.name,
          'Amount (Billions)': item.value,
          'Percentage': `${item.percentage}%`
        }));
        filename = 'philhealth-expenses-2024';
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
          2024 Financial Overview
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
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
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Bar Chart - Left Side */}
            <div className="w-full lg:w-[700px] h-[450px] min-h-[450px] flex-shrink-0">
              <div className="mb-4 text-center">
                <p className="text-3xl font-bold text-[#009a3d]">₱{(statisticsData?.premium_contributions?.data?.total || 0).toLocaleString('en-PH')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Contributions 2024</p>
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={contributionsData} margin={{ top: 30, right: 30, left: 60, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: '#666', fontSize: 12 }}
                    label={{ value: 'Amount (Billions ₱)', angle: -90, position: 'insideLeft', style: { fill: '#666' } }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {contributionsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Content - Far Right Side */}
            <div className="w-full lg:w-auto lg:max-w-sm space-y-6 lg:ml-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">About Contributions received</h3>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Premium contributions received from direct and indirect contributors in 2024. Direct contributors include employed (private and government) and informal sector members. Indirect contributors include indigents, senior citizens, and sponsored members.
              </p>
              
              <div className="space-y-3">
                <p className="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold">DO YOU WANT TO LEARN MORE?</p>
                <a href="/financials" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Visit Financial Overview
                </a>
              </div>

              <div className="space-y-3">
                <p className="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold">PLAY WITH THE DATA</p>
                <div className="flex gap-3">
                  <button 
                    onClick={handleDownloadCSV}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Download CSV
                  </button>
                  <button 
                    onClick={handleDownloadXLS}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                <p className="text-4xl font-bold text-[#009a3d]">₱{(statisticsData?.claims_payment?.grand_total_amount_php || 0).toLocaleString('en-PH')}</p>
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
                        <p className="text-2xl font-bold text-[#009a3d]">₱{(item.value * 1000000000).toLocaleString('en-PH')}</p>
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
            <div className="w-full lg:w-auto lg:max-w-sm space-y-6 lg:ml-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">About Allocations</h3>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Fund allocations represent the planned distribution of collected contributions across various healthcare benefit programs and services offered by PhilHealth.
              </p>
              
              <div className="space-y-3">
                <p className="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold">DO YOU WANT TO LEARN MORE?</p>
                <a href="/financials" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Visit Financial Overview
                </a>
              </div>

              <div className="space-y-3">
                <p className="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold">PLAY WITH THE DATA</p>
                <div className="flex gap-3">
                  <button onClick={handleDownloadCSV} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    Download CSV
                  </button>
                  <button onClick={handleDownloadXLS} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
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
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Benefit Expenses</p>
                <p className="text-4xl font-bold text-[#009a3d]">
                  ₱{(statisticsData?.benefit_expense?.by_membership_category?.total_amount_php || 0).toLocaleString('en-PH')}
                </p>
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
                        <p className="text-2xl font-bold text-[#009a3d]">₱{(item.value * 1000000000).toLocaleString('en-PH')}</p>
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
            <div className="w-full lg:w-auto lg:max-w-sm space-y-6 lg:ml-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">About Benefit Expenses</h3>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Benefit expenses represent the actual costs of healthcare benefits provided to PhilHealth members, broken down by membership category including direct contributors, indirect contributors, and special programs.
              </p>
              
              <div className="space-y-3">
                <p className="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold">DO YOU WANT TO LEARN MORE?</p>
                <a href="/financials" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Visit Financial Overview
                </a>
              </div>

              <div className="space-y-3">
                <p className="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold">PLAY WITH THE DATA</p>
                <div className="flex gap-3">
                  <button onClick={handleDownloadCSV} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    Download CSV
                  </button>
                  <button onClick={handleDownloadXLS} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    Download XLS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
      )}
    </motion.div>
  );
}
