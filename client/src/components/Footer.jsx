import React from 'react';
import '../styles/Footer.css'; // Corrected path

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} PrepMate. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
