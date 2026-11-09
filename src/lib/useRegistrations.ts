"use client";

import { useEffect } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { supabase } from "./supabase";

export type RegistrationData = {
  _id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  dietary: string;
  guests: string;
  appliedAt: string;
  message: string;
  status: "pending" | "confirmed" | "cancelled";
};

export const ALL_REGISTRATIONS_KEY = "/api/registrations";

const INITIAL_REGISTRATIONS: RegistrationData[] = [
  {
    _id: "reg-1",
    event_id: "annual-youth-conference-2026",
    name: "Arthur Pendelton",
    email: "a.pendelton@outlook.com",
    phone: "+44 7700 900111",
    dietary: "None",
    guests: "2",
    appliedAt: "2026-03-22T10:00:00.000Z",
    message: "Looking forward to the youth leadership labs!",
    status: "confirmed",
  },
  {
    _id: "reg-2",
    event_id: "annual-youth-conference-2026",
    name: "Evelyn Wright",
    email: "evelyn.wright@nhs.net",
    phone: "+44 7700 900222",
    dietary: "Vegetarian",
    guests: "1",
    appliedAt: "2026-03-23T14:30:00.000Z",
    message: "First time attending the Annual Youth Conference.",
    status: "confirmed",
  },
  {
    _id: "reg-3",
    event_id: "community-outreach-drive",
    name: "Daniel Foster",
    email: "dfoster@techcorp.co.uk",
    phone: "+44 7700 900333",
    dietary: "None",
    guests: "3",
    appliedAt: "2026-03-24T09:15:00.000Z",
    message: "Bringing my family to help distribute food parcels.",
    status: "confirmed",
  },
  {
    _id: "reg-4",
    event_id: "worship-night-encounter",
    name: "Chloe Sterling",
    email: "chloe.sterling@gmail.com",
    phone: "+44 7700 900444",
    dietary: "Gluten-Free",
    guests: "2",
    appliedAt: "2026-03-25T16:40:00.000Z",
    message: "Excited for the extended worship and prayer night.",
    status: "pending",
  },
  {
    _id: "reg-5",
    event_id: "event-1",
    name: "Nathaniel Mensah",
    email: "nmensah@londonmail.co.uk",
    phone: "+44 7700 900555",
    dietary: "None",
    guests: "4",
    appliedAt: "2026-03-26T11:20:00.000Z",
    message: "Joining for Sunday Communion with our family.",
    status: "confirmed",
  },
];

const registrationsFetcher = async (url: string): Promise<RegistrationData[]> => {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch registrations");
    const data = await res.json();
    if (Array.isArray(data)) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("crc_cached_registrations", JSON.stringify(data));
        } catch {
          // ignore
        }
      }
      return data;
    }
  } catch (err) {
    console.warn("Registrations fetch failed, falling back to cache:", err);
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("crc_cached_registrations");
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

export function useAllRegistrations() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<RegistrationData[]>(
    ALL_REGISTRATIONS_KEY,
    registrationsFetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 1000,
      keepPreviousData: false,
    }
  );

  useEffect(() => {
    const channelId = `realtime-registrations-all-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event_registrations" },
        (payload) => {
          globalMutate(ALL_REGISTRATIONS_KEY);
          const evId = (payload.new as any)?.event_id || (payload.old as any)?.event_id;
          if (evId) {
            globalMutate(`/api/registrations?event_id=${encodeURIComponent(evId)}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    registrations: data ?? [],
    isLoading: isLoading && data === undefined,
    isValidating,
    isError: error,
    mutate,
  };
}

