'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, Megaphone, CalendarDays, HeartHandshake,
  FileText, Image as ImageIcon, Users, Contact, CreditCard, BarChart3, Settings,
  ChevronDown, ChevronRight, Moon,
  BellOff, HelpCircle, LogOut,
  CheckCircle2, Sparkles, PanelLeftClose, PanelLeftOpen, X
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthProvider';

export const ADMIN_SIDEBAR_TOGGLE_EVENT = 'crc:toggle-admin-sidebar';
export const ADMIN_SIDEBAR_STATE_EVENT = 'crc:admin-sidebar-state';

export function toggleAdminSidebar() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ADMIN_SIDEBAR_TOGGLE_EVENT));
  }
}

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
                <BellOff size={18} className={`flex-shrink-0 ${notifPaused ? 'text-[#0ea5e9]' : 'text-gray-500'}`} />
                <span className="flex-1 text-left text-[13px] font-medium text-gray-700">
                  {notifPaused ? 'Resume Notifications' : 'Pause Notifications'}
                </span>
                {notifPaused && (
                  <span className="text-[10px] font-bold text-white bg-[#0ea5e9] px-2 py-0.5 rounded-full">ON</span>
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
                <LogOut size={18} className="text-gray-400 group-hover:text-[#0ea5e9] transition-colors flex-shrink-0" />
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

  // Responsive & Collapsible Sidebar state
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const profileRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? '';
  const useSearchParam = pathname === '/admin/campaigns' && !!activeTab;

  // Detect screen size (< 1024px = mobile/tablet drawer, >= 1024px = collapsible desktop sidebar)
  useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile((prevMobile) => {
        if (prevMobile !== mobile) {
          setIsOpen(!mobile);
        }
        return mobile;
      });
    };

    const initialMobile = window.innerWidth < 1024;
    setIsMobile(initialMobile);
    setIsOpen(!initialMobile);

    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Broadcast state changes so AdminHeader knows if sidebar is open or closed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(ADMIN_SIDEBAR_STATE_EVENT, {
          detail: { isOpen, isMobile },
        })
      );
    }
  }, [isOpen, isMobile]);

  // Listen to toggle events from AdminHeader or anywhere in Admin
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener(ADMIN_SIDEBAR_TOGGLE_EVENT, handleToggle);
    return () => window.removeEventListener(ADMIN_SIDEBAR_TOGGLE_EVENT, handleToggle);
  }, []);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  // Close dropdown / mobile sidebar on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        if (isMobile) setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isMobile]);

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname?.startsWith(path);
  };

  const linkClass = (path: string) =>
    isActive(path)
      ? 'flex items-center gap-3 px-3 py-2 bg-white border border-gray-100 rounded-full text-[#0ea5e9] font-semibold shadow-lg relative'
      : 'flex items-center gap-3 px-3 py-2 hover:bg-gray-100/50 rounded-full text-gray-600 transition-colors';

  const iconClass = (path: string) =>
    isActive(path) ? 'w-[18px] h-[18px] text-[#0ea5e9]' : 'w-[18px] h-[18px] text-gray-400';

  const sidebarInner = (
    <div className="w-[260px] bg-[#f8f9fa] border-r border-gray-200/60 h-full flex flex-col shrink-0 select-none">
      {/* Logo & Collapse Button */}
      <div className="h-[72px] flex items-center px-6">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-black hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] rounded-xl flex items-center justify-center text-white text-xs font-black shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]">
            CRC
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[14px] text-gray-900 leading-tight">Christ Revelation</span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Admin Portal</span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
          className="ml-auto w-8 h-8 border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-black rounded-xl flex items-center justify-center shadow-[0_1px_4px_-1px_rgba(0,0,0,0.05)] transition-colors"
        >
          {isMobile ? <X className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything"
            className="w-full pl-9 pr-10 py-2 bg-white border border-gray-200/80 rounded-full text-[13px] outline-none focus:ring-1 focus:ring-[#0ea5e9]/20 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] transition-shadow"
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

            {/* Campaigns (Commented out as requested) */}
            {/* {hasPerm('campaigns') && (
              <div>
                <button
                  onClick={() => setCampaignsOpen(!campaignsOpen)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100/50 rounded-full text-gray-600 transition-colors"
                >
                  <Megaphone className={isActive('/admin/campaigns') ? 'w-[18px] h-[18px] text-[#0ea5e9]' : 'w-[18px] h-[18px] text-gray-400'} />
                  <span className={isActive('/admin/campaigns') ? 'text-[13px] font-semibold text-[#0ea5e9]' : 'text-[13px] font-medium'}>Campaigns</span>
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
                      <Link href="/admin/campaigns" className={`py-1.5 pl-6 pr-2 text-[13px] font-medium w-full rounded-full hover:bg-gray-100/50 transition-colors ${pathname === '/admin/campaigns' && !useSearchParam ? 'text-[#0ea5e9]' : 'text-gray-500 hover:text-[#0ea5e9]'}`}>All Campaigns</Link>
                    </div>

                    <div className="relative flex items-center">
                      <div className="absolute left-[-2px] w-3 h-px bg-gray-200 top-1/2"></div>
                      <Link href="/admin/campaigns?tab=active" className={`py-1.5 pl-6 pr-2 text-[13px] font-medium w-full rounded-full hover:bg-gray-100/50 transition-colors ${activeTab === 'active' ? 'text-[#0ea5e9]' : 'text-gray-500 hover:text-[#0ea5e9]'}`}>Active</Link>
                    </div>

                    <div className="relative flex items-center">
                      <div className="absolute left-[-2px] w-3 h-px bg-gray-200 top-1/2"></div>
                      <div className="absolute left-[-2px] bottom-1/2 w-3 h-full border-b border-l border-gray-200 rounded-bl-[6px]"></div>
                      <div className="absolute left-[-2px] top-1/2 bottom-0 w-px bg-[#f8f9fa] z-10"></div>
                      <Link href="/admin/campaigns?tab=drafts" className={`py-1.5 pl-6 pr-2 text-[13px] font-medium w-full rounded-full hover:bg-gray-100/50 transition-colors ${activeTab === 'drafts' ? 'text-[#0ea5e9]' : 'text-gray-500 hover:text-[#0ea5e9]'}`}>Drafts</Link>
                    </div>
                  </div>
                )}
              </div>
            )} */}

            {hasPerm('events') && (
              <Link href="/admin/events" className={linkClass('/admin/events')}>
                <CalendarDays className={iconClass('/admin/events')} />
                <span className="text-[13px]">Events</span>
              </Link>
            )}

            {/* Volunteers (Commented out as requested) */}
            {/* {hasPerm('volunteers') && (
              <Link href="/admin/volunteers" className={linkClass('/admin/volunteers')}>
                <HeartHandshake className={iconClass('/admin/volunteers')} />
                <span className="text-[13px]">Volunteers</span>
              </Link>
            )} */}
          </nav>
        </div>

        {/* CONTENT */}
        {(hasPerm('blog') || hasPerm('gallery') || hasPerm('subscribers') || hasPerm('prayer-requests')) && (
          <div>
            <h3 className="px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Content</h3>
            <nav className="flex flex-col gap-0.5">
              {hasPerm('blog') && (
                <Link href="/admin/blog" className={linkClass('/admin/blog')}>
                  <FileText className={iconClass('/admin/blog')} />
                  <span className="text-[13px]">Blogs</span>
                </Link>
              )}
              {hasPerm('gallery') && (
                <Link href="/admin/gallery" className={linkClass('/admin/gallery')}>
                  <ImageIcon className={iconClass('/admin/gallery')} />
                  <span className="text-[13px]">Gallery</span>
                </Link>
              )}

              {/* Subscribers (Commented out as requested) */}
              {/* {hasPerm('subscribers') && (
                <Link href="/admin/subscribers" className={linkClass('/admin/subscribers')}>
                  <Users className={iconClass('/admin/subscribers')} />
                  <span className="text-[13px]">Subscribers</span>
                </Link>
              )} */}

              {(hasPerm('subscribers') || hasPerm('prayer-requests')) && (
                <Link href="/admin/prayer-requests" className={linkClass('/admin/prayer-requests')}>
                  <Sparkles className={iconClass('/admin/prayer-requests')} />
                  <span className="text-[13px]">Prayer Requests</span>
                </Link>
              )}
            </nav>
          </div>
        )}

        {/* COMMUNICATION / Contacts (Commented out as requested) */}
        {/* {hasPerm('contacts') && (
          <div>
            <h3 className="px-2 text-[11px] font-semibold text-gray-400 uppercase mb-2">Communication</h3>
            <nav className="flex flex-col gap-0.5">
              <Link href="/admin/contacts" className={linkClass('/admin/contacts')}>
                <Contact className={iconClass('/admin/contacts')} />
                <span className="text-[13px]">Contacts</span>
              </Link>
            </nav>
          </div>
        )} */}

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
                  <Settings className={isActive('/admin/settings') ? 'w-[18px] h-[18px] text-[#0ea5e9]' : 'w-[18px] h-[18px] text-gray-400'} />
                  <span className={isActive('/admin/settings') ? 'text-[13px] font-semibold text-[#0ea5e9]' : 'text-[13px] font-medium'}>Settings</span>
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
                      <div className="absolute left-[-2px] bottom-1/2 w-3 h-full border-b border-l border-gray-200 rounded-bl-[6px]"></div>
                      <div className="absolute left-[-2px] top-1/2 bottom-0 w-px bg-[#f8f9fa] z-10"></div>
                      <Link href="/admin/settings" className={`py-1.5 pl-6 pr-2 text-[13px] font-medium w-full rounded-full hover:bg-gray-100/50 transition-colors ${pathname === '/admin/settings' ? 'text-[#0ea5e9]' : 'text-gray-500 hover:text-[#0ea5e9]'}`}>Settings</Link>
                    </div>

                    {/* Subadmins (Commented out as requested) */}
                    {/* <div className="relative flex items-center">
                      <div className="absolute left-[-2px] w-3 h-px bg-gray-200 top-1/2"></div>
                      <div className="absolute left-[-2px] bottom-1/2 w-3 h-full border-b border-l border-gray-200 rounded-bl-[6px]"></div>
                      <div className="absolute left-[-2px] top-1/2 bottom-0 w-px bg-[#f8f9fa] z-10"></div>
                      <Link href="/admin/settings/subadmins" className={`py-1.5 pl-6 pr-2 text-[13px] font-medium w-full rounded-full hover:bg-gray-100/50 transition-colors ${pathname?.startsWith('/admin/settings/subadmins') ? 'text-[#0ea5e9]' : 'text-gray-500 hover:text-[#0ea5e9]'}`}>Subadmins</Link>
                    </div> */}
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
          className={`w-full flex items-center justify-between p-2.5 rounded-[14px] border transition-all text-left ${
            profileOpen
              ? 'bg-white border-gray-200 shadow-[0_0_0_3px_rgba(0,0,0,0.08)]'
              : 'bg-white border-gray-200/80 hover:border-gray-300 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} className="w-8 h-8 rounded-full shadow-sm" alt="" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center text-white text-xs font-bold shadow-sm">
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
          <motion.div
            animate={{ rotate: profileOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </motion.div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile & Tablet Off-Canvas Drawer (< 1024px) ── */}
      {isMobile ? (
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="mobile-sidebar-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
                onClick={() => setIsOpen(false)}
              />
              <motion.aside
                key="mobile-sidebar-drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 290,
                  mass: 0.85,
                }}
                className="fixed top-0 left-0 bottom-0 z-[70] h-full shadow-2xl"
              >
                {sidebarInner}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      ) : (
        /* ── Desktop Collapsible Sidebar (>= 1024px) ── */
        <motion.aside
          initial={false}
          animate={{
            width: isOpen ? 260 : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{
            type: 'spring',
            damping: 32,
            stiffness: 290,
            mass: 0.85,
          }}
          className="h-full overflow-hidden shrink-0 relative"
        >
          {sidebarInner}
        </motion.aside>
      )}
    </>
  );
}

export default function Sidebar() {
  return (
    <React.Suspense fallback={<aside className="hidden lg:flex w-[260px] bg-[#f8f9fa] border-r border-gray-200/60 h-full flex-col shrink-0"></aside>}>
      <SidebarContent />
    </React.Suspense>
  );
}
