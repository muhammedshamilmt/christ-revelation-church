"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { INITIAL_EVENTS } from "./mockData";
import { saveMediaBlobToIDB } from "./useGallery";
import type { AdminEvent } from "@/components/admin/events/EventForm";
import { mapDbRowToAdminEvent } from "./eventUtils";
import { supabase } from "./supabase";

export { saveMediaBlobToIDB };

export const EVENTS_KEY = "/api/events";
const IDB_NAME = "crc_gallery_media_db";
const IDB_STORE = "media_blobs";

const objectUrlCache = new Map<string, string>();

async function resolveEventIDBUrl(ref?: string): Promise<string> {
  if (!ref) return "";
  if (!ref.startsWith("idb://")) return ref;
  const key = ref.slice("idb://".length);
  if (objectUrlCache.has(key)) {
    return objectUrlCache.get(key)!;
  }
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return "/images/hero-bg.png";
  }
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(IDB_STORE, "readonly");
        const getReq = tx.objectStore(IDB_STORE).get(key);
        getReq.onsuccess = () => {
          const blob = getReq.result as Blob | undefined;
          if (blob instanceof Blob) {
            const objUrl = URL.createObjectURL(blob);
            objectUrlCache.set(key, objUrl);
            resolve(objUrl);
          } else {
            resolve("/images/hero-bg.png");
          }
        };
        getReq.onerror = () => resolve("/images/hero-bg.png");
      };
      req.onerror = () => resolve("/images/hero-bg.png");
    } catch {
      resolve("/images/hero-bg.png");
    }
  });
}

async function hydrateEvents(events: AdminEvent[]): Promise<AdminEvent[]> {
  return Promise.all(
    events.map(async (evt) => {
      const resolvedImages = await Promise.all(
        (evt.images || []).map((img) => resolveEventIDBUrl(img))
      );
      const resolvedHostImg = await resolveEventIDBUrl(evt.host?.image);
      return {
        ...evt,
        images: resolvedImages.length ? resolvedImages : ["/images/hero-bg.png"],
        host: {
          ...evt.host,
          image: resolvedHostImg || "/images/hero-bg.png",
        },
      };
    })
  );
}

// ── High Speed API Fetcher with In-Memory / Local Storage Caching & Deduplication ──
const fetcher = async (url: string): Promise<AdminEvent[]> => {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.statusText}`);
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("crc_cached_events", JSON.stringify(data));
        } catch {
          // ignore quota
        }
      }
      return hydrateEvents(data);
    }
  } catch (err) {
    console.warn("API fetch error, falling back to cached events:", err);
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("crc_cached_events");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            return hydrateEvents(parsed);
          }
        }
      } catch {
        // ignore
      }
    }
  }

  return [];
};

export function useEvents() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<AdminEvent[]>(
    EVENTS_KEY,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 1000,
      keepPreviousData: false,
    }
  );

  // Real-time synchronization without manual refresh
  useEffect(() => {
    const channelId = `realtime-events-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          globalMutate(EVENTS_KEY);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    events: data ?? [],
    isLoading: isLoading && data === undefined,
    isValidating,
    isError: error,
    mutate,
  };
}

