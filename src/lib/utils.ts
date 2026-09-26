import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns true if src is a valid string for Next.js <Image> —
 * either a relative path starting with "/" or an absolute http/https URL.
 */
export function isValidImageSrc(src: unknown): src is string {
  if (!src || typeof src !== "string") return false;
  const s = src.trim();
  if (!s) return false;
  // Relative path (e.g. /images/photo.jpg)
  if (s.startsWith("/")) return true;
  // Absolute URL
  try {
    const url = new URL(s);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
