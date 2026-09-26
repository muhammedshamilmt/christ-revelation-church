"use client";

import useSWR, { mutate as globalMutate } from 'swr';
import { INITIAL_CAMPAIGNS } from './mockData';
import type { AdminCampaign } from '@/components/admin/campaigns/CampaignForm';

export const CAMPAIGNS_KEY = 'admin_campaigns';

function getStoredCampaigns(): AdminCampaign[] {
  if (typeof window === 'undefined') return INITIAL_CAMPAIGNS;
  try {
    const raw = localStorage.getItem('crc_mock_campaigns');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CAMPAIGNS;
}

function saveStoredCampaigns(campaigns: AdminCampaign[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('crc_mock_campaigns', JSON.stringify(campaigns));
    } catch (e) {
      console.error(e);
    }
  }
}

export function useCampaigns() {
  const { data, error, isLoading, mutate } = useSWR<AdminCampaign[]>(
    CAMPAIGNS_KEY,
    async () => getStoredCampaigns(),
    {
      fallbackData: INITIAL_CAMPAIGNS,
      revalidateOnFocus: false,
    }
  );

  return {
    campaigns: data || INITIAL_CAMPAIGNS,
    isLoading: false,
    isError: error,
    mutate,
  };
}

export function useCampaign(id: string) {
  const { data, error, isLoading, mutate } = useSWR<AdminCampaign | null>(
    id ? `campaign/${id}` : null,
    async () => {
      const list = getStoredCampaigns();
      return list.find(c => c.id === id) || null;
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    campaign: data ?? null,
    isLoading: false,
    isError: error,
    mutate,
  };
}

export async function addCampaign(campaign: AdminCampaign) {
  const list = getStoredCampaigns();
  const newCamp = {
    ...campaign,
    id: campaign.id || `camp-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newCamp, ...list];
  saveStoredCampaigns(updated);
  globalMutate(CAMPAIGNS_KEY, updated, false);
}

export async function updateCampaign(id: string, patch: Partial<AdminCampaign>) {
  const list = getStoredCampaigns();
  const updated = list.map(c => c.id === id ? { ...c, ...patch } : c);
  saveStoredCampaigns(updated);
  globalMutate(CAMPAIGNS_KEY, updated, false);
  globalMutate(`campaign/${id}`, updated.find(c => c.id === id), false);
}

export async function deleteCampaign(id: string) {
  const list = getStoredCampaigns();
  const updated = list.filter(c => c.id !== id);
  saveStoredCampaigns(updated);
  globalMutate(CAMPAIGNS_KEY, updated, false);
}
