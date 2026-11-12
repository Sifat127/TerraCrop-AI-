import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './client';

export interface ProfileData {
  id: string;
  full_name: string;
  avatar_url?: string;
  phone_number?: string;
  preferred_language: 'en' | 'bn';
  experience_years: number;
}

interface StoredLocalAccount {
  id: string;
  email: string;
  password?: string;
  full_name: string;
  preferred_language: 'en' | 'bn';
  experience_years: number;
  created_at: string;
}

const LOCAL_ACCOUNTS_KEY = 'terracrop_builtin_accounts_v1';
const LOCAL_SESSION_KEY = 'terracrop_builtin_session_v1';

const DEFAULT_DEMO_ACCOUNT: StoredLocalAccount = {
  id: 'farmer-demo-001',
  email: 'farmer@terracrop.ai',
  password: 'password123',
  full_name: 'Rahim Chowdhury',
  preferred_language: 'en',
  experience_years: 8,
  created_at: new Date().toISOString()
};

function loadLocalAccounts(): Record<string, StoredLocalAccount> {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed[DEFAULT_DEMO_ACCOUNT.email]) {
      parsed[DEFAULT_DEMO_ACCOUNT.email] = DEFAULT_DEMO_ACCOUNT;
    }
    return parsed;
  } catch {
    return { [DEFAULT_DEMO_ACCOUNT.email]: DEFAULT_DEMO_ACCOUNT };
  }
}

function saveLocalAccounts(accounts: Record<string, StoredLocalAccount>) {
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // Ignore storage quota errors
  }
}

