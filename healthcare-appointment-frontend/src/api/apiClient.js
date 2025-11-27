import axios from 'axios';
import { mockDoctors, mockUsers, mockSchedule, mockPatientAppointments, mockDoctorAppointments } from './mockData';

const isProduction = import.meta.env.MODE === 'production';

// In production (GitHub Pages), use a dummy base URL so requests don't actually go out
const baseURL = isProduction ? '/' : 'http://localhost:8085/api';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // INTERCEPT REQUESTS ONLY IN PRODUCTION MODE
    if (isProduction) {
      const { url, method, data } = error.config;
      console.log(`[MOCK API] ${method.toUpperCase()} ${url}`);

      // --- 1. LOGIN SIMULATION ---
      if (url.includes('/users/login') && method === 'post') {
        const requestBody = JSON.parse(data);
        const user = mockUsers.find(u => u.email === requestBody.email);

        if (user) {
          // Fake a token that contains the email so we can look it up in /profile
          const fakeToken = btoa(JSON.stringify({ email: user.email })); 
          return { data: { token: fakeToken, message: 'Login Successful' } };
        } else {
          return Promise.reject({ response: { status: 401, data: { message: 'Invalid credentials' } } });
        }
      }

      // --- 2. GET USER PROFILE ---
      if (url.includes('/users/profile') && method === 'get') {
        // Decode our fake token to find who is logged in
        const authHeader = error.config.headers['Authorization'];
        if (authHeader) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = JSON.parse(atob(token));
                const user = mockUsers.find(u => u.email === decoded.email);
                if (user) return { data: user.data };
            } catch (e) { console.error("Mock token parse error"); }
        }
        return Promise.reject({ response: { status: 403 } });
      }

      // --- 3. DOCTOR ENDPOINTS ---
      if (url.includes('/doctors') && !url.includes('/schedule') && !url.includes('/availability')) {
        // Get Single Doctor
        const idMatch = url.match(/\/doctors\/(\d+)$/);
        if (idMatch) {
            const docId = parseInt(idMatch[1]);
            const doctor = mockDoctors.find(d => d.id === docId);
            return doctor ? { data: doctor } : Promise.reject({ response: { status: 404 } });
        }
        // Get All Doctors
        return { data: mockDoctors };
      }

      // --- 4. SCHEDULE & AVAILABILITY ---
      if (url.includes('/schedule')) return { data: mockSchedule };
      if (url.includes('/availability')) {
        // Return dummy slots
        return { data: ["2025-10-10T09:00:00", "2025-10-10T10:00:00", "2025-10-10T14:00:00"] }; 
      }

      // --- 5. DASHBOARD DATA ---
      if (url.includes('/appointments/my-appointments')) return { data: mockPatientAppointments };
      if (url.includes('/appointments/doctor/my-appointments')) return { data: mockDoctorAppointments };
      
      // --- 6. GENERIC SUCCESS FOR POST/PUT ---
      if (method === 'post' || method === 'put' || method === 'delete') {
        return { data: { message: 'Action successful (Mock)' } };
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;