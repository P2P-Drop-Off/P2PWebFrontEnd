// src/components/Header.jsx
import { useNavigate } from 'react-router-dom';
import '../css/style.css';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="brand" onClick={() => navigate("/")}>
        <div className="logo">P2P</div>
      </div>

      <nav className="top-nav">
        <a onClick={() => navigate("/partner-form")}>Partner Application</a>
        <a onClick={() => navigate("/create-listing")}>Create a Listing</a>
        <a onClick={() => navigate("/terms")}>Terms of Service</a>

        <button
          className="nav-btn gradient-outline"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>

        <button
          className="nav-btn gradient-solid"
          onClick={() => navigate("/create-account")}
        >
          Sign Up
        </button>
      </nav>
    </header>
  );
}

