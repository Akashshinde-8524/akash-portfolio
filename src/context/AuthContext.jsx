import { useState } from "react";
import { AuthContext } from "./AuthContextObject";

const ADMIN_SESSION_KEY = "portfolio_master_session";
const DEFAULT_SECRET_KEY = "akash@admin2026";

export function AuthProvider({ children }) {
  const configuredSecretKey = import.meta.env.VITE_ADMIN_SECRET_KEY || DEFAULT_SECRET_KEY;

  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.authenticated) return parsed;
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (inputKey, rememberMe = true) => {
    setError(null);
    setLoading(true);

    // Small delay for natural feel
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!inputKey || !inputKey.trim()) {
      setLoading(false);
      const msg = "Please enter the Master Secret Key.";
      setError(msg);
      throw new Error(msg);
    }

    if (inputKey.trim() !== configuredSecretKey.trim()) {
      setLoading(false);
      const msg = "Access Denied: Invalid Master Secret Key.";
      setError(msg);
      throw new Error(msg);
    }

    const sessionUser = {
      role: "admin",
      authenticated: true,
      authenticatedAt: new Date().toISOString(),
    };

    if (rememberMe) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionUser));
    }
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionUser));

    setUser(sessionUser);
    setLoading(false);
    return sessionUser;
  };

  const logout = async () => {
    setError(null);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user?.authenticated),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

