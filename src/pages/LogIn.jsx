import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/style.css';
import '../css/login.css';

function LogIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordToggle = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add actual authentication logic
    console.log('Login attempt:', formData);
    // Navigate to home or dashboard after successful login
    // navigate('/');
  };

  return (
    <>
      <header>
        <h1>Peer to Peer Drop Off</h1>
      </header>

      <main className="container">
        <div className="logo-box"></div>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              id="loginPassword"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button
              className="toggle"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              data-visible={showPassword}
              onClick={handlePasswordToggle}
            >
              {/* Open eye (shown when visible=true) */}
              <svg
                className="icon eye"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ display: showPassword ? "inline" : "none" }}
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {/* Slashed eye (shown by default when visible=false) */}
              <svg
                className="icon eye-off"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ display: showPassword ? "none" : "inline" }}
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.87 21.87 0 0 1 5.06-6.94"></path>
                <path d="M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.83 21.83 0 0 1-3.87 4.94"></path>
                <path d="M1 1l22 22"></path>
              </svg>
            </button>
          </div>

          <a href="#" className="forgot">Forgot password?</a>

          <button type="submit" className="signin-btn">Sign In</button>
          <button
            type="button"
            className="create-btn"
            onClick={() => navigate('/create-account')}
          >
            Create Account
          </button>
        </form>
      </main>

      <footer>
        <p>&copy; 2025 Peer to Peer Drop Off | All Rights Reserved</p>
      </footer>
    </>
  );
}

export default LogIn;
