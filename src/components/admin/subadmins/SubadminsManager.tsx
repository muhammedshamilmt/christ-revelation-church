'use client';
import React, { useState, useMemo } from 'react';
import {
  Users, Search, ArrowUpDown, Plus, MoreHorizontal, Check, X,
  Mail, Phone, Shield, Trash2, MapPin
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import NewSubadminSidebar from './NewSubadminSidebar';
import { useConfirm } from '@/components/ui/ConfirmDialogProvider';

import { useSubadmins, deleteSubadmin } from '@/lib/useSubadmins';

export default function SubadminsManager() {
  const router = useRouter();
  const { subadmins, isLoading, mutate } = useSubadmins();
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { confirm } = useConfirm();

  // Filter/Sort States
  const [sortBy, setSortBy] = useState<'name' | 'role' | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Handlers
  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSort = () => {
    if (sortBy === null) {
      setSortBy('name');
      setSortAsc(true);
    } else if (sortBy === 'name') {
      setSortAsc(!sortAsc);
      if (!sortAsc) setSortBy('role');
    } else {
      setSortAsc(!sortAsc);
      if (!sortAsc) setSortBy(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isConfirmed = await confirm({
      title: 'Remove Subadmin',
      message: 'Are you sure you want to remove this subadmin?',
      confirmText: 'Remove',
      variant: 'danger'
    });

    if (isConfirmed) {
      try {
        await deleteSubadmin(id);
        mutate();
      } catch (err) {
        console.error("Failed to delete subadmin", err);
      }
    }
  };

  const handleRowClick = (id: string) => {
    router.push(`/admin/settings/subadmins/${id}`);
  };

  // Derived data
  const filteredSubadmins = useMemo(() => {
    let result = [...subadmins];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => sortAsc ? a.fullName.localeCompare(b.fullName) : b.fullName.localeCompare(a.fullName));
    } else if (sortBy === 'role') {
      result.sort((a, b) => sortAsc ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role));
    }

    return result;
  }, [searchQuery, sortBy, sortAsc, subadmins]);


  return (
    <>
      <div className="flex w-full h-[calc(100vh-2rem)] bg-white rounded-[24px] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden relative">

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white relative">

          {/* Header */}
          <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-black" />
              <h1 className="text-[16px] font-bold text-black tracking-tight">Subadmins Management</h1>
            </div>
          </div>

          {/* Toolbar */}
          <div className="h-14 px-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/30">
            <div className="flex items-center gap-4">
              <div className="relative group flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 focus-within:border-black transition-colors ">
                <Search className="w-3.5 h-3.5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search subadmins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-[13px] w-[200px]"
                />
              </div>

              <div className="flex items-center gap-4 text-[13px] font-medium text-gray-600">
                <button
                  onClick={handleSort}
                  className={`flex items-center gap-1.5 transition-colors ${sortBy ? 'text-black font-bold' : 'hover:text-black'}`}
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  {sortBy ? `Sort by ${sortBy}` : 'Sort by'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="px-4 py-2 text-[13px] font-bold text-white bg-black hover:bg-black/90 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Subadmin
              </button>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
                  <th className="py-2.5 pl-6 pr-3 font-medium text-gray-400 text-[12px] w-10 border-r border-gray-100">
                    <div className="w-4 h-4 rounded-[4px] border border-gray-300 bg-white"></div>
                  </th>
                  <th className="py-2.5 px-4 font-semibold text-gray-500 text-[12px] border-r border-gray-100 w-[25%]">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-gray-400" /> Subadmin
                    </div>
                  </th>
                  <th className="py-2.5 px-4 font-semibold text-gray-500 text-[12px] border-r border-gray-100 w-[15%]">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-gray-400" /> Role
                    </div>
                  </th>
                  <th className="py-2.5 px-4 font-semibold text-gray-500 text-[12px] border-r border-gray-100 w-[20%]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" /> Email
                    </div>
                  </th>
                  <th className="py-2.5 px-4 font-semibold text-gray-500 text-[12px] border-r border-gray-100 w-[15%]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone
                    </div>
                  </th>
                  <th className="py-2.5 px-4 font-semibold text-gray-500 text-[12px] border-r border-gray-100 w-[20%]">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-gray-400" /> Permissions
                    </div>
                  </th>
                  <th className="py-2.5 px-4 w-10 border-r border-gray-100">
                    <MoreHorizontal className="w-3.5 h-3.5 text-gray-400 mx-auto" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  // Skeleton Rows
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className="border-b border-gray-100">
                      <td className="py-3 px-6 border-r border-gray-100"><div className="w-4 h-4 bg-gray-200 rounded animate-pulse" /></td>
                      <td className="py-3 px-4 border-r border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse" />
                          <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </td>
                      <td className="py-3 px-4 border-r border-gray-100"><div className="w-16 h-4 bg-gray-200 rounded-full animate-pulse" /></td>
                      <td className="py-3 px-4 border-r border-gray-100"><div className="w-32 h-3 bg-gray-200 rounded animate-pulse" /></td>
                      <td className="py-3 px-4 border-r border-gray-100"><div className="w-24 h-3 bg-gray-200 rounded animate-pulse" /></td>
                      <td className="py-3 px-4 border-r border-gray-100">
                        <div className="flex gap-1">
                          <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </td>
                      <td className="py-3 px-4 border-r border-gray-100"><div className="w-4 h-4 bg-gray-200 rounded animate-pulse mx-auto" /></td>
                    </tr>
                  ))
                ) : filteredSubadmins.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500 font-medium bg-gray-50">
                      No subadmins found.
                    </td>
                  </tr>
                ) : (
                  filteredSubadmins.map((subadmin) => (
                    <tr
                      key={subadmin.id}
                      onClick={() => handleRowClick(subadmin.id)}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${selected.includes(subadmin.id) ? 'bg-gray-100' : ''}`}
                    >
                      <td className="py-2 pl-6 pr-3 border-r border-gray-100" onClick={(e) => toggleSelect(subadmin.id, e)}>
                        <div
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${selected.includes(subadmin.id) ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}
                        >
                          {selected.includes(subadmin.id) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      </td>
                      <td className="py-2 px-4 border-r border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm overflow-hidden ${subadmin.color || 'bg-gray-200'}`}>
                            {subadmin.avatar && (subadmin.avatar.startsWith('data:image') || subadmin.avatar.startsWith('http')) ? (
                              <img src={subadmin.avatar} alt={subadmin.fullName} className="w-full h-full object-cover" />
                            ) : (
                              subadmin.avatar || subadmin.fullName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="text-[13px] font-semibold text-black">{subadmin.fullName}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-r border-gray-100">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${subadmin.role === 'Super Admin' ? 'bg-gray-100 text-black' : 'bg-gray-100 text-gray-600'}`}>
                          {subadmin.role}
                        </div>
                      </td>
                      <td className="py-2 px-4 border-r border-gray-100">
                        <span className="text-[13px] font-medium text-gray-600">{subadmin.email}</span>
                      </td>
                      <td className="py-2 px-4 border-r border-gray-100">
                        <span className="text-[13px] font-medium text-gray-600">{subadmin.phone || '-'}</span>
                      </td>
                      <td className="py-2 px-4 border-r border-gray-100">
                        <div className="flex flex-wrap gap-1">
                          {subadmin.role === 'Super Admin' || subadmin.permissions?.includes('all') ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-black">
                              Full Access
                            </span>
                          ) : subadmin.permissions && subadmin.permissions.length > 0 ? (
                            <>
                              {subadmin.permissions.slice(0, 2).map((p: string) => {
                                const label = p === '/admin' ? 'Dashboard' : p.split('/').pop();
                                return (
                                  <span key={p} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 capitalize">
                                    {label}
                                  </span>
                                );
                              })}
                              {subadmin.permissions.length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 text-gray-500">
                                  +{subadmin.permissions.length - 2}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-[12px] text-gray-400 italic">None</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-4 border-r border-gray-100 text-center">
                        <button
                          onClick={(e) => handleDelete(subadmin.id, e)}
                          className="text-gray-400 hover:text-black transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <NewSubadminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
