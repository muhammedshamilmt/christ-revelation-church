"use client";

import useSWR, { mutate as globalMutate } from 'swr';
import { INITIAL_BLOGS } from './mockData';

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: { heading?: string; text: string }[];
  pullQuote?: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  views?: number;
};

export const BLOG_POSTS_KEY = 'blog_posts';

function getStoredBlogPosts(): BlogPost[] {
  if (typeof window === 'undefined') return INITIAL_BLOGS as BlogPost[];
  try {
    const raw = localStorage.getItem('crc_mock_blogs');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_BLOGS as BlogPost[];
}

function saveStoredBlogPosts(posts: BlogPost[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('crc_mock_blogs', JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }
}

export function useAllBlogPosts() {
  const { data, error, isLoading, mutate } = useSWR<BlogPost[]>(
    BLOG_POSTS_KEY,
    async () => getStoredBlogPosts(),
    {
      fallbackData: INITIAL_BLOGS as BlogPost[],
      revalidateOnFocus: false,
    }
  );

  return {
    posts: data || (INITIAL_BLOGS as BlogPost[]),
    isLoading: false,
    isError: error,
    mutate,
  };
}

export async function addBlogPost(post: BlogPost) {
  const list = getStoredBlogPosts();
  const newPost = {
    ...post,
    id: post.id || `blog-${Date.now()}`,
    views: post.views || 0,
  };
  const updated = [newPost, ...list];
  saveStoredBlogPosts(updated);
  globalMutate(BLOG_POSTS_KEY, updated, false);
}

export async function updateBlogPost(id: string, patch: Partial<BlogPost>) {
  const list = getStoredBlogPosts();
  const updated = list.map(p => p.id === id ? { ...p, ...patch } : p);
  saveStoredBlogPosts(updated);
  globalMutate(BLOG_POSTS_KEY, updated, false);
}

export async function deleteBlogPost(id: string) {
  const list = getStoredBlogPosts();
  const updated = list.filter(p => p.id !== id);
  saveStoredBlogPosts(updated);
  globalMutate(BLOG_POSTS_KEY, updated, false);
}
