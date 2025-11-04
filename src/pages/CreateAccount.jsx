import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/style.css';
import '../css/create-account.css';

function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
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
    // TODO: Add actual form submission logic
    alert('Account created successfully!');
    navigate('/');
  };

  return (
    <div className="page-signup">
      {/* Header */}
      <header>
        <h1>Peer to Peer Drop Off</h1>
      </header>

      {/* Main */}
      <main>
        <div className="auth-wrap">
          <button 
            className="back-chip" 
            onClick={() => navigate('/')}
          >
            ← Back to Login
          </button>

          <h2 className="page-title">Create Your Account</h2>

          <form className="auth-form" id="signupForm" onSubmit={handleSubmit}>
            {/* First Name */}
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />

            {/* Last Name */}
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />

            {/* Phone */}
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="(123) 456-7890"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />

            {/* Email */}
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            {/* Password */}
            <label htmlFor="signupPassword">Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                id="signupPassword"
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
                {/* Eye (open) */}
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
                  style={{ display: showPassword ? "inline" : "none" }}
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {/* Eye-off (default) */}
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
                  style={{ display: showPassword ? "none" : "inline" }}
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.87 21.87 0 0 1 5.06-6.94" />
                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.83 21.83 0 0 1-3.87 4.94" />
                  <path d="M1 1l22 22" />
                </svg>
              </button>
            </div>

            <p className="helper-text">Password must be at least 8 characters long.</p>

            <button type="submit" className="cta-large">Create Account</button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <p>© 2025 Peer to Peer Drop Off. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default CreateAccount;

