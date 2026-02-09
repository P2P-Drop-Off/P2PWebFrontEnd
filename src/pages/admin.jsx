import React, { useState } from "react";
import "../css/admin.css";


const stats = [
    { label: "Total Stores", value: "XX", },
    { label: "Total Revenue", value: "$XXX", },
    { label: "Active Listings", value: "XXX", },
    { label: "Active Users", value: "XXXX", }
];

const stores = [
    {
        name: "Downtown Center",
        location: "New York, 10001",
        cost: "$15/month",
        capacity: 145,
        max: 200,
        status: "active",
        date: "Dec 15, 2025"
    },
    {
        name: "North District Store",
        location: "New York, 10002",
        cost: "$12/month",
        capacity: 98,
        max: 150,
        status: "active",
        date: "Nov 20, 2025"
    },
    {
        name: "East Quarter Shop",
        location: "New York, 10003",
        cost: "$18/month",
        capacity: 187,
        max: 250,
        status: "active",
        date: "Oct 10, 2025"
    },
    {
        name: "West Side Location",
        location: "New York, 10004",
        cost: "$10/month",
        capacity: 45,
        max: 100,
        status: "inactive",
        date: "Sep 5, 2025"
    }
];

export default function AdminDashboard() {
    const [storeView, setStoreView] = useState("manage");

    return (
        <div className="admin-container">
            {/* Admin Overview */}
            <div className="section-header">
                <h2>Admin Overview</h2>
                <p>Manage stores and view sales analytics</p>
            </div>

            <div className="stats-grid">
                {stats.map((s, i) => (
                    <div key={i} className="stat-card">
                        <span className={`badge ${s.color}`}>{s.change}</span>
                        <p>{s.label}</p>
                        <h3>{s.value}</h3>
                    </div>
                ))}
            </div>

            {/* Store Management */}
            <div className="table-header">
                <h3>Store Management</h3>
                <div className="store-tabs">
                    <button
                        className={storeView === "manage" ? "tab active" : "tab"}
                        onClick={() => setStoreView("manage")}
                    >
                        Manage Stores
                    </button>
                    <button
                        className={storeView === "onboard" ? "tab active" : "tab"}
                        onClick={() => setStoreView("onboard")}
                    >
                        Onboard New Store
                    </button>
                    <button
                        className={storeView === "requests" ? "tab active" : "tab"}
                        onClick={() => setStoreView("requests")}
                    >
                        Store Requests
                    </button>
                </div>
            </div>

            {/* Manage Stores View */}
            {storeView === "manage" && (
                <>
                    <div className="table-actions">
                        <input placeholder="Search stores..." />
                        <button className="primary">+ Add Store</button>
                    </div>

                    <div className="table">
                        <div className="table-row header">
                            <span>Store Name</span>
                            <span>Location</span>
                            <span>Storage Cost</span>
                            <span>Capacity</span>
                            <span>Status</span>
                            <span>Date Added</span>
                            <span>Actions</span>
                        </div>

                        {stores.map((store, i) => {
                            const percent = (store.capacity / store.max) * 100;
                            return (
                                <div key={i} className="table-row">
                                    <span>{store.name}</span>
                                    <span>{store.location}</span>
                                    <span>{store.cost}</span>
                                    <span>
                                        <div className="progress">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        {store.capacity}/{store.max}
                                    </span>
                                    <span className={`status ${store.status}`}>
                                        {store.status}
                                    </span>
                                    <span>{store.date}</span>
                                    <span className="actions">✏️ 🗑️</span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Onboard New Store View */}
            {storeView === "onboard" && (
                <div className="empty-state">
                    <h4>Onboard a New Store</h4>
                    <p>Submit and configure new store locations.</p>
                    <button className="primary">Start Onboarding</button>
                </div>
            )}

            {/* Store Requests View */}
            {storeView === "requests" && (
                <div className="empty-state">
                    <h4>Store Requests</h4>
                    <p>Review pending store onboarding requests.</p>
                    <button className="primary">View Requests</button>
                </div>
            )}

            {/* Admin Management */}
            <div className="table-header">
                <h3>Admin Management</h3>
                <div className="table-actions">
                    <input placeholder="Search admins..." />
                    <button className="primary">+ Add Admin</button>
                </div>
            </div>
        </div>
    );
}
