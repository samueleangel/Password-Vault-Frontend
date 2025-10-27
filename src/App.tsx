/**
 * Main application component
 * Configures routing and authentication context
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// Pages
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
          {/* Root route redirects to vault */}
          <Route path="/" element={<Navigate to="/vault" replace />} />

          {/* Public routes - Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes - Vault */}
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
          {/* Backend uses detail instead of just id */}
          <Route
            path="/vault/detail/:id"
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
                <p>Page not found</p>
                <a href="/vault" className="btn-primary">
                  Go to vault
                </a>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
