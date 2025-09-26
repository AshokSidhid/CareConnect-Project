import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import './RescheduleModal.css';

function RescheduleModal({ appointment, onClose, onRescheduleSuccess }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      setAvailableSlots([]);
      setSelectedSlot('');
      
      apiClient.get(`/doctors/${appointment.doctorId}/availability?date=${selectedDate}`)
        .then(response => {
          // Filter out past slots for today's date
          const now = new Date();
          const todayString = getTodayString();
          const filteredSlots = response.data.filter(slot => {
            const slotDateTime = new Date(slot);
            return !(selectedDate === todayString && slotDateTime <= now);
          });
          setAvailableSlots(filteredSlots);
        })
        .catch(error => {
          console.error("Failed to fetch time slots:", error);
          alert("Could not fetch available time slots for this date.");
        })
        .finally(() => {
          setLoadingSlots(false);
        });
    }
  }, [selectedDate, appointment.doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('Please select a new time slot.');
      return;
    }
    try {
      await apiClient.put(`/appointments/${appointment.id}/reschedule`, {
        newAppointmentDateTime: selectedSlot,
      });
      onRescheduleSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to reschedule:', error);
      alert('Failed to reschedule. The slot may no longer be available or is in the past.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Reschedule Appointment</h2>
        <p>with Dr. {appointment.doctorName}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rescheduleDate">1. Select a New Date</label>
            <input
              type="date"
              id="rescheduleDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getTodayString()} // Restrict past dates
              required
            />
          </div>

          {selectedDate && (
            <div className="form-group">
              <label>2. Select an Available Time</label>
              {loadingSlots && <p>Loading times...</p>}
              <div className="slots-container">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => {
                    const time = new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <button
                        type="button"
                        key={slot}
                        className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {time}
                      </button>
                    );
                  })
                ) : (
                  !loadingSlots && <p>No available slots for this day.</p>
                )}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-confirm" disabled={!selectedSlot}>Confirm Reschedule</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RescheduleModal;