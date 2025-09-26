import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import RescheduleModal from '../components/common/RescheduleModal';
import './PatientDashboard.css';

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);

  const fetchAppointments = async () => {
    if (!user) return;
    try {
      const response = await apiClient.get('/appointments/my-appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await apiClient.put(`/appointments/${appointmentId}/cancel`);
        fetchAppointments();
      } catch (error) {
        console.error("Failed to cancel appointment:", error);
        alert("Could not cancel the appointment. Please try again.");
      }
    }
  };

  const openRescheduleModal = (appointment) => {
    setAppointmentToReschedule(appointment);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSuccess = () => {
    alert('Appointment rescheduled successfully!');
    fetchAppointments();
  };

  if (loading) {
    return <div className="loading-container">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {user?.fullName || 'Patient'}!</p>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-widget">
          <h2>Upcoming Appointments</h2>
          {appointments.length > 0 ? (
            <div className="appointments-list-widget">
              {appointments.map((appt) => (
                <div key={appt.id} className="appointment-card-widget">
                  <div className="appt-card-header">
                    <h4>Dr. {appt.doctorName}</h4>
                    <span className={`status ${appt.status?.toLowerCase()}`}>{appt.status}</span>
                  </div>
                  <p>{new Date(appt.appointmentDateTime).toLocaleString()}</p>
                  
                  {appt.status === 'SCHEDULED' && (
                    <div className="appt-actions">
                      <button onClick={() => openRescheduleModal(appt)} className="btn-reschedule">
                        Reschedule
                      </button>
                      <button onClick={() => handleCancel(appt.id)} className="btn-cancel-appt">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>You have no upcoming appointments.</p>
          )}
        </div>

        <div className="dashboard-widget">
          <h2>Quick Actions</h2>
          <Link to="/doctors">
            <button>Book a New Appointment</button>
          </Link>
        </div>
      </div>

      {isRescheduleModalOpen && (
        <RescheduleModal
          appointment={appointmentToReschedule}
          onClose={() => setIsRescheduleModalOpen(false)}
          onRescheduleSuccess={handleRescheduleSuccess}
        />
      )}
    </div>
  );
}

export default PatientDashboard;