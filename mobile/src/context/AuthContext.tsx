import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

interface AuthContextValue {
  token?: string;
  email?: string;
  booting: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const savedToken = await AsyncStorage.getItem('orbit-token');
      const savedEmail = await AsyncStorage.getItem('orbit-email');
      setToken(savedToken || undefined);
      setEmail(savedEmail || undefined);
      setBooting(false);
    };

    restore();
  }, []);

  const persist = async (nextToken: string, nextEmail: string) => {
    setToken(nextToken);
    setEmail(nextEmail);
    await AsyncStorage.multiSet([
      ['orbit-token', nextToken],
      ['orbit-email', nextEmail]
    ]);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      email,
      booting,
      login: async (nextEmail, password) => {
        const result = await api.login(nextEmail, password);
        await persist(result.token, result.user.email);
      },
      register: async (nextEmail, password) => {
        const result = await api.register(nextEmail, password);
        await persist(result.token, result.user.email);
      },
      logout: async () => {
        setToken(undefined);
        setEmail(undefined);
        await AsyncStorage.multiRemove(['orbit-token', 'orbit-email']);
      }
    }),
    [token, email, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};

