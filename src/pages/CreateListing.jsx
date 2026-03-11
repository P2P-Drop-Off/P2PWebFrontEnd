import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { auth } from "../functions/firebase";
import MapComponent from '../components/MapComponent';
import Header from '../components/Header';
import '../css/sell.css';


const CreateListing = () => {
  const navigate = useNavigate();
  const { stores, listings, setListings } = useListings();
  const mapControlRef = useRef(null);

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

  const [fieldErrors, setFieldErrors] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [storeQuery, setStoreQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stepError, setStepError] = useState(null);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // clear error when user edits field
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
  };

  const validateStep = () => {
    const errors = {};

    if (step === 1) {
        if (!formData.title?.trim()) {
        errors.title = "Item name is required.";
        }

        const p = parseFloat(formData.price);
        if (formData.price === '' || Number.isNaN(p) || p < 0) {
        errors.price = "Please enter a valid price.";
        }

        if (!imagePreview) {
        errors.image = "Please upload an image.";
        }
    }

    if (step === 2) {
        if (!formData.location) {
        setStepError("Please select a pickup location.");
        return false;
        }
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
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
      const safePrice = Number.isNaN(priceNum) || priceNum < 0 ? 0 : priceNum;

      // Create payload for backend
      const fd = new FormData();

        fd.append("title", formData.title);
        fd.append("description", formData.description);
        fd.append("price", safePrice);
        fd.append("location", formData.location?.name || "");
        fd.append("locationId", formData.location?.id);
        fd.append("marketplaceLink", formData.marketplaceLink || "");
        fd.append("imageFile", imageFile);

        const user = auth.currentUser;

        if (!user) {
          throw new Error("User not logged in!");
        }

        const token = await user.getIdToken();

        const res = await fetch("http://localhost:8080/api/items", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: fd
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create listing: ${res.status} ${text}`);
      }

      let createdListing = {}; //modified 3/9
      try {
        createdListing = await res.json();
      } catch {
        createdListing = {};
      }


      /* Add listing to dashboard */
      setListings(prev => [
        ...prev,
        {
          id: createdListing.id,
          title: formData.title,
          description: formData.description,
          price: safePrice,
          location: formData.location?.name || "",
          image: imagePreview,
          views: 0,
          comments: 0
        }
      ]);

navigate(`/listing-created/${createdListing.id}`);

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

  const filteredStores = stores.filter(s =>
    `${s.name} ${s.address}`.toLowerCase().includes(storeQuery.toLowerCase())
  );

  const formatPriceDisplay = (value) => {
    const num = parseFloat(value);
    if (value === '' || Number.isNaN(num)) return '0.00';
    return (num < 0 ? 0 : num).toFixed(2);
  };

  const displayPrice = formatPriceDisplay(formData.price);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="wizard-step-content animate-in">
            <div className="form-title-section">
              <div className="form-title-icon">📦</div>
              <h3>Tell us about your item</h3>
              <p>Provide details that will help buyers</p>
            </div>

            <div className="field-group">
              <label>Item Name *</label>
              <input
                className={`input-styled ${fieldErrors.title ? "input-error" : ""}`}
                type="text"
                placeholder="e.g., Vintage Leather Sofa"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>
            {fieldErrors.title && (
                <div className="error-text">{fieldErrors.title}</div>
            )}

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
                onClick={() => !imagePreview && document.getElementById('imageUploadInput').click()}
                style={{ position: 'relative' }}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', borderRadius: '16px' }}
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
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      Select New Image
                    </button>
                  </>
                ) : (
                  <>
                    <div className="upload-graphic">⬆️</div>
                    <div className="drop-zone-text-primary">Upload an image</div>
                    <div className="drop-zone-text-secondary">Click to browse (JPG, PNG, WEBP)</div>
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

            {fieldErrors.image && (
                <div className="error-text">{fieldErrors.image}</div>
            )}

            <div className="form-row">
              <div className="field-group">
                <label>Price *</label>

                
                  <div className="icon-input-container">
                    <span className="input-icon">$</span>

                    <input
                      className={`input-styled ${fieldErrors.price ? "input-error" : ""}`}
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => updateField('price', e.target.value)}
                    />
                  </div>
                
               
              
              {fieldErrors.price && (
                    <div className="field-error">{fieldErrors.price}</div>
                  )}
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
                  {filteredStores.map((loc) => (
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
                  onExternalControl={(controlFns) => (mapControlRef.current = controlFns)}
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

        <div className="preview-listing-card">

          {/* LEFT: IMAGE */}
          <div className="preview-media">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Item"
                className="preview-image"
              />
            )}
          </div>

          {/* RIGHT: CONTENT */}
          <div className="preview-body">

            <div className="preview-title-row">
              <div className="preview-title">
                {formData.title || "Untitled Item"}
              </div>

              <div className="preview-price">
                ${displayPrice}
              </div>
            </div>

            <p className="preview-description">
              {formData.description || "No description provided"}
            </p>

            {formData.location && (
              <div className="pickup-section">

                <h4 className="pickup-title">Pickup Location</h4>

                {/* KEEPING YOUR ORIGINAL LOCATION STYLE */}
                <div className="review-location-card">
                  <div className="review-location-icon">📍</div>

                  <div className="review-location-info">
                    <div className="review-location-name">
                      {formData.location.name}
                    </div>

                    <div className="review-location-address">
                      {formData.location.address}
                    </div>

                    {formData.location.price && (
                      <div className="review-location-price">
                        {formData.location.price}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

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
      <Header />
      <header className="wizard-nav">
        <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 850, color: '#1E293B' }}>Create a Listing</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginTop: '2px' }}>Step {step} of 3</div>
        </div>
        <div />
      </header>

      <main className="wizard-viewport">{renderStep()}</main>

      <footer className="wizard-dock-footer">
        <button className="btn-wizard-back" onClick={handleBack}>Back</button>
        <button className="btn-wizard-next" onClick={handleNext}>
          {loading ? 'Creating...' : step === 3 ? 'Publish Listing' : 'Continue'}
        </button>
      </footer>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreateListing;