import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!isAuthenticated) return "/";
    switch (user?.role) {
      case 'ADMIN': return '/admin-dashboard';
      case 'DOCTOR': return '/doctor-dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-brand">
        <Link to={getDashboardPath()}>CareConnect</Link>
      </div>
      <div className="navbar-right-section">
        <ul className="navbar-links">
          {user?.role !== 'DOCTOR' && (
            <li><Link to="/doctors">Find a Doctor</Link></li>
          )}
          {isAuthenticated ? (
            <>
              <li><Link to="/profile">My Profile</Link></li>
              <li>
                <button onClick={handleLogout} className="navbar-logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register" className="navbar-register-btn">Register</Link></li>
            </>
          )}
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;