/**
 * Página principal del vault
 * Lista todas las credenciales guardadas
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
      
      // El backend puede retornar {items: [...]} o directamente [...]
      const data = response.data.items || response.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar las credenciales");
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
          <h1>🔐 Mi Bóveda</h1>
          <button onClick={logout} className="btn-logout">
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="vault-content">
        <div className="vault-actions">
          <input
            type="search"
            placeholder="🔍 Buscar credencial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Link to="/vault/new" className="btn-primary">
            + Nueva credencial
          </Link>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando credenciales...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={loadVaultItems} className="btn-link">
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && searchTerm === "" && (
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <h2>No tienes credenciales guardadas</h2>
            <p>Comienza agregando tu primera credencial para mantenerla segura</p>
            <Link to="/vault/new" className="btn-primary">
              + Crear primera credencial
            </Link>
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && searchTerm !== "" && (
          <div className="empty-state">
            <p>No se encontraron credenciales que coincidan con "{searchTerm}"</p>
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
                      <span className="label">Usuario:</span> {item.username}
                    </p>
                  )}
                  {item.app_login_url && (
                    <p className="vault-url">
                      <span className="label">URL:</span>{" "}
                      <span className="url-text">{item.app_login_url}</span>
                    </p>
                  )}
                  <p className="vault-date">
                    <span className="label">Creada:</span>{" "}
                    {new Date(item.created_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div className="vault-card-footer">
                  <span className="link-text">Ver detalles →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

