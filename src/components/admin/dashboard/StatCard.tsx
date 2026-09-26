import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  percentage: string;
  isPositive: boolean;
  icon: React.ReactNode;
  data: number[];
}

export default function StatCard({ title, value, percentage, isPositive, icon, data }: StatCardProps) {

  // Very simple SVG sparkline generator
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 30;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = isPositive ? '#22c55e' : "#000000"; // green vs our theme red
  const fillColor = isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 56, 92, 0.1)';

  return (
    <div className="rounded-[20px] p-2 bg-[#f8f9fa] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full flex flex-col relative overflow-hidden"
      style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)' }}>

      {/* Header (Outer) */}
      <div className="flex items-center justify-between px-3 pt-2 pb-2">
        <span className="text-[14px] font-semibold text-gray-600">{title}</span>
        <div className="text-gray-400 w-5 h-5 flex items-center justify-center">
          {icon}
        </div>
      </div>

      {/* Inner White Card */}
      <div className="bg-white rounded-[14px] p-4 flex flex-col h-full shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-100">

        {/* Value & Chart Row */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col gap-1">
            <span className="text-[32px] font-bold text-black tracking-tight leading-none">{value}</span>
            <div className="flex items-center gap-1.5 mt-2 text-[12px] font-semibold">
              <span className={isPositive ? 'text-emerald-500' : 'text-black'}>
                {isPositive ? '+' : ''}{percentage}
              </span>
              <span className="text-gray-400 font-medium">vs last week</span>
            </div>
          </div>

          <div className="w-[80px] h-[40px] shrink-0 mb-1">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                className="drop-shadow-sm"
              />
              <polygon
                fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
                points={`0,${height} ${points} ${width},${height}`}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
