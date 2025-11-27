// src/api/mockData.js

// 1. The list of doctors displayed on the "Find a Doctor" page
export const mockDoctors = [
  { id: 1, fullName: 'Dr. Jane Doctor', specialization: 'Cardiology', yearsOfExperience: 12, biography: 'Expert in cardiovascular health and preventative care.' },
  { id: 2, fullName: 'Dr. Sarah Chen', specialization: 'Dermatology', yearsOfExperience: 8, biography: 'Specializes in cosmetic and medical dermatology.' },
  { id: 3, fullName: 'Dr. Michael Lee', specialization: 'Pediatrics', yearsOfExperience: 15, biography: 'Dedicated to the health and well-being of children and adolescents.' },
  { id: 4, fullName: 'Dr. Emily White', specialization: 'Neurology', yearsOfExperience: 10, biography: 'Expertise in treating disorders of the nervous system.' },
  { id: 5, fullName: 'Dr. David Green', specialization: 'Orthopedics', yearsOfExperience: 20, biography: 'Specialist in bone, joint, and muscle surgery.' },
  { id: 6, fullName: 'Dr. Olivia Black', specialization: 'General Medicine', yearsOfExperience: 5, biography: 'Providing comprehensive primary care for adults.' },
  { id: 7, fullName: 'Dr. Chris Brown', specialization: 'Cardiology', yearsOfExperience: 18, biography: 'Renowned for treating complex heart conditions.' },
  { id: 8, fullName: 'Dr. Jessica Blue', specialization: 'Dermatology', yearsOfExperience: 6, biography: 'Focuses on skin cancer screening and treatment.' },
  { id: 9, fullName: 'Dr. Daniel Gray', specialization: 'Pediatrics', yearsOfExperience: 9, biography: 'Passionate about early childhood development.' },
  { id: 10, fullName: 'Dr. Chloe Gold', specialization: 'Neurology', yearsOfExperience: 14, biography: 'Specializes in migraine and stroke management.' },
  { id: 11, fullName: 'Dr. Ethan Silver', specialization: 'Orthopedics', yearsOfExperience: 11, biography: 'Expert in sports medicine and rehabilitation.' },
];

// 2. The list of valid users for Login simulation
// Password for all is "password123" (logic handled in apiClient)
export const mockUsers = [
  // Patient
  {
    email: 'patient@example.com',
    data: { id: 100, fullName: 'John Patient', email: 'patient@example.com', role: 'PATIENT' }
  },
  // Admin
  {
    email: 'admin@example.com',
    data: { id: 900, fullName: 'Admin User', email: 'admin@example.com', role: 'ADMIN' }
  },
  // Doctors (mapped to the doctors list above)
  {
    email: 'doctor@example.com',
    data: { id: 1, fullName: 'Dr. Jane Doctor', email: 'doctor@example.com', role: 'DOCTOR' }
  },
  {
    email: 'sarah.chen@example.com',
    data: { id: 2, fullName: 'Dr. Sarah Chen', email: 'sarah.chen@example.com', role: 'DOCTOR' }
  },
  {
    email: 'michael.lee@example.com',
    data: { id: 3, fullName: 'Dr. Michael Lee', email: 'michael.lee@example.com', role: 'DOCTOR' }
  }
  // ... you can add more doctor logins here if needed
];

// 3. Mock Schedule data (generic schedule for any doctor)
export const mockSchedule = [
  { dayOfWeek: 'MONDAY', startTime: '09:00:00', endTime: '17:00:00' },
  { dayOfWeek: 'WEDNESDAY', startTime: '09:00:00', endTime: '17:00:00' },
  { dayOfWeek: 'FRIDAY', startTime: '09:00:00', endTime: '16:00:00' },
];

// 4. Mock Appointments (for dashboards)
export const mockPatientAppointments = [
  { id: 101, doctorName: 'Jane Doctor', doctorSpecialization: 'Cardiology', appointmentDateTime: '2025-10-15T10:00:00', status: 'SCHEDULED' },
  { id: 102, doctorName: 'Sarah Chen', doctorSpecialization: 'Dermatology', appointmentDateTime: '2025-11-20T14:30:00', status: 'COMPLETED' }
];

export const mockDoctorAppointments = [
  { id: 201, patientName: 'John Patient', appointmentDateTime: '2025-10-15T10:00:00', status: 'SCHEDULED', patientId: 100 },
  { id: 202, patientName: 'Alice Smith', appointmentDateTime: '2025-10-16T11:00:00', status: 'SCHEDULED', patientId: 101 }
];