/**
 * Página para registrar una nueva credencial
 * Requiere master password para cifrar
 */

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import client from "../api/client";

const vaultRegisterSchema = z.object({
  app_name: z.string().min(1, "El nombre de la app es requerido"),
  app_login_url: z.string().url("URL inválida").optional().or(z.literal("")),
  username: z.string().optional(),
  password: z.string().min(1, "La contraseña es requerida"),
  master_password: z.string().min(1, "La contraseña maestra es requerida"),
});

type VaultRegisterFormData = z.infer<typeof vaultRegisterSchema>;

export default function VaultRegister() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VaultRegisterFormData>({
    resolver: zodResolver(vaultRegisterSchema),
  });

  const onSubmit = async (data: VaultRegisterFormData) => {
    try {
      setError(null);
      
      // Limpiar URL vacía
      const payload = {
        ...data,
        app_login_url: data.app_login_url || undefined,
        username: data.username || undefined,
      };

      await client.post("/vault/register", payload);
      navigate("/vault");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Contraseña maestra incorrecta");
      } else {
        setError(err.response?.data?.message || "Error al guardar la credencial");
      }
    }
  };

  return (
    <div className="vault-container">
      <div className="vault-form-wrapper">
        <div className="form-header">
          <Link to="/vault" className="back-button">
            ← Volver
          </Link>
          <h1>Nueva credencial</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="vault-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="app_name">
              Nombre de la aplicación <span className="required">*</span>
            </label>
            <input
              id="app_name"
              type="text"
              placeholder="ej: GitHub, Gmail, Netflix..."
              autoComplete="off"
              {...register("app_name")}
            />
            {errors.app_name && <span className="error-text">{errors.app_name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="app_login_url">URL de login (opcional)</label>
            <input
              id="app_login_url"
              type="url"
              placeholder="https://ejemplo.com/login"
              autoComplete="off"
              {...register("app_login_url")}
            />
            {errors.app_login_url && (
              <span className="error-text">{errors.app_login_url.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">Usuario / Email (opcional)</label>
            <input
              id="username"
              type="text"
              placeholder="usuario@ejemplo.com"
              autoComplete="off"
              {...register("username")}
            />
            {errors.username && <span className="error-text">{errors.username.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña a guardar <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="La contraseña que quieres cifrar"
                autoComplete="off"
                {...register("password")}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <div className="form-group master-password-group">
            <label htmlFor="master_password">
              Tu contraseña maestra <span className="required">*</span>
            </label>
            <input
              id="master_password"
              type="password"
              placeholder="Para cifrar esta credencial"
              autoComplete="current-password"
              {...register("master_password")}
            />
            {errors.master_password && (
              <span className="error-text">{errors.master_password.message}</span>
            )}
            <small className="form-hint">
              Necesitamos tu contraseña maestra para cifrar esta credencial de forma segura
            </small>
          </div>

          <div className="form-actions">
            <Link to="/vault" className="btn-secondary">
              Cancelar
            </Link>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "💾 Guardar credencial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

