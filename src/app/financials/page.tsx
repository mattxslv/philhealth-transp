"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EChartsCard } from "@/components/ui/echarts-card";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { KPIStatCard } from "@/components/ui/kpi-stat-card";
import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const COLORS = {
  primary: '#009a3d',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  pink: '#ec4899',
  dark: '#2e2e2e',
};

export default function FinancialsPageECharts() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';
  const textColor = isDark ? '#e5e5e5' : '#2e2e2e';
  const axisLineColor = isDark ? '#444' : '#999';
  const splitLineColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  useEffect(() => {
    axios.get("/data/financials.json")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading financials data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading financial data...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Failed to load data</div>
        </div>
      </DashboardLayout>
    );
  }

  const currentYear = data.annualReports[0];

  // Revenue vs Expenditures - Advanced 3D Bar Chart with Animation
  const revenueExpOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0, 154, 61, 0.1)'
        }
      },
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: COLORS.primary,
      borderWidth: 2,
      textStyle: {
        color: textColor,
        fontSize: 13
      },
      formatter: function(params: any) {
        let result = `<strong>${params[0].axisValue}</strong><br/>`;
        params.forEach((item: any) => {
          result += `${item.marker} ${item.seriesName}: <strong>₱${item.value.toFixed(2)}B</strong><br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['Revenue', 'Expenditures'],
      top: 10,
      textStyle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: textColor
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.monthlyRevenue.map((m: any) => m.month),
      axisLine: {
        lineStyle: {
          color: axisLineColor
        }
      },
      axisLabel: {
        fontSize: 11,
        rotate: 45,
        color: textColor
      }
    },
    yAxis: {
      type: 'value',
      name: 'Amount (Billions)',
      nameTextStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: textColor
      },
      axisLabel: {
        formatter: '₱{value}B',
        fontSize: 11,
        color: textColor
      },
      axisLine: {
        lineStyle: {
          color: axisLineColor
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: splitLineColor
        }
      }
    },
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        data: data.monthlyRevenue.map((m: any) => m.revenue / 1000000000),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: COLORS.primary },
              { offset: 1, color: '#007a31' }
            ]
          },
          borderRadius: [8, 8, 0, 0],
          shadowColor: 'rgba(0, 154, 61, 0.5)',
          shadowBlur: 10
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 154, 61, 0.8)'
          }
        },
        animationDelay: (idx: number) => idx * 50
      },
      {
        name: 'Expenditures',
        type: 'bar',
        data: data.monthlyRevenue.map((m: any) => m.expenditures / 1000000000),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: COLORS.danger },
              { offset: 1, color: '#b91c1c' }
            ]
          },
          borderRadius: [8, 8, 0, 0],
          shadowColor: 'rgba(239, 68, 68, 0.5)',
          shadowBlur: 10
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(239, 68, 68, 0.8)'
          }
        },
        animationDelay: (idx: number) => idx * 50 + 100
      }
    ],
    animationEasing: 'elasticOut',
    animationDuration: 1000
  };

  // Fund Balance - Beautiful Area Chart with Gradient
  const fundBalanceOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: COLORS.primary,
      borderWidth: 2,
      textStyle: {
        color: textColor,
        fontSize: 13
      },
      formatter: function(params: any) {
        return `<strong>${params[0].axisValue}</strong><br/>Fund Balance: <strong>₱${params[0].value.toFixed(2)}B</strong>`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.annualReports.map((r: any) => r.year).reverse(),
      axisLine: {
        lineStyle: {
          color: axisLineColor
        }
      },
      axisLabel: {
        color: textColor
      }
    },
    yAxis: {
      type: 'value',
      name: 'Fund Balance (Billions)',
      nameTextStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: textColor
      },
      axisLabel: {
        formatter: '₱{value}B',
        fontSize: 11,
        color: textColor
      },
      axisLine: {
        lineStyle: {
          color: axisLineColor
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: splitLineColor
        }
      }
    },
    series: [
      {
        name: 'Fund Balance',
        type: 'line',
        smooth: true,
        data: data.annualReports.map((r: any) => r.fundBalance / 1000000000).reverse(),
        lineStyle: {
          width: 4,
          color: COLORS.primary,
          shadowColor: 'rgba(0, 154, 61, 0.5)',
          shadowBlur: 10
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 154, 61, 0.5)' },
              { offset: 1, color: 'rgba(0, 154, 61, 0.05)' }
            ]
          }
        },
        itemStyle: {
          color: COLORS.primary,
          borderWidth: 3,
          borderColor: isDark ? '#1a1a1a' : '#fff',
          shadowColor: 'rgba(0, 154, 61, 0.5)',
          shadowBlur: 10
        },
        emphasis: {
          itemStyle: {
            borderWidth: 5,
            shadowBlur: 20
          }
        },
        markPoint: {
          data: [
            { type: 'max', name: 'Max', itemStyle: { color: COLORS.primary } },
            { type: 'min', name: 'Min', itemStyle: { color: COLORS.danger } }
          ],
          symbolSize: 70,
          label: {
            fontSize: 11,
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        markLine: {
          data: [{ type: 'average', name: 'Average' }],
          lineStyle: {
            type: 'dashed',
            color: COLORS.warning,
            width: 2
          },
          label: {
            fontSize: 11,
            fontWeight: 'bold',
            color: textColor
          }
        }
      }
    ],
    animationEasing: 'cubicOut',
    animationDuration: 1500
  };

  // Administrative Costs - Stunning Rose Chart (Nightingale)
  const adminCostsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: COLORS.primary,
      borderWidth: 2,
      textStyle: {
        color: textColor,
        fontSize: 13
      },
      formatter: function(params: any) {
        return `<strong>${params.name}</strong><br/>Amount: <strong>₱${params.value.toFixed(2)}B</strong><br/>Percentage: <strong>${params.percent}%</strong>`;
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        fontSize: 11,
        color: textColor
      },
      formatter: function(name: string) {
        // Shorten legend names for better display
        return name.length > 25 ? name.substring(0, 22) + '...' : name;
      }
    },
    series: [
      {
        name: 'Administrative Costs',
        type: 'pie',
        radius: ['30%', '70%'],
        center: ['40%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
          borderColor: isDark ? '#1a1a1a' : '#fff',
          borderWidth: 3,
          shadowBlur: 20,
          shadowColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)'
        },
        label: {
          fontSize: 10,
          fontWeight: 'bold',
          formatter: function(params: any) {
            return `${params.name}\n₱${params.value.toFixed(2)}B`;
          },
          color: textColor
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
            color: textColor
          },
          itemStyle: {
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: (data.administrativeCosts || []).map((c: any, idx: number) => ({
          value: c.amount / 1000000000,
          name: c.category,
          itemStyle: {
            color: [COLORS.primary, COLORS.danger, COLORS.warning, COLORS.info, COLORS.purple][idx % 5]
          }
        })),
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: (idx: number) => idx * 100
      }
    ]
  };

  // Investment Portfolio - Sunburst Chart
  const investmentOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: COLORS.primary,
      borderWidth: 2,
      textStyle: {
        color: textColor,
        fontSize: 13
      },
      formatter: function(params: any) {
        if (params.data.children) {
          return `<strong>${params.name}</strong><br/>Amount: <strong>₱${params.value.toFixed(2)}B</strong>`;
        } else {
          return `<strong>${params.name}</strong><br/>Value: <strong>₱${params.value.toFixed(2)}B</strong>`;
        }
      }
    },
    series: [
      {
        type: 'sunburst',
        data: (data.investments || []).map((inv: any) => ({
          name: inv.type,
          value: inv.amount / 1000000000,
          children: [
            {
              name: `Returns: ${formatPercent(inv.returns)}`,
              value: (inv.amount * (inv.returns || 0) / 100) / 1000000000
            }
          ]
        })),
        radius: [0, '90%'],
        label: {
          fontSize: 11,
          fontWeight: 'bold',
          rotate: 'radial',
          color: textColor,
          formatter: function(params: any) {
            if (params.data.children) {
              return params.name.length > 20 ? params.name.substring(0, 17) + '...' : params.name;
            }
            return params.name;
          }
        },
        itemStyle: {
          borderRadius: 7,
          borderWidth: 2,
          borderColor: isDark ? '#1a1a1a' : '#fff'
        },
        emphasis: {
          focus: 'ancestor'
        }
      }
    ]
  };

  const investmentColumns: ColumnDef<any>[] = [
    {
      accessorKey: "type",
      header: ({ column }) => <SortableHeader column={column}>Investment Type</SortableHeader>,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <SortableHeader column={column}>Amount</SortableHeader>,
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: "percentage",
      header: ({ column }) => <SortableHeader column={column}>Portfolio %</SortableHeader>,
      cell: ({ row }) => formatPercent(row.original.percentage),
    },
    {
      accessorKey: "returns",
      header: ({ column }) => <SortableHeader column={column}>Returns %</SortableHeader>,
      cell: ({ row }) => formatPercent(row.original.returns),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* KPI Cards with Animation */}
        <motion.div 
          className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <KPIStatCard
            title="Total Revenue (2024)"
            value={formatCurrency(currentYear.revenue)}
            icon={DollarSign}
            description="Annual revenue"
          />
          <KPIStatCard
            title="Fund Balance"
            value={formatCurrency(currentYear.fundBalance)}
            icon={Wallet}
            description="Available funds"
          />
          <KPIStatCard
            title="Net Income"
            value={formatCurrency(currentYear.netIncome)}
            icon={TrendingUp}
            description="Profit for the year"
          />
        </motion.div>

        {/* Revenue vs Expenditures */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <EChartsCard
            title="Monthly Revenue vs Expenditures (2024)"
            description="Comprehensive comparison with gradient bars, shadows, and smooth animations showing monthly financial performance"
          >
            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-3 rounded-lg border border-primary/20">
                <div className="text-muted-foreground text-xs">Total Revenue</div>
                <div className="font-bold text-primary text-lg">{formatCurrency(data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.revenue, 0))}</div>
              </div>
              <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 p-3 rounded-lg border border-red-500/20">
                <div className="text-muted-foreground text-xs">Total Expenditures</div>
                <div className="font-bold text-red-600 text-lg">{formatCurrency(data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.expenditures, 0))}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-3 rounded-lg border border-blue-500/20">
                <div className="text-muted-foreground text-xs">Average Monthly Revenue</div>
                <div className="font-bold text-blue-600 text-lg">{formatCurrency(data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.revenue, 0) / 12)}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-3 rounded-lg border border-purple-500/20">
                <div className="text-muted-foreground text-xs">Surplus/Deficit</div>
                <div className={`font-bold text-lg ${(data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.revenue, 0) - data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.expenditures, 0)) > 0 ? 'text-primary' : 'text-red-500'}`}>
                  {formatCurrency(data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.revenue, 0) - data.monthlyRevenue.reduce((sum: number, m: any) => sum + m.expenditures, 0))}
                </div>
              </div>
            </div>
            <ReactECharts option={revenueExpOption} style={{ height: '500px' }} />
          </EChartsCard>
        </motion.div>

        {/* Fund Balance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EChartsCard
            title="Fund Balance Over Time (5-Year Trend)"
            description="Interactive area chart with gradient fill, max/min markers, and average line showing financial health trajectory"
          >
            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-3 rounded-lg border border-primary/20">
                <div className="text-muted-foreground text-xs">Current Balance</div>
                <div className="font-bold text-primary text-lg">{formatCurrency(currentYear.fundBalance)}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-3 rounded-lg border border-green-500/20">
                <div className="text-muted-foreground text-xs">5-Year Growth</div>
                <div className="font-bold text-green-600 text-lg">
                  {formatPercent(((currentYear.fundBalance - data.annualReports[data.annualReports.length - 1].fundBalance) / data.annualReports[data.annualReports.length - 1].fundBalance) * 100)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-3 rounded-lg border border-orange-500/20">
                <div className="text-muted-foreground text-xs">Highest Balance</div>
                <div className="font-bold text-orange-600 text-lg">{formatCurrency(Math.max(...data.annualReports.map((r: any) => r.fundBalance)))}</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-3 rounded-lg border border-cyan-500/20">
                <div className="text-muted-foreground text-xs">Average Balance</div>
                <div className="font-bold text-cyan-600 text-lg">{formatCurrency(data.annualReports.reduce((sum: number, r: any) => sum + r.fundBalance, 0) / data.annualReports.length)}</div>
              </div>
            </div>
            <ReactECharts option={fundBalanceOption} style={{ height: '500px' }} />
          </EChartsCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Administrative Costs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <EChartsCard
              title="Administrative Cost Breakdown"
              description="Rose chart (Nightingale diagram) showing proportional cost distribution with beautiful radial design"
            >
              <ReactECharts option={adminCostsOption} style={{ height: '450px' }} />
            </EChartsCard>
          </motion.div>

          {/* Investment Portfolio */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <EChartsCard
              title="Investment Portfolio Distribution"
              description="Sunburst chart visualizing investment allocation and returns in a hierarchical radial layout"
            >
              <ReactECharts option={investmentOption} style={{ height: '450px' }} />
            </EChartsCard>
          </motion.div>
        </div>

        {/* Investment Portfolio Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="rounded-2xl border-2 border-border/50 bg-card shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Investment Portfolio Details</h2>
            <DataTable columns={investmentColumns} data={data.investments} />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
