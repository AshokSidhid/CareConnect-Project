// src/pages/DoctorsListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './DoctorsListPage.css';

function DoctorsListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await apiClient.get('/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading doctors...</div>;
  }

  return (
    <div className="doctors-list-container">
      <h1>Our Doctors</h1>
      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <Link to={`/doctors/${doctor.id}`} key={doctor.id} className="doctor-card-link">
            <div className="doctor-card">
              <h2>{doctor.fullName}</h2>
              <p>{doctor.specialization}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DoctorsListPage;