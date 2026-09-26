"use client";

import useSWR, { mutate as globalMutate } from 'swr';
import { INITIAL_VOLUNTEERS } from './mockData';
import type { VolunteerDetails } from '@/components/admin/volunteers/VolunteerDetailsSidebar';

export const VOLUNTEERS_KEY = 'admin_volunteers';

function getStoredVolunteers(): VolunteerDetails[] {
  if (typeof window === 'undefined') return INITIAL_VOLUNTEERS as VolunteerDetails[];
  try {
    const raw = localStorage.getItem('crc_mock_volunteers');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_VOLUNTEERS as VolunteerDetails[];
}

function saveStoredVolunteers(volunteers: VolunteerDetails[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('crc_mock_volunteers', JSON.stringify(volunteers));
    } catch (e) {
      console.error(e);
    }
  }
}

export function useVolunteers() {
  const { data, error, isLoading, mutate } = useSWR<VolunteerDetails[]>(
    VOLUNTEERS_KEY,
    async () => getStoredVolunteers(),
    {
      fallbackData: INITIAL_VOLUNTEERS as VolunteerDetails[],
      revalidateOnFocus: false,
    }
  );

  return {
    volunteers: data || (INITIAL_VOLUNTEERS as VolunteerDetails[]),
    isLoading: false,
    isError: error,
    mutate,
  };
}

export async function addVolunteerApplication(data: any) {
  const list = getStoredVolunteers();
  const newVol: VolunteerDetails = {
    id: `vol-${Date.now()}`,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phone: data.phone || '',
    location: data.location || '',
    ageGroup: data.ageGroup || '',
    interests: data.interests || [],
    frequency: data.frequency || '',
    days: data.days || [],
    time: data.time || [],
    preference: data.preference || '',
    hasExperience: data.hasExperience || '',
    experienceDetails: data.experienceDetails || '',
    motivation: data.motivation || '',
    skills: data.skills || [],
    status: 'pending',
    matchScore: 85,
    appliedDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
  };
  const updated = [newVol, ...list];
  saveStoredVolunteers(updated);
  globalMutate(VOLUNTEERS_KEY, updated, false);
}

export async function updateVolunteerStatus(id: string, status: string) {
  const list = getStoredVolunteers();
  const updated = list.map(v => v.id === id ? { ...v, status } : v);
  saveStoredVolunteers(updated);
  globalMutate(VOLUNTEERS_KEY, updated, false);
}
