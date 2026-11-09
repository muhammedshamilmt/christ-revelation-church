# Security Architecture & Deployment Guide — Christ Revelation Church

## Pre-Deploy Checklist

Run through this checklist before every production deployment.

### Secrets & Environment
- [ ] `.env.local` is **never** committed to git (verify with `git status`).
- [ ] All production environment variables are configured in the hosting environment (Vercel / Cloudflare / Node):
  - `NEXT_PUBLIC_ADMIN_EMAIL`: Whitelist of authorized Super Admin emails (comma-separated).
  - `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase Project URL (`https://psxdxygtenkaurdbxgvq.supabase.co`).
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Public Anonymous API Key.
  - `SUPABASE_SERVICE_ROLE_KEY`: Supabase Secret Service Role Key (Server-side only — **never** prefix with `NEXT_PUBLIC_`).
- [ ] Google OAuth Client Credentials:
  - Google Cloud Console Web Application Client ID & Secret configured in Supabase Auth Providers.
  - Google Cloud Console OAuth Consent Screen is published **"In Production"**.
  - Authorized Redirect URI in Google Cloud Console is set strictly to:
    `https://psxdxygtenkaurdbxgvq.supabase.co/auth/v1/callback`

### Build & Runtime
- [ ] `NODE_ENV=production` is set in the hosting environment.
- [ ] TypeScript check passes with zero errors: `npx tsc --noEmit`.
- [ ] Production build compiles cleanly: `npm run build`.
- [ ] HTTPS is enforced across all routes with HSTS.

### Database & Storage (Supabase)
- [ ] Row Level Security (RLS) is active on all tables (`subadmins`, `events`, `blogs`, `gallery`, `prayer_requests`, `transactions`, `event_registrations`).
- [ ] Realtime publication is enabled for required tables (`events`, `blogs`, `gallery`, `prayer_requests`, `transactions`, `event_registrations`).
- [ ] Storage buckets (`gallery`, `blog-covers`, `event-media`) have public read access and authenticated upload policies.

---

## Security Architecture

### 1. Rate Limiting (`src/lib/rateLimit.ts`)
Implements an in-memory sliding-window counter per client IP (resolving through `x-forwarded-for`, `cf-connecting-ip`, and `x-real-ip`). Automatically purges expired windows every 3 minutes.

| Endpoint Category | Route Examples | Rate Limit | Protection Target |
|:---|:---|:---|:---|
| **Authentication** | `POST /api/auth/verify-email` | **5 req / 15 min** | Brute-force & email enumeration |
| **Form Submissions** | `POST /api/prayer-requests`, `/api/contacts`, `/api/registrations` | **8 req / min** | Spam submissions & bot flooding |
| **Newsletter** | `POST /api/subscribers` | **5 req / 10 min** | Email list pollution & harvesting |
| **Media Uploads** | `POST /api/gallery` | **15 req / min** | Storage exhaustion & denial-of-service |
| **Admin Operations** | `POST /api/blogs`, `/api/events`, `/api/transactions` | **40 req / min** | Administrative API abuse |
| **General Read APIs** | `GET /api/*` | **120 req / min** | API scraping & resource exhaustion |

When a rate limit is exceeded, the server returns an **HTTP 429 Too Many Requests** response with standard RFC headers:
- `Retry-After`: Seconds until the quota window resets.
- `X-RateLimit-Limit`: Maximum requests permitted in the window.
- `X-RateLimit-Remaining`: `0`.
- `X-RateLimit-Reset`: Unix timestamp when the limit resets.

---

### 2. File Upload & Media Security (`src/lib/fileSecurity.ts`)

Christ Revelation Church enforces a **Media-Only Policy** across all upload channels.

#### A. Strict Whitelist (Images & Videos Only)
- **Safe Images**:
  - MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/avif`
  - Extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`
- **Safe Videos**:
  - MIME types: `video/mp4`, `video/webm`, `video/quicktime` (`.mov`), `video/x-matroska` (`.mkv`)
  - Extensions: `.mp4`, `.webm`, `.mov`, `.mkv`

