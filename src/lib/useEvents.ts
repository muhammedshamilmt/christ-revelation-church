"use client";

import useSWR, { mutate as globalMutate } from 'swr';
import { INITIAL_EVENTS } from './mockData';
import type { AdminEvent } from '@/components/admin/events/EventForm';

export const EVENTS_KEY = 'admin_events';

function getStoredEvents(): AdminEvent[] {
  if (typeof window === 'undefined') return INITIAL_EVENTS as AdminEvent[];
  try {
    const raw = localStorage.getItem('crc_mock_events');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_EVENTS as AdminEvent[];
}

function saveStoredEvents(events: AdminEvent[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('crc_mock_events', JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }
}

export function useEvents() {
  const { data, error, isLoading, mutate } = useSWR<AdminEvent[]>(
    EVENTS_KEY,
    async () => getStoredEvents(),
    {
      fallbackData: INITIAL_EVENTS as AdminEvent[],
      revalidateOnFocus: false,
    }
  );

  return {
    events: data || (INITIAL_EVENTS as AdminEvent[]),
    isLoading: false,
    isError: error,
    mutate,
  };
}

export function useEvent(id: string) {
  const { data, error, isLoading, mutate } = useSWR<AdminEvent | null>(
    id ? `event/${id}` : null,
    async () => {
      const list = getStoredEvents();
      return list.find(e => e.id === id) || null;
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    event: data ?? null,
    isLoading: false,
    isError: error,
    mutate,
  };
}

export async function addEvent(event: AdminEvent) {
  const list = getStoredEvents();
  const newEvt = {
    ...event,
    id: event.id || `event-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newEvt, ...list];
  saveStoredEvents(updated);
  globalMutate(EVENTS_KEY, updated, false);
}

export async function updateEvent(id: string, patch: Partial<AdminEvent>) {
  const list = getStoredEvents();
  const updated = list.map(e => e.id === id ? { ...e, ...patch } : e);
  saveStoredEvents(updated);
  globalMutate(EVENTS_KEY, updated, false);
  globalMutate(`event/${id}`, updated.find(e => e.id === id), false);
}

export async function deleteEvent(id: string) {
  const list = getStoredEvents();
  const updated = list.filter(e => e.id !== id);
  saveStoredEvents(updated);
  globalMutate(EVENTS_KEY, updated, false);
}

export async function incrementEventViews(id: string) {
  const list = getStoredEvents();
  const updated = list.map(e => e.id === id ? { ...e, views: (e.views || 0) + 1 } : e);
  saveStoredEvents(updated);
  globalMutate(EVENTS_KEY, updated, false);
}
