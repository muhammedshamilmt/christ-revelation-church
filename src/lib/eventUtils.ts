import type { AdminEvent } from "@/components/admin/events/EventForm";

export type EventDbRow = {
  id: string;
  title: string;
  subtitle: string | null;
  type: string;
  date: string | null;
  time: string | null;
  location: string | null;
  capacity: string | null;
  accessibility: string | null;
  price: string | null;
  status: "Upcoming" | "Open" | "Closing" | "Past";
  images: string[] | null;
  description: string[] | null;
  perfect_for: string[] | null;
  agenda: { time: string; title: string; desc: string }[] | null;
  highlights: string[] | null;
  host: { name: string; role: string; image: string } | null;
  views: number;
  created_at: string;
  updated_at?: string;
};

export function mapDbRowToAdminEvent(row: any): AdminEvent {
  return {
    id: row.id,
    title: row.title || "",
    subtitle: row.subtitle || "",
    type: row.type || "GENERAL",
    date: row.date || "",
    time: row.time || "",
    location: row.location || "",
    capacity: row.capacity || "",
    accessibility: row.accessibility || "",
    price: row.price || "Free",
    status: (row.status as AdminEvent["status"]) || "Open",
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : ["/images/hero-bg.png"],
    description: Array.isArray(row.description) ? row.description : [row.description || ""],
    perfectFor: Array.isArray(row.perfect_for)
      ? row.perfect_for
      : Array.isArray(row.perfectFor)
      ? row.perfectFor
      : [],
    agenda: Array.isArray(row.agenda) ? row.agenda : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    host: row.host && typeof row.host === "object"
      ? {
          name: row.host.name || "Pastor David Vance",
          role: row.host.role || "Host",
          image: row.host.image || "/images/hero-bg.png",
        }
      : {
          name: "Pastor David Vance",
          role: "Host",
          image: "/images/hero-bg.png",
        },
    views: Number(row.views || 0),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapAdminEventToDbRow(event: AdminEvent | Partial<AdminEvent>) {
  const row: Record<string, any> = {};
  if (event.id !== undefined) row.id = event.id;
  if (event.title !== undefined) row.title = event.title;
  if (event.subtitle !== undefined) row.subtitle = event.subtitle;
  if (event.type !== undefined) row.type = event.type;
  if (event.date !== undefined) row.date = event.date;
  if (event.time !== undefined) row.time = event.time;
  if (event.location !== undefined) row.location = event.location;
  if (event.capacity !== undefined) row.capacity = event.capacity;
  if (event.accessibility !== undefined) row.accessibility = event.accessibility;
  if (event.price !== undefined) row.price = event.price;
  if (event.status !== undefined) row.status = event.status;
  if (event.images !== undefined) row.images = event.images;
  if (event.description !== undefined) row.description = event.description;
  if ((event as any).perfect_for !== undefined) {
    row.perfect_for = (event as any).perfect_for;
  } else if (event.perfectFor !== undefined) {
    row.perfect_for = event.perfectFor;
  }
  if (event.agenda !== undefined) row.agenda = event.agenda;
  if (event.highlights !== undefined) row.highlights = event.highlights;
  if (event.host !== undefined) row.host = event.host;
  if (event.views !== undefined) row.views = event.views;
  if (event.createdAt !== undefined) row.created_at = event.createdAt;
  row.updated_at = new Date().toISOString();
  return row;
}
