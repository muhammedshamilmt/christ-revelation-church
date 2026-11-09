"use client";

import { useEffect } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { INITIAL_PRAYER_REQUESTS } from "./mockData";
import { supabase } from "./supabase";
import { mapDbRowToPrayerRequest } from "./prayerUtils";

export type PrayerRequestStatus = "New" | "Praying" | "Answered" | "Followed Up";

export type PrayerRequestItem = {
  id: string;
  category: string; // "Healing" | "Guidance" | "Thanksgiving" | "Other"
  title: string; // "Mr." | "Mrs." | "Ms." | "Dr." | ""
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  request: string;
  contactPreference: "yes" | "no";
  isConfidential: boolean;
  status: PrayerRequestStatus;
  notes?: string;
  createdAt: string;
};

export const PRAYER_REQUESTS_KEY = "/api/prayer-requests";
const STORAGE_KEY = "crc_cached_prayer_requests";

const prayerRequestsFetcher = async (url: string): Promise<PrayerRequestItem[]> => {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch prayer requests");
    const data = await res.json();
    if (Array.isArray(data)) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {
          // ignore
        }
      }
      return data;
    }
  } catch (err) {
    console.warn("API prayer requests fetch error, checking cache:", err);
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore
      }
    }
  }

  return [];
};

export function usePrayerRequests() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<PrayerRequestItem[]>(
    PRAYER_REQUESTS_KEY,
    prayerRequestsFetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 1000,
      keepPreviousData: false,
    }
  );

  // Live real-time updates from Supabase
  useEffect(() => {
    const channelId = `realtime-prayer-requests-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "prayer_requests" },
        () => {
          globalMutate(PRAYER_REQUESTS_KEY);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    prayerRequests: data ?? [],
    isLoading: isLoading && data === undefined,
    isValidating,
    isError: error,
    mutate,
  };
}

// ── Optimistic Mutations (Zero Latency + Fast Background Sync) ──
export async function addPrayerRequest(
  input: Omit<PrayerRequestItem, "id" | "status" | "createdAt">
): Promise<PrayerRequestItem> {
  const newItem: PrayerRequestItem = {
    ...input,
    id: `pray-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: "New",
    notes: input.notes || "",
    createdAt: new Date().toISOString(),
  };

  // 1. Optimistic update
  globalMutate(
    PRAYER_REQUESTS_KEY,
    (current: PrayerRequestItem[] | undefined) => [newItem, ...(current || [])],
    { revalidate: false }
  );

  // 2. Background API call
  try {
    const res = await fetch("/api/prayer-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      const saved = await res.json();
      globalMutate(PRAYER_REQUESTS_KEY);
      return saved;
    }
  } catch (err) {
    console.error("Failed to add prayer request via API:", err);
  }

  return newItem;
}

export async function updatePrayerRequest(
  id: string,
  patch: Partial<PrayerRequestItem>
) {
  // 1. Optimistic update
  globalMutate(
    PRAYER_REQUESTS_KEY,
    (current: PrayerRequestItem[] | undefined) =>
      (current || []).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    { revalidate: false }
  );

  // 2. Background sync
  try {
    const res = await fetch(`/api/prayer-requests/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      globalMutate(PRAYER_REQUESTS_KEY);
    }
  } catch (err) {
    console.error("Failed to update prayer request via API:", err);
  }
}

export async function deletePrayerRequest(id: string) {
  // 1. Optimistic delete
  globalMutate(
    PRAYER_REQUESTS_KEY,
    (current: PrayerRequestItem[] | undefined) =>
      (current || []).filter((item) => item.id !== id),
    { revalidate: false }
  );

  // 2. Background delete
  try {
    const res = await fetch(`/api/prayer-requests/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      globalMutate(PRAYER_REQUESTS_KEY);
    }
  } catch (err) {
    console.error("Failed to delete prayer request via API:", err);
  }
}
