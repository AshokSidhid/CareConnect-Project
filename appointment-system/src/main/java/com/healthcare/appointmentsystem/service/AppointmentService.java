package com.healthcare.appointmentsystem.service;

import com.healthcare.appointmentsystem.dto.AppointmentRequestDTO;
import com.healthcare.appointmentsystem.dto.RescheduleRequestDTO; // Import this

import com.healthcare.appointmentsystem.entity.Appointment;
import com.healthcare.appointmentsystem.dto.AppointmentDTO; // Add this import

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {
    Appointment bookAppointment(AppointmentRequestDTO appointmentRequestDTO);
    List<LocalDateTime> getAvailableTimeSlots(Long doctorId, LocalDate date); // Add this
    List<AppointmentDTO> getAppointmentsForPatient(Long patientId); // Add this
    List<AppointmentDTO> getAppointmentsForDoctor(Long doctorId); // Add this
    AppointmentDTO cancelAppointment(Long appointmentId, String patientEmail); // Add this
    AppointmentDTO rescheduleAppointment(Long appointmentId, RescheduleRequestDTO rescheduleRequestDTO, String patientEmail); // Add this


}