import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import '../css/sell.css';

const SellingPage = () => {
    const navigate = useNavigate();
    const { listings, stats, currentUser, logout } = useListings();

    const [sellOpen, setSellOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <div className="selling-container" style={{ padding: 0 }}>
            {/* HEADER */}
            <header className="site-header">
                <div
                    className="brand"
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="logo">P2P</div>
                </div>

                <nav className="top-nav">
                    <a onClick={() => navigate('/')}>Marketplace</a>
                    <a onClick={() => navigate('/create-listing')}>Create a Listing</a>

                    {currentUser && (
                        <>
                            <div className="sell-dropdown" style={{ marginLeft: '10px' }}>
                                <button
                                    className="dash-sell-btn"
                                    onClick={() => setSellOpen(v => !v)}
                                    onBlur={() => setTimeout(() => setSellOpen(false), 120)}
                                >
                                    + Sell
                                </button>

                                {sellOpen && (
                                    <div className="sell-menu">
                                        <button
                                            className="sell-menu-item"
                                            onMouseDown={() => navigate('/create-listing')}
                                        >
                                            <span className="menu-plus">+</span>
                                            Create Listing
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div
                                className="nav-icon-group"
                                style={{ marginLeft: '10px', position: 'relative' }}
                            >
                                <div
                                    className="nav-icon-item"
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #9be7ff, #d8a6ff)',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        boxShadow: '0 6px 18px rgba(76, 91, 150, 0.08)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    👤
                                </div>

                                {profileOpen && (
                                    <div
                                        className="animate-in"
                                        style={{
                                            position: 'absolute',
                                            top: '120%',
                                            right: 0,
                                            width: '220px',
                                            backgroundColor: 'white',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '16px',
                                            padding: '20px',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                            zIndex: 100
                                        }}
                                    >
                                        <div style={{ fontWeight: '800', color: '#1E293B' }}>
                                            {currentUser.name}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                                            {currentUser.email}
                                        </div>
                                        <hr style={{ margin: '16px 0', borderColor: '#F1F5F9' }} />
                                        <button
                                            onClick={() => {
                                                logout();
                                                navigate('/');
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: '10px',
                                                border: '1px solid #FECACA',
                                                background: '#FEF2F2',
                                                color: '#EF4444',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </nav>
            </header>

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
                                                <span>👁️ {item.views}</span>
                                                <span style={{ marginLeft: '8px' }}>💬 {item.comments}</span>
                                                <span style={{ marginLeft: '8px' }}>📍 {item.location}</span>
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
