// src/pages/Listing.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useListings } from "../context/ListingsContext";
import "../css/listing.css";
import Header from "../components/Header";

export default function Listing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { stores } = useListings();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch single item from backend
  const fetchListing = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/items/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Listing not found");
        throw new Error("Failed to fetch listing");
      }
      const data = await res.json();
      setListing(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="listing-page">
        <Header />
        <main className="listing-container">
          <h2 style={{ textAlign: "center", marginTop: "80px" }}>Loading...</h2>
        </main>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="listing-page">
        <Header />
        <main className="listing-container">
          <h2 style={{ textAlign: "center", marginTop: "80px" }}>
            {error || "Listing not found."}
          </h2>
        </main>
      </div>
    );
  }

  return (
    <div className="listing-page">
      <Header />
      <main className="listing-container">
        <aside className="listing-card" aria-label="Product details">
          {/* Clickable Image */}
          <img
            src={listing.image}
            alt={listing.title}
            className="listing-image"
            onClick={() => setShowModal(true)}
          />

          <div className="listing-body">
            <div className="title-row">
              <h3 className="listing-title">{listing.title}</h3>
              <div className="price-badge">${listing.price}</div>
            </div>

            <p className="description">{listing.description}</p>

            <div className="pickup">
              <h4>Pickup Location</h4>
              <div className="pickup-card">
                <div className="pickup-header">
                  <span className="pickup-dot" />
                  <div>{listing.location}</div>
                </div>

                <div className="map-preview">
                  <div className="map-pin">📍</div>
                  <button
                    className="view-map"
                    onClick={() => navigate("/map")}
                  >
                    View on map
                  </button>
                </div>
              </div>
            </div>

            <button
              className="continue-btn"
              onClick={() => alert("Continue flow (checkout / confirm pickup)")}
            >
              Continue
            </button>
          </div>
        </aside>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="image-modal" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevents closing when clicking image
          >
            <button
              className="close-modal"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <img src={listing.image} alt="Full view" />
          </div>
        </div>
      )}
    </div>
  );
}