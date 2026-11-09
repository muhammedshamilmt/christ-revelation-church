/**
 * Centralized Zod validation schemas and sanitization helpers for all API routes.
 * Server-side security boundary ensuring data integrity and preventing injection attacks.
 */
import { z } from 'zod';
import { validateMediaUrl } from './fileSecurity';

// ── Sanitization & Common Helpers ─────────────────────────────

/** Strip potential HTML tags and script injections from user input */
export function sanitizeText(val: string): string {
  if (!val || typeof val !== 'string') return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim();
}

// ── Primitives ────────────────────────────────────────────────

const safeString = (min = 1, max = 500) =>
  z.string()
    .min(min, `Minimum ${min} characters required`)
    .max(max, `Maximum ${max} characters allowed`)
    .transform(sanitizeText);

const email = z
  .string()
  .email('Please enter a valid email address')
  .max(254, 'Email is too long')
  .transform(v => v.trim().toLowerCase());

const phone = z
  .string()
  .max(35, 'Phone number too long')
  .optional()
  .nullable()
  .transform(v => (v ? sanitizeText(v) : undefined));

const mediaUrl = z.string().refine(val => validateMediaUrl(val).valid, {
  message: 'Invalid or insecure media URL',
});

// ── Auth Schemas ──────────────────────────────────────────────

export const verifyEmailSchema = z.object({
  email,
});

// ── Prayer Request Schemas ────────────────────────────────────

export const prayerRequestSchema = z.object({
  id: z.string().optional(),
  firstName: safeString(1, 60),
  lastName: safeString(1, 60),
  email,
  phone,
  category: z.string().max(80).optional().default('General'),
  request: safeString(3, 3000),
  isPrivate: z.boolean().optional().default(false),
  isUrgent: z.boolean().optional().default(false),
  status: z.enum(['New', 'Praying', 'Answered', 'Followed Up']).optional().default('New'),
  createdAt: z.string().optional(),
});

// ── Contact Us Schemas ────────────────────────────────────────

export const contactSchema = z.object({
  id: z.string().optional(),
  name: safeString(1, 100),
  email,
  phone,
  subject: safeString(1, 200).optional().default('General Inquiry'),
  message: safeString(3, 4000),
  status: z.enum(['new', 'read', 'archived', 'replied']).optional().default('new'),
});

// ── Newsletter Subscription Schemas ───────────────────────────

export const subscriberSchema = z.object({
  email,
});

// ── Event Registration Schemas ────────────────────────────────

export const eventRegistrationSchema = z.object({
  id: z.string().optional(),
  eventId: z.string().min(1, 'Event ID is required').max(100),
  fullName: safeString(1, 100),
  email,
  phone,
  ticketsCount: z.number().int().min(1, 'At least 1 ticket required').max(20, 'Maximum 20 tickets allowed').default(1),
  notes: z.string().max(1000).optional().transform(v => (v ? sanitizeText(v) : undefined)),
  status: z.enum(['confirmed', 'pending', 'cancelled']).optional().default('confirmed'),
});

// ── Gallery Schemas ───────────────────────────────────────────

export const galleryItemSchema = z.object({
  id: z.string().optional(),
  title: safeString(1, 200),
  mediaType: z.enum(['image', 'video']),
  url: mediaUrl,
  thumbnailUrl: z.string().optional().refine(val => !val || validateMediaUrl(val).valid, {
    message: 'Invalid thumbnail URL',
  }),
  category: z.string().max(80).optional().default('General'),
  description: z.string().max(2500).optional().transform(v => (v ? sanitizeText(v) : '')),
  date: z.string().max(50).optional(),
  location: z.string().max(150).optional().transform(v => (v ? sanitizeText(v) : '')),
});

// ── Blog Post Schemas ─────────────────────────────────────────

export const blogPostSchema = z.object({
  id: z.string().optional(),
  title: safeString(1, 250),
  slug: z.string().max(250).optional(),
  excerpt: z.string().max(1000).optional().transform(v => (v ? sanitizeText(v) : '')),
  content: z.string().min(1, 'Content is required').max(100000),
  author: safeString(1, 100).optional().default('Christ Revelation Church'),
  category: safeString(1, 80).optional().default('Faith'),
  coverImage: z.string().optional().refine(val => !val || validateMediaUrl(val).valid, {
    message: 'Invalid cover image URL',
  }),
  tags: z.array(z.string().max(40)).max(20).optional().default([]),
  status: z.enum(['published', 'draft', 'archived']).optional().default('published'),
  readTime: z.string().max(30).optional(),
  views: z.number().int().min(0).optional().default(0),
});

// ── Event Schemas ─────────────────────────────────────────────

export const eventSchema = z.object({
  id: z.string().optional(),
  title: safeString(1, 250),
  date: z.string().min(1, 'Date is required').max(80),
  time: z.string().max(80).optional(),
  location: safeString(1, 200).optional().default('Main Sanctuary'),
  description: z.string().max(15000).optional().transform(v => (v ? sanitizeText(v) : '')),
  category: safeString(1, 80).optional().default('Service'),
  imageUrl: z.string().optional().refine(val => !val || validateMediaUrl(val).valid, {
    message: 'Invalid image URL',
  }),
  capacity: z.number().int().min(0).max(50000).optional().default(500),
  featured: z.boolean().optional().default(false),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).optional().default('upcoming'),
});
