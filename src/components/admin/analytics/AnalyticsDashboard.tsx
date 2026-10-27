'use client';
import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import {
  BarChart3, TrendingUp, TrendingDown, ChevronDown,
  Search, Users, Clock, Target, ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, ReferenceDot
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const chartConfig = {
  views: {
    label: "Total Giving",
  },
  emergency: {
    label: "Tithes & Offerings",
    color: "#0ea5e9",
  },
  general: {
    label: "Building & Missions",
    color: "#3b82f6",
  },
};

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('Weekly');
  const [activeChart, setActiveChart] = useState<string>('emergency');
  
  const { data: transactions, isLoading } = useSWR<any[]>('/api/transactions', fetcher);

  const { totalAmount, dailyAvg, salesData, segmentData, emergencyShare } = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) {
      return { 
        totalAmount: 0, dailyAvg: 0, 
        salesData: [], 
        segmentData: [
          { name: 'Tithes & Offerings', value: 0, color: "#0ea5e9" },
          { name: 'Building & Missions', value: 0, color: '#3b82f6' }
        ],
        emergencyShare: 0
      };
    }

    let total = 0;
    let emergencyTotal = 0;
    let generalTotal = 0;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const volumeByDay = new Map<string, { emergency: number, general: number }>();
    days.forEach(d => volumeByDay.set(d, { emergency: 0, general: 0 }));

    transactions.forEach(txn => {
      const amount = typeof txn.amount === 'string' ? parseFloat(txn.amount.replace(/[^0-9.-]+/g,"")) : txn.amount;
      const validAmount = amount || 0;
      total += validAmount;
      
      const d = new Date(txn.date || txn.created_at);
      const dayName = days[d.getDay()];
      const current = volumeByDay.get(dayName)!;

      if (txn.designation === 'Tithe & Offering' || txn.designation === 'Emergency Relief') {
        emergencyTotal += validAmount;
        current.emergency += validAmount;
      } else {
        generalTotal += validAmount;
        current.general += validAmount;
      }
    });

    const computedSalesData = days.map(d => ({
      name: d,
      emergency: volumeByDay.get(d)!.emergency,
      general: volumeByDay.get(d)!.general
    }));

    const computedSegmentData = [
      { name: 'Emergency', value: emergencyTotal, color: "#0ea5e9" },
      { name: 'General', value: generalTotal, color: '#fca5a5' }
    ];

    const computedEmergencyShare = total > 0 ? Math.round((emergencyTotal / total) * 100) : 0;

    return {
      totalAmount: total,
      dailyAvg: total / 7,
      salesData: computedSalesData,
      segmentData: computedSegmentData,
      emergencyShare: computedEmergencyShare
    };
  }, [transactions]);

  const cardStyle = "bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] p-6 lg:p-8";

  return (
    <div className="w-full flex flex-col gap-6 pt-2 pb-12">

      {/* Top Header & Overview Stats */}
      <div className={`${cardStyle}`}>
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
            {/* Stat 1 */}
            <div>
              <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Donations</p>
              <div className="flex items-baseline gap-3">
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-black">£{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <span className="flex items-center text-[13px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <TrendingUp className="w-3 h-3 mr-1" /> +7.1% <span className="text-gray-400 font-medium ml-1">vs prev</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stat 2 */}
            <div className="md:border-l md:border-gray-200 md:pl-8">
              <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Daily Average</p>
              <div className="flex items-baseline gap-3">
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-black">£{dailyAvg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <span className="flex items-center text-[13px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <TrendingUp className="w-3 h-3 mr-1" /> +2% <span className="text-gray-400 font-medium ml-1">vs last week</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stat 3 */}
            <div className="md:border-l md:border-gray-200 md:pl-8">
              <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Donors</p>
              <div className="flex items-baseline gap-3">
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-black">{transactions?.length || 0}</h2>
                    <span className="flex items-center text-[13px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <TrendingUp className="w-3 h-3 mr-1" /> +5% <span className="text-gray-400 font-medium ml-1">vs last week</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className={`${cardStyle} flex flex-col gap-0 p-0 overflow-hidden`}>
        <div className="flex flex-col sm:flex-row border-b border-gray-100">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <h3 className="text-lg font-bold text-black">Total Volume</h3>
            <p className="text-[13px] font-medium text-gray-500">
              Showing total donations across major funds
            </p>
          </div>
          <div className="flex border-t border-gray-100 sm:border-t-0">
            {["emergency", "general"].map((key) => {
              const isActive = activeChart === key;
              const title = key === 'emergency' ? 'Tithes & Offerings' : 'Building & Missions';
              const total = salesData.reduce((acc, curr) => acc + (curr[key as keyof typeof curr] as number), 0);
              
              return (
                <button
                  key={key}
                  data-active={isActive}
                  className="flex flex-1 flex-col justify-center gap-1 border-l border-gray-100 px-6 py-4 text-left transition-colors hover:bg-gray-50 data-[active=true]:bg-gray-50/80 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(key)}
                >
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {title}
                  </span>
                  <span className="text-lg font-bold text-black sm:text-2xl">
                    £{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="h-[350px] w-full p-6 pt-8">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full w-full"
          >
            <LineChart
              accessibilityLayer
              data={salesData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                tickMargin={12}
                minTickGap={32}
              />
              <ChartTooltip
                cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                content={
                  <ChartTooltipContent
                    className="w-[180px] bg-white border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] rounded-2xl p-3"
                    nameKey="views"
                  />
                }
              />
              <Line 
                dataKey={activeChart}
                type="monotone" 
                stroke={(chartConfig as any)[activeChart]?.color || "#0ea5e9"}
                strokeWidth={3}
                dot={{ r: 4, fill: (chartConfig as any)[activeChart]?.color || "#0ea5e9", strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: (chartConfig as any)[activeChart]?.color || "#0ea5e9", strokeWidth: 3, stroke: '#fff' }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">

        {/* Left Column: Categories & Segments */}
        <div className={`${cardStyle} flex flex-col gap-8`}>

          {/* Funding Categories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-black flex items-center gap-2">
                  Funding Categories <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px]">i</span>
                </h3>
                <div className="flex items-baseline gap-3 mt-1">
                  {isLoading ? (
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <span className="text-3xl font-bold text-black">{emergencyShare}%</span>
                  )}
                  <span className="text-[13px] font-bold text-emerald-500">+2.1% vs last week</span>
                </div>
              </div>
              <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Details
              </button>
            </div>

            {/* Custom Bar representing the emergencyShare visually like the image */}
            <div className="flex h-6 w-full gap-1 mt-6 mb-4">
              {isLoading ? (
                Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-gray-200 animate-pulse" />
                ))
              ) : (
                Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${i < (emergencyShare / 100 * 30) ? 'bg-[#0ea5e9]' : 'bg-gray-200'}`}
                  />
                ))
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                Emergency Relief
                <div className="flex gap-1 ml-2">
                  <button className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">{'<'}</button>
                  <button className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">{'>'}</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-600">
                  {isLoading ? '...' : (transactions?.filter((t: any) => t.designation === 'Emergency Relief').length || 0)} donations
                </span>
                <span className="font-bold text-emerald-500">+3.2%</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] border-b border-dashed border-gray-200 my-2"></div>

          {/* Customer Segments */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-black flex items-center gap-2">
                Donation Segments <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px]">i</span>
              </h3>
              <span className="text-[13px] font-bold text-emerald-500">+5.8% vs last week</span>
            </div>

            <div className="flex items-center gap-8">
              <div className="w-[120px] h-[120px] relative">
                {isLoading ? (
                  <div className="w-full h-full rounded-full border-[20px] border-gray-200 animate-pulse"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={segmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {segmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-3">
                {segmentData.map(segment => (
                  <div key={segment.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: segment.color }}></div>
                      <span className="font-medium text-gray-600">{segment.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-black">£{segment.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span className="font-medium text-gray-400 w-8 text-right">
                        {totalAmount > 0 ? Math.round((segment.value / totalAmount) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Marketing Channels */}
        <div className={`${cardStyle} flex flex-col gap-8`}>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-black flex items-center gap-2">
                  Acquisition Channels <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px]">i</span>
                </h3>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-bold text-black">82%</span>
                  <span className="text-[13px] font-bold text-emerald-500">+2.1% vs last week</span>
                </div>
              </div>
            </div>

            {/* Custom dual progress bar */}
            <div className="flex h-3 w-full gap-1 mt-8 mb-4 rounded-full overflow-hidden bg-gray-100">
              <div className="h-full bg-[#0ea5e9]" style={{ width: '65%' }}></div>
              <div className="h-full bg-[#fca5a5]" style={{ width: '25%' }}></div>
            </div>

            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]"></div>
                <span className="text-sm font-semibold text-gray-700">Organic Search</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#fca5a5]"></div>
                <span className="text-sm font-semibold text-gray-700">Social Media</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] border-b border-dashed border-gray-200 my-2"></div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
              <span>Channels</span>
              <span>Metrics</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-gray-700">Acquisition</span>
                </div>
                <span className="font-bold text-black">£384</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-gray-700">Conversion</span>
                </div>
                <span className="font-bold text-black">4.2%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-gray-700">ROI</span>
                </div>
                <span className="font-bold text-black">324%</span>
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-gray-50 hover:bg-gray-100 text-black font-semibold rounded-full text-sm transition-colors border border-gray-200">
              View full report
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
