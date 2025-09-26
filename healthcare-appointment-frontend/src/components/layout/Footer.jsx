// src/components/layout/Footer.jsx

import React from 'react';
import './Footer.css'; // We will create this CSS file next

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>&copy; {currentYear} Healthcare System. All rights reserved.</p>
        <div className="footer-links">
          {/* These are placeholder links for now */}
          <a href="/privacy-policy">Privacy Policy</a>
          <span>|</span>
          <a href="/terms-of-service">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;