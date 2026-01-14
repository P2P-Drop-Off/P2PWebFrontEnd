// SellingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import '../css/sell.css';

const SellingPage = () => {
    const navigate = useNavigate();
    const { listings, watching, stats, currentUser, logout } = useListings();
    const [activeTab, setActiveTab] = useState('Overview');
    const [sellOpen, setSellOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const renderContent = () => {
        if (activeTab === 'Selling') {
            return (
                <div className="tab-content-detailed animate-in">
                    <div className="column-heading">
                        <h3>Your Active Listings</h3>
                        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{listings.length} items currently listed</p>
                    </div>
                    <div className="detailed-list-scroll">
                        {listings.length === 0 ? (
                            <div className="empty-state-card">
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                                <h4>No active listings yet</h4>
                                <p>Start selling your items to see them here!</p>
                                <button className="sell-btn-main" style={{ marginTop: '1rem' }} onClick={() => navigate('/create-listing')}>+ Post a Listing</button>
                            </div>
                        ) : (
                            <div className="item-list-grid">
                                {listings.map(item => (
                                    <div key={item.id} className="listing-card-mini" style={{ width: '100%' }}>
                                        <div className="item-visual">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
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
            );
        }

        if (activeTab === 'Buying') {
            return (
                <div className="tab-content-detailed animate-in">
                    <div className="column-heading">
                        <h3>Items You're Watching</h3>
                        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{watching.length} items in your watchlist</p>
                    </div>
                    <div className="detailed-list-scroll">
                        {watching.length === 0 ? (
                            <div className="empty-state-card">
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                                <h4>Your watchlist is empty</h4>
                                <p>Browse the marketplace to find items you love!</p>
                                <button className="btn-wizard-back" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Explore Marketplace</button>
                            </div>
                        ) : (
                            <div className="item-list-grid">
                                {watching.map(item => (
                                    <div key={item.id} className="listing-card-mini" style={{ width: '100%' }}>
                                        <div className="item-visual">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                        </div>
                                        <div className="item-details-mini">
                                            <h4>{item.title}</h4>
                                            <div className="item-price-mini">${item.price}</div>
                                            <div className="item-sub-meta">
                                                <span>📍 {item.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Overview (Original two-column view)
        return (
            <div className="cards-columns animate-in">
                <div className="dashboard-col">
                    <div className="column-heading">
                        <h3>Recent Watching</h3>
                        <a href="#" className="link-view-all" onClick={() => setActiveTab('Buying')}>View All</a>
                    </div>
                    <div className="item-list-stack">
                        {watching.length === 0 ? <p style={{ color: '#94A3B8', textAlign: 'center', padding: '2rem' }}>No items watched</p> :
                            watching.slice(0, 3).map(item => (
                                <div key={item.id} className="listing-card-mini">
                                    <div className="item-visual">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                    </div>
                                    <div className="item-details-mini">
                                        <h4>{item.title}</h4>
                                        <div className="item-price-mini">${item.price}</div>
                                        <div className="item-sub-meta">
                                            <span>📍 {item.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="dashboard-col">
                    <div className="column-heading">
                        <h3>Active Listings</h3>
                        <a href="#" className="link-view-all" onClick={() => setActiveTab('Selling')}>View All</a>
                    </div>
                    <div className="item-list-stack">
                        {listings.length === 0 ? <p style={{ color: '#94A3B8', textAlign: 'center', padding: '2rem' }}>No current listings</p> :
                            listings.slice(0, 3).map(item => (
                                <div key={item.id} className="listing-card-mini">
                                    <div className="item-visual">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                    </div>
                                    <div className="item-details-mini">
                                        <h4>{item.title}</h4>
                                        <div className="item-price-mini">${item.price}</div>
                                        <div className="item-sub-meta">
                                            <span>👁️ {item.views}</span>
                                            <span style={{ marginLeft: '8px' }}>💬 {item.comments}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="selling-container" style={{ padding: 0 }}>
            {/* NEW: site-header structure to match Home.jsx */}
            <header className="site-header">
                <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div className="logo">P2P</div>
                </div>

                <nav className="top-nav">
                    <a onClick={() => navigate('/')}>Marketplace</a>
                    <a onClick={() => navigate('/create-listing')}>Create a Listing</a>
                    <a onClick={() => navigate('/terms')}>Terms of Service</a>

                    {currentUser ? (
                        <>
                            <div className="sell-dropdown" style={{ marginLeft: '10px' }}>
                                <button
                                    className="dash-sell-btn"
                                    onClick={() => setSellOpen((v) => !v)}
                                    onBlur={() => setTimeout(() => setSellOpen(false), 120)}
                                >
                                    + Sell
                                </button>

                                {sellOpen && (
                                    <div className="sell-menu" style={{ right: 0 }}>
                                        <button
                                            className="sell-menu-item"
                                            onMouseDown={() => navigate('/create-listing')}
                                        >
                                            <span className="menu-plus">+</span>
                                            Post a Listing
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="nav-icon-group" style={{ marginLeft: '10px', position: 'relative' }}>
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
                                    <div className="animate-in" style={{
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
                                    }}>
                                        <div style={{ fontWeight: '800', color: '#1E293B', fontSize: '1rem', marginBottom: '4px' }}>
                                            {currentUser.name}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748B', wordBreak: 'break-all' }}>
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
                                                fontSize: '0.9rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <button className="nav-btn gradient-outline" onClick={() => navigate('/login')} style={{ marginLeft: '10px' }}>
                                Sign In
                            </button>
                            <button className="nav-btn gradient-solid" onClick={() => navigate('/create-account')}>
                                Sign Up
                            </button>
                        </>
                    )}
                </nav>
            </header>

            <div className="selling-inner" style={{ padding: '28px 32px' }}>

                <section className="welcome-msg">
                    <h1>Welcome back, {currentUser ? currentUser.name.split(' ')[0] : 'Guest'}! 👋</h1>
                    <p>Here's what's happening with your buying and selling activity</p>
                </section>

                <div className="stats-panel">
                    <div className="stat-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '2px dashed #A78BFA', background: '#F5F3FF' }}>
                        <div className="stat-label-text" style={{ fontWeight: 800, color: '#7C3AED' }}>Start Selling</div>
                        <button className="btn-wizard-next" onClick={() => navigate('/create-listing')} style={{ marginTop: '10px', padding: '10px 20px' }}>Continue →</button>
                    </div>
                    <div className="stat-box">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                        </div>
                        <div>
                            <div className="stat-label-text">Items Watching</div>
                            <div className="stat-value-text">{stats.itemsWatching}</div>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: '#F3E8FF', color: '#9333EA' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
                        </div>
                        <div>
                            <div className="stat-label-text">Active Listings</div>
                            <div className="stat-value-text">{stats.activeListings}</div>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                        <div>
                            <div className="stat-label-text">Total Earnings</div>
                            <div className="stat-value-text">${stats.totalEarnings.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-tabs-container">
                    <button className={`tab-pill ${activeTab === 'Overview' ? 'active' : ''}`} onClick={() => setActiveTab('Overview')}>Overview</button>
                    <button className={`tab-pill ${activeTab === 'Buying' ? 'active' : ''}`} onClick={() => setActiveTab('Buying')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                        Buying
                    </button>
                    <button className={`tab-pill ${activeTab === 'Selling' ? 'active' : ''}`} onClick={() => setActiveTab('Selling')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
                        Selling
                    </button>
                </div>

                {renderContent()}

                <div className="quick-actions-panel">
                    <h4>Quick Actions</h4>
                </div>
            </div>
        </div>
    );
};

export default SellingPage;
