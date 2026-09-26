'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, Megaphone, CalendarDays, HeartHandshake,
  FileText, Users, Contact, CreditCard, BarChart3, Settings,
  ChevronDown, ChevronRight, Moon,
  BellOff, HelpCircle, LogOut,
  CheckCircle2
} from 'lucide-react';

// ── Status type ──
type Status = 'online' | 'away';

// ── Profile Dropdown ──
function ProfileDropdown({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('online');
  const [notifPaused, setNotifPaused] = useState(false);

  const handleSignOut = () => {
    onClose();
    // Clear admin session and redirect
    document.cookie = 'admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          {/* Dropdown panel — opens upward, fixed narrower width */}
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full left-2 right-2 mb-2 z-50 bg-white border border-gray-100 rounded-[20px] shadow-[0_-8px_40px_-8px_rgba(0,0,0,0.18)] overflow-hidden"
          >
            {/* ── Status & Notifications ── */}
            <div className="p-2 flex flex-col gap-0.5">

              {/* Set status */}
              <button
                onClick={() => setStatus(s => s === 'online' ? 'away' : 'online')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${status === 'online' ? 'text-emerald-500' : 'text-amber-400'}`}>
                  {status === 'online' ? <CheckCircle2 size={18} /> : <Moon size={16} />}
                </div>
                <span className="flex-1 text-left text-[13px] font-medium text-gray-700">
                  Set yourself as{' '}
                  <span className="font-bold text-gray-900">
                    {status === 'online' ? 'away' : 'online'}
                  </span>
                </span>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </button>

              {/* Pause notifications */}
              <button
                onClick={() => setNotifPaused(p => !p)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <BellOff size={18} className={`flex-shrink-0 ${notifPaused ? 'text-black' : 'text-gray-500'}`} />
                <span className="flex-1 text-left text-[13px] font-medium text-gray-700">
                  {notifPaused ? 'Resume Notifications' : 'Pause Notifications'}
                </span>
                {notifPaused && (
                  <span className="text-[10px] font-bold text-white bg-black px-2 py-0.5 rounded-full">ON</span>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 mx-3" />

            {/* ── Help & Settings ── */}
            <div className="p-2 flex flex-col gap-0.5">
              <Link
                href="/admin/settings#help"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <HelpCircle size={18} className="text-gray-500 flex-shrink-0" />
                <span className="text-[13px] font-medium text-gray-700">Help & Support</span>
              </Link>

              <Link
                href="/admin/settings"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Settings size={18} className="text-gray-500 flex-shrink-0" />
                <span className="text-[13px] font-medium text-gray-700">Settings</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 mx-3" />

            {/* ── Sign Out ── */}
            <div className="p-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <LogOut size={18} className="text-gray-400 group-hover:text-black transition-colors flex-shrink-0" />
                <span className="text-[13px] font-medium text-gray-600 group-hover:text-black transition-colors">
                  Sign out
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { useAdminAuth } from './AdminAuthProvider';

// ── Main Sidebar ──
function SidebarContent() {
  const { role, permissions, user } = useAdminAuth();
  const hasPerm = (p: string) => {
    if (role === 'Super Admin' || permissions?.includes('all')) return true;
    return permissions?.includes(p) || permissions?.includes(`/admin/${p}`);
  };

  const [campaignsOpen, setCampaignsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? '';
  const useSearchParam = pathname === '/admin/campaigns' && !!activeTab;

  // Close dropdown on outside click (handled by backdrop in dropdown)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname?.startsWith(path);
  };

  const linkClass = (path: string) =>
    isActive(path)
      ? 'flex items-center gap-3 px-3 py-2 bg-white border border-gray-100 rounded-full text-black font-semibold shadow-lg relative'
      : 'flex items-center gap-3 px-3 py-2 hover:bg-gray-100/50 rounded-full text-gray-600 transition-colors';

  const iconClass = (path: string) =>
    isActive(path) ? 'w-[18px] h-[18px] text-black' : 'w-[18px] h-[18px] text-gray-400';

  return (
    <aside className="w-[260px] bg-[#f8f9fa] border-r border-gray-200/60 h-full flex flex-col shrink-0">

      {/* Logo */}
      <div className="h-[72px] flex items-center px-6">
        <Link href="/admin" className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-black hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-black to-neutral-800 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]">
            CRC
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[14px] text-gray-900 leading-tight">Christ Revelation</span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Admin Portal</span>
          </div>
        </Link>
        <button className="ml-auto w-6 h-6 border border-gray-200 bg-white rounded flex items-center justify-center shadow-[0_1px_4px_-1px_rgba(0,0,0,0.05)]">
          <div className="w-3 h-0.5 bg-gray-400 rounded-full flex flex-col gap-0.5 relative">
            <div className="w-3 h-0.5 bg-gray-400 rounded-full absolute -top-[3px]"></div>
            <div className="w-3 h-0.5 bg-gray-400 rounded-full absolute -bottom-[3px]"></div>
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything"
            className="w-full pl-9 pr-10 py-2 bg-white border border-gray-200/80 rounded-full text-[13px] outline-none focus:ring-1 focus:ring-black/20 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] transition-shadow"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-50 border border-gray-200 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 shadow-sm flex items-center gap-0.5">
            <span className="text-xs leading-none">⌘</span>K
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-6">

        {/* MAIN */}
        <div>
          <h3 className="px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Main</h3>
          <nav className="flex flex-col gap-0.5">
            <Link href="/admin" className={linkClass('/admin')}>
              <LayoutDashboard className={iconClass('/admin')} />
              <span className="text-[13px]">Dashboard</span>
            </Link>

            {hasPerm('campaigns') && (
              <div>
              <button
                onClick={() => setCampaignsOpen(!campaignsOpen)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100/50 rounded-full text-gray-600 transition-colors"
              >
                <Megaphone className={isActive('/admin/campaigns') ? 'w-[18px] h-[18px] text-black' : 'w-[18px] h-[18px] text-gray-400'} />
                <span className={isActive('/admin/campaigns') ? 'text-[13px] font-semibold text-black' : 'text-[13px] font-medium'}>Campaigns</span>
                {campaignsOpen
                  ? <ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400" />
                  : <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-400" />
                }
              </button>

              {campaignsOpen && (
                <div className="flex flex-col mt-0.5 mb-1 relative ml-5">
                  <div className="absolute left-[-2px] top-0 bottom-3 w-px bg-gray-200"></div>

                  <div className="relative flex items-center">
                    <div className="absolute left-[-2px] w-3 h-px bg-gray-200 top-1/2"></div>
                    <Link href="/admin/campaigns" className={`py-1.5 pl-6 pr-2 text-[13px] font-medium w-full rounded-full hover:bg-gray-100/50 transition-colors ${pathname === '/admin/campaigns' && !useSearchParam ? 'text-black' : 'text-gray-500 hover:text-black'}`}>All Campaigns</Link>
                  </div>

                  <div className="relative flex items-center">
                    <div className="absolute left-[-2px] w-3 h-px bg-gray-200 top-1/2"></div>
                    <Link href="/admin/campaigns?tab=active" className={`py-1.5 pl-6 pr-2 text-[13px] font-medium w-full rounded-full hover:bg-gray-100/50 transition-colors ${activeTab === 'active' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Active</Link>
                  </div>

                  <div className="relative flex items-center">
                    <div className="absolute left-[-2px] w-3 h-px bg-gray-200 top-1/2"></div>
                    <div className="absolute left-[-2px] bottom-1/2 w-3 h-full border-b border-l border-gray-200 rounded-bl-[6px]"></div>
                    <div className="absolute left-[-2px] top-1/2 bottom-0 w-px bg-[#f8f9fa] z-10"></div>
                    <Link href="/admin/campaigns?tab=drafts" className={`py-1.5 pl-6 pr-2 text-[13px] font-medium w-full rounded-full hover:bg-gray-100/50 transition-colors ${activeTab === 'drafts' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Drafts</Link>
                  </div>
                </div>
              )}
            </div>
            )}

            {hasPerm('events') && (
              <Link href="/admin/events" className={linkClass('/admin/events')}>
                <CalendarDays className={iconClass('/admin/events')} />
                <span className="text-[13px]">Events</span>
              </Link>
            )}

            {hasPerm('volunteers') && (
              <Link href="/admin/volunteers" className={linkClass('/admin/volunteers')}>
                <HeartHandshake className={iconClass('/admin/volunteers')} />
                <span className="text-[13px]">Volunteers</span>
              </Link>
            )}
          </nav>
        </div>

        {/* CONTENT */}
        {(hasPerm('blog') || hasPerm('subscribers')) && (
          <div>
            <h3 className="px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Content</h3>
            <nav className="flex flex-col gap-0.5">
              {hasPerm('blog') && (
                <Link href="/admin/blog" className={linkClass('/admin/blog')}>
                  <FileText className={iconClass('/admin/blog')} />
                  <span className="text-[13px]">Blogs</span>
                </Link>
              )}
              {hasPerm('subscribers') && (
                <Link href="/admin/subscribers" className={linkClass('/admin/subscribers')}>
                  <Users className={iconClass('/admin/subscribers')} />
                  <span className="text-[13px]">Subscribers</span>
                </Link>
              )}
            </nav>
          </div>
        )}

        {/* COMMUNICATION */}
        {hasPerm('contacts') && (
          <div>
            <h3 className="px-2 text-[11px] font-semibold text-gray-400 uppercase mb-2">Communication</h3>
            <nav className="flex flex-col gap-0.5">
              <Link href="/admin/contacts" className={linkClass('/admin/contacts')}>
                <Contact className={iconClass('/admin/contacts')} />
                <span className="text-[13px]">Contacts</span>
              </Link>
            </nav>
          </div>
        )}

        {/* FINANCE */}
        {hasPerm('transactions') && (
          <div>
            <h3 className="px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Finance</h3>
            <nav className="flex flex-col gap-0.5">
              <Link href="/admin/transactions" className={linkClass('/admin/transactions')}>
                <CreditCard className={iconClass('/admin/transactions')} />
                <span className="text-[13px]">Transactions</span>
              </Link>
            </nav>
          </div>
        )}

        {/* INSIGHTS */}
        {hasPerm('analytics') && (
          <div>
            <h3 className="px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Insights</h3>
            <nav className="flex flex-col gap-0.5">
              <Link href="/admin/analytics" className={linkClass('/admin/analytics')}>
                <BarChart3 className={iconClass('/admin/analytics')} />
                <span className="text-[13px]">Analytics</span>
              </Link>
            </nav>
          </div>
        )}

        {/* SYSTEM */}
        {hasPerm('settings') && (
          <div>
            <h3 className="px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">System</h3>
            <nav className="flex flex-col gap-0.5">
              <div>
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100/50 rounded-full text-gray-600 transition-colors"
                >
                  <Settings className={isActive('/admin/settings') ? 'w-[18px] h-[18px] text-black' : 'w-[18px] h-[18px] text-gray-400'} />
                  <span className={isActive('/admin/settings') ? 'text-[13px] font-semibold text-black' : 'text-[13px] font-medium'}>Settings</span>
                  {settingsOpen
                    ? <ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400" />
                    : <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-400" />
                  }
                </button>

                {settingsOpen && (
                  <div className="flex flex-col mt-0.5 mb-1 relative ml-5">
                    <div className="absolute left-[-2px] top-0 bottom-3 w-px bg-gray-200"></div>

                    <div className="relative flex items-center">
                      <div className="absolute left-[-2px] w-3 h-px bg-gray-200 top-1/2"></div>
                      <Link href="/admin/settings" className={`py-1.5 pl-6 pr-2 text-[13px] font-medium w-full rounded-full hover:bg-gray-100/50 transition-colors ${pathname === '/admin/settings' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Settings</Link>
                    </div>

                    <div className="relative flex items-center">
                      <div className="absolute left-[-2px] w-3 h-px bg-gray-200 top-1/2"></div>
                      <div className="absolute left-[-2px] bottom-1/2 w-3 h-full border-b border-l border-gray-200 rounded-bl-[6px]"></div>
                      <div className="absolute left-[-2px] top-1/2 bottom-0 w-px bg-[#f8f9fa] z-10"></div>
                      <Link href="/admin/settings/subadmins" className={`py-1.5 pl-6 pr-2 text-[13px] font-medium w-full rounded-full hover:bg-gray-100/50 transition-colors ${pathname?.startsWith('/admin/settings/subadmins') ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Subadmins</Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* ── User Profile Footer with upward dropdown ── */}
      <div className="p-4 bg-[#f8f9fa] mt-auto relative" ref={profileRef}>
        <ProfileDropdown open={profileOpen} onClose={() => setProfileOpen(false)} />

        <button
          onClick={() => setProfileOpen(o => !o)}
          className={`w-full flex items-center justify-between p-2.5 rounded-[14px] border transition-all text-left ${profileOpen
            ? 'bg-white border-gray-200 shadow-[0_0_0_3px_rgba(0,0,0,0.08)]'
            : 'bg-white border-gray-200/80 hover:border-gray-300 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:shadow-md'
            }`}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} className="w-8 h-8 rounded-full shadow-sm" alt="" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-black to-neutral-800 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.user_metadata?.full_name?.substring(0, 2).toUpperCase() || 'AD'}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-[2px] border-white rounded-full" />
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-[13px] font-bold text-black leading-tight truncate">
                {user?.user_metadata?.full_name || 'Admin Profile'}
              </span>
              <span className="text-[11px] text-gray-400 font-medium leading-tight truncate">
                {user?.email || 'pastor.david@christrevelation.org'}
              </span>
            </div>
          </div>
          {/* Chevron rotates when open */}
          <motion.div
            animate={{ rotate: profileOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </motion.div>
        </button>
      </div>

    </aside>
  );
}

export default function Sidebar() {
  return (
    <React.Suspense fallback={<aside className="w-[260px] bg-[#f8f9fa] border-r border-gray-200/60 h-full flex flex-col shrink-0"></aside>}>
      <SidebarContent />
    </React.Suspense>
  );
}
