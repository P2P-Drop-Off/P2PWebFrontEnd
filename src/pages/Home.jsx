// src/pages/Home.jsx
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../css/home.css';
import '../css/style.css'; // shared tokens

// update path or replace with your real image in src/assets
import chairImg from "../assets/armchair.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({
    how: false,
    rentals: false,
    safety: false,
    whyDNO: false,
  });

  const [showRentalDetails, setShowRentalDetails] = useState(false);

  const toggle = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    
    <div className="home-page">
      <Header />

      <main className="home-container">

      {/* Main */}
      <section className="main-info">
        <h1>Drop 'N Off</h1>
        <p className="main-info-sub">
          The safer way to buy and sell — powered by trusted local businesses.
        </p>
      </section>

      {/* MISSION CARD */}
      <section className="home-card">
        <h2>What is Drop 'N Off?</h2>
        <p>
          Drop 'N Off is a secure peer-to-peer marketplace designed to eliminate
          awkward meetups and safety risks.
        </p>
        <p>
          Instead of meeting strangers, transactions are completed through
          verified partner businesses in your community.
        </p>
        <div className="tagline">
          Drop off. Get paid.
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-card">
        <button
          className={`accordion-btn ${openSections.how ? "open" : ""}`}
          onClick={() => toggle("how")}
        >
          How It Works
          <span className="accordion-arrow" />
        </button>

        {openSections.how && (
          <div className="accordion-content clean">
            <div className="step">
              <span>1</span>
              <p>Seller creates a listing for their item, which generates a unique link.</p>
            </div>
            <div className="step">
              <span>2</span>
              <p>Seller sends the unique link to a potential buyer.</p>
            </div>
            <div className="step">
              <span>3</span>
              <p>Buyer confirms the listing details and accepts the transaction.</p>
            </div>
            <div className="step">
              <span>4</span>
              <p>Seller drops item off at a verified partner location.</p>
            </div>
            <div className="step">
              <span>5</span>
              <p>Buyer pays and picks the item up at their convenience.</p>
            </div>
          </div>
        )}
      </section>

      {/* RENTALS */}
      <section className="home-card">
        <button
          className={`accordion-btn ${openSections.rentals ? "open" : ""}`}
          onClick={() => toggle("rentals")}
        >
          Rentals (Coming Soon!)
          <span className="accordion-arrow" />
        </button>

        {openSections.rentals && (
          <div className="accordion-content clean">
            <h3>Earn Passive Income with Drop 'N Off Rentals</h3>
            <p>
              Rent your items out and make money! Trusted businesses handle storage,
              logistics, and management.
            </p>

            <button
              className="learn-more-btn"
              onClick={() => setShowRentalDetails(!showRentalDetails)}
            >
              Learn More
            </button>

            {showRentalDetails && (
              <div className="nested-content">
                <div className="step">
                  <span>1</span>
                  <p>Select a participating business to manage your rental item.</p>
                </div>
                <div className="step">
                  <span>2</span>
                  <p>
                    For a small monthly fee + percentage of rental cost, your rental item is fully managed.
                  </p>
                </div>
                <div className="step">
                  <span>3</span>
                  <p>Each time your item is rented out, you earn worry-free passive income!</p>
                </div>
              </div>


            )}
          </div>
        )}
      </section>

      {/* WHY DROP N OFF */}
      <section className="home-card">
        <button
          className={`accordion-btn ${openSections.whyDNO ? "open" : ""}`}
          onClick={() => toggle("whyDNO")}
        >
          Why Drop 'N Off?
          <span className="accordion-arrow" />
        </button>

        {openSections.whyDNO && (
            <div className="accordion-content clean">
            <h3>Second-hand shopping <i>simplified.</i></h3>
            <p><b></b>Second-handing shopping is cheaper and more sustainable than buying new, but it can be uncomfortable <br></br> (and even risky) to coordinate meet ups with strangers.<br></br><br></br><h4>That's where Drop 'N Off comes in:</h4><br></br></p>
            <div className="whyDNO-list">
              <div className="step">
                  <span>✓</span>
                  <p>Partner businesses are vetted and verified for safety and reliability.</p>
              </div>
              <div className="step">
                  <span>✓</span>
                  <p>All items are verified and inspected by partner businesses before being accepted.</p>
              </div>
              <div className="step">
                  <span>✓</span>
                  <p>Items will be stored securely and can be picked up at your convenience.</p>
              </div>
              <div className="step">
                  <span>✓</span>
                  <p>The only strangers you will meet are the staff at our trusted local partner businesses who manage <br></br>Drop 'N Off transactions.</p>
              </div>
            </div>

          </div>
        )}
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="cta-box">
        <h2 className="cta-title">Ready to Get Started?</h2>
        <p className="cta-subtext">
          Join the Drop 'N Off community and experience a better way to buy and sell locally.
        </p>

        <button
          className="cta-button"
          onClick={() => navigate("/create-account")}
        >
          Create Your Account
        </button>
      </section>

    </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Peer to Peer Drop Off · All rights reserved</p>
      </footer>
    </div>
  );
}

