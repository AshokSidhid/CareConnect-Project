import axios from 'axios';
import { mockDoctors, mockUsers, mockSchedule, mockPatientAppointments, mockDoctorAppointments } from './mockData';

// LOGIC CHANGE: Only mock if we are actually on the live GitHub demo site
const isGitHubPages = window.location.hostname.includes('github.io');

// If on GitHub Pages, use mocks. If on Localhost (Docker), use real backend.
const useMocks = isGitHubPages;

// If using mocks, URL doesn't matter. If real, point to backend.
const baseURL = useMocks ? '' : 'http://localhost:8085/api';

// Define the Mock Adapter function
const mockAdapter = async (config) => {
  const { url, method, data, headers } = config;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`[MOCK ADAPTER] ${method.toUpperCase()} ${url}`);

  // --- 1. LOGIN SIMULATION ---
  if (url.includes('/users/login') && method === 'post') {
    const requestBody = JSON.parse(data);
    const user = mockUsers.find(u => u.email === requestBody.email);

    if (user) {
      // Fake a token that contains the email so we can look it up in /profile
      const fakeToken = btoa(JSON.stringify({ email: user.email }));
      return { status: 200, data: { token: fakeToken, message: 'Login Successful' } };
    } else {
      return Promise.reject({ response: { status: 401, data: { message: 'Invalid credentials' } } });
    }
  }

  // --- 2. GET USER PROFILE ---
  if (url.includes('/users/profile') && method === 'get') {
    // Decode our fake token to find who is logged in
    const authHeader = headers['Authorization'];
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = JSON.parse(atob(token));
            const user = mockUsers.find(u => u.email === decoded.email);
            if (user) return { status: 200, data: user.data };
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
        return doctor ? { status: 200, data: doctor } : Promise.reject({ response: { status: 404 } });
    }
    // Get All Doctors
    return { status: 200, data: mockDoctors };
  }

  // --- 4. SCHEDULE & AVAILABILITY ---
  if (url.includes('/schedule')) return { status: 200, data: mockSchedule };
  if (url.includes('/availability')) {
    // Return dummy slots
    return { status: 200, data: ["2025-10-10T09:00:00", "2025-10-10T10:00:00", "2025-10-10T14:00:00"] };
  }

  // --- 5. DASHBOARD DATA ---
  if (url.includes('/appointments/my-appointments')) return { status: 200, data: mockPatientAppointments };
  if (url.includes('/appointments/doctor/my-appointments')) return { status: 200, data: mockDoctorAppointments };

  // --- 6. GENERIC SUCCESS FOR POST/PUT/DELETE ---
  if (['post', 'put', 'delete'].includes(method)) {
    return { status: 200, data: { message: 'Action successful (Mock)' } };
  }

  return Promise.reject({ response: { status: 404, data: { message: `Mock not found for ${method.toUpperCase()} ${url}` } } });
};

// Create the Axios Instance
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // KEY CHANGE: Only attach the adapter if we are on GitHub Pages
  adapter: useMocks ? mockAdapter : undefined
});

// This interceptor adds the token to every request, regardless of mocking
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

export default apiClient;