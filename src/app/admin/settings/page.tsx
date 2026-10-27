'use client';
import React, { useState, useEffect } from 'react';
import {
  LayoutGrid, Bell, Settings as SettingsIcon, User,
  Building2, ShieldCheck, Mail, Check, UploadCloud,
  Globe, CreditCard, LogOut
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [adminUser, setAdminUser] = useState<any>({
    email: 'pastor.david@christrevelation.org',
    user_metadata: {
      full_name: 'Pastor David Vance',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    last_sign_in_at: new Date().toISOString(),
  });
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: false,
    newDonations: true,
    weeklyReports: true,
  });

  const handleSignOut = async () => {
    setIsSigningOut(true);
    router.push('/');
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const TABS = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8f9]">
      {/* Top Header */}
      {/* <header className="h-16 border-b border-gray-200 bg-white/50 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-2 text-[13px] font-medium">
          <LayoutGrid className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">System</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold">Settings</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full border border-white"></span>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </header> */}

      <div className="p-8 flex-1 max-w-[1400px] w-full mx-auto">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight flex items-center gap-3">
            System Settings
          </h1>
          <p className="text-[15px] font-medium text-gray-500 mt-1">
            Manage your account preferences, organization details, and security.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-[14px] font-semibold transition-colors ${activeTab === tab.id
                  ? 'bg-white text-gray-900 border border-gray-200'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
                  }`}
              >
                <tab.icon className={`w-[18px] h-[18px] ${activeTab === tab.id ? 'text-[#0ea5e9]' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 bg-white border border-gray-200 rounded-[24px] overflow-hidden min-h-[600px]">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Profile Information</h2>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-2xl font-bold text-gray-400">AH</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors">
                      <UploadCloud className="w-4 h-4" /> Upload Avatar
                    </button>
                    <p className="text-[13px] text-gray-500 font-medium">Recommended size: 256x256px. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">First Name</label>
                    <input type="text" defaultValue="Admin" className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Last Name</label>
                    <input type="text" defaultValue="User" className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Email Address</label>
                    <input type="email" defaultValue="pastor.david@christrevelation.org" className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400" />
                  </div>
                  <div className="space-y-2 md:col-span-2 pt-4">
                    <button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-8 py-3 rounded-full text-sm font-semibold transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Organization Tab */}
            {activeTab === 'organization' && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Organization Details</h2>
                <div className="grid grid-cols-1 gap-6 max-w-3xl">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Organization Name</label>
                    <input type="text" defaultValue="Christ Revelation Church" className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Website</label>
                    <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-full overflow-hidden focus-within:bg-white focus-within:border-gray-400">
                      <div className="pl-4 pr-2 text-gray-400"><Globe className="w-4 h-4" /></div>
                      <input type="text" defaultValue="christrevelation.org" className="w-full bg-transparent px-2 py-3 text-sm text-gray-900 focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Address</label>
                    <textarea rows={3} defaultValue="Birmingham, UK" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400 resize-none" />
                  </div>
                  <div className="space-y-2 pt-4">
                    <button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-8 py-3 rounded-full text-sm font-semibold transition-colors">
                      Update Organization
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Notification Preferences</h2>
                <div className="max-w-3xl flex flex-col gap-6">

                  {[
                    { key: 'emailAlerts', title: 'Email Alerts', desc: 'Receive critical system alerts and updates via email.' },
                    { key: 'pushNotifications', title: 'Push Notifications', desc: 'Allow browser push notifications for real-time updates.' },
                    { key: 'newDonations', title: 'New Donations', desc: 'Get notified immediately when a new donation is received.' },
                    { key: 'weeklyReports', title: 'Weekly Reports', desc: 'Receive a weekly summary of analytics and system health.' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-start justify-between p-4 bg-gray-50 border border-gray-200 rounded-[16px]">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.title}</p>
                        <p className="text-[13px] text-gray-500 font-medium mt-1">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-[#0ea5e9]' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}

                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Security & Privacy</h2>
                <div className="max-w-3xl flex flex-col gap-8">

                  {/* Active Session */}
                  <div className="space-y-4">
                    <h3 className="text-[15px] font-bold text-gray-900">Active Session</h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-[16px] bg-gray-50">
                      <div className="flex items-center gap-4">
                        {adminUser?.user_metadata?.avatar_url ? (
                          <img
                            src={adminUser.user_metadata.avatar_url}
                            alt="Admin avatar"
                            className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black font-bold text-sm">
                            {adminUser?.email?.charAt(0).toUpperCase() ?? 'A'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {adminUser?.user_metadata?.full_name ?? adminUser?.email ?? 'Admin'}
                          </p>
                          <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                            {adminUser?.email ?? '—'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[12px] font-bold text-emerald-600">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Auth Provider */}
                  <div className="space-y-4">
                    <h3 className="text-[15px] font-bold text-gray-900">Authentication Method</h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-[16px]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-5 h-5">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Google OAuth</p>
                          <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                            Signed in via Google · {adminUser?.email ?? '—'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-[12px] font-bold">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        Connected
                      </div>
                    </div>
                  </div>

                  {/* Last sign-in */}
                  {adminUser?.last_sign_in_at && (
                    <div className="space-y-2">
                      <h3 className="text-[15px] font-bold text-gray-900">Last Sign-In</h3>
                      <p className="text-[14px] text-gray-500 font-medium">
                        {new Date(adminUser.last_sign_in_at).toLocaleString('en-GB', {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  )}

                  {/* Sign Out */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-3">Sign Out</h3>
                    <p className="text-[13px] text-gray-500 font-medium mb-4">
                      This will end your current admin session and redirect you to the home page.
                    </p>
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <LogOut className="w-4 h-4" />
                      {isSigningOut ? 'Signing out…' : 'Sign Out of Admin'}
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4 border border-gray-200">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Billing integration not set up</h3>
                <p className="text-[15px] text-gray-500 font-medium max-w-sm mb-6">Connect your payment processor to manage billing and subscription plans directly from here.</p>
                <button className="bg-[#0ea5e9] hover:bg-[#0284c7] hover:text-white text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors">
                  Setup Stripe Connect
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
