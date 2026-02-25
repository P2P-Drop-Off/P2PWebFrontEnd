// src/pages/PartnerForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../css/partner-form.css";

export default function PartnerForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    storeName: "",
    storeType: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    manager: "",
    capacity: "",
    space: "",
    dimensions: "",
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
    amenities: [], // <-- Track selected amenities
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    try {
      const requiredFields = ["storeName", "street", "city", "state", "zip", "phone", "email"];

      for (let field of requiredFields) {
        if (!form[field]) {
          alert("Please fill out all required fields.");
          return;
        }
      }
      const response = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        alert("Application submitted!");
        navigate("/dashboard"); // or wherever you want
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

          {/* Basic Information */}
          <SectionCard title="Basic Information">
            <div className="grid-2">
              <Input
                label="Store Name *"
                name="storeName"
                placeholder="e.g. Downtown Center"
                value={form.storeName}
                onChange={handleChange}
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
            />
            <div className="grid-3">
              <Input
                label="City *"
                name="city"
                placeholder="e.g. San Clemente"
                value={form.city}
                onChange={handleChange}
              />
              <div className="form-group">
                <label>State *</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="input"
                >
                  {US_STATES.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Zip Code *"
                name="zip"
                placeholder="e.g. 92672"
                value={form.zip}
                onChange={handleChange}
              />
            </div>
          </SectionCard>

          {/* Contact Info */}
          <SectionCard title="Contact Information">
            <div className="grid-3">
              <Input
                label="Phone *"
                name="phone"
                placeholder="(212) 555-0123"
                value={form.phone}
                onChange={handleChange}
              />
              <Input
                label="Email *"
                name="email"
                placeholder="store@company.com"
                value={form.email}
                onChange={handleChange}
              />
              <Input
                label="Manager Name"
                name="manager"
                placeholder="John Smith"
                value={form.manager}
                onChange={handleChange}
              />
            </div>
          </SectionCard>

          {/* Capacity & Partnership */}
          <div className="grid-2">
            <SectionCard title="Capacity & Storage">
              <div className="grid-2">
                <Input
                  label="Item Capacity"
                  name="capacity"
                  placeholder="200"
                  value={form.capacity}
                  onChange={handleChange}
                />
                <Input
                  label="Space (sq ft)"
                  name="space"
                  placeholder="500"
                  value={form.space}
                  onChange={handleChange}
                />
                <Input
                  label="Max Dimensions"
                  name="dimensions"
                  placeholder="48x48x48"
                  value={form.dimensions}
                  onChange={handleChange}
                />
                <Input
                  label="Cost ($/mo)"
                  name="cost"
                  placeholder="15"
                  value={form.cost}
                  onChange={handleChange}
                />
              </div>
            </SectionCard>

            <SectionCard title="Partnership Details">
              <div className="grid-2">
                  <Select
                    label="Type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    options={["Revenue Share", "Flat Rate"]}
                  />

                  {form.type === "Revenue Share" && (
                    <Input
                      label="Commission (%)"
                      name="commission"
                      type="number"
                      min="0"
                      max="100"
                      value={form.commission}
                      onChange={handleChange}
                    />
                  )}
                  {form.type === "Flat Rate" && (
                    <Input
                      label="Commission (%)"
                      name="commission"
                      type="number"
                      min="0"
                      max="100"
                      value={form.commission}
                      onChange={handleChange}
                    />
                  )}
                </div>
            </SectionCard>
          </div>

          <div className="hours-and-features">
            <SectionCard title="Business Hours">
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

            <SectionCard title="Amenities & Features">
              <div className="amenities-grid">
                {["Parking", "Accessible", "Climate Control", "Security"].map((item) => (
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

function Input({ label, ...props }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input className="input" {...props} />
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