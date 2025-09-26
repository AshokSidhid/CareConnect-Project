import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Effortless Appointment Scheduling</h1>
          <p>Connect with expert doctors and manage your health, all in one place.</p>
          <Link to="/doctors" className="cta-button">
            Book an Appointment
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Find Expert Doctors</h3>
            <p>Browse profiles, specializations, and find the right doctor for your needs.</p>
          </div>
          <div className="feature-card">
            <h3>Easy Online Booking</h3>
            <p>Check real-time availability and book your appointment in just a few clicks.</p>
          </div>
          <div className="feature-card">
            <h3>Manage Your Health</h3>
            <p>View your upcoming appointments, reschedule, or cancel with ease from your dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;