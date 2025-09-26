import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './ManageDoctorsPage.css';

function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    specialization: 'Cardiology',
  });

  const specializations = ["Cardiology", "Dermatology", "Neurology", "Pediatrics", "Orthopedics", "General Medicine"];

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/users/register/doctor', formData);
      alert('Doctor registered successfully!');
      setFormData({ fullName: '', email: '', password: '', specialization: 'Cardiology' });
      fetchDoctors();
    } catch (error) {
      console.error('Failed to register doctor:', error);
      alert('Failed to register doctor. The email might already be in use.');
    }
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor and all their records?')) {
      try {
        await apiClient.delete(`/doctors/${doctorId}`);
        alert('Doctor deleted successfully.');
        fetchDoctors();
      } catch (error) {
        console.error('Failed to delete doctor:', error);
        alert('Failed to delete doctor.');
      }
    }
  };

  return (
    <div>
      <div className="register-doctor-widget">
        <h2>Register a New Doctor</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="Temporary Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="form-group">
            <label htmlFor="specialization">Specialization</label>
            <select
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="form-select"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="primary">
            Register Doctor
          </Button>
        </form>
      </div>

      <div className="existing-doctors-widget">
        <h2>Existing Doctors</h2>
        <table className="doctors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.fullName}</td>
                <td>{doctor.specialization}</td>
                <td>
                  <button onClick={() => handleDelete(doctor.id)} className="btn-delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageDoctorsPage;