/**
 * Componente HOC para proteger rutas
 * Redirige a login si no hay token válido
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
    // Guardar la ubicación intentada para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

