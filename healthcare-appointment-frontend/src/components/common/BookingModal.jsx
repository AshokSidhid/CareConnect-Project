import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import './BookingModal.css';

function BookingModal({ doctor, onClose, onBookingSuccess }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { user } = useContext(AuthContext);

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
      
      apiClient.get(`/doctors/${doctor.id}/availability?date=${selectedDate}`)
        .then(response => {
          setAvailableSlots(response.data);
        })
        .catch(error => {
          console.error("Failed to fetch time slots:", error);
          alert("Could not fetch available time slots for this date.");
        })
        .finally(() => {
          setLoadingSlots(false);
        });
    }
  }, [selectedDate, doctor.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('Please select an available time slot.');
      return;
    }

    try {
      await apiClient.post('/appointments/book', {
        patientId: user.id,
        doctorId: doctor.id,
        appointmentDateTime: selectedSlot,
      });
      onBookingSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to book appointment:', error);
      alert('Failed to book appointment. The time slot may have just been taken.');
    }
  };

  // 1. Filter out past time slots if the selected date is today
  const filterPastSlots = () => {
    if (selectedDate !== getTodayString()) {
      return availableSlots; // If it's a future date, show all slots
    }
    const now = new Date();
    return availableSlots.filter(slot => new Date(slot) > now);
  };
  
  const displaySlots = filterPastSlots();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Book Appointment with Dr. {doctor.fullName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="appointmentDate">1. Select a Date</label>
            <input
              type="date"
              id="appointmentDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getTodayString()}
              required
            />
          </div>

          {selectedDate && (
            <div className="form-group">
              <label>2. Select an Available Time</label>
              {loadingSlots && <p>Loading times...</p>}
              <div className="slots-container">
                {displaySlots.length > 0 ? ( // 2. Use the filtered list here
                  displaySlots.map((slot) => {
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
            <button type="submit" className="btn-confirm" disabled={!selectedSlot}>Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;