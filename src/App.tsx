/**
 * Componente principal de la aplicación
 * Configura el routing y contexto de autenticación
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// Páginas
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import VaultList from "./pages/VaultList";
import VaultRegister from "./pages/VaultRegister";
import VaultDetail from "./pages/VaultDetail";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta raíz redirige al vault */}
          <Route path="/" element={<Navigate to="/vault" replace />} />

          {/* Rutas públicas - Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas - Vault */}
          <Route
            path="/vault"
            element={
              <ProtectedRoute>
                <VaultList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vault/new"
            element={
              <ProtectedRoute>
                <VaultRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vault/:id"
            element={
              <ProtectedRoute>
                <VaultDetail />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="error-container">
                <h1>404</h1>
                <p>Página no encontrada</p>
                <a href="/vault" className="btn-primary">
                  Ir al vault
                </a>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

