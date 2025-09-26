package com.healthcare.appointmentsystem.service;

import com.healthcare.appointmentsystem.dto.AppointmentRequestDTO;
import com.healthcare.appointmentsystem.dto.AppointmentDTO;
import com.healthcare.appointmentsystem.entity.Appointment;
import com.healthcare.appointmentsystem.entity.AppointmentStatus;
import com.healthcare.appointmentsystem.dto.RescheduleRequestDTO; // Import this

import com.healthcare.appointmentsystem.entity.Doctor;
import com.healthcare.appointmentsystem.entity.DoctorSchedule;
import com.healthcare.appointmentsystem.entity.User;
import com.healthcare.appointmentsystem.repository.AppointmentRepository;
import com.healthcare.appointmentsystem.repository.DoctorScheduleRepository;
import com.healthcare.appointmentsystem.repository.DoctorRepository;
import com.healthcare.appointmentsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository; // Inject the new repository

    @Override
    public Appointment bookAppointment(AppointmentRequestDTO appointmentRequestDTO) {
        // ... (this method remains unchanged)
        if (appointmentRequestDTO.getAppointmentDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot book an appointment in the past.");
        }
        User patient = userRepository.findById(appointmentRequestDTO.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        Doctor doctor = doctorRepository.findById(appointmentRequestDTO.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment newAppointment = new Appointment();
        newAppointment.setPatient(patient);
        newAppointment.setDoctor(doctor);
        newAppointment.setAppointmentDateTime(appointmentRequestDTO.getAppointmentDateTime());
        newAppointment.setStatus(AppointmentStatus.SCHEDULED);

        return appointmentRepository.save(newAppointment);
    }

    @Override
    public List<LocalDateTime> getAvailableTimeSlots(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        
        Optional<DoctorSchedule> scheduleOpt = doctorScheduleRepository.findByDoctorAndDayOfWeek(doctor, dayOfWeek);

        if (scheduleOpt.isEmpty()) {
            return new ArrayList<>();
        }

        DoctorSchedule schedule = scheduleOpt.get();
        LocalTime startTime = schedule.getStartTime();
        LocalTime endTime = schedule.getEndTime();
        int slotDurationMinutes = 30;

        List<LocalDateTime> bookedSlots = appointmentRepository.findBookedAppointmentTimesByDoctorIdAndDate(doctorId, date);
        List<LocalDateTime> allPossibleSlots = new ArrayList<>();
        LocalDateTime currentSlotTime = date.atTime(startTime);

        while (currentSlotTime.isBefore(date.atTime(endTime))) {
            allPossibleSlots.add(currentSlotTime);
            currentSlotTime = currentSlotTime.plusMinutes(slotDurationMinutes);
        }

        allPossibleSlots.removeAll(bookedSlots);
        return allPossibleSlots;
    }
    
    @Override
    public List<AppointmentDTO> getAppointmentsForPatient(Long patientId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return appointmentRepository.findByPatient(patient)
                .stream()
                .map(appointment -> {
                    AppointmentDTO dto = new AppointmentDTO();
                    dto.setId(appointment.getId());
                    dto.setAppointmentDateTime(appointment.getAppointmentDateTime());
                    dto.setStatus(appointment.getStatus());
                    dto.setPatientId(appointment.getPatient().getId());
                    dto.setPatientName(appointment.getPatient().getFullName());
                    dto.setDoctorId(appointment.getDoctor().getId());
                    dto.setDoctorName(appointment.getDoctor().getUser().getFullName());
                    dto.setDoctorSpecialization(appointment.getDoctor().getSpecialization()); // Line added
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAppointmentsForDoctor(Long doctorId) {
        System.out.println("--- Fetching appointments for doctor ID: " + doctorId + " ---");

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Appointment> appointments = appointmentRepository.findByDoctor(doctor);

        System.out.println("--- Found " + appointments.size() + " appointments in the repository for this doctor. ---");

        return appointments
                .stream()
                .map(appointment -> {
                    AppointmentDTO dto = new AppointmentDTO();
                    dto.setId(appointment.getId());
                    dto.setAppointmentDateTime(appointment.getAppointmentDateTime());
                    dto.setStatus(appointment.getStatus());
                    dto.setPatientId(appointment.getPatient().getId());
                    dto.setPatientName(appointment.getPatient().getFullName());
                    dto.setDoctorId(appointment.getDoctor().getId());
                    dto.setDoctorName(appointment.getDoctor().getUser().getFullName());
                    dto.setDoctorSpecialization(appointment.getDoctor().getSpecialization());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentDTO cancelAppointment(Long appointmentId, String patientEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getPatient().getEmail().equals(patientEmail)) {
            throw new SecurityException("User is not authorized to cancel this appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(updatedAppointment.getId());
        dto.setAppointmentDateTime(updatedAppointment.getAppointmentDateTime());
        dto.setStatus(updatedAppointment.getStatus());
        dto.setPatientId(updatedAppointment.getPatient().getId());
        dto.setPatientName(updatedAppointment.getPatient().getFullName());
        dto.setDoctorId(updatedAppointment.getDoctor().getId());
        dto.setDoctorName(updatedAppointment.getDoctor().getUser().getFullName());
        dto.setDoctorSpecialization(updatedAppointment.getDoctor().getSpecialization()); // Line added

        return dto;
    }
    @Override
    public AppointmentDTO rescheduleAppointment(Long appointmentId, RescheduleRequestDTO rescheduleRequestDTO, String patientEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // 1. Security Check
        if (!appointment.getPatient().getEmail().equals(patientEmail)) {
            throw new SecurityException("User is not authorized to reschedule this appointment");
        }

        LocalDateTime newDateTime = rescheduleRequestDTO.getNewAppointmentDateTime();

        // 2. Past Date Check
        if (newDateTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot reschedule an appointment to a past date or time.");
        }
        
        // 3. Smarter Availability Check using the new repository method
        Optional<Appointment> conflictingAppointment = appointmentRepository.findByDoctorIdAndAppointmentDateTimeAndIdNot(
                appointment.getDoctor().getId(),
                newDateTime,
                appointmentId
        );
                
        if (conflictingAppointment.isPresent()) {
            throw new RuntimeException("The selected time slot is no longer available.");
        }

        // All checks passed, update the appointment
        appointment.setAppointmentDateTime(newDateTime);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return mapToAppointmentDTO(updatedAppointment);
    }

    // Helper method to reduce code duplication
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