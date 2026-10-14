import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CreatorProfile } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  creator: CreatorProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    handle?: string;
    specialization?: string;
  }) => Promise<void>;
  logout: () => void;
  updateCreatorProfile: (updates: Partial<CreatorProfile>) => Promise<void>;
  loginAsDemoCreator: (handle: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ACCOUNTS: Record<string, { email: string; pass: string }> = {
  elena_synth: { email: 'elena@creatorspace.ai', pass: 'Creator123!' },
  marcus_visuals: { email: 'marcus@creatorspace.ai', pass: 'Creator123!' },
  aria_couture: { email: 'aria@creatorspace.ai', pass: 'Creator123!' },
  tate_motion: { email: 'tate@creatorspace.ai', pass: 'Creator123!' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('creatorspace_jwt_token') || localStorage.getItem('kroma_jwt_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('creatorspace_jwt_token') || localStorage.getItem('kroma_jwt_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        setUser(res.user);
        setCreator(res.creator || null);
      } catch (err) {
        console.warn('Session expired or invalid token:', err);
        localStorage.removeItem('creatorspace_jwt_token');
        localStorage.removeItem('kroma_jwt_token');
        setToken(null);
        setUser(null);
        setCreator(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password = 'Creator123!') => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('creatorspace_jwt_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setCreator(res.creator || null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    handle?: string;
    specialization?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem('creatorspace_jwt_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setCreator(res.creator || null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('creatorspace_jwt_token');
    localStorage.removeItem('kroma_jwt_token');
    setToken(null);
    setUser(null);
    setCreator(null);
  };

  const updateCreatorProfile = async (updates: Partial<CreatorProfile>) => {
    const res = await api.updateProfile(updates);
    setCreator(res.data);
  };

  const loginAsDemoCreator = async (handle: string) => {
    const account = DEMO_ACCOUNTS[handle];
    if (account) {
      await login(account.email, account.pass);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        creator,
        token,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        updateCreatorProfile,
        loginAsDemoCreator,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
