import React from 'react';
import '../styles/Navbar.css'; // Corrected path

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">PrepMate</div>
      <div className="navbar-buttons">
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
