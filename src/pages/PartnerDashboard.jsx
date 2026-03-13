// src/pages/PartnerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { statusLabels } from "../context/ListingsContext";
import "../css/sell.css";

const PartnerDashboard = () => {
  const { locationId } = useParams();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/stores/${locationId}/items`);
        if (!res.ok) throw new Error(`Failed request: ${res.status}`);
        const data = await res.json();
        setItems(data);
        setFilteredItems(data);
      } catch (err) {
        console.error(err);
        setItems([]);
        setFilteredItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [locationId]);

const handleUpdateStatus = async () => {
  if (!selectedItem) return;

  let newStatus;
  if (selectedItem.status === "approved_by_buyer") newStatus = "dropped_off";
  if (selectedItem.status === "payment_received") newStatus = "picked_up";

  try {
    const res = await fetch(
      `http://localhost:8080/api/partner/items/${selectedItem.id}/update-status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!res.ok) throw new Error(`Failed to update: ${res.status}`);
    const updatedStatus = await res.text();

    setItems(prev =>
      prev.map(item =>
        item.id === selectedItem.id ? { ...item, status: updatedStatus } : item
      )
    );
    setFilteredItems(prev =>
      prev.map(item =>
        item.id === selectedItem.id ? { ...item, status: updatedStatus } : item
      )
    );
    closeModal();
  } catch (err) {
    console.error(err);
    alert("Failed to update item status");
  }
};

  const openModal = item => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalOpen(false);
  };

  // Filter items whenever searchCode changes
  useEffect(() => {
    if (!searchCode) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter(item =>
          item.sixDigitCode?.toLowerCase().includes(searchCode.toLowerCase())
        )
      );
    }
  }, [searchCode, items]);

  if (loading)
    return (
      <div className="selling-container">
        <p>Loading items...</p>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="selling-container">
        <p>No items found for this location.</p>
      </div>
    );

  return (
    <div className="selling-container">
      <div className="selling-inner">
        {/* Header */}
        <section className="welcome-msg">
          <h1>Partner Dashboard</h1>
          <p>Manage items for your location.</p>
        </section>

        {/* Stats Panel */}
        <div className="stats-panel">
          <div className="stat-box">
            <div className="stat-label-text">Incoming Items</div>
            <div className="stat-value-text">
              {items.filter(item => item.status === "approved_by_buyer").length}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label-text">Currently Storing</div>
            <div className="stat-value-text">
              {items.filter(item => item.status === "dropped_off").length}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label-text">Ready for Pickup</div>
            <div className="stat-value-text">
              {items.filter(item => item.status === "payment_received").length}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label-text">Items Picked Up</div>
            <div className="stat-value-text">
              {items.filter(item => item.status === "picked_up").length}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="tab-content-detailed animate-in">
          <div className="column-heading">
            <h3>Items being sold through {items[0]?.location}</h3>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
              {filteredItems.length} items
            </p>

            {/* Search Bar */}
            
          </div>
          <input
              type="text"
              placeholder="Search by Drop Off / Pick Up Code"
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
              className="search-input"
              style={{
                marginTop: "10px",
                padding: "15px",
                width: "99%",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
              
            />

          <div className="detailed-list-scroll">
            <div className="item-list-grid">
              {filteredItems.map(item => (
                <div key={item.id} 
                    className="listing-card-mini"
                    onClick={() => openModal(item)}
                    style={{ cursor: "pointer" }}
                >
                  <div className="item-visual">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "14px"
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
                      <span>Status: {statusLabels[item.status]}</span>
                    </div>
                  </div>
                  <div className="item-code">
                      <span>
                        <b>{item.sixDigitCode}</b>
                      </span>
                    </div>
                </div>
                
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && selectedItem && (
          <div
            className="modal-overlay"
            onClick={closeModal}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              className="modal-content"
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: "#fff",
                padding: "30px",
                borderRadius: "12px",
                width: "400px",
                textAlign: "center",
              }}
            >
              <h2>{selectedItem.title}</h2>
              <p>
                Status: <b>{statusLabels[selectedItem.status]}</b>
              </p>
              <p>
                Pickup Code: <b style={{ color: "red" }}>{selectedItem.sixDigitCode}</b>
              </p>
              <button
                onClick={handleUpdateStatus}
                disabled={selectedItem.status === "dropped_off" || selectedItem.status === "picked_up"}
                className={
                    selectedItem.status === "dropped_off" || selectedItem.status === "picked_up"
                    ? "modal-button-disabled"
                    : "modal-button-enabled"
                }
                >
                {selectedItem.status === "approved_by_buyer" && "Mark as Dropped Off"}
                {selectedItem.status === "dropped_off" && "Awaiting Payment Confirmation"}
                {selectedItem.status === "payment_received" && "Mark as Picked Up"}
                {selectedItem.status === "picked_up" && "Item Picked Up"}
                </button>
            </div>
          </div>
        )}
      </div>
    </div>

    
  );
};

export default PartnerDashboard;