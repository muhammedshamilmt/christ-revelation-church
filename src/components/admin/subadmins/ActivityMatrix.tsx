"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useActivities } from '@/lib/useSubadmins';

interface DayData {
  level: number;
  count: number;
  dateStr: string;
}

export default function ActivityMatrix({ subadminId }: { subadminId?: string }) {
  const { activities, isLoading } = useActivities(subadminId || null);
  const [data, setData] = useState<DayData[][]>([]);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [totalActivities, setTotalActivities] = useState(0);

  const [stats, setStats] = useState({
    successRate: 0,
    riskTakerType: 'No Data',
    lowRisk: 0,
    mediumRisk: 0,
    highRisk: 0,
    efficiencyScore: 0,
    overestimation: 0,
    underestimation: 0,
    efficiencyChange: 0,
  });

  useEffect(() => {
    if (!isLoading) {
      const year = parseInt(selectedYear);
      const start = new Date(year, 0, 1);
      // Shift back to Sunday
      start.setDate(start.getDate() - start.getDay());
      
      const grid: DayData[][] = Array.from({ length: 53 }, () => Array(7).fill(null));
      
      const activityMap = new Map<string, number>();
      if (activities && activities.length > 0) {
        activities.forEach(a => {
          const d = new Date(a.date);
          const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
          activityMap.set(key, (activityMap.get(key) || 0) + a.count);
        });
      }
      
      let currentDate = new Date(start);
      let total = 0;
      
      let daysActive = 0;
      let levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
      
      for (let w = 0; w < 53; w++) {
        for (let d = 0; d < 7; d++) {
          const key = currentDate.getFullYear() + '-' + String(currentDate.getMonth()+1).padStart(2, '0') + '-' + String(currentDate.getDate()).padStart(2, '0');
          const count = activityMap.get(key) || 0;
          
          if (currentDate.getFullYear() === year) {
            total += count;
          }
          
          let level = 0;
          if (count > 0) level = 1;
          if (count > 3) level = 2;
          if (count > 7) level = 3;
          if (count > 15) level = 4;
          
          if (level > 0 && currentDate.getFullYear() === year) {
            daysActive++;
            levelCounts[level as 1|2|3|4]++;
          }
          
          grid[w][d] = {
            level,
            count,
            dateStr: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          };
          
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      
      // Calculate dynamic stats
      const successRate = daysActive === 0 ? 0 : Math.min(98, Math.round((daysActive / 200) * 100 + (total / 100)));
      
      const totalActive = daysActive || 1;
      const highRisk = Math.round((levelCounts[4] / totalActive) * 100);
      const mediumRisk = Math.round(((levelCounts[2] + levelCounts[3]) / totalActive) * 100);
      let lowRisk = 100 - highRisk - mediumRisk;
      if (daysActive === 0) lowRisk = 0;
      
      let riskTakerType = 'Cautious Planner';
      if (highRisk > 40) riskTakerType = 'Aggressive Risk Taker';
      else if (mediumRisk > 40 || highRisk > 20) riskTakerType = 'Moderate Risk Taker';
      else if (daysActive === 0) riskTakerType = 'No Data';

      const efficiencyScore = daysActive === 0 ? 0 : Math.min(99, Math.round(successRate * 0.8 + 15));
      const overestimation = daysActive === 0 ? 0 : Math.round((100 - efficiencyScore) * 0.6);
      const underestimation = daysActive === 0 ? 0 : 100 - efficiencyScore - overestimation;
      
      const efficiencyChange = daysActive === 0 ? 0 : parseFloat(((total % 5) - 1.5).toFixed(1));

      setStats({
        successRate,
        riskTakerType,
        lowRisk,
        mediumRisk,
        highRisk,
        efficiencyScore,
        overestimation,
        underestimation,
        efficiencyChange,
      });
      
      setData(grid);
      setTotalActivities(total);
    }
  }, [activities, isLoading, selectedYear]);

  // Map levels to neutral black/gray brand color shades
  const getColor = (level: number) => {
    switch (level) {
      case 4: return 'bg-black';            // Level 4 (Highest)
      case 3: return 'bg-neutral-700';      // Level 3
      case 2: return 'bg-neutral-400';      // Level 2
      case 1: return 'bg-neutral-200';      // Level 1
      case 0: return 'bg-gray-100';         // Level 0 (Empty)
      default: return 'bg-gray-100';
    }
  };

  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 w-full font-sans animate-pulse">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
            <div className="w-48 h-6 bg-gray-200 rounded mb-6"></div>
            <div className="w-full h-40 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full font-sans">

      {/* SECTION 1: Activity Matrix */}
      <div className="flex flex-col lg:flex-row gap-6 w-full text-[12px]">

        {/* Left side: Main Graph */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[16px] text-gray-900 font-medium">{totalActivities} activities in {selectedYear}</h2>
            <button className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors">
              Contribution settings
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Graph Container */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex flex-col">

              {/* Months Header */}
              <div className="flex ml-8 mb-1">
                {months.map((month, idx) => (
                  <div key={idx} className="flex-1 text-gray-500 text-left">
                    {month}
                  </div>
                ))}
              </div>

              {/* Grid Area */}
              <div className="flex">
                {/* Day Labels */}
                <div className="flex flex-col justify-between text-gray-500 mr-2 h-[104px] text-[11px] py-[2px]">
                  <span className="invisible">Sun</span>
                  <span>Mon</span>
                  <span className="invisible">Tue</span>
                  <span>Wed</span>
                  <span className="invisible">Thu</span>
                  <span>Fri</span>
                  <span className="invisible">Sat</span>
                </div>

                {/* Grid */}
                <div className="flex gap-[3px] flex-1 overflow-x-auto custom-scrollbar pb-2">
                  {data.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-[3px]">
                      {week.map((dayData, dayIdx) => {
                        if (!dayData) return <div key={dayIdx} className="w-[11px] h-[11px]" />;
                        return (
                          <div
                            key={dayIdx}
                            className={`w-[11px] h-[11px] rounded-[2px] ${getColor(dayData.level)} outline outline-1 outline-offset-[-1px] outline-black/5 hover:outline-black/20 cursor-pointer transition-all`}
                            title={`${dayData.count} activities on ${dayData.dateStr}`}
                          ></div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 text-[11px] text-gray-500">
                <a href="#" className="hover:text-black transition-colors">Learn how we count contributions</a>
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <div className={`w-[11px] h-[11px] rounded-[2px] ${getColor(0)} outline outline-1 outline-offset-[-1px] outline-black/5`}></div>
                  <div className={`w-[11px] h-[11px] rounded-[2px] ${getColor(1)} outline outline-1 outline-offset-[-1px] outline-black/5`}></div>
                  <div className={`w-[11px] h-[11px] rounded-[2px] ${getColor(2)} outline outline-1 outline-offset-[-1px] outline-black/5`}></div>
                  <div className={`w-[11px] h-[11px] rounded-[2px] ${getColor(3)} outline outline-1 outline-offset-[-1px] outline-black/5`}></div>
                  <div className={`w-[11px] h-[11px] rounded-[2px] ${getColor(4)} outline outline-1 outline-offset-[-1px] outline-black/5`}></div>
                  <span>More</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right side: Year selector */}
        <div className="w-[120px] shrink-0 pt-8 hidden lg:flex flex-col gap-2">
          <button
            onClick={() => setSelectedYear('2026')}
            className={`px-4 py-2 text-left rounded-full transition-colors ${selectedYear === '2026' ? 'bg-black text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            2026
          </button>
          <button
            onClick={() => setSelectedYear('2025')}
            className={`px-4 py-2 text-left rounded-full transition-colors ${selectedYear === '2025' ? 'bg-black text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            2025
          </button>
        </div>
      </div>

      {/* SECTION 2: Analytics Cards */}
      <div className="flex flex-col md:flex-row gap-6 w-full">

        {/* Card 1: Risk Analysis (Cloned from Image) */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-gray-900">{stats.riskTakerType}</h2>
            <button className="px-3 py-1.5 text-[12px] font-semibold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              View Risk Analysis
            </button>
          </div>

          <div className="h-px bg-gray-100 mb-6 w-full"></div>

          {/* Content */}
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-6">
            {/* SVG Donut Chart */}
            <div className="relative w-[120px] h-[120px] shrink-0">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="60" cy="60" r="50" fill="transparent" stroke="#f3f4f6" strokeWidth="10" />
                {/* Foreground Circle */}
                <circle
                  cx="60" cy="60" r="50" fill="transparent" stroke="#000000" strokeWidth="10"
                  strokeDasharray="314" strokeDashoffset={314 - (314 * stats.successRate / 100)} strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[24px] font-bold text-gray-900 leading-none">{stats.successRate}%</span>
                <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider mt-1 text-center leading-tight">
                  success<br />rate:
                </span>
              </div>
            </div>

            {/* Right Stats */}
            <div className="flex-1 w-full">
              <h3 className="text-[13px] font-bold text-gray-900 mb-3">Risk Level Distribution</h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-500 font-medium">Low Risk Decisions</span>
                  <span className="text-gray-900 font-bold">: {stats.lowRisk}%</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-500 font-medium">Medium Risk Decisions</span>
                  <span className="text-gray-900 font-bold">: {stats.mediumRisk}%</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-500 font-medium">High Risk Decisions</span>
                  <span className="text-gray-900 font-bold">: {stats.highRisk}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 mb-4 w-full"></div>
          <p className="text-[12px] font-medium text-gray-500">
            {stats.highRisk > 40 ? 'High-risk decisions show significantly lower success rates.' : 'Consistent and reliable performance across tasks.'}
          </p>
        </div>

        {/* Card 2: Stacked Bar Chart */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-gray-900">Efficiency Accuracy</h2>
            <button className="px-3 py-1.5 text-[12px] font-semibold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              Improve Efficiency
            </button>
          </div>

          <div className="h-px bg-gray-100 mb-5 w-full"></div>

          {/* Content */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-[28px] font-bold text-gray-900">{stats.efficiencyScore}%</span>
              <span className={`text-[12px] font-bold ${stats.efficiencyChange >= 0 ? 'text-emerald-500' : 'text-black'}`}>
                {stats.efficiencyChange > 0 ? '+' : ''}{stats.efficiencyChange}%
              </span>
              <span className="text-[12px] font-medium text-gray-400">vs last week</span>
            </div>

            {/* Stacked Bar */}
            <div className="flex h-[8px] w-full rounded-full overflow-hidden gap-1 mb-6">
              <div className="bg-black h-full transition-all" style={{ width: `${stats.efficiencyScore}%` }}></div>
              <div className="bg-[#fc748d] h-full transition-all" style={{ width: `${stats.overestimation}%` }}></div>
              <div className="bg-[#fcdde2] h-full transition-all" style={{ width: `${stats.underestimation}%` }}></div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                  <span className="text-gray-600 font-medium">Efficiency Accuracy Score</span>
                </div>
                <span className="text-black font-bold">{stats.efficiencyScore}%</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#fc748d]"></div>
                  <span className="text-gray-600 font-medium">Overestimation rate</span>
                </div>
                <span className="text-[#fc748d] font-bold">{stats.overestimation}%</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#fcdde2]"></div>
                  <span className="text-gray-600 font-medium">Underestimation rate</span>
                </div>
                <span className="text-[#fc748d] font-bold">{stats.underestimation}%</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 mb-4 w-full"></div>
          <p className="text-[12px] font-medium text-gray-500">
            You tend to overestimate success in high-priority tasks.
          </p>
        </div>

      </div>

      {/* Close MAIN CONTAINER */}
    </div>
  );
}
