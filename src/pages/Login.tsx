/**
 * Página de login
 * Autentica al usuario y guarda el JWT
 */

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import client from "../api/client";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  master_password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      const response = await client.post("/auth/login", data);
      
      // Guardar token
      setToken(response.data.token);

      // Redirigir a la ruta anterior o al vault
      const from = (location.state as any)?.from?.pathname || "/vault";
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Credenciales incorrectas");
      } else if (err.response?.status === 403) {
        setError("Debes verificar tu email antes de iniciar sesión");
      } else {
        setError(err.response?.data?.message || "Error al iniciar sesión. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔐 Iniciar sesión</h1>
          <p className="auth-subtitle">Password Vault</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="master_password">Contraseña maestra</label>
            <input
              id="master_password"
              type="password"
              placeholder="Tu contraseña maestra"
              autoComplete="current-password"
              {...register("master_password")}
            />
            {errors.master_password && (
              <span className="error-text">{errors.master_password.message}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Iniciando sesión..." : "Entrar"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta? <Link to="/signup">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

