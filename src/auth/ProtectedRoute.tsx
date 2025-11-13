/**
 * HOC component to protect routes
 * Redirects to login if no valid token
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Wait for token to load from sessionStorage
  useEffect(() => {
    const checkToken = () => {
      // Check if token exists in sessionStorage
      sessionStorage.getItem("pv_token");
      setIsLoading(false);
    };
    
    // Small delay to ensure sessionStorage is ready
    const timer = setTimeout(checkToken, 50);
    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
