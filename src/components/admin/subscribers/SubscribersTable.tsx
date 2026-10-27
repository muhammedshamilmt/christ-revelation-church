'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';
import { Mail, Users, Globe, Activity, Check, Trash2 } from 'lucide-react';
import { useConfirm } from '@/components/ui/ConfirmDialogProvider';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SubscribersTable() {
  const { data: subscribers, error, isLoading, mutate } = useSWR<any[]>('/api/subscribers', fetcher);
  const [selected, setSelected] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { confirm } = useConfirm();

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Subscriber',
      message: 'Are you sure you want to delete this subscriber?',
      confirmText: 'Delete',
      variant: 'danger'
    });
    
    if (!isConfirmed) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/subscribers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete subscriber');
      
      toast.success('Subscriber deleted successfully');
      mutate();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete subscriber');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Active': return { color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' };
      case 'Unsubscribed': return { color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' };
      case 'Bounced': return { color: 'text-red-500', bg: 'bg-red-50 border-red-200' };
      default: return { color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' };
    }
  };

  const displaySubscribers = Array.isArray(subscribers) ? subscribers : [];

  return (
    <div className="w-full flex flex-col pt-4 pb-12">

      {/* Header Area */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-black tracking-tight flex items-center gap-3">
          Subscribers Management
          <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
            <Mail className="w-3.5 h-3.5 text-gray-500" />
          </div>
        </h1>
        <p className="text-[15px] font-medium text-gray-500 mt-1">
          Manage newsletter and communication subscribers.
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/80 rounded-full ">
          <div className="flex -space-x-1.5">
            <img className="w-5 h-5 rounded-full border-2 border-white relative z-20" src="https://ui-avatars.com/api/?name=J+D&background=random&size=20" alt="Avatar" />
            <img className="w-5 h-5 rounded-full border-2 border-white relative z-10" src="https://ui-avatars.com/api/?name=S+C&background=random&size=20" alt="Avatar" />
            <img className="w-5 h-5 rounded-full border-2 border-white relative z-0" src="https://ui-avatars.com/api/?name=M+C&background=random&size=20" alt="Avatar" />
          </div>
          <span className="text-[13px] font-semibold text-gray-700">{displaySubscribers.length} Subscribers</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/80 rounded-full  text-[13px] font-semibold text-gray-700">
          <Globe className="w-3.5 h-3.5 text-gray-400" />
          Global
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/80 rounded-full  text-[13px] font-semibold text-gray-700">
          <Activity className="w-3.5 h-3.5 text-gray-400" />
          Dynamic Data
        </div>
      </div>

      {/* Table Content */}
      <div className="rounded-[20px] p-2 bg-[#f8f9fa] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full"
        style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)' }}>

        <div className="bg-white rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200/80 bg-[#fafafa]">
                  <th className="py-3 pl-4 pr-3 border-r border-gray-200/60 font-medium text-gray-500 text-[13px] w-10">
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 rounded-[4px] border border-gray-300 bg-white "></div>
                    </div>
                  </th>
                  <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[20%]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" /> Type
                    </div>
                  </th>
                  <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[30%]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" /> Email
                    </div>
                  </th>
                  <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[25%]">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" /> Region
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-[13px] w-[20%] border-r border-gray-200/60">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-400" /> Status
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-[13px] w-[5%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors animate-pulse">
                      <td className="py-3.5 pl-4 pr-3 border-r border-gray-100">
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 bg-gray-200 rounded-[4px]"></div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100">
                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100">
                        <div className="w-48 h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100">
                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100">
                        <div className="w-24 h-6 bg-gray-200 rounded-full"></div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : displaySubscribers.map((subscriber) => {
                  const styles = getStatusStyles(subscriber.status);
                  return (
                    <tr
                      key={subscriber.id}
                      onClick={() => toggleSelect(subscriber.id)}
                      className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer group ${selected.includes(subscriber.id) ? 'bg-gray-100' : ''}`}
                    >
                      <td className="py-3.5 pl-4 pr-3 border-r border-gray-100">
                        <div className="flex items-center justify-center">
                          <div
                            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${selected.includes(subscriber.id) ? 'bg-[#0ea5e9] border-[#0ea5e9]' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}
                          >
                            {selected.includes(subscriber.id) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100">
                        <span className="text-[14px] font-semibold text-gray-900">{subscriber.type || 'Newsletter'}</span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100">
                        <span className="text-[14px] font-medium text-gray-600">{subscriber.email}</span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100">
                        <span className="text-[13px] font-medium text-gray-500">{subscriber.region || 'Global'}</span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold border ${styles.bg} ${styles.color}`}>
                          {subscriber.status || 'Active'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(subscriber.id);
                          }}
                          disabled={deletingId === subscriber.id}
                          className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {!isLoading && displaySubscribers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Mail className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-[15px] font-semibold text-gray-900 mb-1">No subscribers yet</h3>
                        <p className="text-[13px] text-gray-500 max-w-sm">
                          When users subscribe to the newsletter from the footer, they will appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
