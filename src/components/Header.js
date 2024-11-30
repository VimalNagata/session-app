import React from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import "../styles.css"; // Import global CSS
import { FaSignInAlt, FaSignOutAlt, FaUserCircle } from "react-icons/fa"; // Import icons

const Header = () => {
  const auth = useAuth();

  const signoutRedirect = () => {
    const clientId = "2fpemjqos4302bfaf65g06l8g0";
    const logoutUri = "https://sessions.red/home";
    const cognitoDomain = "https://auth.sessions.red";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="header-logo">
        <img
          src="/logo.jpeg" // Replace with your logo path
          alt="Expert Sessions Logo"
          className="header-logo-image"
        />
        <span className="header-title">Expert Sessions</span>
      </Link>

      {/* Navigation Links */}
      <nav className="header-nav">
        {!auth.isAuthenticated ? (
          <button className="header-link" onClick={() => auth.signinRedirect()}>
            <FaSignInAlt className="header-icon" /> Sign In
          </button>
        ) : (
          <>
            <Link to="/profile" className="header-link">
              <FaUserCircle className="header-icon" /> Profile
            </Link>
            <button className="header-link" onClick={signoutRedirect}>
              <FaSignOutAlt className="header-icon" /> Sign Out
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;