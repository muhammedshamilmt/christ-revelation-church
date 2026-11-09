'use client';

import React, { useMemo } from 'react';
import { useTransactions } from '@/lib/useTransactions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function VolumeChart() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(2);
  const { transactions, isLoading } = useTransactions();

  const data = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) {
      return [
        { name: 'Sun', volume: 0 }, { name: 'Mon', volume: 0 }, { name: 'Tue', volume: 0 },
        { name: 'Wed', volume: 0 }, { name: 'Thu', volume: 0 }, { name: 'Fri', volume: 0 }, { name: 'Sat', volume: 0 }
      ];
    }
    
    // Group last 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const volumeByDay = new Map<string, number>();
    days.forEach(d => volumeByDay.set(d, 0));

    transactions.forEach(txn => {
      const d = new Date(txn.date || txn.created_at || Date.now());
      const dayName = days[d.getDay()];
      const amount = typeof txn.amount === 'string' ? parseFloat(txn.amount.replace(/[^0-9.-]+/g,"")) : txn.amount;
      volumeByDay.set(dayName, (volumeByDay.get(dayName) || 0) + (amount || 0));
    });

    return days.map(d => ({ name: d, volume: volumeByDay.get(d) }));
  }, [transactions]);

  if (isLoading) {
    const skeletonHeights = [45, 70, 35, 60, 80, 50, 40];
    return (
      <div className="w-full h-full min-h-[250px] relative mt-2 flex items-end justify-between px-4 pb-8 animate-pulse">
        {skeletonHeights.map((h, i) => (
          <div key={i} className="w-8 bg-gray-200 rounded-t-sm" style={{ height: `${h}%` }}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[250px] relative mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 30, right: 0, left: -20, bottom: 0 }}
          onMouseMove={(state: any) => {
            if (state && state.activeTooltipIndex !== undefined) {
              setActiveIndex(state.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
            orientation="right"
            dx={10}
          />

          <Tooltip
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#0ea5e9] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                    {payload[0].payload.name} : {payload[0].value}
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Dotted Reference Line at the active index value (roughly) */}
          {/* <ReferenceLine y={584} stroke="#000000" strokeDasharray="4 4" /> */}

          <Bar
            dataKey="volume"
            radius={[4, 4, 4, 4]}
            barSize={40}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeIndex === index ? "#0ea5e9" : '#f1f5f9'}
                className="transition-colors duration-300"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
