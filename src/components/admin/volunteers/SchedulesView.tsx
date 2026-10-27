import React, { useState } from 'react';
import { Calendar as CalendarIcon, CalendarDays, ChevronLeft, ChevronRight, Search, Filter, Settings, Plus, Video, MapPin, AlertCircle, CheckCircle2, LayoutGrid, Clock, Users } from 'lucide-react';
import ScheduleDetailsSidebar, { ScheduleEvent } from '@/components/admin/events/ScheduleDetailsSidebar';
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import DateRangePicker from '@/components/admin/shared/DateRangePicker';

const mockSummaryCards = [
  { id: 1, title: 'Weekly Team Meeting', time: '3:00 PM - 4:30 PM', status: 'Today', statusColor: 'bg-emerald-100 text-emerald-700', action: 'Join Meeting', actionColor: 'text-emerald-700' },
  { id: 2, title: 'Product Launch Event', time: '3:00 PM - 4:30 PM', status: '2 Conflicted', statusColor: 'bg-orange-100 text-orange-700', action: 'See Conflict', actionColor: 'text-gray-600' },
  { id: 3, title: 'Team Building Workshop', time: '9:00 AM - 12:00 PM', status: 'Cancelled', statusColor: 'bg-red-100 text-red-700', date: 'Aug 06, 2023' },
  { id: 4, title: 'Marketing Campaign Strategy', time: '2:30 PM - 4:00 PM', status: '3 days later', statusColor: 'bg-gray-100 text-gray-700', date: 'Aug 07, 2023' },
];

const mockEvents = [
  { id: 1, day: 0, start: 9, duration: 0.5, title: 'Brainstorming Session', time: '9:00 - 9:30 AM', color: 'bg-blue-50 border-blue-200' },
  { id: 2, day: 0, start: 9.5, duration: 0.5, title: 'Bi-Weekly Marketing Team Meet...', time: '9:30 - 10:00 AM', color: 'bg-gray-50 border-gray-200' },
  { id: 3, day: 0, start: 11.5, duration: 1.5, title: 'Workshop: "Mastering Design Thinking"', time: '11:30 AM - 1:00 PM', color: 'bg-orange-50 border-orange-200', location: 'Venue: XYZ Conference Cen...' },

  { id: 4, day: 1, start: 9, duration: 0.5, title: 'Project Review Meeting', time: '9:00 - 9:30 AM', color: 'bg-blue-100 border-blue-200' },
  { id: 5, day: 1, start: 10, duration: 1.5, title: 'Sales Team Training Session - Improving Sales Techniques', time: '10:00 - 11:30 AM', color: 'bg-blue-100 border-blue-200', participants: 7, platform: 'on Zoom' },
  { id: 6, day: 1, start: 12, duration: 0.5, title: 'Quarterly Financial Review', time: '12:00 PM - 12:30 PM', color: 'bg-blue-100 border-blue-200' },
  { id: 7, day: 1, start: 12.5, duration: 0.5, title: 'Sales Performance Review', time: '12:30 PM - 1:00 PM', color: 'bg-blue-100 border-blue-200' },

  { id: 8, day: 2, start: 9.5, duration: 0.5, title: 'Marketing Strategy Discussion', time: '9:30 - 10:00 AM', color: 'bg-blue-100 border-blue-200' },
  { id: 9, day: 2, start: 11, duration: 0.5, title: 'Strategy Planning for Company E...', time: '11:00 - 11:30 AM', color: 'bg-blue-100 border-blue-200' },
  { id: 10, day: 2, start: 11.5, duration: 1.5, title: 'New Feature Implementation and Roadmap Discussion', time: '11:30 AM - 1:00 PM', color: 'bg-blue-100 border-blue-200', participants: 4, platform: 'on Zoom' },

  { id: 11, day: 3, start: 9, duration: 1, title: 'Customer Feedback Analysis', time: '9:00 - 10:00 AM', color: 'bg-blue-100 border-blue-200', participants: 4, platform: 'on Meet' },
  { id: 12, day: 3, start: 11.5, duration: 1.5, title: 'Webinar: "Digital Marketing Trends for 2023"', time: '11:30 AM - 1:00 PM', color: 'bg-orange-50 border-orange-200', location: 'http://www.examplewebinar....' },
];

