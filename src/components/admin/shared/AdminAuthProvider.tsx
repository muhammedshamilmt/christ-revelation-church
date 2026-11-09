'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

export const ADMIN_SESSION_STORAGE_KEY = 'crc_admin_session';
export const ADMIN_PENDING_EMAIL_KEY = 'crc_admin_pending_email';

export interface PersistedAdminSession {
  email: string;
  role: string;
  permissions: string[];
  subadminId: string | null;
  user: any;
  loggedInAt: string;
}

let isExplicitSignOut = false;

export function getPersistedAdminSession(): PersistedAdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedAdminSession;
    if (parsed && parsed.email && parsed.role) {
      return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

export function savePersistedAdminSession(sessionData: PersistedAdminSession) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    window.localStorage.removeItem(ADMIN_PENDING_EMAIL_KEY);
    document.cookie = `admin_authenticated=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  } catch {
    // ignore storage errors
  }
}

export async function signOutAdmin() {
  isExplicitSignOut = true;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      window.localStorage.removeItem(ADMIN_PENDING_EMAIL_KEY);
      document.cookie = 'admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch {
      // ignore storage errors
    }
  }
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore signOut errors
  }
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

interface AuthContextType {
  role: string | null;
  permissions: string[];
  isLoading: boolean;
  user: any | null;
  subadminId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  permissions: [],
  isLoading: true,
  user: null,
  subadminId: null,
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [subadminId, setSubadminId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const applyPersisted = (persisted: PersistedAdminSession) => {
      if (!mounted) return;
      setUser(persisted.user || { email: persisted.email });
      setRole(persisted.role);
      setPermissions(persisted.permissions || ['all']);
      setSubadminId(persisted.subadminId || null);
      setIsLoading(false);
    };

    const checkAuth = async () => {
      // 1. Immediately restore persisted admin session if already logged in (never expire until explicit logout)
      const persisted = getPersistedAdminSession();
      if (persisted) {
        applyPersisted(persisted);
      }

      try {
        // 2. If redirected to /admin?code=... from OAuth callback fallback, exchange code first
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          if (code) {
            await supabase.auth.exchangeCodeForSession(code);
            // Clean ?code= from URL without reloading
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
          }
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Check if we have a session user email or a pending verified email from Step 1
        const sessionEmail = session?.user?.email?.trim().toLowerCase();
        const pendingEmail =
          typeof window !== 'undefined'
            ? window.localStorage.getItem(ADMIN_PENDING_EMAIL_KEY)?.trim().toLowerCase()
            : null;
        const emailToVerify = sessionEmail || persisted?.email || pendingEmail;

        if (!emailToVerify) {
          if (mounted && !persisted) {
            setUser(null);
            setRole(null);
            setIsLoading(false);
          }
          return;
        }

        // Verify through secure endpoint which handles both env and DB checks
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToVerify }),
        });

        // Only treat explicit 403 as unauthorized; never log out on network/429/500 transient errors
        if (res.status === 403) {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
            window.localStorage.removeItem(ADMIN_PENDING_EMAIL_KEY);
          }
          await supabase.auth.signOut();
          if (mounted) {
            setUser(null);
            setRole(null);
            setIsLoading(false);
            router.push('/?error=unauthorized');
          }
          return;
        }

        if (!res.ok) {
          // Transient error: keep existing persisted session if available
          if (mounted) setIsLoading(false);
          return;
        }

        const data = await res.json();
        if (!data.success) {
          if (mounted && !persisted) {
            setIsLoading(false);
          }
          return;
        }

        const resolvedUser = session?.user ||
          persisted?.user || {
            email: emailToVerify,
            user_metadata: {
              full_name: emailToVerify.split('@')[0],
            },
          };

        const sessionPayload: PersistedAdminSession = {
          email: emailToVerify,
          role: data.role,
          permissions: data.permissions || ['all'],
          subadminId: data.id || null,
          user: resolvedUser,
          loggedInAt: persisted?.loggedInAt || new Date().toISOString(),
        };

        savePersistedAdminSession(sessionPayload);

        if (mounted) {
          setUser(resolvedUser);
          setRole(sessionPayload.role);
          setPermissions(sessionPayload.permissions);
          setSubadminId(sessionPayload.subadminId);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        if (mounted) setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes, but never expire a persisted admin session unless explicitly signed out
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        if (isExplicitSignOut) {
          isExplicitSignOut = false;
          setRole(null);
          setPermissions([]);
          setSubadminId(null);
          setUser(null);
          router.push('/');
        } else {
          // Background token refresh or cookie hiccup: keep persisted admin session alive
          const persisted = getPersistedAdminSession();
          if (persisted) {
            applyPersisted(persisted);
          }
        }
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkAuth();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  // Redirect unauthenticated visitors trying to access /admin routes
  useEffect(() => {
    if (!isLoading && !user && pathname?.startsWith('/admin')) {
      const persisted = getPersistedAdminSession();
      if (persisted) {
        setUser(persisted.user || { email: persisted.email });
        setRole(persisted.role);
        setPermissions(persisted.permissions || ['all']);
        setSubadminId(persisted.subadminId || null);
        return;
      }
      router.replace('/?error=unauthorized');
    }
  }, [isLoading, user, pathname, router]);

  // Page Restriction Logic
  useEffect(() => {
    if (isLoading || !role || !pathname) return;

    if (role === 'Super Admin' || permissions.includes('all')) return;

    const restrictedRoutes = [
      { path: '/admin/events' },
      { path: '/admin/blog' },
      { path: '/admin/gallery' },
      { path: '/admin/prayer-requests' },
      { path: '/admin/campaigns' },
      { path: '/admin/volunteers' },
      { path: '/admin/subscribers' },
      { path: '/admin/contacts' },
      { path: '/admin/transactions' },
      { path: '/admin/analytics' },
      { path: '/admin/settings' },
    ];

    for (const route of restrictedRoutes) {
      if (pathname.startsWith(route.path) && !permissions.includes(route.path)) {
        // Exception: allow subadmins to access their own settings/profile page
        if (
          route.path === '/admin/settings' &&
          subadminId &&
          pathname === `/admin/settings/subadmins/${subadminId}`
        ) {
          continue;
        }

        router.replace('/admin');
        break;
      }
    }
  }, [pathname, role, permissions, isLoading, router, subadminId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-gray-900 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Verifying secure church access...
        </p>
      </div>
    );
  }

  if (!user && pathname?.startsWith('/admin')) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <AuthContext.Provider value={{ role, permissions, isLoading, user, subadminId }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AuthContext);
