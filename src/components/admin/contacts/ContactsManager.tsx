'use client';
import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';
import {
  Users, Search, Filter, ArrowUpDown, EyeOff, Plus, Download,
  MoreHorizontal, ChevronDown, Check, LayoutGrid, X,
  Mail, Phone, Share2, AlertCircle, Briefcase, ChevronLeft, ChevronRight, Globe, Building2, MapPin, MessageSquare, Trash2
} from 'lucide-react';
import { useConfirm } from '@/components/ui/ConfirmDialogProvider';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const categories = [
  { name: 'Active Contacts', color: 'bg-green-500' },
  { name: 'Potential Clients', color: 'bg-blue-400' },
  { name: 'Competition Tracking', color: 'bg-red-500' },
  { name: 'Certain Sector', color: 'bg-purple-500' },
  { name: 'Neutrals', color: 'bg-gray-400' },
];

export default function ContactsManager() {
  const { data: contacts, error, isLoading, mutate } = useSWR<any[]>('/api/contacts', fetcher);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('Display All');

  // Filter/Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'company' | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { confirm } = useConfirm();

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
      if (!sortAsc) setSortBy('company');
    } else {
      setSortAsc(!sortAsc);
      if (!sortAsc) setSortBy(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isConfirmed = await confirm({
      title: 'Delete Contact',
      message: 'Are you sure you want to delete this contact?',
      confirmText: 'Delete',
      variant: 'danger'
    });
    
    if (!isConfirmed) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete contact');
      
      toast.success('Contact deleted successfully');
      mutate(); // Refresh SWR cache
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete contact');
    } finally {
      setDeletingId(null);
    }
  };

  // Derived data
  const filteredContacts = useMemo(() => {
    if (!Array.isArray(contacts)) return [];
    let result = [...contacts];

    // Category filter logic
    if (activeCategory !== 'Display All') {
      result = result.filter(c => c.category === activeCategory);
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        (c.name?.toLowerCase() || '').includes(q) ||
        (c.company?.toLowerCase() || '').includes(q) ||
        (c.email?.toLowerCase() || '').includes(q)
      );
    }

    // Advanced Filter toggle mock
    if (isFilterActive) {
      result = result.filter(c => c.priority === 'High');
    }

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    } else if (sortBy === 'company') {
      result.sort((a, b) => {
        const companyA = a.company || '';
        const companyB = b.company || '';
        return sortAsc ? companyA.localeCompare(companyB) : companyB.localeCompare(companyA);
      });
    }

    return result;
  }, [contacts, searchQuery, sortBy, sortAsc, activeCategory, isFilterActive]);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-orange-600 bg-orange-50';
      case 'Low': return 'text-teal-600 bg-teal-50';
      case 'Neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };


  return (
    <div className="flex w-full h-[calc(100vh-2rem)] bg-white rounded-[24px] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden relative">

      {/* Left Sidebar (Categories) */}
      <div className="w-[240px] shrink-0 border-r border-gray-100 bg-gray-50/30 flex flex-col">
        <div className="p-4 border-b border-gray-100 h-16 flex items-center">
          <div className="flex items-center gap-2 px-3 w-full bg-white border border-gray-200 rounded-full py-1.5 focus-within:border-black transition-colors">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-[13px] bg-transparent outline-none w-full placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          <button
            onClick={() => setActiveCategory('Display All')}
            className={`flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-full w-full text-left transition-colors ${activeCategory === 'Display All' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-100/50'}`}
          >
            <div className="w-3 h-3 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            Display All
          </button>

          <div className="my-2 border-t border-gray-100"></div>

          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-full w-full text-left transition-colors ${activeCategory === cat.name ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-100/50'}`}
            >
              <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
              {cat.name}
            </button>
          ))}

          <div className="my-2 border-t border-gray-100"></div>

          <button className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-100/50 rounded-full w-full text-left transition-colors">
            <Plus className="w-3 h-3 text-gray-400" />
            New Sector...
          </button>
        </div>

        <div className="p-4 mt-auto border-t border-gray-100">
          <button className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-700 w-full text-left transition-colors">
            <LayoutGrid className="w-4 h-4" />
            Archive
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">

        {/* Header */}
        <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-black" />
            <h1 className="text-[16px] font-bold text-black tracking-tight">Contacts</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-gray-400">
              <AlertCircle className="w-4 h-4 hover:text-gray-600 cursor-pointer transition-colors" />
            </div>
            <div className="w-px h-5 bg-gray-200"></div>
            <div className="flex -space-x-2">
              <img className="w-7 h-7 rounded-full border-2 border-white relative z-20" src="https://ui-avatars.com/api/?name=J+D&background=random&size=28" alt="Avatar" />
              <img className="w-7 h-7 rounded-full border-2 border-white relative z-10" src="https://ui-avatars.com/api/?name=S+C&background=random&size=28" alt="Avatar" />
              <div className="w-7 h-7 rounded-full border-2 border-white relative z-0 bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">+3</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="h-14 px-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/30">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              <LayoutGrid className="w-3.5 h-3.5 text-gray-500" />
              Table
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
            </button>

            <div className="flex items-center gap-4 text-[13px] font-medium text-gray-600">
              <div className="relative group">
                <button className="flex items-center gap-1.5 hover:text-black transition-colors">
                  <Search className="w-3.5 h-3.5" />
                  {searchQuery ? <span className="text-black font-bold">Search Active</span> : 'Search'}
                </button>
                {/* Invisible drop target just to show it's "working" intuitively */}
              </div>

              <button
                onClick={() => setIsFilterActive(!isFilterActive)}
                className={`flex items-center gap-1.5 transition-colors ${isFilterActive ? 'text-black font-bold' : 'hover:text-black'}`}
              >
                <Filter className="w-3.5 h-3.5" /> Filters
              </button>

              <button className="flex items-center gap-1.5 hover:text-black transition-colors"><Users className="w-3.5 h-3.5" /> Person</button>

              <button
                onClick={handleSort}
                className={`flex items-center gap-1.5 transition-colors ${sortBy ? 'text-black font-bold' : 'hover:text-black'}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sortBy ? `Sort by ${sortBy}` : 'Sort by'}
              </button>

              <button className="flex items-center gap-1.5 hover:text-black transition-colors"><EyeOff className="w-3.5 h-3.5" /> Hide</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              Import
            </button>
            <button className="px-3 py-1.5 text-[13px] font-semibold text-white bg-black hover:bg-[#e03150] rounded-full transition-colors flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> New Contact
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
                <th className="py-2.5 px-4 font-semibold text-gray-500 text-[12px] border-r border-gray-100 w-[22%]">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gray-400" /> Contact
                  </div>
                </th>
                <th className="py-2.5 px-4 font-semibold text-gray-500 text-[12px] border-r border-gray-100 w-[22%]">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400" /> Company
                  </div>
                </th>
                <th className="py-2.5 px-4 font-semibold text-gray-500 text-[12px] border-r border-gray-100 w-[12%]">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-gray-400" /> Priority
                  </div>
                </th>
                <th className="py-2.5 px-4 font-semibold text-gray-500 text-[12px] border-r border-gray-100 w-[18%]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone
                  </div>
                </th>
                <th className="py-2.5 px-4 font-semibold text-gray-500 text-[12px] border-r border-gray-100 w-[22%]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> Email
                  </div>
                </th>
                <th className="py-2.5 px-4 w-10 border-r border-gray-100">
                  <Plus className="w-3.5 h-3.5 text-gray-400 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-gray-100 animate-pulse">
                    <td className="py-2.5 pl-6 pr-3 border-r border-gray-100">
                      <div className="w-4 h-4 bg-gray-200 rounded-[4px]"></div>
                    </td>
                    <td className="py-2.5 px-4 border-r border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 border-r border-gray-100">
                      <div className="w-32 h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-2.5 px-4 border-r border-gray-100">
                      <div className="w-16 h-5 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-2.5 px-4 border-r border-gray-100">
                      <div className="w-28 h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-2.5 px-4 border-r border-gray-100">
                      <div className="w-36 h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-2.5 px-4 border-r border-gray-100">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={(e) => toggleSelect(contact.id, e)}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${selected.includes(contact.id) ? 'bg-gray-100' : ''}`}
                >
                  <td className="py-2 pl-6 pr-3 border-r border-gray-100">
                    <div
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${selected.includes(contact.id) ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}
                    >
                      {selected.includes(contact.id) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-r border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${contact.color}`}>
                        {contact.avatar}
                      </div>
                      <span className="text-[13px] font-semibold text-black">{contact.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-r border-gray-100">
                    <span className="text-[13px] font-medium text-gray-700">{contact.company || '-'}</span>
                  </td>
                  <td className="py-2 px-4 border-r border-gray-100">
                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-[12px] font-semibold ${getPriorityStyles(contact.priority)}`}>
                      {contact.priority}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-r border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-2.5 bg-gray-200 rounded-[2px] overflow-hidden relative">
                        {/* Fake flag representing country code */}
                        <div className="absolute inset-0 bg-red-500 w-1/3"></div>
                        <div className="absolute inset-0 bg-white w-1/3 left-1/3"></div>
                        <div className="absolute inset-0 bg-blue-500 w-1/3 left-2/3"></div>
                      </div>
                      <span className="text-[13px] font-medium text-black tracking-tight">{contact.phone || '-'}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-r border-gray-100">
                    <span className="text-[13px] font-medium text-gray-600">{contact.email}</span>
                  </td>
                  <td className="py-2 px-4 border-r border-gray-100 text-center">
                    <button
                      onClick={(e) => handleDelete(contact.id, e)}
                      disabled={deletingId === contact.id}
                      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}

              {!isLoading && filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 font-medium">
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Floating Action Bar */}
        {selected.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-xl shadow-2xl flex items-center gap-4 px-2 py-2 animate-in slide-in-from-bottom-4 fade-in duration-200 z-50">
            <div className="flex items-center gap-2 pl-2">
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-[12px] font-bold">
                {selected.length}
              </div>
              <span className="text-[13px] font-medium pr-2 border-r border-gray-700">Selected</span>
            </div>
            <button className="flex items-center gap-2 px-2 hover:text-gray-300 transition-colors text-[13px] font-medium">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button className="flex items-center gap-2 px-2 hover:text-gray-300 transition-colors text-[13px] font-medium">
              <Mail className="w-3.5 h-3.5" /> Send Emails
            </button>
            <div className="w-px h-5 bg-gray-700 mx-1"></div>
            <div className="flex items-center gap-1 pr-2">
              <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded-lg transition-colors text-red-400 hover:text-red-300">
                <AlertCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelected([])}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded-lg transition-colors border-l border-gray-700 ml-1"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
