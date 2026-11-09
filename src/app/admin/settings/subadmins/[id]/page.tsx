'use client';
import React, { useState } from 'react';
import {
  ArrowLeft, CheckCircle2, RotateCcw, Box, Eye, Users,
  Tag, Folder, FileText, Target, Puzzle, UserCircle,
  Bell, Lock, Key, Keyboard, Edit2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ActivityMatrix from '@/components/admin/subadmins/ActivityMatrix';
import NewSubadminSidebar, { PERMISSION_SECTIONS } from '@/components/admin/subadmins/NewSubadminSidebar';
import { useSubadmin } from '@/lib/useSubadmins';

export default function SubadminDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const [activeTab, setActiveTab] = useState('General');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use the hook to fetch data
  const { subadmin, isLoading } = useSubadmin(unwrappedParams.id);

  // If loading or not found, we will render fallbacks below, but for now we need a safe reference
  const safeSubadmin = subadmin || {
    id: unwrappedParams.id,
    fullName: 'Loading...',
    email: '',
    dob: '',
    gender: '',
    nationality: '',
    address: '',
    phone: '',
    avatar: '',
    role: '',
    color: 'bg-gray-200',
    permissions: [] as string[]
  };

  const navItemsSettings = [
    { name: 'Workspace', icon: Box, active: false },
    { name: 'Overview', icon: Eye, active: false },
    { name: 'Members', icon: Users, active: false },
    { name: 'Label', icon: Tag, active: false },
    { name: 'Projects', icon: Folder, active: false },
    { name: 'Templates', icon: FileText, active: false },
    { name: 'Initiatives', icon: Target, active: false },
    { name: 'Integrations', icon: Puzzle, active: false },
  ];

  const navItemsAccount = [
    { name: 'Profile', icon: UserCircle, active: true },
    { name: 'Notifications', icon: Bell, active: false },
    { name: 'Security & Access', icon: Lock, active: false },
    { name: 'API Keys', icon: Key, active: false },
    { name: 'Keyboard shortcuts', icon: Keyboard, active: false },
  ];

  return (
    <div className="flex h-screen bg-gray-50/30 overflow-hidden">

      {/* Container echoing the sleek rounded window look from the image */}
      <div className="flex w-full max-w-[1400px] mx-auto my-4 bg-white rounded-3xl border border-gray-100 overflow-hidden">

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative">

          {/* Breadcrumb Header */}
          <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-2 text-[15px] font-semibold bg-white sticky top-0 z-20">
            <span className="text-gray-500">Subadmins</span>
            <span className="text-gray-300">/</span>
            <div className="flex items-center gap-2 text-black">
              <UserCircle className="w-5 h-5" /> Profile
            </div>
          </div>

          {/* Profile Section */}
          <div className="w-full  relative border-b border-gray-50">

            {/* Small accent grid behind avatar */}
            <div
              className="absolute  w-full h-full pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0h30v30H30zM0 30h30v30H0z' fill='%230048ff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                maskImage: 'linear-gradient(to top, transparent, black)',
                WebkitMaskImage: 'linear-gradient(to top, transparent, black)'
              }}
            ></div>


            <div className="relative px-8 pt-10 pb-5 z-10 max-w-[700px]">
              {isLoading ? (
                <>
                  <div className="w-[110px] h-[110px] rounded-full bg-gray-200 animate-pulse mb-5 border border-gray-100" />
                  <div className="w-64 h-8 bg-gray-200 animate-pulse rounded-lg mb-2" />
                  <div className="w-48 h-4 bg-gray-200 animate-pulse rounded-lg" />
                </>
              ) : (
                <>
                  <div className={`w-[110px] h-[110px] rounded-full overflow-hidden mb-5 border border-gray-100 shadow-sm flex items-center justify-center text-4xl font-bold text-white ${safeSubadmin.color}`}>
                    {safeSubadmin.avatar ? (
                      <img src={safeSubadmin.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      safeSubadmin.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5 group w-fit">
                    <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">{safeSubadmin.fullName}</h1>
                    <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-black hover:bg-red-50 rounded-full transition-all ml-1"
                      title="Edit Subadmin"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[14px] font-medium text-gray-500">{safeSubadmin.email}</p>
                </>
              )}
            </div>

            {/* Tabs */}
            <div className="px-6 pb-3 pb-0 border-gray-100 bg-white">
              <div className="inline-flex items-center bg-gray-50/80 border border-gray-100/80 rounded-full p-1">
                {['General', 'Activity', 'Permissions'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-[13px] font-semibold rounded-full transition-all ${activeTab === tab
                      ? 'bg-white text-black shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>



          <div className={`flex-1 px-8 py-8 bg-white max-w-[1100px] ${activeTab === 'General' ? 'max-w-[800px]' : ''}`}>
            {activeTab === 'General' && (
              <>
                {/* Personal Details Card */}
                <div className="bg-[#fafafa] border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-[#fafafa]">
                    <h2 className="text-[16px] font-bold text-black">Personal details</h2>
                  </div>
                  <div className="bg-white">
                    {isLoading ? (
                      <div className="divide-y divide-gray-100">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="px-6 py-4 grid grid-cols-3 md:grid-cols-4 items-center">
                            <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
                            <div className="w-40 h-4 bg-gray-200 animate-pulse rounded col-span-2" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        <div className="px-6 py-3 grid grid-cols-3 md:grid-cols-4 items-center">
                          <div className="text-[13px] font-semibold text-[#a8b0ba]">Full name:</div>
                          <div className="col-span-2 md:col-span-3 text-[14px] font-bold text-gray-900">{safeSubadmin.fullName}</div>
                        </div>
                        <div className="px-6 py-3 grid grid-cols-3 md:grid-cols-4 items-center">
                          <div className="text-[13px] font-semibold text-[#a8b0ba]">Date of Birth:</div>
                          <div className="col-span-2 md:col-span-3 text-[14px] font-bold text-gray-900">{safeSubadmin.dob || '-'}</div>
                        </div>
                        <div className="px-6 py-3 grid grid-cols-3 md:grid-cols-4 items-center">
                          <div className="text-[13px] font-semibold text-[#a8b0ba]">Gender:</div>
                          <div className="col-span-2 md:col-span-3 text-[14px] font-bold text-gray-900">{safeSubadmin.gender || '-'}</div>
                        </div>
                        <div className="px-6 py-3 grid grid-cols-3 md:grid-cols-4 items-center">
                          <div className="text-[13px] font-semibold text-[#a8b0ba]">Nationality:</div>
                          <div className="col-span-2 md:col-span-3 text-[14px] font-bold text-gray-900">{safeSubadmin.nationality || '-'}</div>
                        </div>
                        <div className="px-6 py-3 grid grid-cols-3 md:grid-cols-4 items-center">
                          <div className="text-[13px] font-semibold text-[#a8b0ba]">Address:</div>
                          <div className="col-span-2 md:col-span-3 text-[14px] font-bold text-gray-900 flex items-center gap-1.5">
                            {/* Assuming nationality might be US for the flag, simplified for now */}
                            {safeSubadmin.address || '-'}
                          </div>
                        </div>
                        <div className="px-6 py-4 grid grid-cols-3 md:grid-cols-4 items-center">
                          <div className="text-[13px] font-semibold text-[#a8b0ba]">Phone Number:</div>
                          <div className="col-span-2 md:col-span-3 text-[14px] font-bold text-gray-900">{safeSubadmin.phone || '-'}</div>
                        </div>
                        <div className="px-6 py-4 grid grid-cols-3 md:grid-cols-4 items-center">
                          <div className="text-[13px] font-semibold text-[#a8b0ba]">Email:</div>
                          <div className="col-span-2 md:col-span-3 text-[14px] font-bold text-gray-900">{safeSubadmin.email}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Settings Card Stub */}
                <div className="mt-8 bg-[#fafafa] border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-[#fafafa]">
                    <h2 className="text-[16px] font-bold text-black">Security Settings</h2>
                  </div>
                  <div className="divide-y divide-gray-100 bg-white">
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <div className="text-[14px] font-semibold text-black mb-1">Password</div>
                        <div className="text-[13px] font-medium text-gray-400">Last changed 3 months ago</div>
                      </div>
                      <button className="px-4 py-1.5 rounded-full border border-gray-200 text-[13px] font-bold text-gray-600 hover:bg-gray-50 hover:shadow-sm transition-all">
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Permissions' && (
              <div className="bg-[#fafafa] border border-gray-100 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-[#fafafa]">
                  <h2 className="text-[16px] font-bold text-black">Access Permissions</h2>
                </div>
                <div className="bg-white">
                  {isLoading ? (
                    <div className="divide-y divide-gray-100">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="px-6 py-4 flex items-center justify-between">
                          <div className="w-32 h-4 bg-gray-200 animate-pulse rounded" />
                          <div className="w-16 h-6 bg-gray-200 animate-pulse rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        {(() => {
                          const ALL_ROUTES = [
                            { path: '/admin', label: 'Dashboard' },
                            { path: '/admin/campaigns', label: 'Campaigns' },
                            { path: '/admin/events', label: 'Events' },
                            { path: '/admin/volunteers', label: 'Volunteers' },
                            { path: '/admin/blog', label: 'Blogs' },
                            { path: '/admin/gallery', label: 'Gallery' },
                            { path: '/admin/subscribers', label: 'Subscribers' },
                            { path: '/admin/contacts', label: 'Contacts' },
                            { path: '/admin/transactions', label: 'Transactions' },
                            { path: '/admin/analytics', label: 'Analytics' },
                            { path: '/admin/settings', label: 'Settings' },
                            { path: '/admin/subadmin', label: 'Subadmin' }
                          ];

                          const grantedRoutes = ALL_ROUTES.filter(route => {
                            const routeBase = route.path === '/admin' ? 'dashboard' : route.path.replace('/admin/', '');
                            return safeSubadmin.role === 'Super Admin' ||
                              safeSubadmin.permissions?.includes('all') ||
                              safeSubadmin.permissions?.includes(route.path) ||
                              safeSubadmin.permissions?.includes(routeBase);
                          });

                          if (grantedRoutes.length === 0) {
                            return (
                              <tr>
                                <td colSpan={2} className="py-8 px-6 text-center text-[13px] font-medium text-gray-400">
                                  No access permissions granted.
                                </td>
                              </tr>
                            );
                          }

                          return grantedRoutes.map((route, idx) => (
                            <tr key={idx} className="border-b border-gray-100 last:border-none">
                              <td className="py-4 px-6 text-[14px] font-bold text-gray-900">{route.label}</td>
                              <td className="py-4 px-6 text-right">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">Access</span>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Activity' && (
              <ActivityMatrix subadminId={unwrappedParams.id} />
            )}
          </div>
        </div>

      </div>

      <NewSubadminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        editData={safeSubadmin}
      />
    </div>
  );
}
