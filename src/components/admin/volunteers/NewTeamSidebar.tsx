"use client";

import React, { useState, useEffect } from "react";
import {
  X, Search, Crown, Check, ChevronDown, Users, Star,
  ArrowRight, Upload, Plus, Tag,
} from "lucide-react";

const AVATAR_URL = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f3f4f6&color=111827&size=56`;

import { useVolunteers } from "@/lib/useVolunteers";
import { addTeam, updateTeam } from "@/lib/useTeams";
import { useSWRConfig } from "swr";
import { TEAMS_KEY } from "@/lib/useTeams";

const DEPARTMENTS = ["Operations", "Community", "Management", "Finance", "HR", "IT", "Outreach", "Legal"];

const TEAM_COLORS = [
  { label: "Rose", value: "#000000" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Emerald", value: "#10b981" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Sky", value: "#0ea5e9" },
  { label: "Purple", value: "#a855f7" },
];

const SKILL_TAGS = ["Leadership", "Fundraising", "Outreach", "Research", "Events", "Media", "Tech", "Legal"];

// Define member type based on VolunteerDetails
type Member = { id: string; name: string; role: string; department: string };

interface NewTeamSidebarProps {
  open: boolean;
  onClose: () => void;
  onSave?: (team: any) => void;
  editData?: any;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">{children}</p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">{children}</label>
  );
}

export default function NewTeamSidebar({ open, onClose, onSave, editData }: NewTeamSidebarProps) {
  // Team Details
  const [teamName, setTeamName] = useState("");
  const [department, setDepartment] = useState("");
  const [deptOpen, setDeptOpen] = useState(false);
  const [color, setColor] = useState(TEAM_COLORS[0].value);
  const [colorOpen, setColorOpen] = useState(false);
  const [status, setStatus] = useState<"Active" | "Draft">("Active");

  // Members
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [leaderId, setLeaderId] = useState<string | null>(null);

  // SWR hooks
  const { volunteers, isLoading: loadingVolunteers } = useVolunteers();
  const { mutate } = useSWRConfig();

  // Map volunteers to Member format for the UI
  const availableMembers: Member[] = volunteers.map(v => ({
    id: v.id,
    name: `${v.firstName} ${v.lastName}`.trim(),
    role: 'Volunteer',
    department: (v.interests && v.interests.length > 0) ? v.interests[0] : 'General',
  }));

  // Tags & Notes
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [extraTags, setExtraTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      if (editData) {
        setTeamName(editData.name || "");
        setDepartment(editData.department || "");
        setColor(editData.color || TEAM_COLORS[0].value);
        setStatus(editData.status || "Active");
        setLeaderId(editData.leaderId || null);
        setActiveTags(editData.tags || []);
        setNotes(editData.notes || "");

        if (editData.members) {
          setSelectedMembers(editData.members);
        } else if (editData.memberIds && availableMembers.length > 0) {
          setSelectedMembers(availableMembers.filter(m => editData.memberIds.includes(m.id)));
        } else {
          setSelectedMembers([]);
        }
      } else {
        setTeamName(""); setDepartment(""); setColor(TEAM_COLORS[0].value);
        setStatus("Active"); setMemberSearch(""); setSelectedMembers([]);
        setLeaderId(null); setActiveTags([]); setCustomTag("");
        setExtraTags([]); setNotes("");
      }
      setSaved(false);
      setDeptOpen(false); setColorOpen(false);
    }
  }, [open, editData, availableMembers.length]);

  const filteredMembers = availableMembers.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.role.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.department.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const toggleMember = (m: Member) => {
    const already = selectedMembers.find(s => s.id === m.id);
    if (already) {
      setSelectedMembers(prev => prev.filter(s => s.id !== m.id));
      if (leaderId === m.id) setLeaderId(null);
    } else {
      setSelectedMembers(prev => [...prev, m]);
    }
  };

  const toggleTag = (tag: string) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addCustomTag = () => {
    const t = customTag.trim();
    if (t && !SKILL_TAGS.includes(t) && !extraTags.includes(t)) {
      setExtraTags(prev => [...prev, t]);
      setActiveTags(prev => [...prev, t]);
    }
    setCustomTag("");
  };

  const isValid = teamName.trim().length > 0;

  const handleSave = async () => {
    if (!isValid) return;
    try {
      setSaved(true);

      const payload = {
        name: teamName,
        department,
        status,
        color,
        tags: activeTags,
        notes,
        leaderId,
        memberIds: selectedMembers.map(m => m.id),
      };

      if (editData) {
        await updateTeam(editData.id, payload);
      } else {
        await addTeam(payload);
      }

      // Refresh teams data
      mutate(TEAMS_KEY);

      onSave?.({ teamName, department, color, status, members: selectedMembers, leaderId, tags: activeTags, notes });
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (error) {
      console.error("Failed to add team", error);
      setSaved(false);
      // could show an error toast here
    }
  };

  const selectedColorLabel = TEAM_COLORS.find(c => c.value === color)?.label || "Rose";
  const leader = selectedMembers.find(m => m.id === leaderId);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${open ? "bg-black/25 backdrop-blur-[3px] pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar panel — cloned from reference design */}
      <div
        className={`fixed top-2 right-2 bottom-2 z-50 w-[460px] max-w-[100vw] bg-white rounded-2xl flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-gray-100">
          <div>
            <h2 className="text-[20px] font-bold text-black tracking-tight mb-1">
              {editData ? "Edit Team" : "Add New Team"}
            </h2>
            <p className="text-[13px] font-medium text-gray-500">
              {editData ? "Update the details of the team" : "Create a new team and assign members"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-black transition-colors ml-4 mt-0.5 flex-shrink-0"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-8">

          {/* ─ Section 1: Team Details ─ */}
          <div>
            <SectionLabel>Team Details</SectionLabel>
            <div className="border border-gray-200 rounded-[16px] p-5 space-y-5 bg-white">

              {/* Row 1: Team Name + Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Team Name</FieldLabel>
                  <input
                    type="text"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    placeholder="e.g. Alpha Squad"
                    className="w-full px-3.5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
                  />
                </div>
                <div>
                  <FieldLabel>Department</FieldLabel>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setDeptOpen(o => !o); setColorOpen(false); }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-left focus:outline-none hover:border-gray-300 transition-colors"
                    >
                      <span className={department ? "text-black" : "text-gray-400"}>{department || "Select…"}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${deptOpen ? "rotate-180" : ""}`} />
                    </button>
                    {deptOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[12px] shadow-xl z-30 overflow-hidden max-h-48 overflow-y-auto">
                        {DEPARTMENTS.map(d => (
                          <button key={d} onClick={() => { setDepartment(d); setDeptOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${department === d ? "text-black font-semibold bg-[#fff5f7]" : "text-gray-700 font-medium hover:bg-gray-50"}`}>
                            {d}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Status toggle + Team Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Status</FieldLabel>
                  <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-full w-fit">
                    {(["Active", "Draft"] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${status === s
                          ? s === "Active"
                            ? "bg-black text-white shadow-sm"
                            : "bg-gray-700 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel>Team Color</FieldLabel>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setColorOpen(o => !o); setDeptOpen(false); }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-left focus:outline-none hover:border-gray-300 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-black">{selectedColorLabel}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${colorOpen ? "rotate-180" : ""}`} />
                    </button>
                    {colorOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[12px] shadow-xl z-30 overflow-hidden">
                        {TEAM_COLORS.map(c => (
                          <button key={c.value} onClick={() => { setColor(c.value); setColorOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${color === c.value ? "bg-gray-50" : "hover:bg-gray-50"}`}>
                            <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.value }} />
                            <span className={`font-medium ${color === c.value ? "text-black font-semibold" : "text-gray-700"}`}>{c.label}</span>
                            {color === c.value && <Check className="w-3.5 h-3.5 ml-auto" style={{ color: c.value }} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─ Section 2: Members ─ */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <SectionLabel>Members</SectionLabel>
              {selectedMembers.length > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-black -mt-4">
                  {selectedMembers.length} selected
                </span>
              )}
            </div>

            <div className="border border-gray-200 rounded-[16px] bg-white overflow-hidden">
              {/* Search inside the box */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    placeholder="Search members…"
                    className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-black bg-gray-50/50 transition-all"
                  />
                </div>
              </div>

              {/* Member rows */}
              <div className="divide-y divide-gray-100 max-h-[240px] overflow-y-auto">
                {loadingVolunteers ? (
                  <div className="py-6 flex flex-col items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    <p className="text-[12px] font-medium text-gray-400 animate-pulse">Loading volunteers...</p>
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-6 font-medium">No members found</p>
                ) : (
                  filteredMembers.map(m => {
                    const isSelected = !!selectedMembers.find(s => s.id === m.id);
                    const isLeader = leaderId === m.id;
                    return (
                      <div key={m.id} className={`flex items-center gap-3 px-4 py-3 transition-colors ${isSelected ? "bg-[#fff8f9]" : "hover:bg-gray-50"}`}>
                        {/* Checkbox-style toggle */}
                        <button
                          onClick={() => toggleMember(m)}
                          className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? "bg-black border-black" : "border-gray-300 hover:border-black"}`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </button>

                        <img src={AVATAR_URL(m.name)} alt={m.name} className="w-8 h-8 rounded-full border border-gray-200 flex-shrink-0" />

                        <div className="flex-1 min-w-0" onClick={() => toggleMember(m)} role="button">
                          <p className="text-[13px] font-semibold text-black truncate">{m.name}</p>
                          <p className="text-[11px] text-gray-400 font-medium truncate">{m.role} · {m.department}</p>
                        </div>

                        {/* Leader star — only visible if selected */}
                        {isSelected && (
                          <button
                            title={isLeader ? "Remove as leader" : "Set as team leader"}
                            onClick={() => setLeaderId(isLeader ? null : m.id)}
                            className="flex-shrink-0 transition-all"
                          >
                            <Star className={`w-4 h-4 transition-all ${isLeader ? "fill-amber-400 text-amber-400" : "text-gray-300 hover:text-amber-400"}`} />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Leader summary row — like P&L computed rows in the reference */}
              {selectedMembers.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/60 space-y-2">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-500 font-medium">Total Members</span>
                    <span className="font-bold text-black">{selectedMembers.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-500 font-medium">Team Leader</span>
                    {leader ? (
                      <span className="flex items-center gap-1.5 font-bold" style={{ color }}>
                        <Crown className="w-3.5 h-3.5" />
                        {leader.name.split(" ")[0]}
                      </span>
                    ) : (
                      <span className="text-amber-500 font-semibold text-[12px]">Not assigned</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─ Section 3: Skills & Tags ─ */}
          <div>
            <SectionLabel>Skills & Tags</SectionLabel>
            <div className="border border-gray-200 rounded-[16px] p-5 bg-white space-y-4">
              <FieldLabel>Team Skills</FieldLabel>
              {/* Pill tags — like Behavioral Tags in reference */}
              <div className="flex flex-wrap gap-2">
                {[...SKILL_TAGS, ...extraTags].map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all border ${activeTags.includes(tag)
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Custom tag input — like "Add custom tag" in reference */}
              <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3.5 py-2.5 focus-within:border-black focus-within:ring-2 focus-within:ring-black/20 transition-all">
                <Tag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={customTag}
                  onChange={e => setCustomTag(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomTag(); } }}
                  placeholder="Add custom tag…"
                  className="flex-1 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
                <button
                  onClick={addCustomTag}
                  disabled={!customTag.trim()}
                  className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center disabled:opacity-30 hover:bg-black transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Notes — like Chart Screenshot area */}
              <div>
                <FieldLabel>Notes</FieldLabel>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any notes or goals for this team…"
                  className="w-full px-3.5 py-2.5 rounded-[20px] border border-gray-200 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-all resize-none bg-gray-50/40"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer — cloned from reference: Cancel (light) + primary CTA (dark) ── */}
        <div className="px-7 pb-7 pt-4 border-t border-gray-100 flex-shrink-0 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || saved}
            className={`flex-[2.5] py-3 rounded-full text-sm font-bold text-white flex items-center justify-center gap-2 transition-all ${saved
              ? "bg-emerald-500"
              : isValid
                ? "bg-black hover:bg-neutral-800 hover:text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          >
            {saved ? (
              <><Check className="w-4 h-4" /> {editData ? "Team Updated!" : "Team Created!"}</>
            ) : (
              <><Plus className="w-4 h-4" /> {editData ? "Save Changes" : "Add Team"}</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
