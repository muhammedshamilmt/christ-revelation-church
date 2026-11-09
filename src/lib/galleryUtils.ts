import type { GalleryItem, GalleryMediaType } from "@/lib/gallery";

export type GalleryDbRow = {
  id: string;
  title: string;
  category: string;
  media_type: string;
  image_url: string;
  video_url?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  date: string;
  location?: string | null;
  description: string;
  aspect_ratio?: string | null;
  featured?: boolean | null;
  created_at: string;
  updated_at?: string | null;
};

export function mapDbRowToGalleryItem(row: any): GalleryItem {
  return {
    id: String(row.id || `gal-${Date.now()}`),
    title: row.title || "Untitled Moment",
    category: (row.category as GalleryItem["category"]) || "Worship",
    mediaType: (row.media_type || row.mediaType || "image") as GalleryMediaType,
    imageUrl:
      row.image_url ||
      row.imageUrl ||
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3562-scaled.jpeg",
    videoUrl: row.video_url || row.videoUrl || undefined,
    fileName: row.file_name || row.fileName || undefined,
    fileSize: typeof row.file_size === "number" ? row.file_size : typeof row.fileSize === "number" ? row.fileSize : undefined,
    mimeType: row.mime_type || row.mimeType || undefined,
    date: row.date || "December 2025",
    location: row.location || "Main Sanctuary",
    description: row.description || "",
    aspectRatio: (row.aspect_ratio || row.aspectRatio || "wide") as "tall" | "wide" | "square",
    featured: Boolean(row.featured),
  };
}

export function mapGalleryItemToDbRow(item: Partial<GalleryItem>): Record<string, any> {
  const row: Record<string, any> = {};

  if (item.id !== undefined) row.id = item.id;
  if (item.title !== undefined) row.title = item.title;
  if (item.category !== undefined) row.category = item.category;

  if (item.mediaType !== undefined) {
    row.media_type = item.mediaType;
  } else if ((item as any).media_type !== undefined) {
    row.media_type = (item as any).media_type;
  }

  if (item.imageUrl !== undefined) {
    row.image_url = item.imageUrl;
  } else if ((item as any).image_url !== undefined) {
    row.image_url = (item as any).image_url;
  }

  if (item.videoUrl !== undefined) {
    row.video_url = item.videoUrl;
  } else if ((item as any).video_url !== undefined) {
    row.video_url = (item as any).video_url;
  }

  if (item.fileName !== undefined) {
    row.file_name = item.fileName;
  } else if ((item as any).file_name !== undefined) {
    row.file_name = (item as any).file_name;
  }

  if (item.fileSize !== undefined) {
    row.file_size = item.fileSize;
  } else if ((item as any).file_size !== undefined) {
    row.file_size = (item as any).file_size;
  }

  if (item.mimeType !== undefined) {
    row.mime_type = item.mimeType;
  } else if ((item as any).mime_type !== undefined) {
    row.mime_type = (item as any).mime_type;
  }

  if (item.date !== undefined) row.date = item.date;
  if (item.location !== undefined) row.location = item.location;
  if (item.description !== undefined) row.description = item.description;

  if (item.aspectRatio !== undefined) {
    row.aspect_ratio = item.aspectRatio;
  } else if ((item as any).aspect_ratio !== undefined) {
    row.aspect_ratio = (item as any).aspect_ratio;
  }

  if (item.featured !== undefined) row.featured = item.featured;

  row.updated_at = new Date().toISOString();
  return row;
}

