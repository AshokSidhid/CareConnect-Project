// src/components/layout/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <nav>
          <ul>
            <li>
              <NavLink to="/admin-dashboard" end>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/admin-dashboard/doctors">Manage Doctors</NavLink>
            </li>
            {/* We will add more links here later */}
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;