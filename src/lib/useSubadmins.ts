"use client";

import useSWR, { mutate as globalMutate } from 'swr';
import { INITIAL_SUBADMINS } from './mockData';

export const SUBADMINS_KEY = 'admin_subadmins';

export interface Subadmin {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  role: string;
  permissions: string[];
  location?: string;
  avatar?: string;
  color?: string;
  createdAt: string;
}

export interface SubadminActivity {
  id: string;
  subadminId: string;
  date: string;
  count: number;
}

function getStoredSubadmins(): Subadmin[] {
  if (typeof window === 'undefined') return INITIAL_SUBADMINS;
  try {
    const raw = localStorage.getItem('crc_mock_subadmins');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_SUBADMINS;
}

function saveStoredSubadmins(subadmins: Subadmin[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('crc_mock_subadmins', JSON.stringify(subadmins));
    } catch (e) {
      console.error(e);
    }
  }
}

export function useSubadmins() {
  const { data, error, isLoading, mutate } = useSWR<Subadmin[]>(
    SUBADMINS_KEY,
    async () => getStoredSubadmins(),
    {
      fallbackData: INITIAL_SUBADMINS,
      revalidateOnFocus: false,
    }
  );

  return {
    subadmins: data || INITIAL_SUBADMINS,
    isLoading: false,
    isError: error,
    mutate,
  };
}

export function useSubadmin(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Subadmin | null>(
    id ? `subadmin/${id}` : null,
    async () => {
      const list = getStoredSubadmins();
      return list.find(s => s.id === id) || null;
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    subadmin: data ?? null,
    isLoading: false,
    isError: error,
    mutate,
  };
}

export async function addSubadmin(subadmin: Omit<Subadmin, 'id' | 'createdAt'>) {
  const list = getStoredSubadmins();
  const colors = ['bg-black', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
  const newSub: Subadmin = {
    ...subadmin,
    id: `sub-${Date.now()}`,
    color: subadmin.color || colors[Math.floor(Math.random() * colors.length)],
    avatar: subadmin.avatar || (subadmin.fullName ? subadmin.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AD'),
    createdAt: new Date().toISOString(),
  };

  const updated = [newSub, ...list];
  saveStoredSubadmins(updated);
  globalMutate(SUBADMINS_KEY, updated, false);
  return newSub;
}

export async function updateSubadmin(id: string, subadmin: Partial<Subadmin>) {
  const list = getStoredSubadmins();
  const updated = list.map(s => {
    if (s.id !== id) return s;
    return {
      ...s,
      ...subadmin,
      avatar: subadmin.fullName ? subadmin.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : s.avatar,
    };
  });
  saveStoredSubadmins(updated);
  globalMutate(SUBADMINS_KEY, updated, false);
  globalMutate(`subadmin/${id}`, updated.find(s => s.id === id), false);
  return updated.find(s => s.id === id);
}

export async function deleteSubadmin(id: string) {
  const list = getStoredSubadmins();
  const updated = list.filter(s => s.id !== id);
  saveStoredSubadmins(updated);
  globalMutate(SUBADMINS_KEY, updated, false);
}

// Generate realistic activity heatmap data
export function useActivities(subadminId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<SubadminActivity[]>(
    subadminId ? `subadmin_activities/${subadminId}` : null,
    async () => {
      const activities: SubadminActivity[] = [];
      const today = new Date();
      for (let i = 0; i < 90; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const count = (i % 7 === 0 || i % 5 === 0) ? Math.floor(Math.random() * 8) + 1 : 0;
        activities.push({
          id: `act-${subadminId}-${i}`,
          subadminId: subadminId!,
          date: d.toISOString().split('T')[0],
          count,
        });
      }
      return activities;
    },
    { revalidateOnFocus: false }
  );

  return {
    activities: data || [],
    isLoading: false,
    isError: error,
    mutate,
  };
}
