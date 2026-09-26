"use client";

import useSWR, { mutate as globalMutate } from 'swr';

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

const INITIAL_REGISTRATIONS: RegistrationData[] = [
  {
    _id: "reg-1",
    event_id: "event-1",
    name: "Arthur Pendelton",
    email: "a.pendelton@outlook.com",
    phone: "+44 7700 900111",
    dietary: "None",
    guests: "2",
    appliedAt: "2026-03-22T10:00:00.000Z",
    message: "Looking forward to Sunday communion!",
    status: "confirmed"
  },
  {
    _id: "reg-2",
    event_id: "event-1",
    name: "Evelyn Wright",
    email: "evelyn.wright@nhs.net",
    phone: "+44 7700 900222",
    dietary: "Vegetarian",
    guests: "1",
    appliedAt: "2026-03-23T14:30:00.000Z",
    message: "First time visiting your sanctuary.",
    status: "confirmed"
  },
  {
    _id: "reg-3",
    event_id: "event-2",
    name: "Daniel Foster",
    email: "dfoster@techcorp.co.uk",
    phone: "+44 7700 900333",
    dietary: "None",
    guests: "3",
    appliedAt: "2026-03-24T09:15:00.000Z",
    message: "Bringing my family for the worship night.",
    status: "pending"
  }
];

function getStoredRegistrations(): RegistrationData[] {
  if (typeof window === 'undefined') return INITIAL_REGISTRATIONS;
  try {
    const raw = localStorage.getItem('crc_mock_registrations');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_REGISTRATIONS;
}

function saveStoredRegistrations(regs: RegistrationData[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('crc_mock_registrations', JSON.stringify(regs));
    } catch (e) {
      console.error(e);
    }
  }
}

export function useEventRegistrations(eventId: string) {
  const { data, error, isLoading, mutate } = useSWR<RegistrationData[]>(
    eventId ? `registrations/${eventId}` : null,
    async () => {
      const list = getStoredRegistrations();
      return list.filter(r => r.event_id === eventId);
    },
    { revalidateOnFocus: false }
  );

  return {
    registrations: data || [],
    isLoading: false,
    isError: error,
    mutate,
  };
}

export async function addRegistration(eventId: string, data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dietary: string;
  guests: string;
  notes: string;
}) {
  const list = getStoredRegistrations();
  const newReg: RegistrationData = {
    _id: `reg-${Date.now()}`,
    event_id: eventId,
    name: `${data.firstName} ${data.lastName}`.trim(),
    email: data.email,
    phone: data.phone || '',
    dietary: data.dietary || 'None',
    guests: data.guests || '1',
    appliedAt: new Date().toISOString(),
    message: data.notes || '',
    status: 'pending'
  };

  const updated = [newReg, ...list];
  saveStoredRegistrations(updated);
  globalMutate(`registrations/${eventId}`, updated.filter(r => r.event_id === eventId), false);
  return newReg;
}
