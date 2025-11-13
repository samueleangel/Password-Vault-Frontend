/**
 * Credential detail page
 * Allows viewing and revealing encrypted password
 */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import client from "../api/client";
import { VaultItemDetail } from "../types";

export default function VaultDetail() {
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = useState<VaultItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [masterPassword, setMasterPassword] = useState("");
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [revealError, setRevealError] = useState<string | null>(null);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    loadVaultItem();
  }, [id]);

  const loadVaultItem = async () => {
    try {
      setLoading(true);
      setError(null);
      // Backend returns basic info without password if master_password not provided
      const response = await client.get(`/vault/detail/${id}`);
      setItem(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Credential not found");
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || "Error loading credential");
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
      
      console.log("🔓 Requesting password reveal for ID:", id);
      
      // Backend detail endpoint expects master_password in body of GET request
      const response = await client.request({
        method: 'GET',
        url: `/vault/detail/${id}`,
        data: { master_password: masterPassword }
      });

      console.log("✅ Password revealed successfully");
      console.log("🔐 Decrypted password:", response.data.password);
      
      setRevealedPassword(response.data.password);
      setTimeLeft(30);
      
      // Countdown timer
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setRevealedPassword(null);
            setMasterPassword("");
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Store interval ID to clear if user manually hides
      (window as any).revealInterval = interval;
      
    } catch (err: any) {
      console.error("❌ Error revealing password:", err);
      console.error("❌ Error response:", err.response?.data);
      
      if (err.response?.status === 401) {
        setRevealError("Incorrect master password");
      } else {
        setRevealError(err.response?.data?.error || err.response?.data?.message || "Error revealing password");
      }
    } finally {
      setRevealing(false);
    }
  };

  const handleCopyPassword = async () => {
    if (revealedPassword) {
      try {
        await navigator.clipboard.writeText(revealedPassword);
        setShowCopiedToast(true);
        console.log("📋 Password copied to clipboard");
        
        // Hide toast after 2 seconds
        setTimeout(() => {
          setShowCopiedToast(false);
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        alert("Failed to copy password");
      }
    }
  };

  const handleHidePassword = () => {
    // Clear the countdown interval
    if ((window as any).revealInterval) {
      clearInterval((window as any).revealInterval);
    }
    setRevealedPassword(null);
    setMasterPassword("");
    setTimeLeft(30);
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
                <div className="password-reveal-header">
                  <h4>🔓 Decrypted Password</h4>
                  <div className="countdown-timer">
                    Auto-hide in: <strong>{timeLeft}s</strong>
                  </div>
                </div>
                
                <div className="password-display">
                  <code className="password-code">{revealedPassword}</code>
                </div>
                
                <div className="password-actions">
                  <button onClick={handleCopyPassword} className="btn-copy">
                    📋 Copy to Clipboard
                  </button>
                  <button onClick={handleHidePassword} className="btn-hide">
                    👁️ Hide Password
                  </button>
                </div>
                
                <p className="security-notice">
                  ⚠️ Make sure no one is looking at your screen
                </p>

                {/* Toast notification */}
                {showCopiedToast && (
                  <div className="copy-toast">
                    ✅ Password copied to clipboard!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
