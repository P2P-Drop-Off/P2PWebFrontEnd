// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../css/home.css';
import '../css/style.css'; // shared tokens

// update path or replace with your real image in src/assets
import chairImg from "../assets/armchair.jpg";


export default function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="home-page">
      <Header />

      <main className="listing-container">
        <section className="intro-card" aria-labelledby="welcome-heading">
          <h2 id="welcome-heading">Welcome to P2P</h2>
          <p className="lead">
            P2P is your trusted peer-to-peer marketplace for secure second-hand transactions.
            We connect buyers and sellers in a safe, transparent environment.
          </p>
          <p className="more">
            Every transaction is protected — your items, your terms, our support.
          </p>

          <div className="dots" aria-hidden="true">
            <span className="dot dot--active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </section>

        <aside className="listing-card" aria-label="Product details">
          <div className="media-wrap">
            <img src={chairImg} alt="Vintage Armchair" className="listing-image" />
          </div>

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
                  <span className="pickup-dot" aria-hidden="true" />
                  <div>Downtown Area, Main Street</div>
                </div>

                <div className="map-preview" role="img" aria-label="pickup location map preview">
                  {/* Replace with MapComponent if you want interactive map */}
                  <div className="map-pin">📍</div>
                </div>

                <button className="view-map" onClick={() => navigate('/map')}>View on map</button>
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

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Peer to Peer Drop Off · All rights reserved</p>
      </footer>
    </div>
  );
}

