'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

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

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.email) {
          if (mounted) {
            setUser(null);
            setRole(null);
            setIsLoading(false);
          }
          return;
        }

        const email = session.user.email.toLowerCase();
        // Verify through secure endpoint which handles both env and DB checks using service role
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (!data.success) {
          // Valid Google login but not registered as church admin
          await supabase.auth.signOut();
          if (mounted) {
            router.push('/?error=unauthorized');
          }
          return;
        }

        if (mounted) {
          setUser(session.user);
          setRole(data.role);
          setPermissions(data.permissions);
          setSubadminId(data.id || null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        if (mounted) setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setRole(null);
        setPermissions([]);
        setSubadminId(null);
        setUser(null);
        router.push('/');
      } else if (event === 'SIGNED_IN') {
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
        if (route.path === '/admin/settings' && subadminId && pathname === `/admin/settings/subadmins/${subadminId}`) {
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
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verifying secure church access...</p>
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
