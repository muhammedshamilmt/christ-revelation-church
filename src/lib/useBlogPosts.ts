"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { INITIAL_BLOGS } from "./mockData";
import { saveMediaBlobToIDB } from "./useGallery";
import { mapDbRowToBlogPost } from "./blogUtils";
import { supabase } from "./supabase";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: { heading?: string; text: string; image?: string; videoEmbedUrl?: string }[];
  pullQuote?: string;
  category: string;
  tags: string[];
  status?: "Published" | "Draft";
  date: string;
  readTime: string;
  image: string;
  fileName?: string;
  fileSize?: number;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio?: string;
  };
  views?: number;
  createdAt?: string;
};

export const BLOG_CATEGORIES = [
  "Faith",
  "Outreach",
  "Spiritual Growth",
  "Community",
  "Discipleship",
  "Family & Marriage",
  "Testimonies",
] as const;

export const BLOG_POSTS_KEY = "/api/blogs";
const IDB_NAME = "crc_gallery_media_db";
const IDB_STORE = "media_blobs";
const blogObjectUrlCache = new Map<string, string>();

async function resolveBlogIDBUrl(ref?: string): Promise<string | undefined> {
  if (!ref || !ref.startsWith("idb://")) return ref;
  const key = ref.slice("idb://".length);
  if (blogObjectUrlCache.has(key)) {
    return blogObjectUrlCache.get(key)!;
  }
  if (typeof window === "undefined" || !("indexedDB" in window)) return undefined;

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
        try {
          const tx = db.transaction(IDB_STORE, "readonly");
          const getReq = tx.objectStore(IDB_STORE).get(key);
          getReq.onsuccess = () => {
            if (getReq.result instanceof Blob) {
              const url = URL.createObjectURL(getReq.result);
              blogObjectUrlCache.set(key, url);
              resolve(url);
            } else {
              resolve(undefined);
            }
          };
          getReq.onerror = () => resolve(undefined);
        } catch {
          resolve(undefined);
        }
      };
      req.onerror = () => resolve(undefined);
    } catch {
      resolve(undefined);
    }
  });
}

export { saveMediaBlobToIDB };

async function hydrateBlogPosts(posts: BlogPost[]): Promise<BlogPost[]> {
  return Promise.all(
    posts.map(async (post) => {
      const resolvedImage = await resolveBlogIDBUrl(post.image);
      const resolvedAvatar = await resolveBlogIDBUrl(post.author.avatar);
      return {
        ...post,
        image: resolvedImage || "/images/hero-bg.png",
        author: {
          ...post.author,
          avatar: resolvedAvatar || "",
        },
      };
    })
  );
}

const blogsFetcher = async (url: string): Promise<BlogPost[]> => {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch blogs");
    const data = await res.json();
    if (Array.isArray(data)) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("crc_cached_blogs", JSON.stringify(data));
        } catch {
          // ignore
        }
      }
      return hydrateBlogPosts(data);
    }
  } catch (err) {
    console.warn("API blogs fetch error, checking cache:", err);
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("crc_cached_blogs");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            return hydrateBlogPosts(parsed);
          }
        }
      } catch {
        // ignore
      }
    }
  }

  return [];
};

