import type { PrayerRequestItem, PrayerRequestStatus } from "./usePrayerRequests";

export function mapDbRowToPrayerRequest(row: any): PrayerRequestItem {
  return {
    id: String(row.id),
    category: row.category || "Other",
    title: row.title || "",
    firstName: row.first_name || row.firstName || "",
    lastName: row.last_name || row.lastName || "",
    email: row.email || "",
    street: row.street || "",
    apt: row.apt || "",
    city: row.city || "",
    state: row.state || "",
    zip: row.zip || "",
    country: row.country || "",
    request: row.request || "",
    contactPreference: (row.contact_preference || row.contactPreference || "no") as "yes" | "no",
    isConfidential: Boolean(row.is_confidential ?? row.isConfidential),
    status: (row.status || "New") as PrayerRequestStatus,
    notes: row.notes || "",
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapPrayerRequestToDbRow(item: Partial<PrayerRequestItem>) {
  const row: Record<string, any> = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.category !== undefined) row.category = item.category;
  if (item.title !== undefined) row.title = item.title;
  if (item.firstName !== undefined) row.first_name = item.firstName;
  if ((item as any).first_name !== undefined) row.first_name = (item as any).first_name;
  if (item.lastName !== undefined) row.last_name = item.lastName;
  if ((item as any).last_name !== undefined) row.last_name = (item as any).last_name;
  if (item.email !== undefined) row.email = item.email;
  if (item.street !== undefined) row.street = item.street;
  if (item.apt !== undefined) row.apt = item.apt;
  if (item.city !== undefined) row.city = item.city;
  if (item.state !== undefined) row.state = item.state;
  if (item.zip !== undefined) row.zip = item.zip;
  if (item.country !== undefined) row.country = item.country;
  if (item.request !== undefined) row.request = item.request;
  if (item.contactPreference !== undefined) row.contact_preference = item.contactPreference;
  if ((item as any).contact_preference !== undefined) row.contact_preference = (item as any).contact_preference;
  if (item.isConfidential !== undefined) row.is_confidential = item.isConfidential;
  if ((item as any).is_confidential !== undefined) row.is_confidential = (item as any).is_confidential;
  if (item.status !== undefined) row.status = item.status;
  if (item.notes !== undefined) row.notes = item.notes;
  if (item.createdAt !== undefined) row.created_at = item.createdAt;
  row.updated_at = new Date().toISOString();
  return row;
}
