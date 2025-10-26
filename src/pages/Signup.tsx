/**
 * User registration page
 * Validates email and master password (min 12 characters)
 */

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import client from "../api/client";

// Zod validation schema
const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  master_password: z.string().min(12, "Master password must be at least 12 characters"),
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
      
      // Show message for 3 seconds before redirecting
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating account. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card success-card">
          <h1>✅ Account Created</h1>
          <p className="success-message">
            Check your email to verify your account before logging in.
          </p>
          <Link to="/login" className="link-button">
            Go to login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔐 Create Account</h1>
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
              placeholder="Minimum 12 characters"
              autoComplete="new-password"
              {...register("master_password")}
            />
            {errors.master_password && (
              <span className="error-text">{errors.master_password.message}</span>
            )}
            <small className="form-hint">
              This password will be used to encrypt/decrypt your credentials. Don't forget it.
            </small>
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

