import React, { useState } from 'react';
import { Search, Filter, LayoutGrid, List, MoreHorizontal, Mail, Phone, Calendar, Briefcase, Plus, UserPlus, FolderPlus, CheckSquare } from 'lucide-react';
import TeamTimeline from './TeamTimeline';

const mockTeamMembers = [
  { id: 1, name: "Esther Howard", role: "Event Coordinator", status: "Remote", statusColor: "text-orange-600 bg-orange-50 border-orange-200", department: "Operations", joining: "February 28, 2023", email: "esther.h@example.com", phone: "(209) 555-0104", avatar: "E+H" },
  { id: 2, name: "Jacob Jones", role: "Volunteer Lead", status: "Active", statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200", department: "Community", joining: "December 2, 2022", email: "jacob.jones@example.com", phone: "(405) 555-0128", avatar: "J+J" },
  { id: 3, name: "Bessie Cooper", role: "Project Manager", status: "Part-time", statusColor: "text-blue-600 bg-blue-50 border-blue-200", department: "Management", joining: "May 20, 2021", email: "bessie.c@example.com", phone: "(205) 555-0100", avatar: "B+C" },
  { id: 4, name: "Annette Black", role: "Process Manager", status: "Remote", statusColor: "text-orange-600 bg-orange-50 border-orange-200", department: "Operations", joining: "October 31, 2022", email: "annette.b@example.com", phone: "(671) 555-0110", avatar: "A+B" },
  { id: 5, name: "Brooklyn Simmons", role: "Fundraising VP", status: "Active", statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200", department: "Finance", joining: "March 13, 2023", email: "brooklyn.s@example.com", phone: "(505) 555-0125", avatar: "B+S" },
  { id: 6, name: "Jerome Bell", role: "Outreach Executive", status: "Part-time", statusColor: "text-blue-600 bg-blue-50 border-blue-200", department: "Community", joining: "October 30, 2023", email: "jerome.bell@example.com", phone: "(603) 555-0123", avatar: "J+B" },
  { id: 7, name: "Marvin McKinney", role: "Hiring Manager", status: "Active", statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200", department: "HR", joining: "December 29, 2021", email: "marvin.m@example.com", phone: "(629) 555-0129", avatar: "M+M" },
  { id: 8, name: "Dianne Russell", role: "UX Designer", status: "Part-time", statusColor: "text-blue-600 bg-blue-50 border-blue-200", department: "IT", joining: "March 6, 2022", email: "dianne.r@example.com", phone: "(704) 555-0127", avatar: "D+R" },
];

export default function TeamsView() {
  const [viewTab, setViewTab] = useState('Team Overview');

  return (
    <div className="flex flex-col bg-white rounded-[20px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden w-full p-6">

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-black">Teams</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white rounded-full text-sm font-medium hover:bg-[#0284c7] transition-colors">
            <UserPlus className="w-4 h-4" /> New Member
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            <FolderPlus className="w-4 h-4" /> New Project
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            <CheckSquare className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-100 mb-6">
        {['Department Board', 'Team Overview', 'All tasks'].map(tab => (
          <button
            key={tab}
            onClick={() => setViewTab(tab)}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${viewTab === tab ? 'border-[#0ea5e9] text-[#0ea5e9]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-black">Members</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] w-64 bg-gray-50/50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 border border-gray-200 px-1.5 rounded bg-white">⌘F</div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <div className="flex items-center p-1 border border-gray-200 rounded-full bg-gray-50/50">
            <button className="p-1.5 bg-white shadow-sm rounded-full text-gray-700 border border-gray-200"><LayoutGrid className="w-4 h-4" /></button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600"><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockTeamMembers.map(member => (
          <div key={member.id} className="p-1 bg-[repeating-linear-gradient(-45deg,#f9fafb,#f9fafb_8px,#f3f4f6_8px,#f3f4f6_16px)] border border-gray-100 rounded-[24px] group cursor-pointer transition-all hover:opacity-90">
            <div className="bg-white border border-gray-200/80 rounded-[20px] p-5 h-full transition-shadow group-hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)]">

              {/* Header: Avatar & Badge */}
              <div className="flex justify-between items-start mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${member.avatar}&background=f3f4f6&color=111827&size=56`}
                  alt={member.name}
                  className="w-14 h-14 rounded-full border border-gray-100"
                />
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${member.status === 'Part-time' ? 'bg-blue-100 text-blue-500' : member.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                  {member.status}
                </span>
              </div>

              {/* Title & Role */}
              <div className="mb-5">
                <h4 className="text-[17px] font-medium text-black tracking-tight">{member.name}</h4>
                <p className="text-[14px] text-gray-400 font-medium">{member.role}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wider">Department</p>
                  <p className="text-[13px] text-gray-700 font-medium">{member.department}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wider">Joining</p>
                  <p className="text-[13px] text-gray-700 font-medium">{member.joining}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[13px] text-gray-400 font-medium truncate">{member.email}</p>
                <p className="text-[13px] text-gray-400 font-medium">{member.phone}</p>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Timeline View (Gantt Chart) */}
      <TeamTimeline />

    </div>
  );
}
