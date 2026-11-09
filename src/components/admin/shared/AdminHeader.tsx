'use client';
import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  MessageSquare, Bell, Search, MoreHorizontal, Settings,
  Headphones, Activity, LogOut, AlertTriangle, ChevronDown, Check, Building2,
  Menu, PanelLeftOpen, PanelLeftClose
} from 'lucide-react';

import { useAdminAuth, signOutAdmin } from './AdminAuthProvider';
import { toggleAdminSidebar, ADMIN_SIDEBAR_STATE_EVENT } from './Sidebar';
import { createClient } from '@/lib/supabase/client';

interface AdminHeaderProps {
  subtitle?: string;
  notificationCount?: number;
}

interface Notification {
  id: string;
  type: 'general' | 'inbox' | 'archived';
  user: string;
  avatar: string;
  action: string;
  time: string;
  source: string;
  isRead: boolean;
  isOnline: boolean;
}

export default function AdminHeader({
  subtitle = "Here's what's happening with your projects today.",
  notificationCount = 9
}: AdminHeaderProps) {
  const pathname = usePathname();
  const { user, role, subadminId, permissions } = useAdminAuth();
  
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'user@example.com';
  const profileImage = user?.user_metadata?.avatar_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBvq26wOg0Zi4H-gLYQKJsHN1IhEoteb3j2cn9u__ifA&s=10';

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeNotifTab, setActiveNotifTab] = useState<'general' | 'inbox' | 'archived'>('general');
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'general', user: 'Polly', avatar: 'https://i.pravatar.cc/150?u=1', action: 'edited Contact page', time: '36 mins ago', source: 'Craftwork Design', isRead: false, isOnline: true },
    { id: '2', type: 'general', user: 'James', avatar: 'https://i.pravatar.cc/150?u=2', action: 'left a comment on ACME 2.1', time: '2 hours ago', source: 'ACME', isRead: false, isOnline: false },
    { id: '3', type: 'inbox', user: 'Mary', avatar: 'https://i.pravatar.cc/150?u=3', action: 'sent you a direct message', time: '3 hours ago', source: 'Craftwork Design', isRead: true, isOnline: true },
    { id: '4', type: 'inbox', user: 'David', avatar: 'https://i.pravatar.cc/150?u=4', action: 'shared the file Isometric 2.0 with you', time: '5 hours ago', source: 'Design Team', isRead: false, isOnline: false }
  ]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSidebarState = (e: Event) => {
      const custom = e as CustomEvent<{ isOpen: boolean; isMobile: boolean }>;
      if (custom.detail) {
        setSidebarOpen(custom.detail.isOpen);
        setIsMobileView(custom.detail.isMobile);
      }
    };
    window.addEventListener(ADMIN_SIDEBAR_STATE_EVENT, handleSidebarState);
    return () => window.removeEventListener(ADMIN_SIDEBAR_STATE_EVENT, handleSidebarState);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Create a readable title from pathname
  let pageTitle = 'Dashboard';
  if (pathname) {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 1) {
      // capitalize last segment (or second to last if it's an ID)
      const lastPart = parts[parts.length - 1];
      if (lastPart.length > 20 || lastPart === 'new') { // ID check heuristic
        pageTitle = parts[parts.length - 2];
      } else {
        pageTitle = lastPart;
      }
      pageTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);
      pageTitle = pageTitle.replace(/-/g, ' ');
    }
  }

  return (
    <div className="w-full bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 z-50 relative" ref={dropdownRef}>

      {/* Left Section: Sidebar Toggle & Welcome Text */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleAdminSidebar}
          title={sidebarOpen ? "Hide sidebar" : "Open sidebar"}
          aria-label={sidebarOpen ? "Hide sidebar" : "Open sidebar"}
          className={`w-10 h-10 rounded-xl border border-gray-200/80 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-black flex items-center justify-center transition-all shrink-0 ${
            !isMobileView && sidebarOpen ? 'lg:hidden' : 'flex'
          }`}
        >
          {isMobileView ? (
            <Menu className="w-[18px] h-[18px]" />
          ) : sidebarOpen ? (
            <PanelLeftClose className="w-[18px] h-[18px]" />
          ) : (
            <PanelLeftOpen className="w-[18px] h-[18px]" />
          )}
        </button>

        <div className="flex flex-col">
          <h1 className="text-[18px] font-bold text-gray-900 tracking-tight capitalize">
            {pageTitle} Overview
          </h1>
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Chat / Messages Button */}
        <button
          onClick={() => {
            setActiveNotifTab('inbox');
            setIsNotifOpen(true);
            setIsProfileOpen(false);
          }}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
        >
          <MessageSquare className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors hidden sm:flex ${isNotifOpen ? 'bg-gray-100 text-black' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-black'}`}
          >
            <Bell className="w-[18px] h-[18px]" />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#0ea5e9] text-white text-[10px] font-bold border-2 border-white">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 top-12 w-[380px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-[15px]">Notifications</h3>
                <button className="text-[13px] text-white hover:text-white rounded-full font-medium px-3 py-0.5 bg-[#0ea5e9] hover:bg-[#0284c7] transition-colors">Mark all as read</button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-6 px-4 border-b border-gray-100 text-[13px] font-medium">
                <div
                  onClick={() => setActiveNotifTab('general')}
                  className={`relative pb-3 cursor-pointer transition-colors ${activeNotifTab === 'general' ? 'text-[#0ea5e9]' : 'text-gray-400 hover:text-gray-600'} flex items-center gap-1.5`}
                >
                  General
                  <span className={activeNotifTab === 'general' ? "bg-[#0ea5e9] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold" : "border border-gray-200 text-gray-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold"}>
                    {notifications.filter(n => n.type === 'general').length}
                  </span>
                  {activeNotifTab === 'general' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0ea5e9] rounded-t-full"></div>}
                </div>

                <div
                  onClick={() => setActiveNotifTab('inbox')}
                  className={`relative pb-3 cursor-pointer transition-colors ${activeNotifTab === 'inbox' ? 'text-[#0ea5e9]' : 'text-gray-400 hover:text-gray-600'} flex items-center gap-1.5`}
                >
                  Inbox
                  <span className={activeNotifTab === 'inbox' ? "bg-[#0ea5e9] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold" : "border border-gray-200 text-gray-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold"}>
                    {notifications.filter(n => n.type === 'inbox').length}
                  </span>
                  {activeNotifTab === 'inbox' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0ea5e9] rounded-t-full"></div>}
                </div>

                <div
                  onClick={() => setActiveNotifTab('archived')}
                  className={`relative pb-3 cursor-pointer transition-colors ${activeNotifTab === 'archived' ? 'text-[#0ea5e9]' : 'text-gray-400 hover:text-gray-600'} flex items-center gap-1.5`}
                >
                  Archived
                  <span className={activeNotifTab === 'archived' ? "bg-[#0ea5e9] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold" : "border border-gray-200 text-gray-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold"}>
                    {notifications.filter(n => n.type === 'archived').length}
                  </span>
                  {activeNotifTab === 'archived' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0ea5e9] rounded-t-full"></div>}
                </div>

                <div className="pb-3 ml-auto text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                  <Settings className="w-4 h-4" />
                </div>
              </div>

              {/* List */}
              <div className="flex flex-col max-h-[360px] overflow-y-auto">
                {(() => {
                  const filteredNotifs = activeNotifTab === 'general' ? notifications : notifications.filter(n => n.type === activeNotifTab);
                  
                  if (filteredNotifs.length === 0) {
                    return <div className="p-8 text-center text-gray-400 text-[13px]">No {activeNotifTab} notifications.</div>;
                  }

                  return filteredNotifs.map(notif => (
                    <div key={notif.id} className="p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50/50 transition-colors cursor-pointer relative group">
                      <div className="relative">
                        <img src={notif.avatar} className="w-10 h-10 rounded-full object-cover" alt={notif.user} />
                        {notif.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 text-[13px]">
                        <p className="text-gray-800">
                          <span className="font-bold text-black">{notif.user}</span> {notif.action}
                        </p>
                        <p className={`text-gray-500 text-[12px] mt-0.5 ${notif.type === 'inbox' ? 'group-hover:mb-3 transition-all duration-200' : ''}`}>
                          {notif.time} • {notif.source}
                        </p>
                        
                        {notif.type === 'inbox' && (
                          <div className="hidden group-hover:flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                            {notif.action.includes('shared') ? (
                              <>
                                <button className="px-4 py-1.5 border border-gray-200 rounded-full text-gray-700 font-semibold hover:bg-gray-50 transition-colors">Decline</button>
                                <button className="px-4 py-1.5 bg-[#0ea5e9] text-white rounded-full font-semibold hover:bg-[#0284c7] transition-colors">Accept</button>
                              </>
                            ) : (
                              <button className="px-4 py-1.5 border border-gray-200 rounded-full text-gray-700 font-semibold hover:bg-gray-50 transition-colors">Reply</button>
                            )}
                          </div>
                        )}
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-[#0ea5e9] rounded-full mt-2 shrink-0"></div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative hidden lg:flex items-center ml-2">
          <div className="absolute left-3 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search sermons, events, transactions, members..."
            className="w-[320px] h-10 pl-9 pr-4 rounded-full bg-gray-50 border-2 border-transparent text-[13px] font-medium text-gray-700 outline-none focus:bg-white focus:border-[#0ea5e9] focus:ring-[#0ea5e9]/20 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Profile Image & Dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${isProfileOpen ? 'border-[#0ea5e9] ring-2 ring-[#0ea5e9]/20' : 'border-transparent hover:border-[#0ea5e9]'}`}
          >
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-[320px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">

              {/* Header Info */}
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <img src={profileImage} alt="User" className="w-10 h-10 object-cover rounded-full" />
                  <div>
                    <h3 className="text-[14px] font-bold text-gray-900 leading-none">{userName}</h3>
                    <p className="text-[12px] text-gray-500 mt-1">{userEmail}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-white border border-gray-200 px-2 py-0.5 rounded-full bg-[#0ea5e9]">
                  {role?.toUpperCase() || 'ADMIN'}
                </span>
              </div>

              {/* Organization Selector */}
              <div className="p-4 border-b border-gray-50">
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2.5 rounded-full border border-gray-100 cursor-pointer hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-[13px] font-semibold text-gray-800">Organization</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-gray-500 ">{role || 'Admin'}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Target Time / Credits */}
              <div className="p-4 border-b border-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
                    <Activity className="w-4 h-4 text-gray-400" /> Target Time
                  </div>
                  <div className="text-[13px] font-semibold">
                    <span className="text-gray-900">150</span><span className="text-gray-400">/250</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-[#0ea5e9] rounded-full" style={{ width: '60%' }}></div>
                </div>

                <div className="flex items-center gap-1.5 text-black text-[12px] font-medium mb-4">
                  <AlertTriangle className="w-3.5 h-3.5" /> Your credits are running low.
                </div>

                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-gray-500 flex items-center gap-1"><span className="w-3 h-3 border border-gray-400 rounded-full flex items-center justify-center text-[8px] font-bold">L</span> Resets in 23 days</span>
                  <button className="text-[#0ea5e9] font-bold hover:underline">Upgrade Plan</button>
                </div>
              </div>

              {/* Links */}
              <div className="p-2 border-b border-gray-50 flex flex-col gap-0.5">
                <a href="/admin/support" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Headphones className="w-4 h-4 text-gray-400" /> Support Center
                </a>
                
                {/* DYNAMIC SETTINGS/PROFILE LINK */}
                {(() => {
                  const hasSettingsPerm = role === 'Super Admin' || permissions?.includes('all') || permissions?.includes('/admin/settings');
                  const settingsLink = hasSettingsPerm ? '/admin/settings' : (subadminId ? `/admin/settings/subadmins/${subadminId}` : '/admin');
                  const settingsText = hasSettingsPerm ? 'Settings' : 'My Profile';
                  return (
                    <a href={settingsLink} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4 text-gray-400" /> {settingsText}
                    </a>
                  );
                })()}
                
                <a href="/admin/analytics" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Activity className="w-4 h-4 text-gray-400" /> Activity
                </a>
              </div>

              <div className="p-2">
                <button 
                  onClick={async () => {
                    await signOutAdmin();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-gray-400" /> Log out
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
