import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './ProfilePage.css';

function ProfilePage() {
  const { user, fetchUserProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'MALE',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || 'MALE',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put('/users/profile', formData);
      alert('Profile updated successfully!');
      
      const token = localStorage.getItem('token');
      if (token) {
        await fetchUserProfile(token);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile.');
    }
  };

  if (!user) {
    return <div className="loading-container">Loading profile...</div>;
  }

  return (
    <div className="profile-page-container">
      <h1>My Profile</h1>
      <div className="profile-widget">
        {!isEditing ? (
          <div className="profile-view">
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-edit">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <div className="profile-actions">
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;