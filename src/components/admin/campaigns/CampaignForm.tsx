import React, { useState } from "react";
import { useFormDraft } from "@/lib/useFormDraft";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  AlignLeft,
  Clock,
  Target,
  Plus,
  Trash2,
  X,
  Loader2,
  Heart,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
export type AdminCampaign = {
  id: string;
  title: string;
  org: string;
  raised: number;
  goal: number;
  daysLeft: number;
  status: "Active" | "Completed" | "Draft";
  image: string;
  description: string[];
  updates: { date: string; title: string; content: string }[];
  createdAt?: string;
};

interface CampaignFormProps {
  campaign: AdminCampaign;
  onChange: (campaign: AdminCampaign) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function CampaignForm({ campaign, onChange, onSave, onCancel }: CampaignFormProps) {
  const [formTab, setFormTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);

  // ── Auto-save draft to localStorage ──
  const draftKey = campaign?.id ? `draft:campaign:${campaign.id}` : "";
  const { hasDraft, clearDraft, lastSaved } = useFormDraft(
    draftKey,
    campaign,
    onChange
  );

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      clearDraft();   // wipe draft on successful save
      onSave();
      setSaving(false);
    }, 800);
  };

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto w-full flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-[#e6ece7] rounded-full p-3 sticky top-4 z-30 shadow-lg gap-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-xl hover:bg-gray-50 border border-transparent"
        >
          <ArrowLeft size={16} /> Discard Changes
        </button>

        <div className="flex bg-[#fcfdfc] border border-gray-200 rounded-full p-1">
          <button
            onClick={() => setFormTab("edit")}
            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${formTab === "edit" ? "bg-white text-black shadow-sm border border-gray-200" : "text-gray-500 hover:text-black"}`}
          >
            Edit Campaign
          </button>
          <button
            onClick={() => setFormTab("preview")}
            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${formTab === "preview" ? "bg-white text-black shadow-sm border border-gray-200" : "text-gray-500 hover:text-black"}`}
          >
            Preview Mode
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-lg disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />} 
            Save Campaign
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 xl:grid-cols-3 gap-6 ${formTab === 'preview' ? 'hidden' : 'block'}`}>
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-[#e6ece7] rounded-[24px] p-8 space-y-5 shadow-lg">
            <h3 className="text-lg font-bold text-black flex items-center gap-2 mb-2">
              <AlignLeft size={20} className="text-black" /> Campaign Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  value={campaign.title}
                  onChange={(e) => onChange({ ...campaign, title: e.target.value })}
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-3 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Organization</label>
                <input
                  type="text"
                  value={campaign.org}
                  onChange={(e) => onChange({ ...campaign, org: e.target.value })}
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-3 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">URL Slug (ID)</label>
                <input
                  type="text"
                  value={campaign.id}
                  onChange={(e) => onChange({ ...campaign, id: e.target.value })}
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-3 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={campaign.status}
                  onChange={(e) => onChange({ ...campaign, status: e.target.value as AdminCampaign['status'] })}
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-3 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Goal ($)</label>
                <input
                  type="number"
                  value={campaign.goal || ''}
                  onChange={(e) => onChange({ ...campaign, goal: Number(e.target.value) })}
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-3 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Raised ($)</label>
                <input
                  type="number"
                  value={campaign.raised || ''}
                  onChange={(e) => onChange({ ...campaign, raised: Number(e.target.value) })}
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-3 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Days Left</label>
                <input
                  type="number"
                  value={campaign.daysLeft || ''}
                  onChange={(e) => onChange({ ...campaign, daysLeft: Number(e.target.value) })}
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-3 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Image URL</label>
                <input
                  type="text"
                  value={campaign.image || ''}
                  onChange={(e) => onChange({ ...campaign, image: e.target.value })}
                  placeholder="/peace-1.jpg or https://..."
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-3 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e6ece7] rounded-[24px] p-8 space-y-8 shadow-lg">
            <div>
              <h3 className="text-lg font-bold text-black mb-4">Description Paragraphs</h3>
              {campaign.description.map((desc, idx) => (
                <div key={idx} className="flex gap-2 mb-3">
                  <textarea
                    value={desc}
                    onChange={(e) => {
                      const newDesc = [...campaign.description];
                      newDesc[idx] = e.target.value;
                      onChange({ ...campaign, description: newDesc });
                    }}
                    rows={3}
                    className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-2xl px-4 py-3 text-sm font-medium text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9] resize-none"
                  />
                  <button
                    onClick={() => {
                      const newDesc = campaign.description.filter((_, i) => i !== idx);
                      onChange({ ...campaign, description: newDesc.length ? newDesc : [""] });
                    }}
                    className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-2xl shrink-0 h-fit hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => onChange({ ...campaign, description: [...campaign.description, ""] })}
                className="text-sm font-bold text-black flex items-center gap-1 hover:text-black transition-colors mt-2"
              >
                <Plus size={14} /> Add Paragraph
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#e6ece7] rounded-[24px] p-8 space-y-5 shadow-lg">
            <h3 className="text-lg font-bold text-black flex items-center gap-2 mb-4">
              <Clock size={20} className="text-black" /> Campaign Updates
            </h3>
            {campaign.updates.map((item, idx) => (
              <div key={idx} className="bg-[#fcfdfc] border border-gray-100 p-5 rounded-2xl relative mb-4">
                <button
                  onClick={() => {
                    const newUpdates = campaign.updates.filter((_, i) => i !== idx);
                    onChange({ ...campaign, updates: newUpdates.length ? newUpdates : [{ date: "", title: "", content: "" }] });
                  }}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => {
                        const newUpdates = [...campaign.updates];
                        newUpdates[idx].date = e.target.value;
                        onChange({ ...campaign, updates: newUpdates });
                      }}
                      className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newUpdates = [...campaign.updates];
                        newUpdates[idx].title = e.target.value;
                        onChange({ ...campaign, updates: newUpdates });
                      }}
                      className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Content</label>
                  <textarea
                    value={item.content}
                    onChange={(e) => {
                      const newUpdates = [...campaign.updates];
                      newUpdates[idx].content = e.target.value;
                      onChange({ ...campaign, updates: newUpdates });
                    }}
                    rows={2}
                    className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-2xl px-3 py-2 text-sm font-medium text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9] resize-none"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => onChange({ ...campaign, updates: [...campaign.updates, { date: "", title: "", content: "" }] })}
              className="w-full py-4 border-2 border-[#e6ece7] border-dashed rounded-2xl text-sm font-bold text-gray-500 hover:bg-[#f4f8f4] hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Update
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#e6ece7] rounded-[24px] p-6 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-black flex items-center gap-2 border-b border-gray-100 pb-3">
              <Target size={16} className="text-black" /> Fundraising Goals
            </h3>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
              <select
                value={campaign.status}
                onChange={(e) => onChange({ ...campaign, status: e.target.value as any })}
                className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
              >
                {["Active", "Completed", "Draft"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Goal Amount ($)</label>
              <input
                type="number"
                value={campaign.goal}
                onChange={(e) => onChange({ ...campaign, goal: Number(e.target.value) })}
                className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Raised Amount ($)</label>
              <input
                type="number"
                value={campaign.raised}
                onChange={(e) => onChange({ ...campaign, raised: Number(e.target.value) })}
                className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Days Left</label>
              <input
                type="number"
                value={campaign.daysLeft}
                onChange={(e) => onChange({ ...campaign, daysLeft: Number(e.target.value) })}
                className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Mode Rendering */}
      {formTab === 'preview' && (
        <div className="w-full bg-white border border-[#e6ece7] rounded-[24px] p-6 shadow-lg max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-black border-b border-gray-100 pb-4 mb-6">Preview of Campaign Page</h2>
          
          <div className="flex flex-col w-full">
            {/* Hero Image */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden relative mb-8 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={campaign.image || '/peace-1.jpg'} alt={campaign.title || 'Campaign Image'} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-[#1f2345] shadow-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-black fill-black" />
                  Verified Campaign
                </span>
              </div>
            </div>

            {/* Campaign Header Details */}
            <div className="flex flex-col mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-semibold uppercase tracking-wider">
                <span>{campaign.org || 'Organization Name'}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="text-black">{campaign.status}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1f2345] leading-tight mb-4">
                {campaign.title || 'Campaign Title'}
              </h1>

              <div className="flex items-center gap-4 border-t border-b border-gray-100 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <span className="font-bold text-gray-400">{campaign.org ? campaign.org[0] : 'O'}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Organizer</p>
                    <p className="font-semibold text-gray-900">{campaign.org || 'Organization Name'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs area mockup */}
            <div className="flex flex-col bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-6 border-b border-gray-100 pb-4 mb-6">
                <button className="font-semibold pb-4 -mb-[18px] text-black border-b-2 border-[#0ea5e9] text-[#0ea5e9]">
                  About
                </button>
                <button className="font-semibold pb-4 -mb-[18px] text-gray-500">
                  Updates ({campaign.updates.length})
                </button>
              </div>

              <div className="prose prose-lg prose-gray max-w-none text-gray-600">
                <div className="space-y-4">
                  {campaign.description.map((desc, i) => (
                    <p key={i} className="leading-relaxed">{desc || 'Empty paragraph...'}</p>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">How your donation helps:</h3>
                <ul className="space-y-3 list-none p-0">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-black shrink-0" />
                    <span><strong>$50</strong> provides a family of four with clean drinking water for a month.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-black shrink-0" />
                    <span><strong>$100</strong> supplies emergency food rations and cooking supplies.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-black shrink-0" />
                    <span><strong>$250</strong> helps deploy medical tents and first-aid kits to remote areas.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
}
