import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import Header from '../components/Header';
import '../css/sell.css';

const SellingPage = () => {
    const navigate = useNavigate();
    const { listings, stats, currentUser } = useListings();

    return (
        <div className="selling-container" style={{ padding: 0 }}>
            <Header />

            {/* MAIN */}
            <div className="selling-inner" style={{ padding: '28px 32px' }}>
                <section className="welcome-msg">
                    <h1>
                        Welcome back, {currentUser ? currentUser.name.split(' ')[0] : 'Guest'}! 👋
                    </h1>
                    <p>Manage your active listings and earnings</p>
                </section>

                {/* STATS */}
                <div className="stats-panel">
                    <div className="stat-box">
                        <div className="stat-label-text">Active Listings</div>
                        <div className="stat-value-text">{stats.activeListings}</div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-label-text">Total Earnings</div>
                        <div className="stat-value-text">
                            ${stats.totalEarnings.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* CREATE LISTING CTA — MOVED ABOVE */}
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        className="sell-btn-main"
                        onClick={() => navigate('/create-listing')}
                    >
                        + Create Listing
                    </button>
                </div>

                {/* ACTIVE LISTINGS */}
                <div className="tab-content-detailed animate-in">
                    <div className="column-heading">
                        <h3>Your Active Listings</h3>
                        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                            {listings.length} items currently listed
                        </p>
                    </div>

                    <div className="detailed-list-scroll">
                        {listings.length === 0 ? (
                            <div className="empty-state-card">
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                                <h4>No active listings yet</h4>
                                <p>Click “Create Listing” to get started.</p>
                            </div>
                        ) : (
                            <div className="item-list-grid">
                                {listings.map(item => (
                                    <div key={item.id} className="listing-card-mini">
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
                                                <span style={{ marginLeft: '0px' }}>📍 {item.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellingPage;
