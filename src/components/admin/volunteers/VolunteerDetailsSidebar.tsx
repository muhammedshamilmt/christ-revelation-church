import React from 'react';
import { X, User, MapPin, Calendar, Clock, Briefcase, Heart, CheckCircle2, FileText, Download, Check, ExternalLink, Mail, Phone, ChevronLeft, ChevronRight, Maximize2, MoreHorizontal, Loader2 } from 'lucide-react';
import { updateVolunteerStatus, useVolunteers } from '@/lib/useVolunteers';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export interface VolunteerDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  ageGroup: string;
  interests: string[];
  frequency: string;
  days: string[];
  time: string[];
  preference: string;
  hasExperience: string;
  experienceDetails: string;
  motivation: string;
  skills: string[];
  status: string;
  matchScore: number;
  appliedDate: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: VolunteerDetails | null;
}

export default function VolunteerDetailsSidebar({ isOpen, onClose, volunteer }: SidebarProps) {
  const { mutate } = useVolunteers();
  const [isApproving, setIsApproving] = useState(false);
  const [activeTab, setActiveTab] = useState('Application');

  if (!volunteer) return null;

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await updateVolunteerStatus(volunteer.id, 'accepted');
      await mutate();
      onClose();
    } catch (err) {
      console.error('Failed to approve:', err);
      toast.error('Failed to approve volunteer. Please try again.');
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-4 bottom-4 right-4 w-[700px] max-w-[calc(100vw-2rem)] bg-white rounded-[24px] shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-black">Applicant Details</h2>
            <div className="flex items-center gap-2 text-gray-400">
              <button className="hover:text-gray-600 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <span className="text-sm">Previous</span>
              <span className="text-sm ml-2">Next</span>
              <button className="hover:text-gray-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
              <Maximize2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <img
                src={`https://ui-avatars.com/api/?name=${volunteer.firstName}+${volunteer.lastName}&background=ff385c&color=fff&size=64`}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-2 border-white shadow-sm"
              />
              <div>
                <h1 className="text-2xl font-bold text-black">{volunteer.firstName} {volunteer.lastName}</h1>
                <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm font-medium">
                  <MapPin className="w-4 h-4" /> {volunteer.location}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {volunteer.status === 'pending' && (
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Approve
                </button>
              )}
              <button className="px-4 py-2 bg-black text-white font-semibold rounded-full text-sm hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm">
                <Calendar className="w-4 h-4" /> Schedule Call
              </button>
              <button className="p-2 text-gray-400 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100">
              <User className="w-4 h-4" /> {volunteer.matchScore}% Matched
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm font-semibold border border-gray-200">
              <Briefcase className="w-4 h-4" /> {volunteer.hasExperience === 'yes' ? 'Experienced' : 'New'}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm font-semibold border border-gray-200">
              <Clock className="w-4 h-4" /> {volunteer.ageGroup}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
              <p className="text-xs text-gray-500 font-medium mb-1">Status</p>
              <p className="text-sm font-bold text-black">{volunteer.status}</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
              <p className="text-xs text-gray-500 font-medium mb-1">Availability</p>
              <p className="text-sm font-bold text-black">{volunteer.frequency}</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
              <p className="text-xs text-gray-500 font-medium mb-1">Applied date</p>
              <p className="text-sm font-bold text-black">{volunteer.appliedDate}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-100 mb-8">
            {['Application', 'Experience', 'Schedule', 'Notes'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition-colors ${activeTab === tab ? 'text-black border-b-2 border-black font-bold' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Application Details */}
          {activeTab === 'Application' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

              {/* Motivation */}
              <section>
                <h3 className="text-base font-bold text-black mb-3">About {volunteer.firstName} (Motivation)</h3>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  {volunteer.motivation || 'I am passionate about helping the community and making a difference...'}
                </p>
              </section>

              {/* Skills & Interests */}
              <section>
                <h3 className="text-base font-bold text-black mb-3">Top Skills & Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {volunteer.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                      {skill}
                    </span>
                  ))}
                  {volunteer.interests.map(interest => (
                    <span key={interest} className="px-3 py-1.5 bg-pink-50 text-black text-xs font-semibold rounded-full border border-pink-100">
                      {interest}
                    </span>
                  ))}
                </div>
              </section>

              {/* Attachments */}
              <section>
                <h3 className="text-base font-bold text-black mb-3">Attachments & Contact</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black">{volunteer.firstName}_Resume.pdf</p>
                        <p className="text-xs text-gray-500">280KB</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-gray-700 flex items-center gap-1 hover:text-black">
                      Download <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black">Email Address</p>
                        <p className="text-sm text-gray-500">{volunteer.email}</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-gray-700 hover:text-black">
                      Copy
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black">Phone Number</p>
                        <p className="text-sm text-gray-500">{volunteer.phone}</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-gray-700 hover:text-black">
                      Copy
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Experience Details */}
          {activeTab === 'Experience' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section>
                <h3 className="text-base font-bold text-black mb-3">Previous Experience</h3>
                {volunteer.hasExperience === 'yes' ? (
                  <div className="pl-4 border-l-2 border-black py-1">
                    <p className="text-sm font-bold text-black mb-1">Volunteering History</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {volunteer.experienceDetails || 'Has previously worked with local NGOs focusing on community outreach and food distribution.'}
                    </p>
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-700">No prior experience.</p>
                    <p className="text-sm text-gray-500 mt-1">This volunteer is just getting started!</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Schedule Details */}
          {activeTab === 'Schedule' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section>
                <h3 className="text-base font-bold text-black mb-3">Availability Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-100 rounded-xl p-4 bg-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center"><Calendar className="w-5 h-5" /></div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Days</p>
                      <p className="text-sm font-semibold text-black">{volunteer.days.join(', ') || 'Any day'}</p>
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 bg-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center"><Clock className="w-5 h-5" /></div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Time</p>
                      <p className="text-sm font-semibold text-black">{volunteer.time.join(', ') || 'Flexible'}</p>
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <h3 className="text-base font-bold text-black mb-3">Commitment</h3>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{volunteer.frequency || 'Ad hoc'}</p>
                    <p className="text-xs text-gray-500">Frequency preference</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Notes */}
          {activeTab === 'Notes' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-black">Admin Notes</h3>
                <button className="text-sm font-semibold text-black hover:text-black">
                  + Add Note
                </button>
              </div>
              <div className="p-10 border-2 border-dashed border-gray-200 rounded-xl text-center">
                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-700">No notes yet</p>
                <p className="text-sm text-gray-500 mt-1">Add internal notes or interview feedback here.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
