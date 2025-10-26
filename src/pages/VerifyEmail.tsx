/**
 * Página de verificación de email
 * Lee el token de los query params y valida con el backend
 */

import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import client from "../api/client";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Token de verificación no encontrado");
        return;
      }

      try {
        const response = await client.get(`/auth/verify?token=${encodeURIComponent(token)}`);
        setStatus("success");
        setMessage(response.data?.message || "Email verificado correctamente");
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Token inválido o expirado. Solicita uno nuevo."
        );
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {status === "loading" && (
          <div className="verify-status">
            <div className="spinner"></div>
            <h2>Verificando tu email...</h2>
          </div>
        )}

        {status === "success" && (
          <div className="verify-status success">
            <div className="icon-large">✅</div>
            <h1>Email verificado</h1>
            <p className="success-message">{message}</p>
            <Link to="/login" className="btn-primary">
              Ir al login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="verify-status error">
            <div className="icon-large">❌</div>
            <h1>Error de verificación</h1>
            <p className="error-message">{message}</p>
            <div className="button-group">
              <Link to="/signup" className="btn-secondary">
                Crear cuenta nueva
              </Link>
              <Link to="/login" className="btn-primary">
                Intentar login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

