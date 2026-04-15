"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/lib/types";
import { LIFELINK_TOKEN_STORAGE_KEY } from "@/lib/auth-constants";
import { clientFetch } from "@/lib/client-api";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  setSession: (token: string, user: AuthUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = LIFELINK_TOKEN_STORAGE_KEY;
const USER_KEY = "lifelink_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      const t = localStorage.getItem(STORAGE_KEY);
      const u = localStorage.getItem(USER_KEY);
      if (t) setToken(t);
      if (u) {
        try {
          setUser(JSON.parse(u) as AuthUser);
        } catch {
          localStorage.removeItem(USER_KEY);
        }
      }
      setLoading(false);
    });
  }, []);

  const setSession = useCallback((t: string, u: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const me = await clientFetch<AuthUser & { businessProfile?: unknown }>(
      "/users/me",
      { token },
    );
    const next: AuthUser = {
      id: me.id,
      email: me.email,
      name: me.name,
      role: me.role,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(next));
    setUser(next);
  }, [token]);

  const value = useMemo(
    () => ({ token, user, loading, setSession, logout, refreshUser }),
    [token, user, loading, setSession, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
