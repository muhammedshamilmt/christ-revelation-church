"use client";

import React, { useState } from 'react';
import { Search, Filter, LayoutGrid, List, UserPlus, FolderPlus, CheckSquare, Users, Edit2 } from 'lucide-react';
import TeamTimeline from './TeamTimeline';
import NewTeamSidebar from './NewTeamSidebar';
import { useTeams } from '@/lib/useTeams';

export default function TeamsView() {
  const [viewTab, setViewTab] = useState('Team Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  
  const { teams, isLoading } = useTeams();

  return (
    <>
      <div className="flex flex-col bg-white rounded-[20px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden w-full p-6">

        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-black">Teams</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setEditingTeam(null); setSidebarOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm shadow-black/10"
            >
              <UserPlus className="w-4 h-4" /> New Team
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
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${viewTab === tab ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
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
                className="pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black w-64 bg-gray-50/50"
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
          {isLoading ? (
             // SKELETON UI
             Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-1 border border-gray-100 rounded-[24px] animate-pulse bg-gray-50/50">
                <div className="bg-white border border-gray-100 rounded-[20px] p-5 h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                    <div className="w-16 h-6 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="mb-5 space-y-2">
                    <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1"><div className="w-12 h-3 bg-gray-200 rounded"></div><div className="w-20 h-4 bg-gray-200 rounded"></div></div>
                    <div className="space-y-1"><div className="w-12 h-3 bg-gray-200 rounded"></div><div className="w-20 h-4 bg-gray-200 rounded"></div></div>
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="w-full h-4 bg-gray-200 rounded"></div>
                    <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
             ))
          ) : teams.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500 font-medium bg-gray-50 rounded-[24px] border border-gray-100">
              No teams found. Create your first team!
            </div>
          ) : (
            teams.map(team => {
              const leader = team.members.find(m => m.id === team.leaderId);
              
              return (
                <div key={team.id} className="p-1 bg-[repeating-linear-gradient(-45deg,#f9fafb,#f9fafb_8px,#f3f4f6_8px,#f3f4f6_16px)] border border-gray-100 rounded-[24px] group cursor-pointer transition-all hover:opacity-90">
                  <div className="bg-white border border-gray-200/80 rounded-[20px] p-5 h-full transition-shadow group-hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] flex flex-col">

                    {/* Header: Avatar & Badge */}
                    <div className="flex justify-between items-start mb-4 relative">
                      <div className="w-14 h-14 rounded-full border-4 border-white shadow-sm flex items-center justify-center" style={{ backgroundColor: team.color }}>
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingTeam(team); setSidebarOpen(true); }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-black hover:bg-red-50 rounded-full transition-all"
                          title="Edit Team"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${team.status === 'Draft' ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {team.status}
                        </span>
                      </div>
                    </div>

                    {/* Title & Role */}
                    <div className="mb-5 flex-grow">
                      <h4 className="text-[17px] font-bold text-black tracking-tight">{team.name}</h4>
                      <p className="text-[14px] text-gray-500 font-medium">{team.department} Team</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-5 border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Members</p>
                        <p className="text-[13px] text-gray-900 font-semibold">{team.members.length} Total</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Created</p>
                        <p className="text-[13px] text-gray-900 font-semibold">{new Date(team.createdAt).toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>

                    {/* Contact Info / Leader */}
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                      {leader ? (
                        <>
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=ffffff&color=000000`}
                            alt={leader.name}
                            className="w-8 h-8 rounded-full shadow-sm"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Team Leader</p>
                            <p className="text-[13px] font-semibold text-gray-900 truncate">{leader.name}</p>
                          </div>
                        </>
                      ) : (
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Team Leader</p>
                          <p className="text-[13px] font-semibold text-amber-500">Not Assigned</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Timeline View (Gantt Chart) */}
        <TeamTimeline />

      </div>

      {/* New Team Sidebar */}
      <NewTeamSidebar
        open={sidebarOpen}
        editData={editingTeam}
        onClose={() => {
          setSidebarOpen(false);
          setTimeout(() => setEditingTeam(null), 300); // clear after animation
        }}
        onSave={(team) => {
          console.log("Team saved:", team);
          setSidebarOpen(false);
          setTimeout(() => setEditingTeam(null), 300);
        }}
      />
    </>
  );
}
