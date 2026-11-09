"use client";

import { useEffect } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import {
  GALLERY_ITEMS,
  GalleryItem,
  GalleryMediaType,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_VIDEO_EXTENSIONS,
  MAX_IMAGE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
} from "./gallery";
import { supabase } from "./supabase";
import { mapDbRowToGalleryItem } from "./galleryUtils";

export const GALLERY_KEY = "/api/gallery";
const STORAGE_KEY = "crc_cached_gallery_v2";
const IDB_NAME = "crc_gallery_media_db";
const IDB_STORE = "media_blobs";

// In-memory cache for Object URLs to prevent jitter
const objectUrlCache = new Map<string, string>();

export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export function getFileExtension(fileName: string): string {
  const idx = fileName.lastIndexOf(".");
  if (idx === -1) return "";
  return fileName.slice(idx).toLowerCase();
}

export interface FileValidationResult {
  valid: boolean;
  mediaType?: GalleryMediaType;
  extension?: string;
  error?: string;
}

/**
 * Validates an uploaded file for allowed image/video formats and size limits:
 * - Images (.png, .jpg, .jpeg, .svg, .webp, .gif, .avif): up to 5 MB
 * - Videos (.mp4, .mkv, .webm, .mov, .avi, .m4v): up to 50 MB
 */
export function validateGalleryFile(
  file: File,
  expectedMediaType?: GalleryMediaType
): FileValidationResult {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  if (file.size === 0) {
    return { valid: false, error: "The selected file is empty (0 bytes)." };
  }

  const ext = getFileExtension(file.name);
  const mime = (file.type || "").toLowerCase();

  const isImageExt = (ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(ext);
  const isVideoExt = (ALLOWED_VIDEO_EXTENSIONS as readonly string[]).includes(ext);

  const isImageMime =
    mime.startsWith("image/") &&
    (mime.includes("png") ||
      mime.includes("jpeg") ||
      mime.includes("jpg") ||
      mime.includes("webp") ||
      mime.includes("gif") ||
      mime.includes("avif"));

  const isVideoMime =
    mime.startsWith("video/") ||
    mime === "application/x-matroska" ||
    isVideoExt;

  const detectedType: GalleryMediaType | null =
    isImageExt || (isImageMime && !isVideoExt)
      ? "image"
      : isVideoExt || (isVideoMime && !isImageExt)
      ? "video"
      : null;

  if (!detectedType) {
    return {
      valid: false,
      extension: ext || undefined,
      error: `Unsupported file format "${ext || file.name}". Allowed images: ${ALLOWED_IMAGE_EXTENSIONS.join(
        ", "
      )}. Allowed videos: ${ALLOWED_VIDEO_EXTENSIONS.join(", ")}.`,
    };
  }

  if (expectedMediaType && detectedType !== expectedMediaType) {
    return {
      valid: false,
      mediaType: detectedType,
      extension: ext,
      error:
        expectedMediaType === "image"
          ? `"${file.name}" is a video file (${ext}). Please switch Media Type to "Video" or select an image (${ALLOWED_IMAGE_EXTENSIONS.join(", ")}).`
          : `"${file.name}" is an image file (${ext}). Please switch Media Type to "Image" or select a video (${ALLOWED_VIDEO_EXTENSIONS.join(", ")}).`,
    };
  }

  if (detectedType === "image" && !isImageExt) {
    return {
      valid: false,
      mediaType: "image",
      extension: ext,
      error: `Invalid image extension "${ext}". Supported image formats: ${ALLOWED_IMAGE_EXTENSIONS.join(", ")}.`,
    };
  }

  if (detectedType === "video" && !isVideoExt) {
    return {
      valid: false,
      mediaType: "video",
      extension: ext,
      error: `Invalid video extension "${ext}". Supported video formats: ${ALLOWED_VIDEO_EXTENSIONS.join(", ")}.`,
    };
  }

  // Size validation: Image <= 5 MB, Video <= 50 MB
  if (detectedType === "image" && file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      mediaType: "image",
      extension: ext,
      error: `Image size (${formatFileSize(file.size)}) exceeds the 5 MB maximum limit. Please choose an image up to 5 MB.`,
    };
  }

  if (detectedType === "video" && file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      mediaType: "video",
      extension: ext,
      error: `Video size (${formatFileSize(file.size)}) exceeds the 50 MB maximum limit. Please choose a video up to 50 MB.`,
    };
  }

  return {
    valid: true,
    mediaType: detectedType,
    extension: ext,
  };
}