export function useEventRegistrations(eventId: string) {
  const targetId = eventId ? decodeURIComponent(eventId) : "";
  const { data, error, isLoading, isValidating, mutate } = useSWR<RegistrationData[]>(
    targetId ? `/api/registrations?event_id=${encodeURIComponent(targetId)}` : null,
    registrationsFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 8000,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    const channelId = `realtime-registrations-event-${targetId || 'all'}-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event_registrations" },
        (payload) => {
          globalMutate(ALL_REGISTRATIONS_KEY);
          const evId = (payload.new as any)?.event_id || (payload.old as any)?.event_id;
          if (evId) {
            globalMutate(`/api/registrations?event_id=${encodeURIComponent(evId)}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    registrations: data || [],
    isLoading: isLoading && !data,
    isValidating,
    isError: error,
    mutate,
  };
}

// ── Optimistic Add / Update / Delete for Registrations ──
export async function addRegistration(
  eventId: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dietary: string;
    guests: string;
    notes: string;
  }
) {
  const targetId = decodeURIComponent(eventId);
  const newReg: RegistrationData = {
    _id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    event_id: targetId,
    name: `${data.firstName} ${data.lastName}`.trim(),
    email: data.email,
    phone: data.phone || "",
    dietary: data.dietary || "None",
    guests: data.guests || "1",
    appliedAt: new Date().toISOString(),
    message: data.notes || "",
    status: "pending",
  };

  // 1. Optimistic update
  globalMutate(
    ALL_REGISTRATIONS_KEY,
    (current: RegistrationData[] | undefined) => [newReg, ...(current || [])],
    { revalidate: false }
  );

  globalMutate(
    `/api/registrations?event_id=${encodeURIComponent(targetId)}`,
    (current: RegistrationData[] | undefined) => [newReg, ...(current || [])],
    { revalidate: false }
  );

  // 2. Background API call
  try {
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: targetId,
        ...data,
      }),
    });
    if (res.ok) {
      const saved = await res.json();
      globalMutate(ALL_REGISTRATIONS_KEY);
      globalMutate(`/api/registrations?event_id=${encodeURIComponent(targetId)}`);
      return saved;
    }
  } catch (err) {
    console.error("Failed to add registration to API:", err);
  }

  return newReg;
}

export async function updateRegistrationStatus(
  eventId: string,
  regId: string,
  status: RegistrationData["status"]
) {
  const targetId = decodeURIComponent(eventId);

  // 1. Optimistic status update
  globalMutate(
    ALL_REGISTRATIONS_KEY,
    (current: RegistrationData[] | undefined) =>
      (current || []).map((r) => (r._id === regId ? { ...r, status } : r)),
    { revalidate: false }
  );

  globalMutate(
    `/api/registrations?event_id=${encodeURIComponent(targetId)}`,
    (current: RegistrationData[] | undefined) =>
      (current || []).map((r) => (r._id === regId ? { ...r, status } : r)),
    { revalidate: false }
  );

  // 2. Background API update
  try {
    const res = await fetch("/api/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regId, status }),
    });
    if (res.ok) {
      globalMutate(ALL_REGISTRATIONS_KEY);
      globalMutate(`/api/registrations?event_id=${encodeURIComponent(targetId)}`);
    }
  } catch (err) {
    console.error("Failed to update registration status:", err);
  }
}

export async function deleteRegistration(eventId: string, regId: string) {
  const targetId = decodeURIComponent(eventId);

  // 1. Optimistic delete
  globalMutate(
    ALL_REGISTRATIONS_KEY,
    (current: RegistrationData[] | undefined) => (current || []).filter((r) => r._id !== regId),
    { revalidate: false }
  );

  globalMutate(
    `/api/registrations?event_id=${encodeURIComponent(targetId)}`,
    (current: RegistrationData[] | undefined) => (current || []).filter((r) => r._id !== regId),
    { revalidate: false }
  );

  // 2. Background delete
  try {
    const res = await fetch(`/api/registrations?id=${encodeURIComponent(regId)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      globalMutate(ALL_REGISTRATIONS_KEY);
      globalMutate(`/api/registrations?event_id=${encodeURIComponent(targetId)}`);
    }
  } catch (err) {
    console.error("Failed to delete registration:", err);
  }
}
