// src/pages/Listing.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/listing.css";
import Header from "../components/Header";
import chairImg from "../assets/armchair.jpg";

export default function Listing() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="listing-page">
      <Header />

      <main className="listing-container">
        <aside className="listing-card" aria-label="Product details">
          
                {/* Clickable Image */}
            <img
                src={chairImg}
                alt="Vintage Armchair"
                className="listing-image"
                onClick={() => setShowModal(true)}
            />

          <div className="listing-body">
            <div className="title-row">
              <h3 className="listing-title">Vintage Armchair</h3>
              <div className="price-badge">$85</div>
            </div>

            <p className="description">
              Beautiful mid-century modern armchair in excellent condition. Comfortable velvet
              upholstery with wooden legs. Perfect for a reading nook or living room accent piece.
            </p>

            <div className="pickup">
                <h4>Pickup Location</h4>

                <div className="pickup-card">
                    <div className="pickup-header">
                        <span className="pickup-dot" />
                        <div>Downtown Area, Main Street</div>
                    </div>

                    <div className="map-preview">
                        <div className="map-pin">📍</div>

                        <button
                        className="view-map"
                        onClick={() => navigate('/map')}
                        >
                        View on map
                        </button>
                    </div>
                </div>
            </div>

            <button
              className="continue-btn"
              onClick={() => alert('Continue flow (checkout / confirm pickup)')}
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

            <img src={chairImg} alt="Full view" />
            </div>
        </div>
        )}
    </div>
  );
}