// ── IndexedDB Helpers for legacy/offline blob handling ──

function openMediaDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve(null);
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
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveMediaBlobToIDB(key: string, blob: Blob): Promise<string> {
  const url = URL.createObjectURL(blob);
  objectUrlCache.set(key, url);

  const db = await openMediaDB();
  if (db) {
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(blob, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
  return `idb://${key}`;
}

export async function resolveIDBUrl(ref?: string): Promise<string | undefined> {
  if (!ref || !ref.startsWith("idb://")) return ref;
  const key = ref.slice("idb://".length);
  if (objectUrlCache.has(key)) {
    return objectUrlCache.get(key)!;
  }

  const db = await openMediaDB();
  if (!db) return undefined;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => {
        if (req.result instanceof Blob) {
          const objUrl = URL.createObjectURL(req.result);
          objectUrlCache.set(key, objUrl);
          resolve(objUrl);
        } else {
          resolve(undefined);
        }
      };
      req.onerror = () => resolve(undefined);
    } catch {
      resolve(undefined);
    }
  });
}

export async function deleteMediaBlobFromIDB(key: string): Promise<void> {
  const cached = objectUrlCache.get(key);
  if (cached) {
    URL.revokeObjectURL(cached);
    objectUrlCache.delete(key);
  }
  const db = await openMediaDB();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Uploads media (images up to 5MB, videos up to 50MB) directly to the Supabase Storage bucket 'gallery'.
 * Returns the CDN public URL and metadata.
 */
export async function uploadGalleryMediaToSupabase(
  file: File,
  itemId: string,
  prefix: "media" | "thumb" = "media"
): Promise<{ publicUrl: string; fileName: string; fileSize: number; mimeType: string }> {
  const ext = getFileExtension(file.name) || (file.type.startsWith("image/") ? ".jpg" : ".mp4");
  const cleanBase = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const filePath = `${prefix}/${itemId}-${Date.now()}-${cleanBase}${ext}`;

  const { data, error } = await supabase.storage.from("gallery").upload(filePath, file, {
    cacheControl: "31536000",
    upsert: true,
    contentType: file.type || (ext === ".mp4" ? "video/mp4" : "image/jpeg"),
  });

  if (error) {
    console.error("Supabase Storage upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: pubData } = supabase.storage.from("gallery").getPublicUrl(filePath);

  return {
    publicUrl: pubData.publicUrl,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || "",
  };
}

/**
 * Extracts a thumbnail Data URL and aspect ratio from a video File if supported by the browser.
 */
export function extractVideoMetadata(
  file: File
): Promise<{ thumbnailDataUrl?: string; aspectRatio: "wide" | "tall" | "square" }> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const tempUrl = URL.createObjectURL(file);
    let settled = false;

    const finish = (result: { thumbnailDataUrl?: string; aspectRatio: "wide" | "tall" | "square" }) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(tempUrl);
      resolve(result);
    };

    const timeout = setTimeout(() => {
      finish({ aspectRatio: "wide" });
    }, 3500);

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      const seekTo = Math.min(1, (video.duration || 0) * 0.25);
      try {
        video.currentTime = seekTo;
      } catch {
        clearTimeout(timeout);
        finish({ aspectRatio: "wide" });
      }
    };

    video.onseeked = () => {
      clearTimeout(timeout);
      try {
        const w = video.videoWidth || 1280;
        const h = video.videoHeight || 720;
        const ratio = w / h;
        const aspectRatio: "wide" | "tall" | "square" =
          ratio > 1.15 ? "wide" : ratio < 0.85 ? "tall" : "square";

        const canvas = document.createElement("canvas");
        const maxDim = 640;
        const scale = Math.min(1, maxDim / Math.max(w, h));
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
          finish({ thumbnailDataUrl: dataUrl, aspectRatio });
          return;
        }
        finish({ aspectRatio });
      } catch {
        finish({ aspectRatio: "wide" });
      }
    };

    video.onerror = () => {
      clearTimeout(timeout);
      finish({ aspectRatio: "wide" });
    };

    video.src = tempUrl;
  });
}

