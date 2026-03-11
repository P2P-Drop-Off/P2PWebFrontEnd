// src/pages/SellingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { useListings, statusLabels } from '../context/ListingsContext';
import Header from '../components/Header';
import '../css/sell.css';

const SellingPage = () => {
  const navigate = useNavigate();
  const { listings, stats, currentUser, updateListingStatus, setListings } = useListings();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filter listings for current seller
  const userListings = listings.filter(
    item => item.ownerUid === currentUser?.uid
  );

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalOpen(false);
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const deleteListing = async () => {
    try {
        console.log("Deleting item:", itemToDelete.id);

        const auth = getAuth();
        const user = auth.currentUser;
        const token = await user.getIdToken();

        const res = await fetch(`http://localhost:8080/api/items/${itemToDelete.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
        });

        console.log("Delete response:", res);

        if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
        }

        setListings(prev => prev.filter(i => i.id !== itemToDelete.id));
        setShowDeleteModal(false);

    } catch (err) {
        console.error(err);
        alert("Failed to delete listing");
    }
    };


  const markPaymentReceived = async (item) => {
  if (!item) return;

  try {
    const auth = getAuth();
    const firebaseUser = auth.currentUser; // Firebase user object

    if (!firebaseUser) {
      alert("Not logged in");
      return;
    }

    const token = await firebaseUser.getIdToken(); // ✅ this exists

    const response = await fetch(`http://localhost:8080/api/items/${item.id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "payment_received" }),
    });

    if (response.ok) {
      setSelectedItem(prev => ({ ...prev, status: "payment_received" }));
    } else {
      const text = await response.text();
      alert("Failed to update status: " + text);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to update status");
  }
};

  return (
    <div className="selling-container" style={{ padding: 0 }}>
      <Header />

      <div className="selling-inner" style={{ padding: '28px 32px' }}>
        {/* Welcome Section */}
        <section className="welcome-msg">
          <h1>
            Welcome back, {currentUser ? currentUser.name.split(' ')[0] : 'Guest'}! 👋
          </h1>
          <p>Manage your active listings and earnings</p>
        </section>

        {/* Stats Panel */}
        <div className="stats-panel">
          <div className="stat-box">
            <div className="stat-label-text">Active Listings</div>
            <div className="stat-value-text">{stats.activeListings}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label-text">Total Earnings</div>
            <div className="stat-value-text">${stats.totalEarnings.toLocaleString()}</div>
          </div>
        </div>

        {/* Create Listing CTA */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            className="sell-btn-main"
            onClick={() => navigate('/create-listing')}
          >
            + Create Listing
          </button>
        </div>

        {/* Active Listings */}
        <div className="tab-content-detailed animate-in">
          <div className="column-heading">
            <h3>Your Active Listings</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              {userListings.length} items currently listed
            </p>
          </div>

          <div className="detailed-list-scroll">
            {userListings.length === 0 ? (
              <div className="empty-state-card">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                <h4>No active listings yet</h4>
                <p>Click “Create Listing” to get started.</p>
              </div>
            ) : (
              <div className="item-list-grid">
                {userListings.map(item => (
                  <div
                    key={item.id}
                    className="listing-card-mini"
                    onClick={() => openModal(item)}
                  >
                    <div className="item-visual">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '14px'
                          }}
                        />
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>

                    <div className="item-details-mini">
                      <h4>{item.title}</h4>
                      <div className="item-price-mini">${item.price}</div>
                      <div className="item-sub-meta">
                        <span style={{ marginLeft: '0px' }}>📍 {item.location?.name || item.location}</span>
                        <span style={{ marginLeft: '0px' }}>Status: {statusLabels[item.status]}</span>
                      </div>
                    </div>
                    <div className = "delete-icon">
                        {item.status === "active" && (
                        <span
                            className="delete-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(item);
                            }}
                            >
                            🗑️
                        </span>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedItem && (
        <div className="image-modal" onClick={closeModal}>
          <div
            className="preview-listing-card modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button className="close-modal" onClick={closeModal}>×</button>

            {/* Left: Image */}
            <div className="preview-media">
              {selectedItem.image && (
                <img src={selectedItem.image} alt={selectedItem.title} />
              )}
            </div>

            {/* Right: Content */}
            <div className="preview-body">
              <div className="preview-title-row">
                <div className="preview-title">{selectedItem.title}</div>
                <div className="preview-price">${selectedItem.price}</div>
              </div>

              <p className="preview-description">
                {selectedItem.description || 'No description provided'}
              </p>

              {selectedItem.location && (
                <div className="pickup-section">
                  <h4 className="pickup-title">Pickup Location</h4>
                  <div className="review-location-card">
                    <div className="review-location-icon">📍</div>
                    <div className="review-location-info">
                      <div className="review-location-name">{selectedItem.location}</div>
                      <div className="review-location-address">{selectedItem.location.address}</div>
                      {selectedItem.location.price && (
                        <div className="review-location-price">{selectedItem.location.price}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="status-section">
                <h4>Status</h4>
                <div className="status-text">{statusLabels[selectedItem.status]}</div>
              </div>

              {selectedItem.status === "approved_by_buyer" ? (
                    <button
                        className="continue-btn"
                        onClick={() => markPaymentReceived(selectedItem)}
                    >
                        Mark Payment Received
                    </button>

                    ) : selectedItem.status === "payment_received" ? (
                    <button className="continue-btn disabled" disabled>
                        Payment Received
                    </button>

                    ) : (
                    <button className="continue-btn disabled" disabled>
                        Awaiting Buyer Approval
                    </button>
                )}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
            <div className="delete-modal">

            <h3>Delete Listing</h3>

            <p>Are you sure you want to delete this listing?</p>

            <div className="modal-buttons">
                <button className="confirm-delete" onClick={deleteListing}>
                Yes, Delete
                </button>

                <button
                className="cancel-delete"
                onClick={() => setShowDeleteModal(false)}
                >
                Cancel
                </button>
            </div>

            </div>
        </div>
        )}
    </div>

    
  );
  
};


export default SellingPage;