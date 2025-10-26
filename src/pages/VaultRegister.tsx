/**
 * Page to register a new credential
 * Requires master password for encryption
 */

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import client from "../api/client";

const vaultRegisterSchema = z.object({
  app_name: z.string().min(1, "App name is required"),
  app_login_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  username: z.string().optional(),
  password: z.string().min(1, "Password is required"),
  master_password: z.string().min(1, "Master password is required"),
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
      
      // Clean empty URL
      const payload = {
        ...data,
        app_login_url: data.app_login_url || undefined,
        username: data.username || undefined,
      };

      await client.post("/vault/register", payload);
      navigate("/vault");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Incorrect master password");
      } else {
        setError(err.response?.data?.message || "Error saving credential");
      }
    }
  };

  return (
    <div className="vault-container">
      <div className="vault-form-wrapper">
        <div className="form-header">
          <Link to="/vault" className="back-button">
            ← Back
          </Link>
          <h1>New Credential</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="vault-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="app_name">
              Application name <span className="required">*</span>
            </label>
            <input
              id="app_name"
              type="text"
              placeholder="e.g: GitHub, Gmail, Netflix..."
              autoComplete="off"
              {...register("app_name")}
            />
            {errors.app_name && <span className="error-text">{errors.app_name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="app_login_url">Login URL (optional)</label>
            <input
              id="app_login_url"
              type="url"
              placeholder="https://example.com/login"
              autoComplete="off"
              {...register("app_login_url")}
            />
            {errors.app_login_url && (
              <span className="error-text">{errors.app_login_url.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username / Email (optional)</label>
            <input
              id="username"
              type="text"
              placeholder="user@example.com"
              autoComplete="off"
              {...register("username")}
            />
            {errors.username && <span className="error-text">{errors.username.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password to save <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="The password you want to encrypt"
                autoComplete="off"
                {...register("password")}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <div className="form-group master-password-group">
            <label htmlFor="master_password">
              Your master password <span className="required">*</span>
            </label>
            <input
              id="master_password"
              type="password"
              placeholder="To encrypt this credential"
              autoComplete="current-password"
              {...register("master_password")}
            />
            {errors.master_password && (
              <span className="error-text">{errors.master_password.message}</span>
            )}
            <small className="form-hint">
              We need your master password to encrypt this credential securely
            </small>
          </div>

          <div className="form-actions">
            <Link to="/vault" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "💾 Save credential"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