function buildMockUser(account: StoredLocalAccount): User {
  return {
    id: account.id,
    email: account.email,
    app_metadata: { provider: 'email' },
    user_metadata: {
      full_name: account.full_name,
      preferred_language: account.preferred_language
    },
    aud: 'authenticated',
    created_at: account.created_at
  } as User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileData | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signInWithDemo: () => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updateProfile: (updates: Partial<ProfileData>) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isConfigured: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signInWithDemo: async () => ({}),
  resetPassword: async () => ({}),
  updateProfile: async () => ({}),
  signOut: async () => {},
  refreshProfile: async () => {}
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSupabaseProfile = async (userId: string, fallbackUser?: User | null) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setProfile(data as ProfileData);
        return;
      }
    } catch (err) {
      console.warn('Could not load profile from Supabase:', err);
    }

    if (fallbackUser) {
      setProfile({
        id: fallbackUser.id,
        full_name:
          (fallbackUser.user_metadata?.full_name as string) ||
          fallbackUser.email?.split('@')[0] ||
          'Farmer',
        preferred_language:
          (fallbackUser.user_metadata?.preferred_language as 'en' | 'bn') || 'en',
        experience_years: 5
      });
    }
  };

  const applyLocalAccountSession = (account: StoredLocalAccount) => {
    const mockUser = buildMockUser(account);
    const mockProfile: ProfileData = {
      id: account.id,
      full_name: account.full_name,
      preferred_language: account.preferred_language,
      experience_years: account.experience_years
    };
    setUser(mockUser);
    setProfile(mockProfile);
    setSession({
      access_token: `local-token-${account.id}`,
      refresh_token: `local-refresh-${account.id}`,
      expires_in: 86400,
      token_type: 'bearer',
      user: mockUser
    } as Session);
    try {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(account));
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    // 1. Check built-in local session first if Supabase is not configured (or if a demo session exists)
    try {
      const savedLocal = localStorage.getItem(LOCAL_SESSION_KEY);
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal) as StoredLocalAccount;
        if (parsed && parsed.email) {
          applyLocalAccountSession(parsed);
          if (!isSupabaseConfigured || !supabase) {
            setLoading(false);
            return;
          }
        }
      }
    } catch {
      // Ignore parse issues
    }

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // 2. Check active Supabase session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      if (activeSession?.user) {
        setSession(activeSession);
        setUser(activeSession.user);
        fetchSupabaseProfile(activeSession.user.id, activeSession.user);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        fetchSupabaseProfile(newSession.user.id, newSession.user);
      } else if (!localStorage.getItem(LOCAL_SESSION_KEY)) {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { error: 'Please enter both your email address and password.' };
    }

    // If Supabase is configured, try Supabase first
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });
      if (!error && data.user) {
        setUser(data.user);
        setSession(data.session);
        await fetchSupabaseProfile(data.user.id, data.user);
        return {};
      }
      if (error) {
        return { error: error.message };
      }
    }

    // Built-in Auth Fallback (Server + LocalStorage)
    const accounts = loadLocalAccounts();
    const existing = accounts[cleanEmail];
    if (existing && existing.password && existing.password !== password) {
      return { error: 'Incorrect password for this account. Please try again.' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const payload = await res.json();
      if (!res.ok || !payload.success) {
        return { error: payload.error || 'Unable to sign in with those credentials.' };
      }

      const serverAcc = payload.data;
      const mergedAccount: StoredLocalAccount = {
        id: existing?.id || serverAcc.id || `farmer-${Date.now().toString(36)}`,
        email: cleanEmail,
        password,
        full_name: existing?.full_name || serverAcc.full_name || cleanEmail.split('@')[0],
        preferred_language: existing?.preferred_language || serverAcc.preferred_language || 'en',
        experience_years: existing?.experience_years ?? serverAcc.experience_years ?? 5,
        created_at: existing?.created_at || serverAcc.created_at || new Date().toISOString()
      };
      accounts[cleanEmail] = mergedAccount;
      saveLocalAccounts(accounts);
      applyLocalAccountSession(mergedAccount);
      return {};
    } catch {
      // Offline client fallback
      const rawName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = rawName.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Farmer';
      const fallbackAccount: StoredLocalAccount = existing || {
        id: `farmer-${Date.now().toString(36)}`,
        email: cleanEmail,
        password,
        full_name: formattedName,
        preferred_language: 'en',
        experience_years: 5,
        created_at: new Date().toISOString()
      };
      accounts[cleanEmail] = fallbackAccount;
      saveLocalAccounts(accounts);
      applyLocalAccountSession(fallbackAccount);
      return {};
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim() || cleanEmail.split('@')[0] || 'Farmer';

    if (!cleanEmail || !password) {
      return { error: 'Please fill in your email address and password.' };
    }
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters long.' };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            preferred_language: 'en'
          }
        }
      });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        setProfile({
          id: data.user.id,
          full_name: cleanName,
          preferred_language: 'en',
          experience_years: 5
        });
        return {};
      }
    }

    // Built-in Auth Registration (Server + LocalStorage)
    const accounts = loadLocalAccounts();
    const newAccount: StoredLocalAccount = {
      id: accounts[cleanEmail]?.id || `farmer-${Date.now().toString(36)}`,
      email: cleanEmail,
      password,
      full_name: cleanName,
      preferred_language: 'en',
      experience_years: 5,
      created_at: new Date().toISOString()
    };

    try {
      await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          fullName: cleanName
        })
      });
    } catch {
      // Continue with local persistence if offline
    }

    accounts[cleanEmail] = newAccount;
    saveLocalAccounts(accounts);
    applyLocalAccountSession(newAccount);
    return {};
  };

  const signInWithDemo = async (): Promise<{ error?: string }> => {
    const accounts = loadLocalAccounts();
    const demoAccount = accounts[DEFAULT_DEMO_ACCOUNT.email] || DEFAULT_DEMO_ACCOUNT;
    accounts[DEFAULT_DEMO_ACCOUNT.email] = demoAccount;
    saveLocalAccounts(accounts);
    applyLocalAccountSession(demoAccount);
    return {};
  };

  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { error: 'Please enter your email address.' };
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
      if (error) {
        return { error: error.message };
      }
    }
    return {};
  };

  const updateProfile = async (updates: Partial<ProfileData>): Promise<{ error?: string }> => {
    if (!user) {
      return { error: 'No active user session.' };
    }

    const updatedProfile: ProfileData = {
      id: profile?.id || user.id,
      full_name: updates.full_name !== undefined ? updates.full_name : (profile?.full_name || 'Farmer'),
      preferred_language: updates.preferred_language || profile?.preferred_language || 'en',
      experience_years: updates.experience_years ?? profile?.experience_years ?? 5,
      avatar_url: updates.avatar_url ?? profile?.avatar_url,
      phone_number: updates.phone_number ?? profile?.phone_number
    };

    if (isSupabaseConfigured && supabase && !user.id.startsWith('farmer-')) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedProfile.full_name,
          preferred_language: updatedProfile.preferred_language,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }
    }

    if (user.email) {
      const cleanEmail = user.email.toLowerCase();
      const accounts = loadLocalAccounts();
      const existing = accounts[cleanEmail] || {
        id: user.id,
        email: cleanEmail,
        full_name: updatedProfile.full_name,
        preferred_language: updatedProfile.preferred_language,
        experience_years: updatedProfile.experience_years,
        created_at: new Date().toISOString()
      };
      const updatedAccount: StoredLocalAccount = {
        ...existing,
        full_name: updatedProfile.full_name,
        preferred_language: updatedProfile.preferred_language,
        experience_years: updatedProfile.experience_years
      };
      accounts[cleanEmail] = updatedAccount;
      saveLocalAccounts(accounts);
      applyLocalAccountSession(updatedAccount);

      try {
        await fetch('/api/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            full_name: updatedProfile.full_name,
            preferred_language: updatedProfile.preferred_language,
            experience_years: updatedProfile.experience_years
          })
        });
      } catch {
        // Ignore network errors
      }
    } else {
      setProfile(updatedProfile);
    }

    return {};
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    } catch {
      // Ignore storage errors
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore signout errors
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user && isSupabaseConfigured && supabase && !user.id.startsWith('farmer-')) {
      await fetchSupabaseProfile(user.id, user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signInWithDemo,
        resetPassword,
        updateProfile,
        signOut,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
