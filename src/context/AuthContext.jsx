import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const TOKEN_KEY = 'exte_key';

function decodeJwtPayload(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    return decodeJwtPayload(token);
  });
  const [agentProfile, setAgentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user profile with stored token
  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return null;
    }

    const decoded = decodeJwtPayload(token);
    if (decoded) {
      setUser((prev) => (prev ? { ...decoded, ...prev } : decoded));
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const userData = data.user ?? data;
        const profileData = data.agentProfile ?? null;

        setUser((prev) => ({ ...(prev || {}), ...userData }));
        setAgentProfile(profileData);
        return userData;
      } else {
        if (!decoded) {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
          setAgentProfile(null);
        }
        return null;
      }
    } catch {
      if (!decoded) {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setAgentProfile(null);
      }
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
    const decoded = decodeJwtPayload(token);
    if (decoded) {
      setUser(decoded);
    }
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
    TOKEN_KEY,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
