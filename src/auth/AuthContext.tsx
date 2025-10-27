/**
 * Authentication context
 * Manages JWT state and sessionStorage persistence
 */

import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null, persist?: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  logout: () => {},
  isAuthenticated: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize token from sessionStorage immediately
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("pv_token");
    }
    return null;
  });

  // Sync token with sessionStorage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem("pv_token");
    if (storedToken && storedToken !== token) {
      setTokenState(storedToken);
    }
  }, [token]);

  const setToken = (newToken: string | null, persist = true) => {
    setTokenState(newToken);
    
    if (persist && newToken) {
      sessionStorage.setItem("pv_token", newToken);
    } else {
      sessionStorage.removeItem("pv_token");
    }
  };

  const logout = () => {
    setToken(null);
    // Redirect to login
    window.location.href = "/login";
  };

  const value = {
    token,
    setToken,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
