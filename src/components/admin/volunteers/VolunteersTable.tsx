'use client';
import React, { useState } from 'react';
import { Lock, Users, FileText, Activity, Search, Filter, MapPin, Phone, Mail, Check, Circle, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import VolunteerDetailsSidebar, { VolunteerDetails } from './VolunteerDetailsSidebar';
import TeamsView from './TeamsView';
import SchedulesView from './SchedulesView';

import { useVolunteers } from '@/lib/useVolunteers';

export default function VolunteersTable() {
  const [selected, setSelected] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('Submissions');
  const [sidebarVolunteer, setSidebarVolunteer] = useState<VolunteerDetails | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { volunteers, isLoading } = useVolunteers();

  const filteredData = volunteers.filter(v => {
    if (activeTab === 'Submissions') return v.status === 'pending' || v.status === 'declined';
    if (activeTab === 'Volunteers') return v.status === 'accepted';
    return false;
  });

  const openSidebar = (sub: VolunteerDetails) => {
    setSidebarVolunteer(sub);
    // Use a tiny timeout to ensure it mounts before animating
    setTimeout(() => setIsSidebarOpen(true), 10);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => setSidebarVolunteer(null), 300);
  };

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="w-full flex flex-col pt-4 pb-12">

      {/* Header Area */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-black tracking-tight flex items-center gap-3">
          Volunteer Management
          <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-gray-500" />
          </div>
        </h1>
        <p className="text-[15px] font-medium text-gray-500 mt-1">
          Manage volunteer submissions, roles, and assignments.
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/80 rounded-full ">
          <div className="flex -space-x-1.5">
            <img className="w-5 h-5 rounded-full border-2 border-white relative z-20" src="https://ui-avatars.com/api/?name=J+D&background=random&size=20" alt="Avatar" />
            <img className="w-5 h-5 rounded-full border-2 border-white relative z-10" src="https://ui-avatars.com/api/?name=S+C&background=random&size=20" alt="Avatar" />
            <img className="w-5 h-5 rounded-full border-2 border-white relative z-0" src="https://ui-avatars.com/api/?name=M+C&background=random&size=20" alt="Avatar" />
          </div>
          <span className="text-[13px] font-semibold text-gray-700">12 Active</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/80 rounded-full  text-[13px] font-semibold text-gray-700">
          <FileText className="w-3.5 h-3.5 text-gray-400" />
          {volunteers.filter(v => v.status === 'pending').length} Submissions
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/80 rounded-full  text-[13px] font-semibold text-gray-700">
          <Activity className="w-3.5 h-3.5 text-gray-400" />
          {volunteers.filter(v => v.status === 'accepted').length} Volunteers
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-full border border-gray-200/60 w-fit mb-6">
        {['Submissions', 'Volunteers', 'Teams'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all ${activeTab === t ? 'bg-white text-black  border border-gray-200/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 border border-transparent'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {(activeTab === 'Submissions' || activeTab === 'Volunteers') && (
        <div className="rounded-[20px] p-2 bg-[#f8f9fa] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)' }}>

          <div className="bg-white rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-gray-200/80">
                    <th className="py-3 pl-4 pr-3 text-left w-[3%] border-r border-gray-100">
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 rounded-[4px] border border-gray-300 bg-white" />
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left border-r border-gray-100">
                      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                        <Users className="w-4 h-4 text-gray-400" /> Applicant
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left border-r border-gray-100">
                      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                        <MapPin className="w-4 h-4 text-gray-400" /> Location
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left border-r border-gray-100">
                      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                        <FileText className="w-4 h-4 text-gray-400" /> Interests
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left border-r border-gray-100">
                      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                        <Mail className="w-4 h-4 text-gray-400" /> Email
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left border-r border-gray-100">
                      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                        <Phone className="w-4 h-4 text-gray-400" /> Phone
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left border-r border-gray-100">
                      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                        <Activity className="w-4 h-4 text-gray-400" /> Status
                      </div>
                    </th>
                    <th className="py-3 px-4 w-[5%]"></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-4">
                        <div className="space-y-4">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-gray-500 font-medium">
                        No records found in this tab.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((sub) => {
                      const isSelected = selected.includes(sub.id);
                      const mainInterest = sub.interests[0] || 'General';
                      let statusLabel = sub.status;
                      let statusBg = 'bg-gray-50 border-gray-200';
                      let statusColor = 'text-gray-500';
                      let StatusIcon = Circle;

                      if (sub.status === 'pending') {
                        statusLabel = 'Pending';
                        statusBg = 'bg-blue-50 border-blue-200';
                        statusColor = 'text-blue-500';
                        StatusIcon = Circle;
                      } else if (sub.status === 'accepted') {
                        statusLabel = 'Accepted';
                        statusBg = 'bg-emerald-50 border-emerald-200';
                        statusColor = 'text-emerald-500';
                        StatusIcon = CheckCircle2;
                      } else if (sub.status === 'declined') {
                        statusLabel = 'Declined';
                        statusBg = 'bg-red-50 border-red-200';
                        statusColor = 'text-red-500';
                        StatusIcon = XCircle;
                      }

                      return (
                        <tr
                          key={sub.id}
                          onClick={() => openSidebar(sub)}
                          className={`border-b border-gray-100/50 transition-colors cursor-pointer group hover:bg-[#fafafa] ${isSelected ? 'bg-gray-100' : ''}`}
                        >
                          <td className="py-3 pl-4 pr-3 border-r border-gray-100" onClick={(e) => { e.stopPropagation(); toggleSelect(sub.id); }}>
                            <div className="flex items-center justify-center">
                              <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${isSelected ? 'bg-black border-black' : 'border-gray-300 bg-white group-hover:border-black/40'}`}>
                                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100">
                            <div className="flex items-center gap-3">
                              <img className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" src={`https://ui-avatars.com/api/?name=${sub.firstName}+${sub.lastName}&background=ff385c&color=fff`} alt={sub.firstName} />
                              <span className="text-[14px] font-bold text-gray-900 group-hover:text-black transition-colors">{sub.firstName} {sub.lastName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100">
                            <span className="text-[13px] font-medium text-gray-600">{sub.location || '-'}</span>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-bold text-gray-800">{mainInterest}</span>
                              {sub.interests.length > 1 && (
                                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md">
                                  +{sub.interests.length - 1} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100">
                            <span className="text-[13px] font-medium text-gray-700">{sub.email}</span>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100">
                            <span className="text-[13px] text-gray-600">{sub.phone || '-'}</span>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${statusBg}`}>
                              <StatusIcon className={`w-3 h-3 ${statusColor}`} />
                              <span className={`text-[12px] font-bold tracking-wide capitalize ${statusColor}`}>{statusLabel}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Teams' && (
        <TeamsView />
      )}

      {/* {activeTab === 'Schedules' && (
        <SchedulesView />
      )} */}

      <VolunteerDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        volunteer={sidebarVolunteer}
      />
    </div>
  );
}
