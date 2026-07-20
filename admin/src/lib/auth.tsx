"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api, logout as apiLogout, tokenStore } from "./api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  admin: AdminUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = async () => {
    if (!tokenStore.access) {
      setAdmin(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api<AdminUser>("/api/admin/auth/me");
      setAdmin(res.data);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await apiLogout();
    setAdmin(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ admin, loading, refresh: load, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
