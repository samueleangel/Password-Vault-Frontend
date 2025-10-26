/**
 * Página de registro de usuario
 * Valida email y master password (mín 12 caracteres)
 */

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import client from "../api/client";

// Schema de validación Zod
const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  master_password: z.string().min(12, "La contraseña maestra debe tener al menos 12 caracteres"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError(null);
      await client.post("/auth/signup", data);
      setSuccess(true);
      
      // Mensaje por 3 segundos antes de redirigir
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al crear la cuenta. Intenta de nuevo.");
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card success-card">
          <h1>✅ Cuenta creada</h1>
          <p className="success-message">
            Revisa tu email para verificar tu cuenta antes de iniciar sesión.
          </p>
          <Link to="/login" className="link-button">
            Ir al login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔐 Crear cuenta</h1>
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
              placeholder="Mínimo 12 caracteres"
              autoComplete="new-password"
              {...register("master_password")}
            />
            {errors.master_password && (
              <span className="error-text">{errors.master_password.message}</span>
            )}
            <small className="form-hint">
              Esta contraseña se usará para cifrar/descifrar tus credenciales. No la olvides.
            </small>
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

