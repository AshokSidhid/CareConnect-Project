import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import BookingModal from '../components/common/BookingModal';
import './DoctorProfilePage.css';

function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // Fetch both doctor details and schedule at the same time
        const [doctorResponse, scheduleResponse] = await Promise.all([
          apiClient.get(`/doctors/${id}`),
          apiClient.get(`/doctors/${id}/schedule`)
        ]);
        setDoctor(doctorResponse.data);
        setSchedule(scheduleResponse.data);
      } catch (error) {
        console.error("Failed to fetch doctor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);

  const handleBookingSuccess = () => {
    alert('Appointment booked successfully!');
  };

  // Helper to format time
  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  if (!doctor) {
    return <div className="loading-container">Doctor not found.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>{doctor.fullName}</h1>
        <h2>{doctor.specialization}</h2>
        {/*<p className="doctor-bio">{doctor.biography}</p>*/}
        <p><strong>Experience:</strong> {doctor.yearsOfExperience} years</p>
        
        <div className="schedule-widget">
          <h3>Weekly Schedule</h3>
          {schedule.length > 0 ? (
            <ul className="schedule-list">
              {schedule.map((s) => (
                <li key={s.dayOfWeek}>
                  <span>{s.dayOfWeek}</span>
                  <span>{formatTime(s.startTime)} - {formatTime(s.endTime)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>This doctor has not posted their schedule yet.</p>
          )}
        </div>

        {isAuthenticated ? (
          <button className="book-appointment-btn" onClick={() => setIsModalOpen(true)}>
            Book Appointment
          </button>
        ) : (
          <p className="login-prompt">
            <Link to="/login">Login</Link> to book an appointment.
          </p>
        )}
      </div>

      {isModalOpen && (
        <BookingModal
          doctor={doctor}
          onClose={() => setIsModalOpen(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}

export default DoctorProfilePage;