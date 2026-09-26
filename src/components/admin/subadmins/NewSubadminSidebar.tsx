'use client';
import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check, ChevronRight, Upload } from 'lucide-react';

export const PERMISSION_SECTIONS = [
  {
    title: 'Main',
    routes: [
      { path: '/admin', label: 'Dashboard' },
      { path: '/admin/campaigns', label: 'Campaigns' },
      { path: '/admin/events', label: 'Events' },
      { path: '/admin/volunteers', label: 'Volunteers' }
    ]
  },
  {
    title: 'Content',
    routes: [
      { path: '/admin/blog', label: 'Blogs' },
      { path: '/admin/subscribers', label: 'Subscribers' }
    ]
  },
  {
    title: 'Communication',
    routes: [
      { path: '/admin/contacts', label: 'Contacts' }
    ]
  },
  {
    title: 'Finance',
    routes: [
      { path: '/admin/transactions', label: 'Transactions' }
    ]
  },
  {
    title: 'Insights',
    routes: [
      { path: '/admin/analytics', label: 'Analytics' }
    ]
  },
  {
    title: 'System',
    routes: [
      { path: '/admin/settings', label: 'Settings' },
      { path: '/admin/subadmin', label: 'Subadmin' }
    ]
  }
];

interface NewSubadminSidebarProps {
  open: boolean;
  onClose: () => void;
  editData?: any;
}

import { addSubadmin, updateSubadmin, useSubadmins } from '@/lib/useSubadmins';

export default function NewSubadminSidebar({ open, onClose, editData }: NewSubadminSidebarProps) {
  const { mutate } = useSubadmins();
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [step, setStep] = useState(1);
  const [permissions, setPermissions] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      if (editData) {
        setAvatar(editData.avatar || "");
        setFullName(editData.fullName || "");
        setDob(editData.dob || "");
        setGender(editData.gender || "");
        setNationality(editData.nationality || "");
        setAddress(editData.address || "");
        setPhone(editData.phone || "");
        setEmail(editData.email || "");
        setRole(editData.role || "Viewer");
        setPermissions(editData.permissions || []);
      } else {
        setAvatar("");
        setFullName("");
        setDob("");
        setGender("");
        setNationality("");
        setAddress("");
        setPhone("");
        setEmail("");
        setRole("Viewer");
        setPermissions([]);
      }
      setStep(1);
      setSaved(false);
    }
  }, [open, editData]);

  const isValid = fullName.trim().length > 0 && email.trim().length > 0;

  const togglePermission = (path: string) => {
    setPermissions(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    
    try {
      const data = {
        fullName,
        dob,
        gender,
        nationality,
        address,
        phone,
        email,
        role,
        permissions,
        avatar,
        // (For a real app, password should go to Auth API)
      };

      if (editData) {
        await updateSubadmin(editData.id, data);
      } else {
        await addSubadmin(data);
      }

      await mutate();
      setSaved(true);
      setTimeout(() => {
        onClose();
        setSaving(false);
      }, 900);
    } catch (err) {
      console.error("Failed to save subadmin:", err);
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed top-2 right-2 bottom-2 z-50 w-[460px] max-w-[100vw] bg-white rounded-2xl flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-gray-100">
          <div>
            <h2 className="text-[20px] font-bold text-black tracking-tight mb-1">
              {editData ? "Edit Subadmin" : "Add Subadmin"}
            </h2>
            <p className="text-[13px] font-medium text-gray-500 transition-opacity">
              {step === 1
                ? (editData ? "Update subadmin details" : "Create a new subadmin account")
                : "Select which areas this subadmin can access"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-6 custom-scrollbar">

          {step === 1 ? (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {/* Personal Details */}
              <div>
                <h3 className="text-[12px] font-bold text-black uppercase tracking-wider mb-4">Personal Details</h3>
                
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserPlus className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Upload className="w-5 h-5" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                  <span className="text-[12px] font-medium text-gray-500 mt-2">Upload Photo</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Emily Johnson"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-[14px] outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/20 transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-[14px] outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/20 transition-all font-medium text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-[14px] outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/20 transition-all font-medium appearance-none text-gray-600"
                      >
                        <option value="" disabled>Select</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Nationality</label>
                    <input
                      type="text"
                      placeholder="e.g. American"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-[14px] outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/20 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Address</label>
                    <input
                      type="text"
                      placeholder="e.g. California - United States"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-[14px] outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/20 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. (213) 555-1234"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-[14px] outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/20 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Account Settings */}
              <div>
                <h3 className="text-[12px] font-bold text-black uppercase tracking-wider mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-[14px] outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/20 transition-all font-medium"
                    />
                  </div>


                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Access Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-[14px] outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/20 transition-all font-medium appearance-none text-gray-600"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {PERMISSION_SECTIONS.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-[12px] font-bold text-black uppercase tracking-wider mb-3">{section.title}</h3>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                    {section.routes.map(route => (
                      <div key={route.path} className="flex items-center justify-between px-5 py-3.5 bg-white">
                        <span className="text-[13px] font-semibold text-gray-800">{route.label}</span>
                        <button
                          onClick={() => togglePermission(route.path)}
                          className={`w-10 h-6 rounded-full transition-colors relative flex items-center ${permissions.includes(route.path) ? 'bg-black' : 'bg-gray-200'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute transition-transform ${permissions.includes(route.path) ? 'translate-x-[20px]' : 'translate-x-[4px]'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-7 pb-7 pt-4 border-t border-gray-100 flex-shrink-0 flex items-center gap-3 bg-white z-10">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!isValid}
                className={`flex-[2.5] py-3 rounded-full text-sm font-bold text-white flex items-center justify-center gap-2 transition-all shadow-sm ${isValid
                  ? "bg-black hover:bg-black/90"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"}`}
              >
                Next: Permissions <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={saved}
                className={`flex-[2.5] py-3 rounded-full text-sm font-bold text-white flex items-center justify-center gap-2 transition-all shadow-sm ${saved
                  ? "bg-emerald-500"
                  : "bg-black hover:bg-black/90"}`}
              >
                {saved ? (
                  <><Check className="w-4 h-4" /> {editData ? "Subadmin Updated!" : "Subadmin Added!"}</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> {editData ? "Save Changes" : "Add Subadmin"}</>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
