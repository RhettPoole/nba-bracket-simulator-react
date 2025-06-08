import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

// All our header is doing is retrieving info and displaying it, not managing its own state or running anything. Only need to display info to the user here.
function Header({ user, onLogout }) {
  return (
    <header className="header-container">
      {/* Top bar: logo, app name, user info/login */}
      <div className="header-top">
        <div className="header-logo">
          <img
            src="/bracket-sim-logo.jpg"
            alt="logo"
          />
        </div>

        <div className="header-user">
          {user ? (
            <>
              <span>Welcome, {user.email}</span>
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Nav bar */}
      <nav className="header-nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/brackets" className="nav-link">Brackets</Link>
        <Link to="/account" className="nav-link">Account Info</Link>
        <Link to="/contact" className="nav-link">Contact Us</Link>
      </nav>
    </header>
  );
}

export default Header;