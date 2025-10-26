/**
 * Main vault page
 * Lists all saved credentials
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import client from "../api/client";
import { VaultItem } from "../types";

export default function VaultList() {
  const { logout } = useAuth();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadVaultItems();
  }, []);

  const loadVaultItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.get("/vault/list");
      
      // Backend may return {items: [...]} or directly [...]
      const data = response.data.items || response.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error loading credentials");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.app_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="vault-container">
      <header className="vault-header">
        <div className="vault-header-content">
          <h1>🔐 My Vault</h1>
          <button onClick={logout} className="btn-logout">
            Log out
          </button>
        </div>
      </header>

      <div className="vault-content">
        <div className="vault-actions">
          <input
            type="search"
            placeholder="🔍 Search credential..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Link to="/vault/new" className="btn-primary">
            + New credential
          </Link>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading credentials...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={loadVaultItems} className="btn-link">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && searchTerm === "" && (
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <h2>No saved credentials</h2>
            <p>Start by adding your first credential to keep it secure</p>
            <Link to="/vault/new" className="btn-primary">
              + Create first credential
            </Link>
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && searchTerm !== "" && (
          <div className="empty-state">
            <p>No credentials found matching "{searchTerm}"</p>
          </div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <div className="vault-grid">
            {filteredItems.map((item) => (
              <Link to={`/vault/${item.id}`} key={item.id} className="vault-card">
                <div className="vault-card-header">
                  <h3>{item.app_name}</h3>
                </div>
                <div className="vault-card-body">
                  {item.username && (
                    <p className="vault-username">
                      <span className="label">Username:</span> {item.username}
                    </p>
                  )}
                  {item.app_login_url && (
                    <p className="vault-url">
                      <span className="label">URL:</span>{" "}
                      <span className="url-text">{item.app_login_url}</span>
                    </p>
                  )}
                  <p className="vault-date">
                    <span className="label">Created:</span>{" "}
                    {new Date(item.created_at).toLocaleDateString("en-US")}
                  </p>
                </div>
                <div className="vault-card-footer">
                  <span className="link-text">View details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
