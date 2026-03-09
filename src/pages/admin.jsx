import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import { getPartners, updatePartnerStatus, deletePartner } from "../functions/firebase";
import "../css/admin.css";

const STATUS_OPTIONS = ["unapproved", "approved", "rejected"];
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const ADMIN_SESSION_KEY = "admin-authenticated";

function getInitialAuthState() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function formatAddress(partner) {
  const parts = [
    partner.street,
    partner.suite && `Suite ${partner.suite}`,
    partner.city,
    partner.state,
    partner.zip,
  ].filter(Boolean);
  return parts.join(", ") || "—";
}

function formatHours(hours) {
  if (!hours || typeof hours !== "object") return "—";
  const dayNames = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
  return Object.entries(hours)
    .map(([day, data]) => {
      const label = dayNames[day] || day;
      if (data?.closed) return `${label}: Closed`;
      if (data?.open && data?.close) return `${label}: ${data.open}–${data.close}`;
      return `${label}: —`;
    })
    .join(" · ");
}

export default function AdminDashboard() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState);

  const loadPartners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPartners();
      const sorted = data.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
      setPartners(sorted);
    } catch (err) {
      console.error(err);
      setError("Failed to load partners.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadPartners();
  }, [isAuthenticated, loadPartners]);

  const handleUnlock = (event) => {
    event.preventDefault();

    if (!ADMIN_PASSWORD) {
      setAuthError("Admin password is not configured in the environment.");
      return;
    }

    if (password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setIsAuthenticated(true);
      setAuthError("");
      setPassword("");
      return;
    }

    setAuthError("Incorrect password.");
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setExpandedId(null);
    setAuthError("");
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="admin-container">
          <div className="section-header">
            <h2>Admin</h2>
            <p>Enter the admin password to continue.</p>
          </div>

          <div className="admin-login-card">
            <form className="admin-login-form" onSubmit={handleUnlock}>
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (authError) setAuthError("");
                }}
                placeholder="Enter admin password"
                autoComplete="current-password"
              />
              {authError && <p className="admin-error">{authError}</p>}
              <button type="submit" className="primary">
                Unlock Admin
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(id);
    try {
      await updatePartnerStatus(id, newStatus);
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id, storeName) => {
    if (!window.confirm(`Delete partner "${storeName || id}"? This cannot be undone.`)) return;
    setActionLoading(id);
    try {
      await deletePartner(id);
      setPartners((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete partner.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <Header />
      <div className="admin-container">
        <div className="section-header admin-header-row">
          <div>
            <h2>Admin</h2>
            <p>Partner applications from the partners collection</p>
          </div>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Lock Admin
          </button>
        </div>

        <div className="partners-section">
          <h3>Partner Applications</h3>
          {loading && <p className="admin-loading">Loading partners…</p>}
          {error && <p className="admin-error">{error}</p>}
          {!loading && !error && partners.length === 0 && (
            <p className="admin-empty">No partner applications yet.</p>
          )}
          {!loading && partners.length > 0 && (
            <div className="partners-table-wrap">
              <table className="partners-table">
                <thead>
                  <tr>
                    <th>Store</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Submitter</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <React.Fragment key={partner.id}>
                      <tr>
                        <td>
                          <div className="partner-name">{partner.storeName || "—"}</div>
                          {partner.storeType && (
                            <div className="partner-meta">{partner.storeType}</div>
                          )}
                          {partner.space && (
                            <div className="partner-meta">{partner.space} sq ft · {partner.itemsCanStore || "—"}</div>
                          )}
                        </td>
                        <td className="partner-address">{formatAddress(partner)}</td>
                        <td>
                          <div>{partner.phone || "—"}</div>
                          <div>{partner.email || "—"}</div>
                        </td>
                        <td>
                          <div>{partner.submittersName || "—"}</div>
                          {partner.role && <div className="partner-meta">{partner.role}</div>}
                        </td>
                        <td>
                          <span className={`status status-${partner.status || "unapproved"}`}>
                            {partner.status || "unapproved"}
                          </span>
                        </td>
                        <td>{partner.createdAt ? new Date(partner.createdAt).toLocaleDateString() : "—"}</td>
                        <td className="partner-actions">
                          <select
                            value={partner.status || "unapproved"}
                            onChange={(e) => handleStatusChange(partner.id, e.target.value)}
                            disabled={actionLoading === partner.id}
                            className="status-select"
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="btn-delete"
                            onClick={() => handleDelete(partner.id, partner.storeName)}
                            disabled={actionLoading === partner.id}
                            title="Delete"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className="btn-toggle-details"
                            onClick={() => setExpandedId(expandedId === partner.id ? null : partner.id)}
                          >
                            {expandedId === partner.id ? "▲ Less" : "▼ More"}
                          </button>
                        </td>
                      </tr>
                      {expandedId === partner.id && (
                        <tr className="partner-details-row">
                          <td colSpan={7}>
                            <div className="partner-details">
                              <div className="partner-details-grid">
                                <div>
                                  <strong>Hours</strong>
                                  <p>{formatHours(partner.hours)}</p>
                                </div>
                                <div>
                                  <strong>Amenities</strong>
                                  <p>{Array.isArray(partner.amenities) && partner.amenities.length ? partner.amenities.join(", ") : "—"}</p>
                                </div>
                                <div className="full-width">
                                  <strong>Instructions</strong>
                                  <p>{partner.instructions || "—"}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
