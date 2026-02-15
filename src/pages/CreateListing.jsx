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

    // IMAGE STATE
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [storeQuery, setStoreQuery] = useState('');

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (file) => {
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
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
            image: imagePreview, // temporary local preview
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
            /* ================= STEP 1 ================= */
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

                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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

            /* ================= STEP 2 ================= */
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
                                    {filteredStores.map(loc => (
                                        <div
                                            key={loc.id}
                                            className={`store-card-selectable ${formData.location?.id === loc.id ? 'selected' : ''}`}
                                            onClick={() => updateField('location', loc)}
                                        >
                                            <div className="selector-circle" />
                                            <div className="store-info-block">
                                                <h5>{loc.name}</h5>
                                                <p>{loc.address}</p>
                                                <span className="store-price-tag">{loc.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="map-viewport-wrapper">
                                <MapComponent
                                    markers={stores}
                                    onMarkerClick={(loc) => updateField('location', loc)}
                                />
                            </div>
                        </div>
                    </div>
                );

            /* ================= STEP 3 ================= */
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
                                    <div className="review-price-pill">${formData.price || '0.00'}</div>
                                    <p className="review-desc-text">
                                        {formData.description || 'No description provided'}
                                    </p>
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
            <header
                className="wizard-nav"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center',
                    padding: '18px 28px'
                }}
            >
                {/* BACK BUTTON — styled like Continue */}
                <button
                    onClick={handleBack}
                    style={{
                        justifySelf: 'start',
                        padding: '8px 22px',
                        borderRadius: '999px',
                        border: '1.5px solid #C4B5FD',
                        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)',
                        color: '#7C3AED',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: '0 6px 18px rgba(124, 58, 237, 0.08)'
                    }}
                >
                    ← Back
                </button>

                {/* CENTERED HEADING */}
                <div
                    style={{
                        justifySelf: 'center',
                        textAlign: 'center',
                        lineHeight: 1.2
                    }}
                >
                    <div
                        style={{
                            fontSize: '1.05rem',
                            fontWeight: 850,
                            color: '#1E293B'
                        }}
                    >
                        Create a Listing
                    </div>
                    <div
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#64748B',
                            marginTop: '2px'
                        }}
                    >
                        Step {step} of 3
                    </div>
                </div>

                {/* RIGHT SPACER (keeps title centered) */}
                <div />
            </header>


            <main className="wizard-viewport">
                {renderStep()}
            </main>

            <footer className="wizard-dock-footer">
                <button className="btn-wizard-back" onClick={handleBack}>
                    Back
                </button>

                <button className="btn-wizard-next" onClick={handleNext}>
                    {step === 3 ? 'Publish Listing' : 'Continue'}
                </button>
            </footer>
        </div>
    );
};

export default CreateListing;
