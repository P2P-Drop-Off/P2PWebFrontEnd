// src/components/Header.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import '../css/style.css';
import '../css/home.css';

export default function Header() {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useListings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleSignOut = () => {
    logoutUser();
    goTo('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`site-header ${menuOpen ? 'menu-open' : ''}`}>
      <div className="brand" onClick={() => goTo("/")}>
        <div className="logo">P2P</div>
      </div>

      <button
        type="button"
        className="header-burger"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className="header-burger-line" />
        <span className="header-burger-line" />
        <span className="header-burger-line" />
      </button>

      {menuOpen && (
        <div
          className="header-overlay"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <nav className={`top-nav ${menuOpen ? 'is-open' : ''}`}>
        <a onClick={() => goTo("/create-listing")}>Create a Listing</a>
        <a onClick={() => goTo("/selling")}>Selling Dashboard</a>
        <a onClick={() => goTo("/partner-form")}>Partner Application</a>
        <a onClick={() => goTo("/terms")}>Terms of Service</a>

        {currentUser ? (
          <div className="header-user-menu" ref={userMenuRef}>
            <button
              type="button"
              className="header-user-trigger"
              onClick={() => setUserMenuOpen((o) => !o)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <span className="header-user-name">{currentUser.name}</span>
            </button>
            {userMenuOpen && (
              <div className="header-user-dropdown">
                <div className="header-user-dropdown-info">
                  <span className="header-user-dropdown-name">{currentUser.name}</span>
                  <span className="header-user-dropdown-email">{currentUser.email}</span>
                </div>
                <hr className="header-user-dropdown-divider" />
                <button type="button" className="header-user-dropdown-item" onClick={() => goTo('/selling')}>
                  Selling Dashboard
                </button>
                <button type="button" className="header-user-dropdown-item header-user-dropdown-signout" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              type="button"
              className="nav-btn gradient-outline"
              onClick={() => goTo("/login")}
            >
              Sign In
            </button>
            <button
              type="button"
              className="nav-btn gradient-solid"
              onClick={() => goTo("/create-account")}
            >
              Sign Up
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

