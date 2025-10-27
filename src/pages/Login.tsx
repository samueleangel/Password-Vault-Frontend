/**
 * Login page
 * Authenticates user and saves JWT
 */

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import client from "../api/client";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  master_password: z.string().min(1, "Password is required"),
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
      
      // Backend returns 'access_token' instead of 'token'
      const token = response.data.access_token || response.data.token;
      
      if (!token) {
        setError("No token received from server");
        return;
      }
      
      // Save token
      setToken(token);

      // Redirect to previous route or vault
      const from = (location.state as any)?.from?.pathname || "/vault";
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Incorrect credentials");
      } else if (err.response?.status === 403) {
        setError("You must verify your email before logging in");
      } else {
        setError(err.response?.data?.message || "Error logging in. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔐 Log In</h1>
          <p className="auth-subtitle">Password Vault</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="master_password">Master Password</label>
            <input
              id="master_password"
              type="password"
              placeholder="Your master password"
              autoComplete="current-password"
              {...register("master_password")}
            />
            {errors.master_password && (
              <span className="error-text">{errors.master_password.message}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
