/**
 * HOC component to protect routes
 * Redirects to login if no valid token
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
