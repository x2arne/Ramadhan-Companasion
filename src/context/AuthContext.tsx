import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getLastSync, pullAndMerge, pushNow, startAutoPush } from '../services/syncService';

export interface AuthUser {
  sub: string;
  name: string;
  picture?: string;
}

type SyncState = 'idle' | 'syncing' | 'ok' | 'error';

interface AuthContextValue {
  clientId: string;
  user: AuthUser | null;
  loading: boolean;
  syncState: SyncState;
  lastSync: number | null;
  error: string | null;
  handleCredential: (credential: string) => Promise<void>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<void>;
}

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
const CLIENT_ID = env?.VITE_GOOGLE_CLIENT_ID ?? '';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [lastSync, setLastSync] = useState<number | null>(getLastSync());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/me', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((data: { user: AuthUser | null }) => {
        if (active) setUser(data.user ?? null);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const syncNow = useCallback(async () => {
    setSyncState('syncing');
    try {
      const result = await pullAndMerge();
      if (result === 'pulled') {
        window.location.reload();
        return;
      }
      setLastSync(getLastSync());
      setSyncState('ok');
    } catch {
      setSyncState('error');
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    syncNow();
    return startAutoPush(
      () => {
        setLastSync(getLastSync());
        setSyncState('ok');
      },
      () => setSyncState('error')
    );
  }, [user, syncNow]);

  const handleCredential = useCallback(async (credential: string) => {
    setError(null);
    try {
      const res = await fetch('/api/auth-google', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = (await res.json()) as { user?: AuthUser; error?: string };
      if (!res.ok || !data.user) throw new Error(data.error || 'Login gagal');
      setUser(data.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login gagal');
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await pushNow();
    } catch {
      /* tetap keluar walau sinkron terakhir gagal */
    }
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined);
    setUser(null);
    setSyncState('idle');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ clientId: CLIENT_ID, user, loading, syncState, lastSync, error, handleCredential, signOut, syncNow }),
    [user, loading, syncState, lastSync, error, handleCredential, signOut, syncNow]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
};
