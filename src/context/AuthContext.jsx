import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'exte_key';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [agentProfile, setAgentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user profile with stored token
  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return null;
    }
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const userData = data.user ?? data;
        const profileData = data.agentProfile ?? null;

        setUser(userData);
        setAgentProfile(profileData);
        return userData;
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setAgentProfile(null);
        return null;
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setAgentProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setAgentProfile(null);
  };

  const value = {
    user,
    setUser,
    agentProfile,
    setAgentProfile,
    loading,
    saveToken,
    logout,
    fetchMe,
    BASE_URL,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
