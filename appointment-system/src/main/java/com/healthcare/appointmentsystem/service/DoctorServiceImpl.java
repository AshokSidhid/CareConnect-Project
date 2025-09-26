package com.healthcare.appointmentsystem.service;

import com.healthcare.appointmentsystem.dto.DoctorDTO;
import com.healthcare.appointmentsystem.dto.DoctorScheduleDTO;
import com.healthcare.appointmentsystem.entity.Doctor;
import com.healthcare.appointmentsystem.entity.User;
import com.healthcare.appointmentsystem.repository.AppointmentRepository;
import com.healthcare.appointmentsystem.repository.DoctorRepository;
import com.healthcare.appointmentsystem.repository.DoctorScheduleRepository;
import com.healthcare.appointmentsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;

    // Add this injection
    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Override
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(this::mapToDoctorDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDTO getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .map(this::mapToDoctorDTO)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
    }

    @Override
    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
        User user = doctor.getUser();
        appointmentRepository.deleteAll(appointmentRepository.findByPatient(user));
        appointmentRepository.deleteAll(appointmentRepository.findByDoctor(doctor));
        doctorRepository.delete(doctor);
        userRepository.delete(user);
    }

    @Override
    public List<DoctorScheduleDTO> getDoctorSchedule(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));

        return doctorScheduleRepository.findAllByDoctor(doctor)
                .stream()
                .map(schedule -> {
                    DoctorScheduleDTO dto = new DoctorScheduleDTO();
                    dto.setDayOfWeek(schedule.getDayOfWeek());
                    dto.setStartTime(schedule.getStartTime());
                    dto.setEndTime(schedule.getEndTime());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private DoctorDTO mapToDoctorDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setFullName(doctor.getUser().getFullName());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setBranch(doctor.getBranch());
        dto.setYearsOfExperience(doctor.getYearsOfExperience()); // Ensure this line is present
        dto.setBiography(doctor.getBiography()); // Ensure this line is present
        return dto;
    }
}