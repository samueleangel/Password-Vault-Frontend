/**
 * Email verification page
 * Reads token from query params and validates with backend
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
        setMessage("Verification token not found");
        return;
      }

      try {
        const response = await client.get(`/auth/verify?token=${encodeURIComponent(token)}`);
        setStatus("success");
        setMessage(response.data?.message || "Email verified successfully");
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Invalid or expired token. Please request a new one."
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
            <h2>Verifying your email...</h2>
          </div>
        )}

        {status === "success" && (
          <div className="verify-status success">
            <div className="icon-large">✅</div>
            <h1>Email Verified</h1>
            <p className="success-message">{message}</p>
            <Link to="/login" className="btn-primary">
              Go to login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="verify-status error">
            <div className="icon-large">❌</div>
            <h1>Verification Error</h1>
            <p className="error-message">{message}</p>
            <div className="button-group">
              <Link to="/signup" className="btn-secondary">
                Create new account
              </Link>
              <Link to="/login" className="btn-primary">
                Try logging in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
