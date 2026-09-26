'use client';

import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  role: string | null;
  permissions: string[];
  isLoading: boolean;
  user: any | null;
  subadminId: string | null;
}

const mockAdminUser = {
  id: 'sub-1',
  email: 'pastor.david@christrevelation.org',
  user_metadata: {
    full_name: 'Pastor David Vance',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  last_sign_in_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({
  role: 'Super Admin',
  permissions: ['all'],
  isLoading: false,
  user: mockAdminUser,
  subadminId: 'sub-1',
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [role] = useState<string | null>('Super Admin');
  const [permissions] = useState<string[]>(['all']);
  const [subadminId] = useState<string | null>('sub-1');
  const [isLoading] = useState(false);
  const [user] = useState<any>(mockAdminUser);

  return (
    <AuthContext.Provider value={{ role, permissions, isLoading, user, subadminId }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AuthContext);
