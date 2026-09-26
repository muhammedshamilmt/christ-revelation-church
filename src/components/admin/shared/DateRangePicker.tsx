import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, subMonths, startOfDay, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { Check } from 'lucide-react';

interface DateRangePickerProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export default function DateRangePicker({ date, setDate }: DateRangePickerProps) {
  const [preset, setPreset] = useState<string>('Custom');

  const presets = [
    { label: 'Today', getValue: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
    { label: 'Yesterday', getValue: () => ({ from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)) }) },
    { label: 'Last 7 days', getValue: () => ({ from: startOfDay(subDays(new Date(), 7)), to: endOfDay(new Date()) }) },
    { label: 'Last 30 days', getValue: () => ({ from: startOfDay(subDays(new Date(), 30)), to: endOfDay(new Date()) }) },
    { label: 'Last 2 months', getValue: () => ({ from: startOfDay(subMonths(new Date(), 2)), to: endOfDay(new Date()) }) },
    { label: 'Last 3 months', getValue: () => ({ from: startOfDay(subMonths(new Date(), 3)), to: endOfDay(new Date()) }) },
    { label: 'Last 6 months', getValue: () => ({ from: startOfDay(subMonths(new Date(), 6)), to: endOfDay(new Date()) }) },
    { label: 'Last 12 months', getValue: () => ({ from: startOfDay(subMonths(new Date(), 12)), to: endOfDay(new Date()) }) },
    { label: 'Custom', getValue: () => date },
  ];

  const handlePresetClick = (p: typeof presets[0]) => {
    setPreset(p.label);
    if (p.label !== 'Custom') {
      setDate(p.getValue());
    }
  };

  return (
    <div className="flex bg-white w-[550px] max-w-[1000px] overflow-hidden">
      {/* Sidebar */}
      <div className="w-[180px] border-r border-gray-100 p-3 bg-gray-50/30 flex flex-col gap-1">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => handlePresetClick(p)}
            className={`flex items-center gap-2 px-3 py-2.5 text-[14px] rounded-full transition-colors text-left ${preset === p.label ? 'text-black font-bold bg-gray-100' : 'text-gray-600 font-medium hover:bg-gray-100'}`}
          >
            {preset === p.label ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Calendar Area */}
      <div className="px-3 py-3 mt-1 flex flex-col bg-white">
        {/* Header Inputs */}
        <div className="flex items-center justify-center gap-3 mb-6 px-4">
          <div className="flex items-center justify-center border border-gray-200 rounded-full px-4 py-1.5 bg-white">
            <span className="text-[14px] font-medium text-black tracking-wide">
              {date?.from ? format(date.from, 'MM / dd / yyyy') : 'MM / DD / YYYY'}
            </span>
          </div>
          <span className="text-gray-400 font-medium">→</span>
          <div className="flex items-center justify-center border border-gray-200 rounded-full px-4 py-1.5 bg-white">
            <span className="text-[14px] font-medium text-black tracking-wide">
              {date?.to ? format(date.to, 'MM / dd / yyyy') : 'MM / DD / YYYY'}
            </span>
          </div>
        </div>

        {/* Calendar */}
        <div className="w-full -mt-5">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setPreset('Custom');
              setDate(newDate);
            }}
            numberOfMonths={1}
          />
        </div>
      </div>
    </div>
  );
}
