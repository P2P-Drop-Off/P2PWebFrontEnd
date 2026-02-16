// src/pages/PartnerForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    commission: "",
    instructions: "",
    weekdayHours: "",
    saturdayHours: "",
    sundayHours: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
  { value: "WY", label: "Wyoming" }
];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        <div className="page-header">
          <h1>Partner Store Application</h1>
          <p>We partner with buisnesses to provide convenient pickup locations for our customers. Apply to join our network of partner stores today!</p>
        </div>

        {/* Basic Information */}
        <SectionCard title="Basic Information">
          <div className="grid-2">
            <Input label="Store Name *" name="storeName" placeholder="e.g. Downtown Center" value={form.storeName} onChange={handleChange} />
            <Select label="Store Type" name="storeType" placeholder="Select store type" value={form.storeType} onChange={handleChange}
              options={["Thrift Store", "Warehouse", "Locker Hub", "Retail", "Other"]} />
          </div>
        </SectionCard>

        {/* Location Details */}
        <SectionCard title="Location Details">
          <Input label="Street Address *" name="street" placeholder="e.g. 123 Main St" value={form.street} onChange={handleChange} />
          <div className="grid-3">
            <Input label="City *" name="city" placeholder="e.g. San Clemente" value={form.city} onChange={handleChange} />
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

            <Input label="Zip Code *" name="zip" placeholder="e.g. 92672" value={form.zip} onChange={handleChange} />
          </div>
        </SectionCard>

        {/* Contact Info */}
        <SectionCard title="Contact Information">
          <div className="grid-3">
            <Input label="Phone *" name="phone" placeholder="(212) 555-0123" value={form.phone} onChange={handleChange} />
            <Input label="Email *" name="email" placeholder="store@company.com" value={form.email} onChange={handleChange} />
            <Input label="Manager Name" name="manager" placeholder="John Smith" value={form.manager} onChange={handleChange} />
          </div>
        </SectionCard>

      

        {/* Capacity & Partnership */}
        <div className="grid-2">
          <SectionCard title="Capacity & Storage">
            <div className="grid-2">
              <Input label="Item Capacity" name="capacity" placeholder="200" value={form.capacity} onChange={handleChange} />
              <Input label="Space (sq ft)" name="space" placeholder="500" value={form.space} onChange={handleChange} />
              <Input label="Max Dimensions" name="dimensions" placeholder="48x48x48" value={form.dimensions} onChange={handleChange} />
              <Input label="Cost ($/mo)" name="cost" placeholder="15" value={form.cost} onChange={handleChange} />
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
              <Input label="Commission (%)" name="commission" value={form.commission} onChange={handleChange} />
            </div>
          </SectionCard>
        </div>

        <div className="hours-and-features">
          <SectionCard title="Business Hours">
            <div className="hours-list">
              {[
                { label: "Mon", name: "mon" },
                { label: "Tue", name: "tue" },
                { label: "Wed", name: "wed" },
                { label: "Thu", name: "thu" },
                { label: "Fri", name: "fri" },
                { label: "Sat", name: "sat" },
                { label: "Sun", name: "sun" },
              ].map((day) => (
                <div key={day.name} className="hours-row">
                  <span className="day-label">{day.label}</span>
                  <input
                    type="text"
                    name={day.name}
                    value={form[day.name] || ""}
                    onChange={handleChange}
                    placeholder="9:00 AM - 6:00 PM"
                    className="input"
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Amenities & Features">
            <div className="amenities-grid">
              {[
                "Parking",
                "Accessible",
                "Climate Control",
                "Security",
              ].map((item) => (
                <button
                  type="button"
                  key={item}
                  className="amenity-pill"
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
          type="submit"
          className="btn-primary"
        >
          Submit Application
        </button>
      </div>


      
    </div>
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

function Select({ label, options, ...props }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <select className="input" {...props}>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
