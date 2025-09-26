package com.healthcare.appointmentsystem.controller;

import com.healthcare.appointmentsystem.dto.DoctorDTO;
import org.springframework.web.bind.annotation.DeleteMapping; // Import

import com.healthcare.appointmentsystem.service.AppointmentService; // 1. Import AppointmentService
import com.healthcare.appointmentsystem.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.healthcare.appointmentsystem.dto.DoctorScheduleDTO; // Import

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService; // 2. Inject AppointmentService

    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build(); // Returns a 204 No Content status
    }

    @GetMapping("/{doctorId}/availability")
    public ResponseEntity<List<LocalDateTime>> getDoctorAvailability(
            @PathVariable Long doctorId,
            @RequestParam("date") LocalDate date) {
        // 3. Call the method on the correct service
        return ResponseEntity.ok(appointmentService.getAvailableTimeSlots(doctorId, date));
    }
    @GetMapping("/{doctorId}/schedule")
    public ResponseEntity<List<DoctorScheduleDTO>> getDoctorSchedule(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getDoctorSchedule(doctorId));
    }
}