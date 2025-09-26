import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Page Imports
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DoctorsListPage from '../pages/DoctorsListPage';
import DoctorProfilePage from '../pages/DoctorProfilePage';
import PatientDashboard from '../pages/PatientDashboard';
import DoctorDashboard from '../pages/DoctorDashboard';
import PatientDetailsPage from '../pages/PatientDetailsPage';
import ProfilePage from '../pages/ProfilePage';
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboardOverview from '../pages/AdminDashboardOverview';
import ManageDoctorsPage from '../pages/ManageDoctorsPage';


function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/doctors" element={<DoctorsListPage />} />
      <Route path="/doctors/:id" element={<DoctorProfilePage />} />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
      />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>}
      />
      <Route
        path="/doctor-dashboard"
        element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>}
      />
      <Route
        path="/doctor/patient-details/:id"
        element={<ProtectedRoute><PatientDetailsPage /></ProtectedRoute>}
      />

      {/* Nested Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<AdminDashboardOverview />} />
        <Route path="doctors" element={<ManageDoctorsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;