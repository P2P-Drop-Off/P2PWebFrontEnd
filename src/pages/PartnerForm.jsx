// src/pages/PartnerForm.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../css/partner-form.css";

export default function PartnerForm() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const firstErrorRef = useRef(null);

  const REQUIRED_FIELDS = [
    "storeName",
    "street",
    "city",
    "state",
    "zip",
    "phone",
    "email",
    "submittersName",
    "role"
  ];

  const [form, setForm] = useState({
    storeName: "",
    storeType: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    submittersName: "",
    capacity: "",
    space: "",
    itemsCanStore: "",
    cost: "",
    type: "",
    commission: "",
    instructions: "",
    hours: {
      mon: { open: "", close: "", closed: false },
      tue: { open: "", close: "", closed: false },
      wed: { open: "", close: "", closed: false },
      thu: { open: "", close: "", closed: false },
      fri: { open: "", close: "", closed: false },
      sat: { open: "", close: "", closed: false },
      sun: { open: "", close: "", closed: false },
    },
    amenities: [],
  });

  const handleChange = (e) => {
      const { name, value } = e.target;

      let updatedValue = value;

      /* Phone Number Formatting: (###)-###-#### */
      if (name === "phone") {
        const digits = value.replace(/\D/g, "").slice(0, 10);

        if (digits.length >= 6) {
          updatedValue = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        } else if (digits.length >= 3) {
          updatedValue = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else {
          updatedValue = digits;
        }
      }

      setForm((prev) => ({ ...prev, [name]: updatedValue }));

      const validateField = (name, value) => {
        let errorMsg = "";

        if (name === "phone") {
          const digits = value.replace(/\D/g, "");
          if (digits.length !== 10) {
            errorMsg = "Phone number must be exactly 10 digits.";
          }
        }

        if (name === "email") {
          const trimmed = value.trim();

          const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

          if (!trimmed) {
            errorMsg = "Email is required.";
          } else if (!emailRegex.test(trimmed)) {
            errorMsg = "Please enter a valid email address (e.g. store@example.com).";
          }
        }

        if (name === "zip") {
          if (!/^\d{5}$/.test(value)) {
            errorMsg = "ZIP code must be 5 digits.";
          }
        }

        if (name === "commission") {
          const num = Number(value);
          if (value && (num < 0 || num > 100)) {
            errorMsg = "Commission must be between 0 and 100.";
          }
        }

        setErrors((prev) => ({
          ...prev,
          [name]: errorMsg,
        }));
      };
    };

  const handleHoursChange = (day, field, value) => {
    setForm((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value,
        },
      },
    }));
  };
  /* Buisness Hour Validation */
  const validateHours = () => {
    for (let [day, data] of Object.entries(form.hours)) {
      if (!data.closed) {
        if (!data.open || !data.close) {
          return "Every day must have opening and closing times or be marked closed.";
        }
        if (data.close <= data.open) {
          return "Closing time must be later than opening time.";
        }
      }
    }
    return "";
  };

  const toggleClosed = (day) => {
    setForm((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          closed: !prev.hours[day].closed,
        },
      },
    }));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity) // remove if selected
        : [...prev.amenities, amenity]; // add if not selected
      return { ...prev, amenities: newAmenities };
    });
  };

  const handleSubmit = async () => {
      const newErrors = {};

      /* Required Fields */
      REQUIRED_FIELDS.forEach((field) => {
        if (!form[field] || form[field].toString().trim() === "") {
          newErrors[field] = "This field is required.";
        }
      });

      /* Validate Hours */
      const hoursError = validateHours();
      if (hoursError) {
        newErrors.hours = hoursError;
      }
      /* Validate Email Format */
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

      if (!emailRegex.test(form.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
      /* Validate Phone Number */
      const digitsOnly = form.phone.replace(/\D/g, "");
      if (form.phone && digitsOnly.length !== 10) {
        newErrors.phone = "Phone number must contain exactly 10 digits.";
      }

      /* ZIP Code Validation*/
      if (form.zip && !/^\d{5}$/.test(form.zip)) {
        newErrors.zip = "ZIP code must be 5 digits.";
      }

      /* Commission Validation */
      if (form.commission) {
        const num = Number(form.commission);
        if (num < 0 || num > 100) {
          newErrors.commission = "Commission must be between 0 and 100.";
        }
      }


      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        setTimeout(() => {
          const firstErrorElement = document.querySelector(".input-error, .section-error");
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
        return;
      }

      try {
        const response = await fetch("/api/partners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (response.ok) {
          alert("Application submitted!");
          navigate("/dashboard");
        } else {
          alert("Failed to submit application");
        }
      } catch (error) {
        console.error(error);
        alert("Error submitting application");
      }
  };

  const US_STATES = [
    { value: "", label: "Select state..." },
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
  ];

  return (
    <>
      <Header />
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <div className="page-header">
            <h1>Partner Store Application</h1>
            <p>
              We partner with businesses to provide convenient pickup
              locations for our customers. Apply to join our network of partner
              stores today!<br /><i>Upon submission of this application, our team will review your information and reach out with next steps. </i>
            </p>
          </div>

          {/* Store Information */}
          <SectionCard title="Store Information">
            <div className="grid-2">
              <Input
                label="Store Name *"
                name="storeName"
                placeholder="e.g. Downtown Center"
                value={form.storeName}
                onChange={handleChange}
                error={errors.storeName}
              />
              <Select
                label="Store Type"
                name="storeType"
                placeholder="Select store type"
                value={form.storeType}
                onChange={handleChange}
                options={["Thrift Store", "Warehouse", "Locker Hub", "Retail", "Other"]}
              />
            </div>
          </SectionCard>

          {/* Location Details */}
          <SectionCard title="Location Details">
            <Input
              label="Street Address *"
              name="street"
              placeholder="e.g. 123 Main St"
              value={form.street}
              onChange={handleChange}
              error={errors.street}
            />
            <div className="grid-3">
              <Input
                label="City *"
                name="city"
                placeholder="e.g. San Clemente"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
              />
              <div className="form-group">
                <label>State *</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  error={errors.state}
                  className={`input ${errors.state ? "input-error" : ""}`}
                  >
                    {US_STATES.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <span className="error-text">{errors.state}</span>
                  )}
                </div>

              <Input
                label="Zip Code *"
                name="zip"
                placeholder="e.g. 92672"
                value={form.zip}
                onChange={handleChange}
                error={errors.zip}
              />
            </div>
          </SectionCard>

{/* Contact + Business Hours Side-by-Side */}
<div className="grid-2">
  
  {/* Contact Info */}
  <SectionCard title="Contact Information">
    <div className="contact-stack">
      <Input
        label="Your Name *"
        name="submittersName"
        placeholder="John Smith"
        value={form.submittersName}
        onChange={handleChange}
        error={errors.submittersName}
      />
      <Input
        label="Your Role *"
        name="role"
        placeholder="e.g. Store Manager"
        value={form.role}
        onChange={handleChange}
        error={errors.role}
      />
      <Input
        label="Phone *"
        name="phone"
        placeholder="(212) 555-0123"
        value={form.phone}
        onChange={handleChange}
        error={errors.phone}
      />
      <Input
        label="Email *"
        name="email"
        placeholder="store@company.com"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
      />
    </div>
  </SectionCard>

  {/* Business Hours */}
  <SectionCard title="Business Hours">
    {errors.hours && (
      <div className="section-error">{errors.hours}</div>
              )}
              <div className="hours-list">
                {[
                  { label: "Mon", key: "mon" },
                  { label: "Tue", key: "tue" },
                  { label: "Wed", key: "wed" },
                  { label: "Thu", key: "thu" },
                  { label: "Fri", key: "fri" },
                  { label: "Sat", key: "sat" },
                  { label: "Sun", key: "sun" },
                ].map((day) => {
                  const dayData = form.hours[day.key];

                  return (
                    <div key={day.key} className="hours-row-upgraded">
                      <span className="day-label">{day.label}</span>

                      {dayData.closed ? (
                        <>
                          <span className="closed-label">Closed</span>
                          <span className="time-placeholder">to</span>
                          <div className="time-placeholder input" />
                        </>
                      ) : (
                        <>
                          <input
                            type="time"
                            value={dayData.open}
                            onChange={(e) =>
                              handleHoursChange(day.key, "open", e.target.value)
                            }
                            className="input"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={dayData.close}
                            onChange={(e) =>
                              handleHoursChange(day.key, "close", e.target.value)
                            }
                            className="input"
                          />
                        </>
                      )}

                      <button
                        type="button"
                        className="closed-toggle"
                        onClick={() => toggleClosed(day.key)}
                      >
                        {dayData.closed ? "Open" : "Closed"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

          </div>

          


          {/* Capacity & Partnership */}
          <div className="grid-2">
            <SectionCard title="Capacity & Storage">
              <div className="extra-info">
                <span><i>How much space could you dedicate to Drop 'N Off items?</i></span>
              </div>
              <div className="grid-2">
                <Input
                  label="Space (estimated sq ft)"
                  name="space"
                  placeholder="100"
                  value={form.space}
                  onChange={handleChange}
                />
                <Select
                  label="Items You Can Store"
                  name="itemsCanStore"
                  placeholder="Select size of items"
                  value={form.itemsCanStore}
                  onChange={handleChange}
                  options={["Small", "Medium ", "Large"]}
                />
              </div>
            </SectionCard>

            <SectionCard title="Amenities & Features">
              <div className="amenities-grid">
                {["Dedicated Parking", "Contactless Payment", "Free WiFi", "Climate Control", "Pet Friendly", "Wheelchair Accessible"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={`amenity-pill ${form.amenities.includes(item) ? "selected" : ""}`}
                    onClick={() => toggleAmenity(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>

          

          {/* Special Instructions */}
          <SectionCard title="Special Instructions">
            <textarea
              name="instructions"
              placeholder="e.g. Use back entrance for pickups, ring doorbell for assistance..."
              value={form.instructions}
              onChange={handleChange}
              className="textarea"
            />
          </SectionCard>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
          >
            Submit Application
          </button>
        </div>
      </div>
    </>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="section-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        className={`input ${error ? "input-error" : ""}`}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

function Select({ label, options, placeholder, ...props }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <select className="input" {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}