export function useAllBlogPosts() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<BlogPost[]>(
    BLOG_POSTS_KEY,
    blogsFetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 1000,
      keepPreviousData: false,
    }
  );

  useEffect(() => {
    const channelId = `realtime-blogs-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blogs" },
        () => {
          globalMutate(BLOG_POSTS_KEY);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    posts: data ?? [],
    isLoading: isLoading && data === undefined,
    isValidating,
    isError: error,
    mutate,
  };
}

export function findBlogPostById(posts: BlogPost[], id: string): BlogPost | undefined {
  const targetId = decodeURIComponent(id).trim();
  const aliasMap: Record<string, string> = {
    "blog-1": "worship-opens-doors",
    "1": "worship-opens-doors",
    "blog-2": "prayer-is-the-key",
    "2": "prayer-is-the-key",
    "blog-3": "christmas-music-festival",
    "3": "christmas-music-festival",
    "blog-4": "our-story-and-mission",
    "4": "our-story-and-mission",
  };
  const mappedId = aliasMap[targetId] || targetId;
  return (
    posts.find((p) => p.id === targetId) ||
    posts.find((p) => p.id === mappedId) ||
    posts.find((p) => p.id === `blog-${targetId}`) ||
    posts.find((p) => p.id.replace(/^blog-/, "") === targetId) ||
    posts.find((p) => p.id === id)
  );
}

export function useBlogPost(id: string) {
  const [hydratedPost, setHydratedPost] = useState<BlogPost | null>(null);
  const targetId = id ? decodeURIComponent(id) : "";

  const { data, error, isLoading, isValidating, mutate } = useSWR<BlogPost | null>(
    targetId ? `/api/blogs/${encodeURIComponent(targetId)}` : null,
    async (url: string) => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const item = await res.json();
          const [hydrated] = await hydrateBlogPosts([item]);
          return hydrated;
        }
      } catch (err) {
        console.warn("Single blog fetch failed, falling back to cache:", err);
      }

      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("crc_cached_blogs");
          if (cached) {
            const list: BlogPost[] = JSON.parse(cached);
            const found = findBlogPostById(list, targetId);
            if (found) {
              const [hydrated] = await hydrateBlogPosts([found]);
              return hydrated;
            }
          }
        } catch {
          // ignore
        }
      }

      const initialList = (INITIAL_BLOGS as any[]).map(mapDbRowToBlogPost);
      const found = findBlogPostById(initialList, targetId);
      if (found) {
        const [hydrated] = await hydrateBlogPosts([found]);
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
      setHydratedPost(data);
    }
  }, [data]);

  useEffect(() => {
    if (!targetId) return;
    const channelId = `realtime-blog-${targetId}-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blogs", filter: `id=eq.${targetId}` },
        () => {
          globalMutate(`/api/blogs/${encodeURIComponent(targetId)}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [targetId]);

  return {
    post: hydratedPost ?? data ?? null,
    isLoading: isLoading && !hydratedPost && !data,
    isValidating,
    isError: error,
    mutate,
  };
}

// ── Optimistic Mutations (Zero Latency + Fast Background Sync) ──
export async function addBlogPost(post: BlogPost) {
  const newPost: BlogPost = {
    ...post,
    id: post.id?.trim() || `blog-${Date.now()}`,
    views: post.views || 0,
    createdAt: post.createdAt || new Date().toISOString(),
  };

  // 1. Optimistic cache update
  globalMutate(
    BLOG_POSTS_KEY,
    (current: BlogPost[] | undefined) => [newPost, ...(current || []).filter((p) => p.id !== newPost.id)],
    { revalidate: false }
  );

  // 2. Background API persistence
  try {
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
    if (res.ok) {
      const saved = await res.json();
      globalMutate(BLOG_POSTS_KEY);
      return saved;
    }
  } catch (err) {
    console.error("Failed to add blog post to API:", err);
  }

  return newPost;
}

export async function updateBlogPost(id: string, patch: Partial<BlogPost>) {
  const targetId = decodeURIComponent(id);

  // 1. Optimistic cache update
  globalMutate(
    BLOG_POSTS_KEY,
    (current: BlogPost[] | undefined) =>
      (current || []).map((p) => (p.id === targetId || p.id === id ? { ...p, ...patch } : p)),
    { revalidate: false }
  );

  globalMutate(
    `/api/blogs/${encodeURIComponent(targetId)}`,
    (current: BlogPost | null | undefined) => (current ? { ...current, ...patch } : null),
    { revalidate: false }
  );

  // 2. Background API update
  try {
    const res = await fetch(`/api/blogs/${encodeURIComponent(targetId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      globalMutate(BLOG_POSTS_KEY);
      globalMutate(`/api/blogs/${encodeURIComponent(targetId)}`);
    }
  } catch (err) {
    console.error("Failed to update blog post in API:", err);
  }
}

export async function deleteBlogPost(id: string) {
  const targetId = decodeURIComponent(id);

  // 1. Optimistic cache deletion
  globalMutate(
    BLOG_POSTS_KEY,
    (current: BlogPost[] | undefined) =>
      (current || []).filter((p) => p.id !== targetId && p.id !== id),
    { revalidate: false }
  );

  // 2. Background API deletion
  try {
    const res = await fetch(`/api/blogs/${encodeURIComponent(targetId)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      globalMutate(BLOG_POSTS_KEY);
    }
  } catch (err) {
    console.error("Failed to delete blog post from API:", err);
  }
}

export async function incrementBlogViews(id: string) {
  const targetId = decodeURIComponent(id);

  // Optimistic increment
  globalMutate(
    BLOG_POSTS_KEY,
    (current: BlogPost[] | undefined) =>
      (current || []).map((p) =>
        p.id === targetId || p.id === id ? { ...p, views: (p.views || 0) + 1 } : p
      ),
    { revalidate: false }
  );

  // Background atomic counter
  try {
    fetch(`/api/blogs/${encodeURIComponent(targetId)}/view`, {
      method: "POST",
    }).catch(() => {});
  } catch {
    // ignore
  }
}
