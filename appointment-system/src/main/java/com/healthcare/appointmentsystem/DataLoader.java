package com.healthcare.appointmentsystem;

import com.healthcare.appointmentsystem.entity.Doctor;
import com.healthcare.appointmentsystem.entity.DoctorSchedule;
import com.healthcare.appointmentsystem.entity.User;
import com.healthcare.appointmentsystem.repository.DoctorScheduleRepository;
import com.healthcare.appointmentsystem.repository.DoctorRepository;
import com.healthcare.appointmentsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Override
    public void run(String... args) throws Exception {
        // ... (patient and admin creation code is the same) ...

        // Create Demo Doctors
        if (!userRepository.findByEmail("patient@example.com").isPresent()) {
            User patient = new User();
            patient.setEmail("patient@example.com");
            patient.setFullName("John Patient");
            patient.setPassword(passwordEncoder.encode("password123"));
            patient.setRole("PATIENT");
            userRepository.save(patient);
        }

        // Create Admin
        if (!userRepository.findByEmail("admin@example.com").isPresent()) {
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setFullName("Admin User");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }

        // Create Demo Doctors
        createDoctor("Jane Doctor", "doctor@example.com", "Cardiology", List.of(
            new DoctorSchedule(null, null, DayOfWeek.FRIDAY, LocalTime.of(9, 0), LocalTime.of(17, 0))
        ));
        createDoctor("Sarah Chen", "sarah.chen@example.com", "Dermatology", List.of(
            new DoctorSchedule(null, null, DayOfWeek.MONDAY, LocalTime.of(10, 0), LocalTime.of(16, 0))
        ));
        createDoctor("Michael Lee", "michael.lee@example.com", "Pediatrics", List.of(
            new DoctorSchedule(null, null, DayOfWeek.WEDNESDAY, LocalTime.of(9, 0), LocalTime.of(13, 0))
        ));
        createDoctor("Emily White", "emily.white@example.com", "Neurology", List.of(
            new DoctorSchedule(null, null, DayOfWeek.TUESDAY, LocalTime.of(8, 0), LocalTime.of(12, 0))
        ));
        createDoctor("David Green", "david.green@example.com", "Orthopedics", List.of(
            new DoctorSchedule(null, null, DayOfWeek.THURSDAY, LocalTime.of(13, 0), LocalTime.of(17, 0))
        ));
        createDoctor("Olivia Black", "olivia.black@example.com", "General Medicine", List.of(
            new DoctorSchedule(null, null, DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(12, 0)),
            new DoctorSchedule(null, null, DayOfWeek.WEDNESDAY, LocalTime.of(14, 0), LocalTime.of(17, 0))
        ));
        createDoctor("Chris Brown", "chris.brown@example.com", "Cardiology", List.of(
            new DoctorSchedule(null, null, DayOfWeek.FRIDAY, LocalTime.of(13, 0), LocalTime.of(16, 0))
        ));
        createDoctor("Jessica Blue", "jessica.blue@example.com", "Dermatology", List.of(
            new DoctorSchedule(null, null, DayOfWeek.TUESDAY, LocalTime.of(14, 0), LocalTime.of(18, 0))
        ));
        createDoctor("Daniel Gray", "daniel.gray@example.com", "Pediatrics", List.of(
            new DoctorSchedule(null, null, DayOfWeek.MONDAY, LocalTime.of(13, 0), LocalTime.of(17, 0))
        ));
        createDoctor("Chloe Gold", "chloe.gold@example.com", "Neurology", List.of(
            new DoctorSchedule(null, null, DayOfWeek.WEDNESDAY, LocalTime.of(8, 0), LocalTime.of(12, 0))
        ));
        createDoctor("Ethan Silver", "ethan.silver@example.com", "Orthopedics", List.of(
            new DoctorSchedule(null, null, DayOfWeek.THURSDAY, LocalTime.of(9, 0), LocalTime.of(12, 0))
        ));
        // ... (all other createDoctor calls are the same) ...
    }

    private void createDoctor(String fullName, String email, String specialization, List<DoctorSchedule> schedules) {
        if (!userRepository.findByEmail(email).isPresent()) {
            System.out.println("--- Loading data for Dr. " + fullName + "... ---");
            User doctorUser = new User();
            doctorUser.setEmail(email);
            doctorUser.setFullName(fullName);
            doctorUser.setPassword(passwordEncoder.encode("password123"));
            doctorUser.setRole("DOCTOR");
            userRepository.save(doctorUser);

            Doctor doctor = new Doctor();
            doctor.setSpecialization(specialization);
            doctor.setUser(doctorUser);
            // Set all properties BEFORE saving
            doctor.setYearsOfExperience((int)(Math.random() * 20) + 5);
            doctor.setBiography("Dr. " + fullName + " is a dedicated professional in the field of " + specialization + ".");
            
            // Save the complete doctor object only ONCE
            doctorRepository.save(doctor);

            for (DoctorSchedule schedule : schedules) {
                schedule.setDoctor(doctor);
                doctorScheduleRepository.save(schedule);
            }
        }
    }
}