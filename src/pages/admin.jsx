import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { getPartners, updatePartnerStatus, deletePartner } from "../functions/firebase";
import "../css/admin.css";

const STATUS_OPTIONS = ["unapproved", "approved", "rejected"];

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

  const loadPartners = async () => {
  setLoading(true);
  setError(null);

  try {
    const data = await getPartners();

    const sorted = data.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA; // newest first
    });

    console.log("Sorted partners:", sorted);
    setPartners(sorted);

  } catch (err) {
    console.error(err);
    setError("Failed to load partners.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadPartners();
  }, []);

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
        <div className="section-header">
          <h2>Admin</h2>
          <p>Partner applications from the partners collection</p>
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
