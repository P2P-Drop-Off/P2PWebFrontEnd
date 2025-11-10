// src/pages/CreateAccount.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/style.css";
import "../css/create-account.css";

export default function CreateAccount() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic client-side check
    if (form.password !== form.confirm) {
      alert("Passwords do not match.");
      return;
    }
    console.log("create account", form);
    // TODO: submit to backend, then navigate to dashboard or login
    navigate("/login");
  };

  return (
    <div className="create-account-page">
      {/* Header (same style as Login: white header with P2P badge + nav) */}
      <header className="site-header">
        <div className="brand" onClick={() => navigate("/")}>
          <div className="logo">P2P</div>
        </div>

        <nav className="top-nav">
          <a onClick={() => navigate("/create-listing")}>Create a Listing</a>
          <a onClick={() => navigate("/terms")}>Terms of Service</a>

          <button className="nav-btn gradient-outline" onClick={() => navigate("/login")}>
            Sign In
          </button>

          <button className="nav-btn gradient-solid" onClick={() => navigate("/create-account")}>
            Sign Up
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="create-main">
        <div className="create-card" role="region" aria-labelledby="create-title">
          <h2 id="create-title" className="card-title">Create an account</h2>

          <form className="create-form" onSubmit={handleSubmit} noValidate>
            <div className="row-two">
              <div className="field">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? (
                    /* eye-off */
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18 18 0 0 1 5.23-6.08"></path>
                      <path d="M1 1l22 22"></path>
                    </svg>
                  ) : (
                    /* eye */
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="confirm">Confirm password</label>
              <div className="password-field">
                <input
                  id="confirm"
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  onClick={() => setShowConfirm((s) => !s)}
                >
                  {showConfirm ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18 18 0 0 1 5.23-6.08"></path>
                      <path d="M1 1l22 22"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="row-between">
              <div></div>
              <Link to="/login" className="small-link">Already have an account? Sign in</Link>
            </div>

            <button type="submit" className="btn btn-primary">Create account</button>

            <div className="divider"></div>

            <div className="support-box small">
              <p>Need help? Contact support</p>
              <p><a href="mailto:support@peertopeerdropoff.com">support@peertopeerdropoff.com</a></p>
              <p>123-456-7890</p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
