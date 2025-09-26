import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import './DoctorDashboard.css';
import { Link } from 'react-router-dom'; // Add Link to imports

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || user.role !== 'DOCTOR') return;

    const fetchDoctorAppointments = async () => {
      try {
        const response = await apiClient.get('/appointments/doctor/my-appointments');
        setAppointments(response.data);
      } catch (error) {
        console.error("Failed to fetch doctor's appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAppointments();
  }, [user]);

  if (loading) {
    return <div className="loading-container">Loading schedule...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <p>Welcome, Dr. {user?.fullName}!</p>
      </header>

      <div className="appointments-section">
        <h2>Your Schedule</h2>
        {appointments.length > 0 ? (
          <div className="appointments-list">
            {appointments.map((appt) => (
              <div key={appt.id} className="appointment-card">
                  
                <h3>Patient: <Link to={`/doctor/patient-details/${appt.patientId}`}>{appt.patientName}</Link></h3>
                <p><strong>Date & Time:</strong> {new Date(appt.appointmentDateTime).toLocaleString()}</p>
                <p><strong>Status:</strong> <span className={`status ${appt.status?.toLowerCase()}`}>{appt.status}</span></p>
              </div>
            ))}
          </div>
        ) : (
          <p>You have no appointments scheduled.</p>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;