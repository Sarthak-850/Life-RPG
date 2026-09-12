import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Character } from '../types/index.js';
import api from '../services/api.js';

interface AuthContextType {
  user: User | null;
  character: Character | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateCharacter: (updated: Partial<Character>) => void;
  refreshCharacter: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('life_rpg_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .getMe()
      .then((data) => {
        setUser(data.user);
        setCharacter(data.character);
      })
      .catch((_err) => {
        api.removeToken();
        setUser(null);
        setCharacter(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (payload: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const data = await api.login(payload);
      setUser(data.user);
      setCharacter(data.character);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: { username: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      const data = await api.register(payload);
      setUser(data.user);
      setCharacter(data.character);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setCharacter(null);
  };

  const updateCharacter = (updated: Partial<Character>) => {
    setCharacter((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const refreshCharacter = async () => {
    try {
      const refreshed = await api.getCharacter();
      setCharacter(refreshed);
    } catch {
      // Ignored
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        character,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        updateCharacter,
        refreshCharacter,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
