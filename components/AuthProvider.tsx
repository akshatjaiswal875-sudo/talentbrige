"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; name: string; email: string; role: string; image?: string } | null;

type AuthContextValue = {
  user: User;
  authChecked: boolean;
  setUser: (u: User) => void;
  reload: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [authChecked, setAuthChecked] = useState(false);

  async function reload() {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        setUser(null);
        return;
      }
      const j = await res.json();
      if (j?.authenticated) setUser(j.user);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    reload();
    // Intentionally run only on mount so child navigations reuse the same context
  }, []);

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      // clear and reload
      setUser(null);
      setAuthChecked(true);
      if (typeof window !== "undefined") window.location.reload();
    }
  }

  const value: AuthContextValue = {
    user,
    authChecked,
    setUser,
    reload,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