#### B. Explicitly Blocked Extensions
Any file ending in the following extensions is unconditionally rejected:
- Executables & Scripts: `.exe`, `.sh`, `.bat`, `.cmd`, `.js`, `.ts`, `.php`, `.py`, `.rb`, `.cgi`, `.asp`, `.aspx`
- Scriptable Markup: `.html`, `.htm`, `.xhtml`, `.svg` *(SVG files are blocked because they can execute `<script>` XSS payloads)*
- Installers & Libraries: `.msi`, `.dll`, `.jar`, `.vbs`, `.scr`, `.pif`
- Archives: `.zip`, `.tar`, `.gz`, `.rar`, `.7z`

#### C. File Size Constraints
- **Images**: Maximum **10 MB** (`MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024`)
- **Videos**: Maximum **100 MB** (`MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024`)

#### D. Magic Bytes Signature Verification
To prevent attackers from masking executable or malicious files behind `.jpg` or `.mp4` extensions (polyglot files), binary buffers are inspected for header signatures:
- **JPEG**: `FF D8 FF`
- **PNG**: `89 50 4E 47 0D 0A 1A 0A`
- **GIF**: `47 49 46 38 37 61` / `47 49 46 38 39 61`
- **WebP**: `RIFF` (offset 0) + `WEBP` (offset 8)
- **MP4 / MOV**: `ftyp` box signature at bytes 4..7
- **WebM / MKV**: EBML header `1A 45 DF A3`

#### E. Filename Sanitization (`sanitizeFilename`)
- Removes path traversal sequences (`../`, `..\`).
- Strips null bytes (`\0`) and invalid filesystem characters (`/ \ ? % * : | " < >`).
- Generates safe alphanumeric filenames suffixed with millisecond timestamps.

---

### 3. Server-Side Input Validation (`src/lib/validation.ts`)

All API routes validate payloads using strict **Zod** schemas. Client-side validation is provided for user feedback only; server-side validation acts as the definitive security boundary.

- **`prayerRequestSchema`**: Validates names (max 60 chars), emails (RFC 5322), phone numbers, categories, and prayer text (min 3, max 3000 chars).
- **`contactSchema`**: Validates sender name, email, phone, subject, and message (min 3, max 4000 chars).
- **`subscriberSchema`**: Validates email format and normalizes to lowercase.
- **`eventRegistrationSchema`**: Validates event ID, attendee name, email, ticket counts (1 to 20), and special notes.
- **`galleryItemSchema`**: Validates title, mediaType (`image` or `video`), media URL, category, description, and event location.
- **`blogPostSchema`**: Validates title, slug, excerpt, author, category, tags, status, and rich text content.
- **`eventSchema`**: Validates event title, date, time, sanctuary location, category, image banner URL, and capacity limit.
- **`sanitizeText`**: Strips inline `<script>` tags, event handlers (`onload`, `onclick`), and `javascript:` URIs from all freeform text before database persistence.

---

### 4. Admin Authentication & Route Protection

1. **Secret Keyboard Shortcut**:
   - Access to the administrative portal is initiated exclusively via **`Shift + Cmd + D`** (macOS) or **`Shift + Ctrl + D`** (Windows / Linux).
2. **Two-Step Pre-Screening**:
   - Step 1 checks the provided email against the server-side whitelist (`NEXT_PUBLIC_ADMIN_EMAIL`).
   - Non-whitelisted accounts receive an immediate rejection before Google OAuth is ever invoked.
3. **Google OAuth via Supabase SSR**:
   - Authorized admins authenticate via Google OAuth with `prompt: 'select_account'`.
   - The exchange callback (`/auth/callback`) sets secure HTTP-only cookies using `@supabase/ssr`.
4. **Route Guard (`AdminAuthProvider`)**:
   - Wraps all `/admin/*` routes.
   - Any unauthenticated direct URL access fails closed and safely redirects to `/?error=unauthorized`.
   - Client-side `<ErrorToastHandler />` provides notification feedback and cleans the browser URL.

---

## Reporting a Security Vulnerability

If you identify a security issue or potential vulnerability in the Christ Revelation Church portal, please report it privately to the administration team at:
- **Email**: `pastor.david@christrevelation.org` or `shaz80170@gmail.com`

Please do not disclose security vulnerabilities publicly on GitHub issues or social channels until they have been addressed.