const days = ['04 MON', '05 TUE', '06 WED', '07 THU', '08 FRI'];
const hours = [9, 10, 11, 12, 13, 14, 15]; // 9 AM to 3 PM for this view

export default function SchedulesView() {
  const [viewTab, setViewTab] = useState('All Scheduled');
  const [sidebarEvent, setSidebarEvent] = useState<ScheduleEvent | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 7, 4), // Aug 4, 2023
    to: new Date(2023, 7, 11), // Aug 11, 2023
  });

  const openSidebar = (event: ScheduleEvent) => {
    setSidebarEvent(event);
    setTimeout(() => setIsSidebarOpen(true), 10);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => setSidebarEvent(null), 300);
  };

  // Helper to position events
  // Assuming each hour is 120px tall
  const HOUR_HEIGHT = 120;
  const START_HOUR = 9;

  return (
    <div className="flex flex-col bg-white rounded-[20px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden w-full p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">August 04, 2023</h2>
            <p className="text-[13px] text-gray-500 font-medium">You have 2 meetings and 1 event today.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Search className="w-5 h-5" /></button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><AlertCircle className="w-5 h-5" /></button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors">
            <CalendarIcon className="w-4 h-4" /> Schedule
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white rounded-full text-sm font-semibold hover:bg-[#0284c7] transition-colors">
            <Plus className="w-4 h-4" /> Create a Request
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors bg-white">
            Today
          </button>
          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
            <button className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 border-r border-gray-200">Last 7 days</button>
            <Popover>
              <PopoverTrigger className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2 cursor-pointer outline-none">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd")} - {format(date.to, "LLL dd yyyy")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, yyyy")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border-0 shadow-2xl rounded-[24px] z-50 overflow-hidden" align="start">
                <DateRangePicker date={date} setDate={setDate} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] w-64 bg-gray-50/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors bg-white">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="p-2 border border-gray-200 text-gray-500 rounded-full hover:bg-gray-50 transition-colors bg-white">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-100 mb-6">
        {['All Scheduled', 'Meetings (8)', 'Events (4)', 'Conflicted (2)', 'Canceled (1)'].map(tab => (
          <button
            key={tab}
            onClick={() => setViewTab(tab)}
            className={`pb-3 text-[13px] font-bold transition-colors border-b-2 flex items-center gap-2 ${viewTab === tab ? 'border-[#0ea5e9] text-[#0ea5e9]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab === 'All Scheduled' && <LayoutGrid className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {viewTab === 'All Scheduled' ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {mockSummaryCards.map(card => (
              <div key={card.id} className="border border-gray-200 rounded-xl p-4 bg-white flex flex-col justify-between h-28 hover:border-[#0ea5e9]/40 hover:shadow-md transition-all cursor-pointer">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-black truncate pr-2">{card.title}</h4>
                    <button className="text-gray-400 hover:text-gray-600 bg-gray-50 rounded"><ChevronRight className="w-4 h-4 rotate-90" /></button>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">{card.time}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${card.statusColor}`}>
                    {card.status === 'Cancelled' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                    {card.status === '2 Conflicted' && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                    {card.status === 'Today' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    {card.status === '3 days later' && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                    {card.status}
                  </span>
                  {card.action && <span className={`text-[11px] font-bold cursor-pointer hover:underline ${card.actionColor}`}>{card.action}</span>}
                  {card.date && <span className="text-[11px] font-medium text-gray-400">{card.date}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="border border-gray-100 rounded-xl bg-white overflow-hidden flex flex-col shadow-sm">

            {/* Days Header */}
            <div className="flex border-b border-gray-100 bg-white">
              <div className="w-24 border-r border-gray-100 flex-shrink-0 flex items-center justify-center gap-4 py-4">
                <button className="text-gray-400 hover:text-gray-600"><ChevronLeft className="w-4 h-4" /></button>
                <button className="text-gray-400 hover:text-gray-600"><ChevronRight className="w-4 h-4" /></button>
              </div>
              {days.map((day, i) => (
                <div key={day} className={`flex-1 py-4 text-center text-[12px] font-bold text-gray-500 tracking-[0.05em] uppercase ${i !== days.length - 1 ? 'border-r border-gray-100' : ''}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Timeline Body */}
            <div className="flex relative bg-white" style={{ height: `${hours.length * HOUR_HEIGHT}px` }}>

              {/* Time Labels */}
              <div className="w-24 border-r border-gray-100 flex-shrink-0 relative">
                {hours.map((hour, i) => (
                  <div key={hour} className="absolute w-full text-center text-[12px] font-bold text-gray-500" style={{ top: `${i * HOUR_HEIGHT}px`, transform: 'translateY(-50%)' }}>
                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                  </div>
                ))}
              </div>

              {/* Grid Columns */}
              {days.map((day, dayIndex) => (
                <div key={day} className={`flex-1 relative ${dayIndex !== days.length - 1 ? 'border-r border-gray-100' : ''}`}>
                  {/* Hourly lines */}
                  {hours.map((hour, i) => (
                    <div key={hour} className="absolute w-full border-t border-gray-100" style={{ top: `${i * HOUR_HEIGHT}px` }} />
                  ))}

                  {/* Diagonal lines pattern for Friday */}
                  {dayIndex === 4 && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px)' }}></div>
                  )}

                  {/* Events for this day */}
                  {mockEvents.filter(e => e.day === dayIndex).map(event => (
                    <div
                      key={event.id}
                      onClick={() => openSidebar(event as unknown as ScheduleEvent)}
                      className={`absolute left-1.5 right-1.5 rounded-lg border p-3 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${event.color}`}
                      style={{
                        top: `${(event.start - START_HOUR) * HOUR_HEIGHT + 2}px`,
                        height: `${event.duration * HOUR_HEIGHT - 4}px`
                      }}
                    >
                      <div>
                        <h5 className="text-[12px] font-bold text-black leading-tight mb-1 truncate">{event.title}</h5>
                        <p className="text-[11px] text-gray-500 font-medium">{event.time}</p>
                      </div>

                      {/* Event Footer */}
                      {(event.participants || event.location || event.platform) && (
                        <div className="flex items-center justify-between mt-1">
                          {event.participants && (
                            <div className="flex items-center gap-1">
                              <div className="flex -space-x-1">
                                <img className="w-4 h-4 rounded-full border border-white" src="https://ui-avatars.com/api/?name=A+B&size=16" alt="Avatar" />
                                <img className="w-4 h-4 rounded-full border border-white" src="https://ui-avatars.com/api/?name=C+D&size=16" alt="Avatar" />
                              </div>
                              <span className="text-[9px] font-bold text-blue-600">+{event.participants}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <MapPin className="w-3 h-3" />
                              <span className="text-[9px] truncate max-w-[80px]">{event.location}</span>
                            </div>
                          )}
                          {event.platform && (
                            <span className="text-[9px] font-medium text-gray-500">{event.platform}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => openSidebar(event as unknown as ScheduleEvent)}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-full hover:border-[#0ea5e9]/40 hover:shadow-md transition-all cursor-pointer bg-white group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${event.color.split(' ')[0]}`}>
                  <CalendarIcon className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-black group-hover:text-black transition-colors">{event.title}</h4>
                  <div className="flex items-center gap-4 mt-1.5 text-[12px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" /> {event.time}</span>
                    {event.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {event.location}</span>}
                    {event.platform && <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-gray-400" /> {event.platform}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                {event.participants && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img className="w-7 h-7 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=A+B&size=28&background=random" alt="Avatar" />
                      <img className="w-7 h-7 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=C+D&size=28&background=random" alt="Avatar" />
                    </div>
                    <span className="text-[12px] font-bold text-gray-600">+{event.participants}</span>
                  </div>
                )}
                <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-full text-[13px] font-semibold hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ScheduleDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        event={sidebarEvent}
      />
    </div>
  );
}
