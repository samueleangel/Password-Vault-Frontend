/**
 * Credential detail page
 * Allows viewing and revealing encrypted password
 */

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { VaultItemDetail } from "../types";

export default function VaultDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<VaultItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [masterPassword, setMasterPassword] = useState("");
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [revealError, setRevealError] = useState<string | null>(null);

  useEffect(() => {
    loadVaultItem();
  }, [id]);

  const loadVaultItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.get(`/vault/${id}`);
      setItem(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Credential not found");
      } else {
        setError(err.response?.data?.message || "Error loading credential");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRevealPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!masterPassword.trim()) {
      setRevealError("Enter your master password");
      return;
    }

    try {
      setRevealing(true);
      setRevealError(null);
      
      const response = await client.post(`/vault/${id}/reveal`, {
        master_password: masterPassword,
      });

      setRevealedPassword(response.data.password);
      
      // Auto-hide after 30 seconds for security
      setTimeout(() => {
        setRevealedPassword(null);
        setMasterPassword("");
      }, 30000);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setRevealError("Incorrect master password");
      } else {
        setRevealError(err.response?.data?.message || "Error revealing password");
      }
    } finally {
      setRevealing(false);
    }
  };

  const handleCopyPassword = () => {
    if (revealedPassword) {
      navigator.clipboard.writeText(revealedPassword);
      alert("Password copied to clipboard");
    }
  };

  const handleHidePassword = () => {
    setRevealedPassword(null);
    setMasterPassword("");
  };

  if (loading) {
    return (
      <div className="vault-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading credential...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="vault-container">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error || "Credential not found"}</p>
          <Link to="/vault" className="btn-primary">
            ← Back to vault
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vault-container">
      <div className="vault-detail-wrapper">
        <div className="form-header">
          <Link to="/vault" className="back-button">
            ← Back
          </Link>
          <h1>{item.app_name}</h1>
        </div>

        <div className="detail-card">
          <div className="detail-section">
            <h3>Information</h3>
            
            {item.app_login_url && (
              <div className="detail-field">
                <label>Login URL</label>
                <a
                  href={item.app_login_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-link"
                >
                  {item.app_login_url} 🔗
                </a>
              </div>
            )}

            {item.username && (
              <div className="detail-field">
                <label>Username</label>
                <p className="detail-value">{item.username}</p>
              </div>
            )}

            <div className="detail-field">
              <label>Created</label>
              <p className="detail-value">
                {new Date(item.created_at).toLocaleString("en-US")}
              </p>
            </div>

            {item.updated_at && (
              <div className="detail-field">
                <label>Last updated</label>
                <p className="detail-value">
                  {new Date(item.updated_at).toLocaleString("en-US")}
                </p>
              </div>
            )}
          </div>

          <div className="detail-section password-section">
            <h3>Encrypted Password</h3>

            {!revealedPassword ? (
              <form onSubmit={handleRevealPassword} className="reveal-form">
                {revealError && <div className="error-banner">{revealError}</div>}
                
                <div className="form-group">
                  <label htmlFor="master_password">
                    Enter your master password to reveal
                  </label>
                  <input
                    id="master_password"
                    type="password"
                    placeholder="Your master password"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={revealing}>
                  {revealing ? "Decrypting..." : "🔓 Show password"}
                </button>
              </form>
            ) : (
              <div className="revealed-password">
                <div className="password-display">
                  <code>{revealedPassword}</code>
                </div>
                <div className="password-actions">
                  <button onClick={handleCopyPassword} className="btn-secondary">
                    📋 Copy
                  </button>
                  <button onClick={handleHidePassword} className="btn-secondary">
                    👁️ Hide
                  </button>
                </div>
                <p className="security-notice">
                  ⚠️ Password will be hidden automatically in 30 seconds
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