export function extractImageAspectRatio(
  file: File
): Promise<"wide" | "tall" | "square"> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const tempUrl = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = (img.naturalWidth || 1) / (img.naturalHeight || 1);
      URL.revokeObjectURL(tempUrl);
      if (ratio > 1.15) resolve("wide");
      else if (ratio < 0.85) resolve("tall");
      else resolve("square");
    };
    img.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      resolve("wide");
    };
    img.src = tempUrl;
  });
}

export function normalizeGalleryItem(raw: any): GalleryItem {
  return mapDbRowToGalleryItem(raw);
}

// Clear legacy mock caches so old deleted data never haunts the browser
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("crc_mock_gallery");
  } catch {}
}

// Global cached fetcher for SWR
const galleryFetcher = async (url: string): Promise<GalleryItem[]> => {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {
          // ignore storage quota error
        }
      }
      return data.map(normalizeGalleryItem);
    }
  } catch (err) {
    console.warn("Gallery API fetch failed, trying local cache...", err);
    // Only fall back to local storage if network completely failed (offline)
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            return parsed.map(normalizeGalleryItem);
          }
        }
      } catch {
        // ignore
      }
    }
  }

  return [];
};

export function useGallery() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<GalleryItem[]>(
    GALLERY_KEY,
    galleryFetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 1000,
      keepPreviousData: false,
    }
  );

  // Real-time synchronization without page reload
  useEffect(() => {
    const channelId = `realtime-gallery-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gallery" },
        () => {
          globalMutate(GALLERY_KEY);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    items: data ?? [],
    isLoading: isLoading && data === undefined,
    isValidating,
    isError: error,
    mutate,
  };
}

export async function addGalleryItem(item: GalleryItem): Promise<GalleryItem> {
  const normalized = normalizeGalleryItem({
    ...item,
    id: item.id?.trim() || `gal-${Date.now()}`,
  });

  // 1. Optimistic update
  globalMutate(
    GALLERY_KEY,
    (current: GalleryItem[] | undefined) => {
      const list = current || [];
      return [normalized, ...list.filter((i) => i.id !== normalized.id)];
    },
    { revalidate: false }
  );

  // 2. Persist to API
  try {
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalized),
    });

    if (!res.ok) {
      throw new Error(`Failed to create gallery item (${res.status})`);
    }

    const saved = await res.json();
    globalMutate(GALLERY_KEY);
    return saved;
  } catch (err) {
    console.error("Failed to add gallery item:", err);
    globalMutate(GALLERY_KEY);
    throw err;
  }
}

export async function updateGalleryItem(id: string, patch: Partial<GalleryItem>): Promise<GalleryItem | undefined> {
  // 1. Optimistic update
  globalMutate(
    GALLERY_KEY,
    (current: GalleryItem[] | undefined) => {
      const list = current || [];
      return list.map((item) =>
        item.id === id ? normalizeGalleryItem({ ...item, ...patch }) : item
      );
    },
    { revalidate: false }
  );

  // 2. Persist to API
  try {
    const res = await fetch(`/api/gallery/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    if (!res.ok) {
      throw new Error(`Failed to update gallery item (${res.status})`);
    }

    const updated = await res.json();
    globalMutate(GALLERY_KEY);
    return updated;
  } catch (err) {
    console.error("Failed to update gallery item:", err);
    globalMutate(GALLERY_KEY);
    throw err;
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  // 1. Optimistic removal
  globalMutate(
    GALLERY_KEY,
    (current: GalleryItem[] | undefined) => {
      const list = current || [];
      return list.filter((item) => item.id !== id);
    },
    { revalidate: false }
  );

  // 2. Delete from API & Storage
  try {
    const res = await fetch(`/api/gallery/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Failed to delete gallery item (${res.status})`);
    }

    globalMutate(GALLERY_KEY);
  } catch (err) {
    console.error("Failed to delete gallery item:", err);
    globalMutate(GALLERY_KEY);
    throw err;
  }
}
