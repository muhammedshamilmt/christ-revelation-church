/**
 * Strict file security utilities for Christ Revelation Church media uploads.
 * Restricts uploads exclusively to safe Image and Video files.
 * Blocks executable scripts, HTML/SVG XSS payloads, and oversized assets.
 */

// ── Allowed MIME Types & Extensions Whitelist ─────────────────

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
] as const;

export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime', // .mov
  'video/x-matroska', // .mkv
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'] as const;
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.mkv'] as const;

// Combined Whitelists
export const ALLOWED_MIME_TYPES = [
  ...ALLOWED_IMAGE_MIME_TYPES,
  ...ALLOWED_VIDEO_MIME_TYPES,
] as const;

export const ALLOWED_EXTENSIONS = [
  ...ALLOWED_IMAGE_EXTENSIONS,
  ...ALLOWED_VIDEO_EXTENSIONS,
] as const;

// Explicitly forbidden extensions (blocked even if someone tries to trick headers)
export const DANGEROUS_EXTENSIONS = [
  '.exe', '.sh', '.bat', '.cmd', '.js', '.ts', '.jsx', '.tsx',
  '.php', '.py', '.rb', '.pl', '.cgi', '.asp', '.aspx',
  '.html', '.htm', '.xhtml', '.svg', // SVG can contain <script> tags leading to Stored XSS
  '.jar', '.vbs', '.msi', '.dll', '.scr', '.pif',
  '.zip', '.tar', '.gz', '.rar', '.7z',
] as const;

// ── Maximum File Size Constraints ──────────────────────────────
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  mediaType?: 'image' | 'video';
  sanitizedFilename?: string;
}

/**
 * Sanitize a filename to prevent path traversal, null byte injections, and strange characters.
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return `file_${Date.now()}`;

  // Strip null bytes and directory paths
  let clean = filename.replace(/\0/g, '').replace(/[/\\?%*:|"<>]/g, '_');
  clean = clean.replace(/(\.\.[\/\\])+/g, '');

  const extIndex = clean.lastIndexOf('.');
  if (extIndex === -1) {
    return `${clean.replace(/[^a-zA-Z0-9_-]/g, '')}_${Date.now()}`;
  }

  const namePart = clean.substring(0, extIndex).replace(/[^a-zA-Z0-9_-]/g, '_');
  const extPart = clean.substring(extIndex).toLowerCase();

  return `${namePart.slice(0, 50)}_${Date.now()}${extPart}`;
}

/**
 * Check file magic bytes signature against known safe image/video binary headers.
 */
export function verifyMagicBytes(buffer: Uint8Array): { valid: boolean; detectedType?: string } {
  if (!buffer || buffer.length < 12) {
    return { valid: false };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedType: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, detectedType: 'image/png' };
  }

  // GIF: GIF87a or GIF89a (47 49 46 38 37 61 or 47 49 46 38 39 61)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return { valid: true, detectedType: 'image/gif' };
  }

  // WebP: RIFF .... WEBP (52 49 46 46 .... 57 45 42 50)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, detectedType: 'image/webp' };
  }

  // MP4 / MOV / QuickTime: bytes 4..7 contain 'ftyp' (66 74 79 70)
  if (
    buffer[4] === 0x66 &&
    buffer[5] === 0x74 &&
    buffer[6] === 0x79 &&
    buffer[7] === 0x70
  ) {
    return { valid: true, detectedType: 'video/mp4' };
  }

  // WebM / MKV (EBML container): 1A 45 DF A3
  if (
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3
  ) {
    return { valid: true, detectedType: 'video/webm' };
  }

  return { valid: false };
}

/**
 * Validate a file by MIME type, extension, size, and optional byte buffer.
 */
export function validateMediaFile(
  filename: string,
  mimeType: string,
  sizeBytes: number,
  buffer?: Uint8Array
): FileValidationResult {
  const ext = ('.' + filename.split('.').pop()?.toLowerCase()) as any;

  // 1. Check for explicitly dangerous extensions
  if (DANGEROUS_EXTENSIONS.some(d => filename.toLowerCase().endsWith(d))) {
    return {
      valid: false,
      error: `Security violation: File type '${ext}' is strictly forbidden.`,
    };
  }

  // 2. Classify image vs video
  const isImageMime = (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mimeType.toLowerCase());
  const isImageExt = (ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(ext);

  const isVideoMime = (ALLOWED_VIDEO_MIME_TYPES as readonly string[]).includes(mimeType.toLowerCase());
  const isVideoExt = (ALLOWED_VIDEO_EXTENSIONS as readonly string[]).includes(ext);

  if (!isImageMime && !isVideoMime && !isImageExt && !isVideoExt) {
    return {
      valid: false,
      error: 'Only image files (JPG, PNG, WebP, GIF, AVIF) and video files (MP4, WebM, MOV) are allowed.',
    };
  }

  const mediaType: 'image' | 'video' = isVideoMime || isVideoExt ? 'video' : 'image';

  // 3. Validate size limits
  if (mediaType === 'image' && sizeBytes > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (sizeBytes / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Image exceeds maximum allowed size of 10 MB (received ${sizeMb} MB).`,
    };
  }

  if (mediaType === 'video' && sizeBytes > MAX_VIDEO_SIZE_BYTES) {
    const sizeMb = (sizeBytes / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Video exceeds maximum allowed size of 100 MB (received ${sizeMb} MB).`,
    };
  }

  // 4. Verify magic bytes if buffer is available
  if (buffer && buffer.length > 0) {
    const magicCheck = verifyMagicBytes(buffer);
    if (!magicCheck.valid) {
      return {
        valid: false,
        error: 'File content does not match genuine image or video format (corrupt or invalid file signature).',
      };
    }
  }

  return {
    valid: true,
    mediaType,
    sanitizedFilename: sanitizeFilename(filename),
  };
}

/**
 * Validate a Media URL (e.g. Supabase Storage, CDN, Unsplash, or YouTube/Vimeo embed)
 */
export function validateMediaUrl(urlStr: string): { valid: boolean; error?: string } {
  if (!urlStr || typeof urlStr !== 'string') {
    return { valid: false, error: 'Media URL is required' };
  }

  try {
    const parsed = new URL(urlStr);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:' && !urlStr.startsWith('data:image/')) {
      return { valid: false, error: 'Only HTTPS and trusted secure protocols are allowed' };
    }

    // Disallow javascript: or data:text/html XSS vectors
    if (urlStr.toLowerCase().startsWith('javascript:') || urlStr.toLowerCase().startsWith('data:text/html')) {
      return { valid: false, error: 'Insecure URL scheme detected' };
    }

    return { valid: true };
  } catch {
    // Check if it is a safe local relative path (e.g. /images/...)
    if (urlStr.startsWith('/') && !urlStr.startsWith('//')) {
      return { valid: true };
    }
    return { valid: false, error: 'Invalid URL format' };
  }
}

