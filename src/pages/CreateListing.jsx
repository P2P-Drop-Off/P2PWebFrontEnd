import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { createListing as createListingInFirebase } from '../functions/firebase';
import MapComponent from '../components/MapComponent';
import Header from '../components/Header';
import '../css/sell.css';

const CreateListing = () => {
    const navigate = useNavigate();
    const { stores, fetchListings } = useListings();

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

    // IMAGE STATE
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [storeQuery, setStoreQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stepError, setStepError] = useState(null);

    // Refresh approved stores when opening Create Listing so newly approved partners appear in the list
    useEffect(() => {
        fetchListings();
    }, []);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (file) => {
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const validateStep = () => {
        setStepError(null);
        if (step === 1) {
            if (!formData.title?.trim()) {
                setStepError('Please enter an item name.');
                return false;
            }
            const p = parseFloat(formData.price);
            if (formData.price === '' || formData.price == null || Number.isNaN(p) || p < 0) {
                setStepError('Please enter a valid price (0 or greater).');
                return false;
            }
            if (!imagePreview) {
                setStepError('Please upload an image.');
                return false;
            }
        }
        if (step === 2) {
            if (!formData.location) {
                setStepError('Please select a pickup location.');
                return false;
            }
        }
        return true;
    };

    const handleNext = async () => {
        if (step < 3) {
            if (!validateStep()) return;
            setStep(step + 1);
            return;
        }

        setStepError(null);
        setLoading(true);
        setError(null);

        try {
            const priceNum = parseFloat(formData.price);
            const safePrice = (Number.isNaN(priceNum) || priceNum < 0) ? 0 : priceNum;
            const payload = {
                title: formData.title || 'Untitled Item',
                description: formData.description || '',
                price: safePrice,
                location: formData.location?.name || 'No location selected',
                locationId: formData.location?.id ?? null,
                image: imagePreview,
            };

            // Store in Firebase (listings collection)
            const listingId = await createListingInFirebase(payload);
            navigate(`/listing-created/${listingId}`);

            // --- Backend (commented out): previously POSTed to http://localhost:8080/items ---
            // const res = await fetch('http://localhost:8080/items', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload),
            // });
            // if (!res.ok) throw new Error('Failed to create listing');
            // const createdListing = await res.json();
            // navigate(`/listing-created/${createdListing.id}`);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStepError(null);
        if (step > 1) setStep(step - 1);
        else navigate('/selling');
    };

    const filteredStores = stores.filter((s) =>
        `${s.name} ${s.address}`.toLowerCase().includes(storeQuery.toLowerCase())
    );

    // Format price for display: non-negative, 2 decimals (fixes e.g. -47 or empty showing wrong)
    const formatPriceDisplay = (value) => {
        const num = parseFloat(value);
        if (value === '' || value == null || Number.isNaN(num)) return '0.00';
        const clamped = num < 0 ? 0 : num;
        return clamped.toFixed(2);
    };

    const displayPrice = formatPriceDisplay(formData.price);

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="wizard-step-content animate-in">
                        <div className="form-title-section">
                            <div className="form-title-icon">
                                📦
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
                                placeholder="Describe the condition, features, and details buyers should know..."
                                value={formData.description}
                                onChange={(e) => updateField('description', e.target.value)}
                            />
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className="field-group">
                            <label>Item Image *</label>

                            <div
                                className="drop-zone-wrapper"
                                style={{ position: 'relative' }}
                                onClick={() => {
                                    if (!imagePreview) {
                                        document.getElementById('imageUploadInput').click();
                                    }
                                }}
                            >
                                {imagePreview ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                maxHeight: '260px',
                                                objectFit: 'cover',
                                                borderRadius: '16px'
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                document.getElementById('imageUploadInput').click();
                                            }}
                                            style={{
                                                position: 'absolute',
                                                bottom: '14px',
                                                right: '14px',
                                                padding: '8px 14px',
                                                borderRadius: '999px',
                                                border: 'none',
                                                background: 'rgba(0,0,0,0.65)',
                                                color: 'white',
                                                fontSize: '0.85rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                backdropFilter: 'blur(6px)'
                                            }}
                                        >
                                            Select New Image
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="upload-graphic">⬆️</div>
                                        <div className="drop-zone-text-primary">Upload an image</div>
                                        <div className="drop-zone-text-secondary">
                                            Click to browse (JPG, PNG, WEBP)
                                        </div>
                                    </>
                                )}

                                <input
                                    id="imageUploadInput"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(e.target.files[0])}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="field-group">
                                <label>Price *</label>
                                <div className="icon-input-container">
                                    <span className="input-icon">$</span>
                                    <input
                                        className="input-styled"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (v === '' || v === '-') {
                                                updateField('price', v);
                                                return;
                                            }
                                            const num = parseFloat(v);
                                            if (!Number.isNaN(num) && num < 0) return;
                                            updateField('price', v);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Marketplace Link</label>
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
                );

            case 2:
                return (
                    <div className="wizard-step-content animate-in">
                        <div className="form-title-section">
                            <h3>Select Pickup Location</h3>
                            <p>Choose where buyers can pick up this item</p>
                        </div>

                        <div className="location-picker-split">
                            <div>
                                <input
                                    className="input-styled"
                                    placeholder="Search stores..."
                                    value={storeQuery}
                                    onChange={(e) => setStoreQuery(e.target.value)}
                                />

                                <div className="store-results-list">
                                    {filteredStores.length === 0 ? (
                                        <div className="store-list-empty">
                                            {stores.length === 0
                                                ? 'No approved stores yet. Approve partner stores in Admin to see them here.'
                                                : 'No stores match your search.'}
                                        </div>
                                    ) : (
                                        filteredStores.map(loc => (
                                            <div
                                                key={loc.id}
                                                className={`store-card-selectable ${formData.location?.id === loc.id ? 'selected' : ''}`}
                                                onClick={() => updateField('location', loc)}
                                            >
                                                <div className="selector-circle" />
                                                <div className="store-info-block">
                                                    <h5>{loc.name}</h5>
                                                    <p>{loc.address}</p>
                                                    {loc.price && <span className="store-price-tag">{loc.price}</span>}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="map-viewport-wrapper">
                                <MapComponent
                                    markers={stores.filter((s) => s.lat != null && s.lng != null)}
                                    onMarkerClick={(loc) => updateField('location', loc)}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="wizard-step-content animate-in">
                        <div className="form-title-section">
                            <h3>Review Your Listing</h3>
                            <p>Make sure everything looks good before publishing</p>
                        </div>

                        <div className="review-card-frame">
                            <div className="review-main-content">
                                <div className="review-placeholder-img">
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Item"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }}
                                        />
                                    )}
                                </div>

                                <div className="review-stats-block">
                                    <h3>{formData.title || 'Untitled Item'}</h3>
                                    <div className="review-price-pill">${displayPrice}</div>
                                    <p className="review-desc-text">
                                        {formData.description || 'No description provided'}
                                    </p>
                                </div>
                            </div>
                            {formData.location && (
                                <div className="review-footer-location">
                                    <span className="loc-icon-purple">📍</span>
                                    <div>
                                        <strong>Pickup location</strong>
                                        <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.9rem' }}>
                                            {formData.location.name}
                                            {formData.location.address && ` — ${formData.location.address}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="wizard-layout">
            <Header />
            <header className="wizard-nav" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', padding: '18px 28px' }}>
                <button onClick={handleBack} style={{ justifySelf: 'start', padding: '8px 22px', borderRadius: '999px', border: '1.5px solid #C4B5FD', background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)', color: '#7C3AED', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 6px 18px rgba(124, 58, 237, 0.08)' }}>← Back</button>
                <div style={{ justifySelf: 'center', textAlign: 'center', lineHeight: 1.2 }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 850, color: '#1E293B' }}>Create a Listing</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginTop: '2px' }}>Step {step} of 3</div>
                </div>
                <div />
            </header>

            <main className="wizard-viewport">
                {renderStep()}
            </main>

            {(error || stepError) && (
                <p className="error-message" style={{ padding: '8px 28px', margin: 0, background: '#fef2f2', color: '#dc2626', fontSize: '0.9rem' }}>
                    {stepError || error}
                </p>
            )}
            <footer className="wizard-dock-footer">
                <button className="btn-wizard-back" onClick={handleBack}>Back</button>
                <button className="btn-wizard-next" onClick={handleNext}>
                    {loading ? 'Creating...' : step === 3 ? 'Publish Listing' : 'Continue'}
                </button>
            </footer>
        </div>
    );

};
export default CreateListing;

