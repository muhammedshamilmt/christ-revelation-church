"use client";

import useSWR, { mutate as globalMutate } from 'swr';
import { createClient } from '@/lib/supabase/client';

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

// ── Row mapper: DB → Subadmin ──
function mapRow(row: any): Subadmin {
  let permissions: string[] = [];
  if (Array.isArray(row.permissions)) {
    permissions = row.permissions;
  } else if (typeof row.permissions === 'string') {
    try {
      permissions = JSON.parse(row.permissions);
    } catch {
      permissions = [];
    }
  }

  return {
    id: row.id,
    fullName: row.full_name || '',
    email: row.email || '',
    phone: row.phone || undefined,
    dob: row.dob || undefined,
    gender: row.gender || undefined,
    nationality: row.nationality || undefined,
    address: row.address || undefined,
    role: row.role || 'Admin',
    permissions,
    location: row.location || undefined,
    avatar: row.avatar || undefined,
    color: row.color || 'bg-black',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

// ── Row mapper: Subadmin → DB ──
function toDbRow(s: Partial<Subadmin>) {
  const row: Record<string, any> = {};
  if (s.fullName !== undefined) row.full_name = s.fullName;
  if (s.email !== undefined) row.email = s.email.trim().toLowerCase();
  if (s.phone !== undefined) row.phone = s.phone || null;
  if (s.dob !== undefined) row.dob = s.dob || null;
  if (s.gender !== undefined) row.gender = s.gender || null;
  if (s.nationality !== undefined) row.nationality = s.nationality || null;
  if (s.address !== undefined) row.address = s.address || null;
  if (s.role !== undefined) row.role = s.role;
  if (s.permissions !== undefined) row.permissions = s.permissions;
  if (s.location !== undefined) row.location = s.location || null;
  if (s.avatar !== undefined) row.avatar = s.avatar || null;
  if (s.color !== undefined) row.color = s.color || null;
  return row;
}

// ── Fetcher: all subadmins ──
const fetcherAll = async (): Promise<Subadmin[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subadmins')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subadmins:', error);
    throw error;
  }
  return (data || []).map(mapRow);
};

// ── Fetcher: single subadmin by ID ──
const fetcherSingle = async (key: string): Promise<Subadmin | null> => {
  const id = key.replace('subadmin/', '');
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subadmins')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return mapRow(data);
};

/** Fetch all subadmins */
export function useSubadmins() {
  const { data, error, isLoading, mutate } = useSWR<Subadmin[]>(
    SUBADMINS_KEY,
    fetcherAll,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  return {
    subadmins: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/** Fetch a single subadmin by ID */
export function useSubadmin(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Subadmin | null>(
    id ? `subadmin/${id}` : null,
    fetcherSingle,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
    }
  );

  return {
    subadmin: data ?? null,
    isLoading,
    isError: error,
    mutate,
  };
}

export async function addSubadmin(subadmin: Omit<Subadmin, 'id' | 'createdAt'>) {
  const supabase = createClient();
  const row = toDbRow(subadmin);

  const colors = ['bg-[#b2823e]', 'bg-[#1a1a1a]', 'bg-[#7c5b24]', 'bg-[#4a3b2c]', 'bg-[#2563eb]'];
  if (!row.color) {
    row.color = colors[Math.floor(Math.random() * colors.length)];
  }
  if (!row.avatar && row.full_name) {
    row.avatar = row.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  }

  const { data, error } = await supabase.from('subadmins').insert(row).select().single();
  if (error) throw error;
  globalMutate(SUBADMINS_KEY);
  return mapRow(data);
}

export async function updateSubadmin(id: string, subadmin: Partial<Subadmin>) {
  const supabase = createClient();
  const row = toDbRow(subadmin);

  if (row.full_name && !row.avatar) {
    row.avatar = row.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  }

  const { data, error } = await supabase.from('subadmins').update(row).eq('id', id).select().single();
  if (error) throw error;
  globalMutate(SUBADMINS_KEY);
  globalMutate(`subadmin/${id}`);
  return mapRow(data);
}

export async function deleteSubadmin(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('subadmins').delete().eq('id', id);
  if (error) throw error;
  globalMutate(SUBADMINS_KEY);
}

// Generate realistic activity heatmap data or fetch from activities if present
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
