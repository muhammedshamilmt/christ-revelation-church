"use client";

import useSWR, { mutate as globalMutate } from 'swr';
import { INITIAL_TEAMS } from './mockData';

export const TEAMS_KEY = 'admin_teams';

export interface TeamMember {
  id: string; // volunteer id
  name: string;
  role: string;
  department: string;
  avatar: string;
}

export interface Team {
  id: string;
  name: string;
  department: string;
  status: 'Active' | 'Draft';
  color: string;
  tags: string[];
  notes: string;
  leaderId: string | null;
  members: TeamMember[];
  createdAt: string;
}

function getStoredTeams(): Team[] {
  if (typeof window === 'undefined') return INITIAL_TEAMS as Team[];
  try {
    const raw = localStorage.getItem('crc_mock_teams');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_TEAMS as Team[];
}

function saveStoredTeams(teams: Team[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('crc_mock_teams', JSON.stringify(teams));
    } catch (e) {
      console.error(e);
    }
  }
}

export function useTeams() {
  const { data, error, isLoading, mutate } = useSWR<Team[]>(
    TEAMS_KEY,
    async () => getStoredTeams(),
    {
      fallbackData: INITIAL_TEAMS as Team[],
      revalidateOnFocus: false,
    }
  );

  return {
    teams: data || (INITIAL_TEAMS as Team[]),
    isLoading: false,
    isError: error,
    mutate,
  };
}

export async function addTeam(teamData: {
  name: string;
  department: string;
  status: string;
  color: string;
  tags: string[];
  notes: string;
  leaderId: string | null;
  memberIds: string[];
}) {
  const list = getStoredTeams();
  const newTeam: Team = {
    id: `team-${Date.now()}`,
    name: teamData.name,
    department: teamData.department,
    status: (teamData.status as 'Active' | 'Draft') || 'Active',
    color: teamData.color || "#000000",
    tags: teamData.tags || [],
    notes: teamData.notes || '',
    leaderId: teamData.leaderId,
    members: teamData.memberIds.map(id => ({
      id,
      name: `Member ${id.slice(-4)}`,
      role: 'Member',
      department: teamData.department,
      avatar: 'Member',
    })),
    createdAt: new Date().toISOString(),
  };

  const updated = [newTeam, ...list];
  saveStoredTeams(updated);
  globalMutate(TEAMS_KEY, updated, false);
  return newTeam;
}

export async function updateTeam(teamId: string, teamData: {
  name: string;
  department: string;
  status: string;
  color: string;
  tags: string[];
  notes: string;
  leaderId: string | null;
  memberIds: string[];
}) {
  const list = getStoredTeams();
  const updated = list.map(t => {
    if (t.id !== teamId) return t;
    return {
      ...t,
      name: teamData.name,
      department: teamData.department,
      status: (teamData.status as 'Active' | 'Draft') || t.status,
      color: teamData.color,
      tags: teamData.tags,
      notes: teamData.notes,
      leaderId: teamData.leaderId,
    };
  });
  saveStoredTeams(updated);
  globalMutate(TEAMS_KEY, updated, false);
  return true;
}
