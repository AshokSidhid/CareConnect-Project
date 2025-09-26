import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './PatientDetailsPage.css';

function PatientDetailsPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await apiClient.get(`/patients/${id}`);
        setPatient(response.data);
      } catch (error) {
        console.error("Failed to fetch patient details:", error);
        // Handle 403 Forbidden error specifically if needed
      } finally {
        setLoading(false);
      }
    };
    fetchPatientDetails();
  }, [id]);

  if (loading) {
    return <div className="loading-container">Loading patient details...</div>;
  }

  if (!patient) {
    return <div className="loading-container">Could not load patient details or you do not have permission.</div>;
  }

  return (
    <div className="patient-details-container">
      <h1>Patient Details</h1>
      <div className="details-widget">
        <p><strong>Full Name:</strong> {patient.fullName}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Address:</strong> {patient.address}</p>
      </div>
    </div>
  );
}

export default PatientDetailsPage;