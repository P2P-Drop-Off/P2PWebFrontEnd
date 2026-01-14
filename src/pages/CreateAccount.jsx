// src/pages/CreateAccount.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../functions/firebase";
import { useListings } from "../context/ListingsContext";
import "../css/style.css";
import "../css/create-account.css";

export default function CreateAccount() {
  const navigate = useNavigate();
  const { login } = useListings();
  const [step, setStep] = useState(1);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // Form State
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    city: "",
    state: "",
    zip: "",
    interests: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCreateAccount = async () => {
    setIsCreatingAccount(true);
    try {
      await signUp(
        form.email,
        form.password,
        form.firstName,
        form.lastName,
        form.city,
        form.state,
        form.zip,
        form.interests
      );
      console.log("Account created successfully");

      // Log in to context
      login({ name: `${form.firstName} ${form.lastName}`, email: form.email });

      // Navigate to selling dashboard after successful account creation
      setTimeout(() => {
        navigate("/selling");
      }, 1500);
    } catch (error) {
      console.error("Error creating account:", error);
      alert(error.message.replace("Error:", ""));
      setIsCreatingAccount(false);
      // Go back to step 1 to correct information
      setStep(1);
    }
  };


  return (
    <div className="create-account-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Join P2P</h1>
          </div>

          <nav className="steps-nav">
            <StepItem
              stepNumber={1}
              currentStep={step}
              title="Account Details"
              description="Basic information"
            />
            <StepItem
              stepNumber={2}
              currentStep={step}
              title="Your Location"
              description="Find items near you"
            />
            <StepItem
              stepNumber={3}
              currentStep={step}
              title="Shopping Interests"
              description="Personalize your feed"
            />
            <StepItem
              stepNumber={4}
              currentStep={step}
              title="All Set!"
              description="Start shopping"
            />
          </nav>

          <div className="sidebar-footer">
            <div className="trust-badge">
              <div className="trust-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="trust-text">
                <strong>Trusted by thousands</strong>
                <p>
                  Join our community of safe, secure second-hand shopping
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* NEW gradient header with Home button */}
        <header className="main-header">
          <div className="main-header-inner">
            <div className="main-header-left">
              <div className="header-logo-circle">P2P</div>
              <div className="header-text">
                <span className="header-title">Create your account to start shopping</span>

              </div>
            </div>

            {/* Home button now lives in the header */}
            <button
              className="home-btn"
              type="button"
              onClick={() => navigate("/")}
            >
              Home
            </button>
          </div>
        </header>

        {/* Form content card */}
        <div className="content-container">
          {step === 1 && (
            <Step1AccountDetails
              form={form}
              handleChange={handleChange}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <Step2Location
              form={form}
              handleChange={handleChange}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}
          {step === 3 && (
            <Step3Interests
              form={form}
              setForm={setForm}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}
          {step === 4 && (
            <Step4AllSet
              onBack={handleBack}
              onCreate={handleCreateAccount}
              isCreating={isCreatingAccount}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Helper Components

function StepItem({ stepNumber, currentStep, title, description }) {
  const isActive = currentStep === stepNumber;
  const isCompleted = currentStep > stepNumber;

  return (
    <div
      className={`step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""
        }`}
    >
      <div className="step-indicator">
        {isCompleted ? (
          <span className="check-icon">✓</span>
        ) : (
          <span className="step-number">{stepNumber}</span>
        )}
      </div>
      <div className="step-info">
        <span className="step-title">{title}</span>
        <span className="step-desc">{description}</span>
      </div>
    </div>
  );
}

function Step1AccountDetails({ form, handleChange, onNext }) {
  const [errors, setErrors] = React.useState({});
  const [attemptedSubmit, setAttemptedSubmit] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const validatePassword = () => {
    const password = form.password;
    const confirm = form.confirm;

    // Check if passwords are empty
    if (!password.trim() || !confirm.trim()) {
      return "Please enter and confirm your password";
    }

    // Check if passwords match
    if (password !== confirm) {
      return "Passwords need to match to continue";
    }

    // Check password requirements
    const missingRequirements = [];
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[a-z]/.test(password)) {
      missingRequirements.push("a lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      missingRequirements.push("an uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      missingRequirements.push("a number");
    }

    if (missingRequirements.length > 0) {
      return `Password is missing ${missingRequirements.join(', ')}`;
    }

    return null;
  };

  const validateEmail = () => {
    const email = form.email.trim();

    if (!email) {
      return "Please enter your email address";
    }

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "Please enter your first name";
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = "Please enter your last name";
    }

    const emailError = validateEmail();
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword();
    if (passwordError) {
      newErrors.password = passwordError;
    }

    return newErrors;
  };

  const handleContinue = () => {
    setAttemptedSubmit(true);
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="step-container fade-in">
      <h2>Create Your Account</h2>
      <div className="form-group-row">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Enter your first name here"
            className={`input-field ${errors.firstName ? 'error' : ''}`}
          />
          {errors.firstName && <p className="error-text">{errors.firstName}</p>}
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Enter your last name here"
            className={`input-field ${errors.lastName ? 'error' : ''}`}
          />
          {errors.lastName && <p className="error-text">{errors.lastName}</p>}
        </div>
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email here"
          className={`input-field ${errors.email ? 'error' : ''}`}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>
      <div className="form-group">
        <label>Password</label>
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password here"
            className={`input-field ${errors.password ? 'error' : ''}`}
          />
          <button
            type="button"
            className="toggle-password"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? (
              // eye-off / slashed eye
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18 18 0 0 1 5.23-6.08"></path>
                <path d="M1 1l22 22"></path>
              </svg>
            ) : (
              // eye
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
              </svg>
            )}
          </button>
        </div>
        <p className="help-text">
          Use at least 8 characters with a mix of letters and numbers
        </p>
      </div>
      <div className="form-group">
        <label>Confirm Password</label>
        <div className="password-field">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            placeholder="Re-enter your password"
            className={`input-field ${errors.password ? 'error' : ''}`}
          />
          <button
            type="button"
            className="toggle-password"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            aria-pressed={showConfirmPassword}
            onClick={() => setShowConfirmPassword((p) => !p)}
          >
            {showConfirmPassword ? (
              // eye-off / slashed eye
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18 18 0 0 1 5.23-6.08"></path>
                <path d="M1 1l22 22"></path>
              </svg>
            ) : (
              // eye
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      <p className="terms-text">
        By creating an account, you agree to our Terms of Service and Privacy
        Policy
      </p>

      <div className="action-bar right">
        <button className="btn-primary" onClick={handleContinue}>
          Continue &gt;
        </button>
      </div>
    </div>
  );
}

function Step2Location({ form, handleChange, onBack, onNext }) {
  const [errors, setErrors] = React.useState({});
  const [attemptedSubmit, setAttemptedSubmit] = React.useState(false);

  // List of all 50 US states
  const US_STATES = [
    { value: "", label: "Select a state..." },
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

  const validateZipCode = (zip) => {
    // Validate ZIP code format (5 digits or ZIP+4 format)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip.trim());
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.city.trim()) {
      newErrors.city = "Please enter your city";
    }
    if (!form.state || form.state === "") {
      newErrors.state = "Please select your state";
    }
    if (!form.zip.trim()) {
      newErrors.zip = "Please enter your ZIP code";
    } else if (!validateZipCode(form.zip)) {
      newErrors.zip = "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
    }

    return newErrors;
  };

  const handleContinue = () => {
    setAttemptedSubmit(true);
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="step-container fade-in">
      <div className="step-header-icon">
        <span className="icon-location">📍</span>
        <h2>Where Are You Located?</h2>
      </div>
      <p className="step-subtitle">
        We'll show you items available near you
      </p>

      <div className="form-group">
        <label>City</label>
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="Type your city here"
          className={`input-field ${errors.city ? 'error' : ''}`}
        />
        {errors.city && <p className="error-text">{errors.city}</p>}
      </div>

      <div className="form-group-row">
        <div className="form-group">
          <label>State</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className={`input-field ${errors.state ? 'error' : ''}`}
          >
            {US_STATES.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
          {errors.state && <p className="error-text">{errors.state}</p>}
        </div>
        <div className="form-group">
          <label>ZIP Code</label>
          <input
            type="text"
            name="zip"
            value={form.zip}
            onChange={handleChange}
            placeholder="12345"
            className={`input-field ${errors.zip ? 'error' : ''}`}
            maxLength="10"
          />
          {errors.zip && <p className="error-text">{errors.zip}</p>}
        </div>
      </div>

      <div className="info-box">
        <span className="bulb-icon">💡</span>
        <p>
          Your location helps us show you the best local deals and reduces
          shipping costs
        </p>
      </div>

      <div className="action-bar">
        <button className="btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn-primary" onClick={handleContinue}>
          Continue &gt;
        </button>
      </div>
    </div>
  );
}

function Step3Interests({ form, setForm, onBack, onNext }) {
  const interestsList = [
    { id: "clothing", label: "Clothing & Accessories", icon: "👕" },
    { id: "furniture", label: "Furniture", icon: "🛋️" },
    { id: "electronics", label: "Electronics", icon: "📱" },
    { id: "books", label: "Books & Media", icon: "📚" },
    { id: "sports", label: "Sports & Outdoors", icon: "⚽" },
    { id: "home", label: "Home & Garden", icon: "🏡" },
    { id: "toys", label: "Toys & Games", icon: "🧸" },
    { id: "art", label: "Collectibles & Art", icon: "🎨" },
  ];

  const toggleInterest = (id) => {
    setForm((prev) => {
      const current = prev.interests || [];
      if (current.includes(id)) {
        return { ...prev, interests: current.filter((i) => i !== id) };
      } else {
        return { ...prev, interests: [...current, id] };
      }
    });
  };

  return (
    <div className="step-container fade-in">
      <h2>What Are You Looking For?</h2>
      <p className="step-subtitle">
        Select your interests to personalize your shopping experience (optional)
      </p>

      <div className="interests-grid">
        {interestsList.map((item) => (
          <div
            key={item.id}
            className={`interest-card ${form.interests?.includes(item.id) ? "selected" : ""
              }`}
            onClick={() => toggleInterest(item.id)}
          >
            <span className="interest-icon">{item.icon}</span>
            <span className="interest-label">{item.label}</span>
          </div>
        ))}
      </div>

      <p className="help-text center">
        You can always update your interests later in your account settings
      </p>

      <div className="action-bar">
        <button className="btn-text" onClick={onNext}>
          Skip for now
        </button>
        <div className="right-actions">
          <button className="btn-secondary" onClick={onBack}>
            Back
          </button>
          <button className="btn-primary" onClick={onNext}>
            Continue &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

function Step4AllSet({ onBack, onCreate, isCreating }) {
  return (
    <div className="step-container fade-in center-content">
      <div className="success-icon-large">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="12" fill="#8B5CF6" />
          <path
            d="M8 12L11 15L16 9"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2>Welcome to P2P!</h2>
      <p className="step-subtitle">
        {isCreating
          ? "Creating your account..."
          : "Your account is ready. Start exploring thousands of quality second-hand items from trusted sellers in your area."}
      </p>

      {!isCreating && (
        <>
          <div className="next-steps-box">
            <h3>What's next?</h3>
            <ul>
              <li>Browse items in your area</li>
              <li>Save your favorites</li>
              <li>Message sellers directly</li>
              <li>Complete secure transactions</li>
            </ul>
          </div>

          <div className="action-bar">
            <button className="btn-secondary" onClick={onBack}>
              Back
            </button>
            <button className="btn-primary" onClick={onCreate}>
              Create Account &gt;
            </button>
          </div>
        </>
      )}

      {isCreating && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}