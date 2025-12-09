// src/pages/LogIn.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {logIn} from "../functions/firebase";
import Header from "../components/Header";
import "../css/style.css";
import "../css/login.css";

export default function LogIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [error, setError] = useState("");     // ⬅ optional: show error messages
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => { // just added async signature to this
    e.preventDefault();
    console.log("login attempt", formData);

    try {
      await logIn(formData.email, formData.password);
      console.log("Logged in successfully")
      navigate("/"); // TODO: redirect after login to somewhere idk

    } catch (err) {
      console.error(err);
      setError(err.message.replace("Firebase:", ""));

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="login-page">
      <Header />

      {/* Main */}
      <main className="login-main">
        <div className="login-card" role="region" aria-labelledby="signin-title">
          <h2 id="signin-title" className="card-title">Peer to Peer Drop Off</h2>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                aria-describedby="forgot-link"
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

            {/* Forgot password (right aligned) */}
            <div className="row-between">
              <div></div>
              <a id="forgot-link" href="#" className="forgot" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary">Sign In</button>

            <div className="divider"></div>

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/create-account")}
            >
              Create Account
            </button>

            {/* SUPPORT BOX (same as Create Account) */}
            <div className="support-box small" style={{ marginTop: "16px" }}>
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
