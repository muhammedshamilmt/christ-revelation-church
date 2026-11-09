# Christ Revelation Church (CRC)

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)]()

A high-performance modern web platform and administrative command center built for **Christ Revelation Church**. Powered by **Next.js 16 (Turbopack)**, **React 19**, **Supabase Realtime**, **SWR**, and **Tailwind CSS**.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Admin Authentication & Access](#admin-authentication--access)
- [Security Architecture](#security-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## Overview

Christ Revelation Church is a full-featured digital ministry platform engineered for speed, real-time interactivity, and bank-grade security:
- **Public Portal**: Event registrations, ministry insights, sermon archives, interactive prayer request submissions, gallery media showcases, and donation channels.
- **Admin Command Center**: Real-time event publisher, blog CMS with live preview, prayer request workflow manager, media asset manager, financial analytics dashboard, and automated email subscriber lists.

---

## Key Features

### 1. Real-Time Interactivity (Zero Page Refreshes)
- Powered by **Supabase Realtime Postgres Changes** (`supabase.channel(...)`).
- Actions taken in the Admin Panel (e.g. creating an event, publishing a blog, answering a prayer request, or updating gallery moments) propagate **instantly** to all active visitors without requiring a page refresh.
- Dedicated unique channel lifecycle management prevents socket collisions during fast route transitions.

### 2. High-Speed Auto-Caching & Background Revalidation
- Client data fetching handled via **SWR** (Stale-While-Revalidate).
- Automatic request deduplication (5–10s intervals), instant cache hydration, and background revalidation ensure zero UI flicker and instant page loads.
- Skeleton UI loaders and optimistic UI state updates across all forms and tables.

### 3. Secret Admin Modal & OAuth Architecture
- **Secret Keyboard Trigger**: Accessible anywhere on the website by pressing **`Shift + Cmd + D`** (macOS) or **`Shift + Ctrl + D`** (Windows / Linux).
- **Two-Step Pre-Screening**: Email verification against `NEXT_PUBLIC_ADMIN_EMAIL` before OAuth initialization to block unauthorized traffic upfront.
- **Google OAuth via `@supabase/ssr`**: Server-side cookie session exchange (`/auth/callback`) with `prompt: 'select_account'`.
- **Fail-Closed Route Guards**: The `<AdminAuthProvider />` wraps all `/admin/*` routes. Unauthenticated visitors are securely redirected to `/?error=unauthorized` with contextual toast notifications.

### 4. Comprehensive Media-Only Security
- Whitelisted exclusively for safe **Images** (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`) and **Videos** (`.mp4`, `.webm`, `.mov`, `.mkv`).
- File size caps: **10 MB** for images, **100 MB** for videos.
- **Magic Bytes Validation**: Binary buffer signature inspection (JPEG `FF D8 FF`, PNG `89 50 4E 47`, WebP `RIFF...WEBP`, MP4 `ftyp`, WebM `1A 45 DF A3`) prevents polyglot file masquerading.
- Explicit blocking of `.exe`, `.sh`, `.bat`, `.php`, `.py`, `.html`, and `.svg` (to eliminate Stored XSS).

### 5. Server-Side Input Validation & Rate Limiting
- Strict **Zod** schema validation across every API route.
- HTML and script sanitization (`sanitizeText`) against XSS.
- In-memory sliding-window rate limiting on all endpoints (protecting auth, forms, uploads, and admin operations).

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16.3.5 (Turbopack)** | Fullstack App Router framework with hybrid SSR/SSG |
| **React 19.2.8** | Component architecture & modern hooks |
| **TypeScript 5.x** | Strict end-to-end type safety |
| **Supabase** | PostgreSQL database, Auth, Realtime sockets, and Object Storage |
| **@supabase/ssr** | Secure cookie-based server session handling |
| **Tailwind CSS v4** | Modern utility-first styling |
| **SWR (v2.5.1)** | Client-side caching, background revalidation, and mutation |
| **Framer Motion 13** | Fluid animations, slide-overs, and spring modals |
| **Zod** | Server-side runtime schema validation |
| **Recharts** | Interactive administrative analytics and volume graphs |
| **Lucide React** | Clean, accessible iconography |

---

## Admin Authentication & Access

Accessing the church administration portal is restricted by design:

1. **Trigger Modal**: Press **`Shift + Cmd + D`** (Mac) or **`Shift + Ctrl + D`** (Windows/Linux) from any page.
2. **Step 1 — Pre-Screening**:
   - The user inputs their email address.
   - The system calls `POST /api/auth/verify-email` (rate-limited to 5 attempts / 15 minutes).
   - If the email is present in the `NEXT_PUBLIC_ADMIN_EMAIL` whitelist, the user is cleared for Step 2. Non-whitelisted emails are rejected immediately.
3. **Step 2 — Google Sign-In**:
   - The user clicks **"Continue with Google"**.
   - Supabase initiates OAuth with Google using `prompt: 'select_account'`.
   - Google redirects to Supabase's callback, which passes the session code to `/auth/callback`.
4. **Session Establishment**:
   - `/auth/callback` exchanges the code for secure HTTP-only cookies using `@supabase/ssr`.
   - The user is redirected into `/admin`.
5. **Real-Time Route Protection**:
   - All `/admin/*` subpaths are guarded by `<AdminAuthProvider />`.
   - Unauthorized attempts fail closed and redirect to `/?error=unauthorized`.
   - Sign out immediately invalidates cookies via `supabase.auth.signOut()`.

---

## Security Architecture

For detailed threat modeling, pre-deployment checklists, and incident response procedures, see **[SECURITY.md](./SECURITY.md)**.

### Rate Limiting Summary

| Endpoint Type | Route | Rate Limit |
| :--- | :--- | :--- |
| **Auth Verification** | `POST /api/auth/verify-email` | **5 req / 15 min** |
| **Form Submissions** | `POST /api/prayer-requests`, `/api/contacts`, `/api/registrations` | **8 req / min** |
| **Newsletter** | `POST /api/subscribers` | **5 req / 10 min** |
| **Media Uploads** | `POST /api/gallery` | **15 req / min** |
| **Admin Operations** | `POST /api/blogs`, `/api/events`, `/api/transactions` | **40 req / min** |
| **General Read APIs** | `GET /api/*` | **120 req / min** |

---

## Project Structure

```text
Christ-Revelation-Church/
├── src/
│   ├── app/                                # Next.js App Router
│   │   ├── (public)/                       # Public-facing church pages
│   │   │   ├── about/                      # About Christ Revelation Church
│   │   │   ├── blogs/                      # Blog articles & dynamic [id] reader
│   │   │   ├── contacts/                   # Contact us form & locations
│   │   │   ├── events/                     # Events catalog & dynamic [id] details
│   │   │   ├── gallery/                    # Media gallery with video lightbox
│   │   │   ├── ministries/                 # Ministry departments & mission
│   │   │   ├── prayer-request/             # Prayer request submission & success view
│   │   │   └── sermons/                    # Sermon messages & streams
│   │   ├── admin/                          # Secure Admin Command Center
│   │   │   ├── analytics/                  # Financial charts & visitor metrics
│   │   │   ├── blog/                       # Blog post creation, editing & CMS
│   │   │   ├── campaigns/                  # Ministry fundraising campaigns
│   │   │   ├── contacts/                   # Inbound message inbox
│   │   │   ├── events/                     # Event creation, capacity & attendance
│   │   │   ├── gallery/                    # Gallery moments & video upload manager
│   │   │   ├── prayer-requests/            # Prayer pipeline, status & confidential notes
│   │   │   ├── settings/                   # Administrative system settings
│   │   │   ├── subscribers/                # Newsletter subscribers directory
│   │   │   └── transactions/               # Giving logs, tithes & offerings ledger
│   │   ├── api/                            # Next.js Serverless API Endpoints
│   │   │   ├── auth/verify-email/          # Rate-limited admin pre-screening
│   │   │   ├── blogs/                      # Blog CRUD & view counter
│   │   │   ├── contacts/                   # Contact form submissions
│   │   │   ├── events/                     # Event CRUD & view counter
│   │   │   ├── gallery/                    # Media upload & gallery CRUD
│   │   │   ├── prayer-requests/            # Prayer request submissions & triage
│   │   │   ├── registrations/              # Event RSVP & ticketing
│   │   │   ├── subscribers/                # Newsletter subscriptions
│   │   │   └── transactions/               # Giving records & volume logs
│   │   ├── auth/callback/                  # Supabase SSR OAuth code exchange
│   │   ├── layout.tsx                      # Root layout mounting Navbar, Footer, Modals
│   │   └── globals.css                     # Global styles & Tailwind CSS v4 setup
│   ├── components/                         # Modular React Components
│   │   ├── admin/                          # Administrative widgets, tables, sidebars
│   │   ├── blogs/                          # Blog cards, reading views & share buttons
│   │   ├── events/                         # Event grids, RSVP modals & countdowns
│   │   ├── gallery/                        # Masonry grid, video players, filter tabs
│   │   ├── layout/                         # Public Navbar, Mobile Menu, Footer
│   │   ├── prayer-request/                 # Prayer submission form & success screens
│   │   ├── ui/                             # Buttons, inputs, modals, ConfirmDialog
│   │   ├── AdminLoginModal.tsx             # Secret shortcut floating admin login
│   │   └── ErrorToastHandler.tsx           # URL error interceptor & toast renderer
│   └── lib/                                # Core Utilities & Data Layer
│       ├── fileSecurity.ts                 # Whitelist, magic bytes & size validator
│       ├── rateLimit.ts                    # Sliding-window IP rate limiter
│       ├── validation.ts                   # Centralized Zod validation schemas
│       ├── supabase.ts                     # Supabase client singleton
│       ├── supabase/client.ts              # Browser client (@supabase/ssr)
│       ├── supabase/server.ts              # Server client with cookies (@supabase/ssr)
│       ├── useBlogPosts.ts                 # Realtime SWR hook for blogs
│       ├── useEvents.ts                    # Realtime SWR hook for events
│       ├── useGallery.ts                   # Realtime SWR hook for gallery moments
│       ├── usePrayerRequests.ts            # Realtime SWR hook for prayer requests
│       ├── useRegistrations.ts             # Realtime SWR hook for event attendees
│       └── useTransactions.ts              # Realtime SWR hook for giving logs
├── public/                                 # Static assets (fonts, icons, images)
├── SECURITY.md                             # Security policy, checklist & architecture
└── package.json                            # Project dependencies & scripts
```

---

## Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Supabase Account**: With an active project instance

### 1. Clone & Install
```bash
git clone https://github.com/muhammedshamilmt/christ-revelation-church.git
cd christ-revelation-church
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
*(Fill in your actual Supabase credentials and admin email whitelist as described below).*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description | Exposure |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Comma-separated list of authorized Super Admin emails | Public (Bundled) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project API URL | Public (Bundled) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anonymous API Key | Public (Bundled) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Secret Service Role Key (Used for server-side auth validation) | **Server-Only (Private)** |

```env
# Admin Whitelist (Comma-separated)
NEXT_PUBLIC_ADMIN_EMAIL=admin@domain.com

# Supabase Public Configuration
NEXT_PUBLIC_SUPABASE_URL=https://psxdxygtenkaurdbxgvq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Server-Side Secret Key (Never prefix with NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

---

## API Reference

All write endpoints strictly enforce rate limiting and Zod input validation:

| Route | Methods | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/verify-email` | `POST` | No | Pre-screen email against admin whitelist |
| `/api/blogs` | `GET`, `POST` | Yes (POST) | List blogs / Create new blog post |
| `/api/blogs/[id]` | `GET`, `PATCH`, `DELETE` | Yes (PATCH/DELETE) | Manage individual blog post |
| `/api/blogs/[id]/view` | `POST` | No | Increment blog post view counter |
| `/api/events` | `GET`, `POST` | Yes (POST) | List events / Create new church event |
| `/api/events/[id]` | `GET`, `PATCH`, `DELETE` | Yes (PATCH/DELETE) | Manage individual church event |
| `/api/events/[id]/view` | `POST` | No | Increment event view counter |
| `/api/gallery` | `GET`, `POST` | Yes (POST) | List gallery items / Upload new moment |
| `/api/gallery/[id]` | `GET`, `PATCH`, `DELETE` | Yes (PATCH/DELETE) | Manage individual gallery moment |
| `/api/prayer-requests` | `GET`, `POST` | Yes (GET) | Submit prayer request / List all (Admin) |
| `/api/prayer-requests/[id]` | `PATCH`, `DELETE` | Yes | Update prayer status / Archive prayer |
| `/api/registrations` | `GET`, `POST`, `PATCH`, `DELETE` | Yes (GET/PATCH/DELETE) | Event RSVPs & attendee management |
| `/api/contacts` | `GET`, `POST` | Yes (GET) | Inbound contact messages |
| `/api/subscribers` | `GET`, `POST` | Yes (GET) | Newsletter subscriptions |
| `/api/transactions` | `GET`, `POST` | Yes | Financial donations & giving records |

---

## Database Schema

The application is backed by Supabase (PostgreSQL) with Realtime publications enabled on the following tables:

1. **`events`**: Church gatherings, conferences, guest speakers, dates, locations, ticket limits, and featured media.
2. **`event_registrations`**: Attendee bookings, ticket quantities, contact details, dietary notes, and status (`confirmed`, `pending`, `cancelled`).
3. **`blogs`**: Articles, devotions, categories, rich text content, reading times, cover images, and publication statuses.
4. **`gallery`**: Curated photography and video moments, categorised by ministry with aspect ratios and location tags.
5. **`prayer_requests`**: Prayer petitions, names, contact preferences, confidentiality flags, and prayer statuses (`New`, `Praying`, `Answered`, `Followed Up`).
6. **`transactions`**: Tithes, offerings, campaign gifts, amounts, currency, and anonymous donation flags.
7. **`subadmins`**: Registered administrative staff profiles, roles, and granular permissions.

---

## Scripts

```bash
# Start local development server with Turbopack
npm run dev

# Run TypeScript static analysis without emitting files
npx tsc --noEmit

# Create an optimized production build
npm run build

# Start the Next.js production server
npm start

# Run ESLint to check for code quality issues
npm run lint
```

---

## Deployment

The application is optimized for deployment on **Vercel**, **Cloudflare Pages**, or any Node.js environment.

1. **Set Environment Variables**: Add `NEXT_PUBLIC_ADMIN_EMAIL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in your hosting dashboard.
2. **Configure Supabase Auth**:
   - Add your production domain to Supabase **Authentication → URL Configuration → Redirect URLs** (e.g. `https://your-domain.com/auth/callback`).
   - Add your Supabase project callback (`https://psxdxygtenkaurdbxgvq.supabase.co/auth/v1/callback`) to your Google Cloud Console Web Application Authorized Redirect URIs.
3. **Verify Build**: Run `npm run build` to confirm all 33 static and dynamic routes compile cleanly.

---

## License & Copyright

Copyright © 2026 **Christ Revelation Church**. All rights reserved.  
Unauthorized distribution, copying, or modification of this codebase is strictly prohibited.
