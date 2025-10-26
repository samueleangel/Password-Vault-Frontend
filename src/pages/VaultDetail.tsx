/**
 * Página de detalle de una credencial
 * Permite ver y revelar la contraseña cifrada
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
        setError("Credencial no encontrada");
      } else {
        setError(err.response?.data?.message || "Error al cargar la credencial");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRevealPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!masterPassword.trim()) {
      setRevealError("Ingresa tu contraseña maestra");
      return;
    }

    try {
      setRevealing(true);
      setRevealError(null);
      
      const response = await client.post(`/vault/${id}/reveal`, {
        master_password: masterPassword,
      });

      setRevealedPassword(response.data.password);
      
      // Auto-ocultar después de 30 segundos por seguridad
      setTimeout(() => {
        setRevealedPassword(null);
        setMasterPassword("");
      }, 30000);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setRevealError("Contraseña maestra incorrecta");
      } else {
        setRevealError(err.response?.data?.message || "Error al revelar la contraseña");
      }
    } finally {
      setRevealing(false);
    }
  };

  const handleCopyPassword = () => {
    if (revealedPassword) {
      navigator.clipboard.writeText(revealedPassword);
      alert("Contraseña copiada al portapapeles");
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
          <p>Cargando credencial...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="vault-container">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error || "Credencial no encontrada"}</p>
          <Link to="/vault" className="btn-primary">
            ← Volver al vault
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
            ← Volver
          </Link>
          <h1>{item.app_name}</h1>
        </div>

        <div className="detail-card">
          <div className="detail-section">
            <h3>Información</h3>
            
            {item.app_login_url && (
              <div className="detail-field">
                <label>URL de login</label>
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
                <label>Usuario</label>
                <p className="detail-value">{item.username}</p>
              </div>
            )}

            <div className="detail-field">
              <label>Fecha de creación</label>
              <p className="detail-value">
                {new Date(item.created_at).toLocaleString("es-ES")}
              </p>
            </div>

            {item.updated_at && (
              <div className="detail-field">
                <label>Última actualización</label>
                <p className="detail-value">
                  {new Date(item.updated_at).toLocaleString("es-ES")}
                </p>
              </div>
            )}
          </div>

          <div className="detail-section password-section">
            <h3>Contraseña cifrada</h3>

            {!revealedPassword ? (
              <form onSubmit={handleRevealPassword} className="reveal-form">
                {revealError && <div className="error-banner">{revealError}</div>}
                
                <div className="form-group">
                  <label htmlFor="master_password">
                    Ingresa tu contraseña maestra para revelar
                  </label>
                  <input
                    id="master_password"
                    type="password"
                    placeholder="Tu contraseña maestra"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={revealing}>
                  {revealing ? "Descifrando..." : "🔓 Mostrar contraseña"}
                </button>
              </form>
            ) : (
              <div className="revealed-password">
                <div className="password-display">
                  <code>{revealedPassword}</code>
                </div>
                <div className="password-actions">
                  <button onClick={handleCopyPassword} className="btn-secondary">
                    📋 Copiar
                  </button>
                  <button onClick={handleHidePassword} className="btn-secondary">
                    👁️ Ocultar
                  </button>
                </div>
                <p className="security-notice">
                  ⚠️ La contraseña se ocultará automáticamente en 30 segundos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

