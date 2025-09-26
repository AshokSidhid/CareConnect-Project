package com.healthcare.appointmentsystem.controller;

import com.healthcare.appointmentsystem.dto.AppointmentRequestDTO;
import com.healthcare.appointmentsystem.dto.AppointmentDTO;
import com.healthcare.appointmentsystem.dto.RescheduleRequestDTO;
import com.healthcare.appointmentsystem.entity.Appointment;
import com.healthcare.appointmentsystem.entity.Doctor;
import com.healthcare.appointmentsystem.entity.User;
import com.healthcare.appointmentsystem.repository.DoctorRepository;
import com.healthcare.appointmentsystem.service.AppointmentService;
import com.healthcare.appointmentsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserService userService;

    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping("/book")
    public ResponseEntity<AppointmentDTO> bookAppointment(@RequestBody AppointmentRequestDTO appointmentRequestDTO) {
        Appointment newAppointment = appointmentService.bookAppointment(appointmentRequestDTO);
        return new ResponseEntity<>(mapToAppointmentDTO(newAppointment), HttpStatus.CREATED);
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<List<AppointmentDTO>> getMyAppointments(Principal principal) {
        User patient = userService.findByEmail(principal.getName());
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsForPatient(patient.getId());
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/my-appointments")
    public ResponseEntity<List<AppointmentDTO>> getDoctorAppointments(Principal principal) {
        User doctorUser = userService.findByEmail(principal.getName());
        Doctor doctor = doctorRepository.findByUser(doctorUser)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found for the user"));
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsForDoctor(doctor.getId());
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<AppointmentDTO> cancelAppointment(@PathVariable Long id, Principal principal) {
        String patientEmail = principal.getName();
        AppointmentDTO cancelledAppointment = appointmentService.cancelAppointment(id, patientEmail);
        return ResponseEntity.ok(cancelledAppointment);
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<AppointmentDTO> rescheduleAppointment(
            @PathVariable Long id,
            @RequestBody RescheduleRequestDTO rescheduleRequestDTO,
            Principal principal) {

        String patientEmail = principal.getName();
        AppointmentDTO rescheduledAppointment = appointmentService.rescheduleAppointment(id, rescheduleRequestDTO, patientEmail);
        return ResponseEntity.ok(rescheduledAppointment);
    }
    
    // Helper to map entity to DTO
    private AppointmentDTO mapToAppointmentDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appointment.getId());
        dto.setAppointmentDateTime(appointment.getAppointmentDateTime());
        dto.setStatus(appointment.getStatus());
        dto.setPatientId(appointment.getPatient().getId());
        dto.setPatientName(appointment.getPatient().getFullName());
        dto.setDoctorId(appointment.getDoctor().getId());
        dto.setDoctorName(appointment.getDoctor().getUser().getFullName());
        dto.setDoctorSpecialization(appointment.getDoctor().getSpecialization());
        dto.setBranch(appointment.getDoctor().getBranch());
        return dto;
    }
}