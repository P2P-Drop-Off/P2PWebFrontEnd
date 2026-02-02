// CreateListing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import MapComponent from '../components/MapComponent';
import '../css/sell.css';

const CreateListing = () => {
    const navigate = useNavigate();
    const { addListing, stores } = useListings();

    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        marketplaceLink: '',
        width: '',
        height: '',
        location: null,
    });

    // optional: search input for stores
    const [storeQuery, setStoreQuery] = useState('');

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
            return;
        }

        addListing({
            title: formData.title || 'Untitled Item',
            price: parseInt(formData.price, 10) || 0,
            description: formData.description,
            location: formData.location?.name || 'No location selected',
        });

        navigate('/selling');
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigate('/selling');
    };

    const filteredStores = stores.filter((s) =>
        `${s.name} ${s.address}`.toLowerCase().includes(storeQuery.toLowerCase())
    );

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="wizard-step-content animate-in">
                        <div className="form-title-section">
                            <div className="form-title-icon">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                </svg>
                            </div>
                            <h3>Tell us about your item</h3>
                            <p>Provide details that will help buyers</p>
                        </div>

                        <div className="field-group">
                            <label>Item Name *</label>
                            <input
                                className="input-styled"
                                type="text"
                                placeholder="e.g., Vintage Leather Sofa"
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                            />
                        </div>

                        <div className="field-group">
                            <label>Description</label>
                            <textarea
                                className="textarea-styled"
                                placeholder="Describe the condition, features, and any details buyers should know..."
                                value={formData.description}
                                onChange={(e) => updateField('description', e.target.value)}
                            />
                        </div>

                        <div className="field-group">
                            <label>Item Image *</label>
                            <div className="drop-zone-wrapper">
                                <div className="upload-graphic">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="16 16 12 12 8 16"></polyline>
                                        <line x1="12" y1="12" x2="12" y2="21"></line>
                                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                                    </svg>
                                </div>
                                <div className="drop-zone-text-primary">Upload an image</div>
                                <div className="drop-zone-text-secondary">
                                    Click to browse or drag and drop
                                </div>
                                <div className="url-input-override">
                                    <input
                                        className="input-styled"
                                        type="text"
                                        placeholder="Or paste image URL here"
                                    />
                                </div>
                            </div>
                        </div>

                        <div
                            className="form-row"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1.5rem',
                            }}
                        >
                            <div className="field-group">
                                <label>Price *</label>
                                <div className="icon-input-container">
                                    <span className="input-icon">$</span>
                                    <input
                                        className="input-styled"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => updateField('price', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Marketplace Link</label>
                                <div className="icon-input-container">
                                    <svg
                                        className="input-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                    </svg>
                                    <input
                                        className="input-styled"
                                        type="text"
                                        placeholder="https://..."
                                        value={formData.marketplaceLink}
                                        onChange={(e) => updateField('marketplaceLink', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div
                            className="form-row"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1.5rem',
                            }}
                        >
                            <div className="field-group">
                                <label>Width (inches)</label>
                                <div className="icon-input-container">
                                    <svg
                                        className="input-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="19" y1="4" x2="10" y2="4"></line>
                                        <line x1="14" y1="20" x2="5" y2="20"></line>
                                        <line x1="15" y1="4" x2="9" y2="20"></line>
                                    </svg>
                                    <input
                                        className="input-styled"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.width}
                                        onChange={(e) => updateField('width', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Height (inches)</label>
                                <div className="icon-input-container">
                                    <svg
                                        className="input-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="19" y1="4" x2="10" y2="4"></line>
                                        <line x1="14" y1="20" x2="5" y2="20"></line>
                                        <line x1="15" y1="4" x2="9" y2="20"></line>
                                    </svg>
                                    <input
                                        className="input-styled"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.height}
                                        onChange={(e) => updateField('height', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="wizard-step-content animate-in">
                        <div className="form-title-section">
                            <div className="form-title-icon" style={{ backgroundColor: '#F5F3FF', color: '#7C3AED' }}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            </div>
                            <h3>Select Pickup Locations</h3>
                            <p>Choose where buyers can pick up this item</p>
                        </div>

                        <div className="location-picker-split">
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className="store-search-box">
                                    <input
                                        className="input-styled"
                                        type="text"
                                        placeholder="Search stores..."
                                        value={storeQuery}
                                        onChange={(e) => setStoreQuery(e.target.value)}
                                    />
                                </div>

                                <div className="store-results-list">
                                    {filteredStores.map((loc) => (
                                        <div
                                            key={loc.id}
                                            className={`store-card-selectable ${formData.location?.id === loc.id ? 'selected' : ''
                                                }`}
                                            onClick={() => updateField('location', loc)}
                                        >
                                            <div className="selector-circle"></div>
                                            <div className="store-info-block">
                                                <h5>{loc.name}</h5>
                                                <p>{loc.address}</p>
                                                <span className="store-price-tag">{loc.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="selection-summary-bar">
                                    {formData.location ? '1 location selected' : '0 locations selected'}
                                </div>
                            </div>

                            <div className="map-viewport-wrapper">
                                <MapComponent
                                    markers={stores}
                                    onMarkerClick={(loc) => updateField('location', loc)}
                                    center={
                                        formData.location
                                            ? { lat: formData.location.lat, lng: formData.location.lng }
                                            : null
                                    }
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="wizard-step-content animate-in">
                        <div className="form-title-section">
                            <div className="form-title-icon" style={{ backgroundColor: '#F3F4F6', color: '#8B5CF6' }}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3>Review Your Listing</h3>
                            <p>Make sure everything looks good before publishing</p>
                        </div>

                        <div className="review-card-frame">
                            <div className="review-main-content">
                                <div className="review-placeholder-img">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>

                                <div className="review-stats-block">
                                    <h3>{formData.title || 'Untitled Item'}</h3>
                                    <div className="review-price-pill">${formData.price || '0.00'}</div>
                                    <p className="review-desc-text">
                                        {formData.description || 'No description provided'}
                                    </p>
                                </div>
                            </div>

                            <div className="review-footer-location">
                                <span className="loc-icon-purple">📍</span>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E293B' }}>
                                        Pickup Locations
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                                        {formData.location ? `${formData.location.name}` : 'No pickup locations selected'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="wizard-layout">
            <header className="wizard-nav">
                <div className="wizard-header-text">
                    <h2>Create New Listing</h2>
                    <p>{step === 1 ? 'Item Information' : step === 2 ? 'Pickup Locations' : 'Review & Confirm'}</p>
                </div>

                <div className="step-bar">
                    <div className={`step-node ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`}>
                        {step > 1 ? '✓' : '1'}
                    </div>

                    <div className={`step-connector ${step >= 2 ? 'completed' : ''}`}></div>

                    <div className={`step-node ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>
                        {step > 2 ? '✓' : '2'}
                    </div>

                    <div className={`step-connector ${step >= 3 ? 'completed' : ''}`}></div>

                    <div className={`step-node ${step === 3 ? 'active' : ''}`}>3</div>
                </div>

                <button className="btn-close-wizard" onClick={() => navigate('/selling')}>
                    ×
                </button>
            </header>

            <main className="wizard-viewport">{renderStep()}</main>

            <footer className="wizard-dock-footer">
                <button className="btn-wizard-back" onClick={handleBack}>
                    Back
                </button>

                <div className="step-progress-text">Step {step} of 3</div>

                <button className="btn-wizard-next" onClick={handleNext}>
                    {step === 3 ? 'Continue to Publish' : 'Continue'}
                </button>
            </footer>
        </div>
    );
};

export default CreateListing;
