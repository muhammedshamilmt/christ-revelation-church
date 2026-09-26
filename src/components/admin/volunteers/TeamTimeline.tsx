import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const timeSlots = ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'];

const tasks = [
  {
    id: 1,
    name: 'Research',
    bars: [
      { start: 0, end: 3, label: 'About 4 hours', avatars: ['A', 'B', 'C'] }
    ]
  },
  {
    id: 2,
    name: 'Wireframe',
    bars: [
      { start: 1, end: 3, label: 'About 3 hours', avatars: ['D'] }
    ]
  },
  {
    id: 3,
    name: 'UI Design',
    bars: [
      { start: 5, end: 10, label: 'About 6 hours', avatars: ['E', 'F', 'G'] }
    ]
  },
  {
    id: 4,
    name: 'Usability Testing',
    bars: [
      { start: 3, end: 6, label: 'About 4 hours', avatars: ['A', 'B', 'C'] },
      { start: 10, end: 12, label: 'About 3 hours', avatars: ['D'] }
    ]
  }
];

export default function TeamTimeline() {
  const [activeTab, setActiveTab] = useState('Day');

  return (
    <div className="mt-8 p-1 bg-[repeating-linear-gradient(-45deg,#f9fafb,#f9fafb_8px,#f3f4f6_8px,#f3f4f6_16px)] border border-gray-100 rounded-[24px]">
      <div className="bg-white border border-gray-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] rounded-[20px] p-6 overflow-hidden w-full h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2 cursor-pointer group">
            <h3 className="text-[17px] font-medium text-black">December 12, 2024</h3>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
          <div className="flex items-center gap-1 bg-gray-50/80 border border-gray-100 rounded-full p-1 text-[13px] font-medium text-gray-500">
            {['Day', 'Week', 'Month', 'Year'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full transition-all ${activeTab === tab ? 'bg-white text-black font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.05)]' : 'hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Container */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[900px] relative">

            {/* Header Row (Times) */}
            <div className="flex ml-[140px] mb-6">
              {timeSlots.map((time, i) => (
                <div key={i} className="flex-1 relative">
                  {/* Visual alignment trick: text centered over the vertical line */}
                  <div className="absolute left-0 -translate-x-1/2 w-20 text-center text-[11px] font-semibold text-gray-400">
                    {time}
                  </div>
                </div>
              ))}
            </div>

            {/* Grid Lines (Background) */}
            <div className="absolute top-[28px] bottom-0 left-[140px] right-0 flex pointer-events-none">
              {timeSlots.map((_, i) => (
                <div key={i} className="flex-1 border-l border-dashed border-gray-200"></div>
              ))}
            </div>

            {/* Rows */}
            <div className="space-y-6 relative z-10">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center h-10">
                  {/* Task Name Sidebar */}
                  <div className="w-[140px] shrink-0 text-[13px] font-medium text-gray-500">
                    {task.name}
                  </div>

                  {/* Timeline Row */}
                  <div className="flex-1 relative h-full">
                    {task.bars.map((bar, i) => {
                      // Calculate left and width percentages based on 12 slots (10am to 10pm)
                      const leftPct = (bar.start / 12) * 100;
                      const widthPct = ((bar.end - bar.start) / 12) * 100;

                      return (
                        <div
                          key={i}
                          className="absolute top-1/2 -translate-y-1/2 h-8 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-between px-3"
                          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        >
                          <span className="text-[11px] font-medium text-gray-500">{bar.label}</span>
                          <div className="flex -space-x-1.5">
                            {bar.avatars.map((avatar, j) => (
                              <img
                                key={j}
                                src={`https://ui-avatars.com/api/?name=${avatar}&background=ffffff&color=111827&size=24`}
                                alt="avatar"
                                className="w-5 h-5 rounded-full border-[1.5px] border-white shadow-sm"
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