export function useEvent(id: string) {
  const [hydratedEvent, setHydratedEvent] = useState<AdminEvent | null>(null);
  const targetId = id ? decodeURIComponent(id) : "";

  const { data, error, isLoading, isValidating, mutate } = useSWR<AdminEvent | null>(
    targetId ? `/api/events/${encodeURIComponent(targetId)}` : null,
    async (url: string) => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const item = await res.json();
          const [hydrated] = await hydrateEvents([item]);
          return hydrated;
        }
      } catch (err) {
        console.warn("Single event fetch failed, checking cache...", err);
      }

      // Check global events cache
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("crc_cached_events");
          if (cached) {
            const list: AdminEvent[] = JSON.parse(cached);
            const found = list.find((e) => e.id === targetId || e.id === id);
            if (found) {
              const [hydrated] = await hydrateEvents([found]);
              return hydrated;
            }
          }
        } catch {
          // ignore
        }
      }

      const fallback = (INITIAL_EVENTS as AdminEvent[]).find(
        (e) => e.id === targetId || e.id === id
      );
      if (fallback) {
        const [hydrated] = await hydrateEvents([fallback]);
        return hydrated;
      }
      return null;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (data !== undefined) {
      setHydratedEvent(data);
    }
  }, [data]);

  useEffect(() => {
    if (!targetId) return;
    const channelId = `realtime-event-${targetId}-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events", filter: `id=eq.${targetId}` },
        () => {
          globalMutate(`/api/events/${encodeURIComponent(targetId)}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [targetId]);

  return {
    event: hydratedEvent ?? data ?? null,
    isLoading: isLoading && !hydratedEvent && !data,
    isValidating,
    isError: error,
    mutate,
  };
}

// ── Optimistic Mutations (Zero Latency UI + Fast Background Sync) ──
export async function addEvent(event: AdminEvent) {
  const newEvt: AdminEvent = {
    ...event,
    id: event.id || `event-${Date.now()}`,
    createdAt: event.createdAt || new Date().toISOString(),
  };

  // 1. Optimistically update local SWR cache immediately
  globalMutate(
    EVENTS_KEY,
    (current: AdminEvent[] | undefined) => {
      const list = current || [];
      return [newEvt, ...list.filter((e) => e.id !== newEvt.id)];
    },
    { revalidate: false }
  );

  // 2. Persist to API / Supabase in background
  try {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvt),
    });
    if (res.ok) {
      const saved = await res.json();
      // Update cache with confirmed backend record
      globalMutate(EVENTS_KEY);
      return saved;
    }
  } catch (err) {
    console.error("Failed to add event to API:", err);
  }
}

export async function updateEvent(id: string, patch: Partial<AdminEvent>) {
  const targetId = decodeURIComponent(id);

  // 1. Optimistic update
  globalMutate(
    EVENTS_KEY,
    (current: AdminEvent[] | undefined) => {
      const list = current || [];
      return list.map((e) => (e.id === targetId || e.id === id ? { ...e, ...patch } : e));
    },
    { revalidate: false }
  );

  globalMutate(
    `/api/events/${encodeURIComponent(targetId)}`,
    (current: AdminEvent | null | undefined) => {
      return current ? { ...current, ...patch } : null;
    },
    { revalidate: false }
  );

  // 2. Background sync
  try {
    const res = await fetch(`/api/events/${encodeURIComponent(targetId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      globalMutate(EVENTS_KEY);
      globalMutate(`/api/events/${encodeURIComponent(targetId)}`);
    }
  } catch (err) {
    console.error("Failed to update event in API:", err);
  }
}

export async function deleteEvent(id: string) {
  const targetId = decodeURIComponent(id);

  // 1. Optimistic removal
  globalMutate(
    EVENTS_KEY,
    (current: AdminEvent[] | undefined) => {
      const list = current || [];
      return list.filter((e) => e.id !== targetId && e.id !== id);
    },
    { revalidate: false }
  );

  // 2. Background delete
  try {
    const res = await fetch(`/api/events/${encodeURIComponent(targetId)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      globalMutate(EVENTS_KEY);
    }
  } catch (err) {
    console.error("Failed to delete event from API:", err);
  }
}

export async function incrementEventViews(id: string) {
  const targetId = decodeURIComponent(id);
  // Optimistic increment
  globalMutate(
    EVENTS_KEY,
    (current: AdminEvent[] | undefined) => {
      const list = current || [];
      return list.map((e) =>
        e.id === targetId || e.id === id ? { ...e, views: (e.views || 0) + 1 } : e
      );
    },
    { revalidate: false }
  );

  // Background atomic counter
  try {
    fetch(`/api/events/${encodeURIComponent(targetId)}/view`, {
      method: "POST",
    }).catch(() => {});
  } catch {
    // ignore
  }
}
