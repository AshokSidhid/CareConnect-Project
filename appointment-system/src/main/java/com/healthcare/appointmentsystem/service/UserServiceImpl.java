package com.healthcare.appointmentsystem.service;

import com.healthcare.appointmentsystem.dto.LoginRequest;
import com.healthcare.appointmentsystem.dto.RegistrationRequestDTO;
import com.healthcare.appointmentsystem.entity.Doctor;
import com.healthcare.appointmentsystem.entity.User;
import com.healthcare.appointmentsystem.repository.AppointmentRepository;
import com.healthcare.appointmentsystem.repository.DoctorRepository;
import com.healthcare.appointmentsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.healthcare.appointmentsystem.dto.UpdateProfileRequestDTO; // Import this
import com.healthcare.appointmentsystem.dto.UserDTO;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private AppointmentRepository appointmentRepository;
    // 1. Inject the DoctorRepository
    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public User registerUser(RegistrationRequestDTO registrationRequestDTO) {
        if (userRepository.findByEmail(registrationRequestDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        User newUser = new User();
        newUser.setFullName(registrationRequestDTO.getFullName());
        newUser.setEmail(registrationRequestDTO.getEmail());
        newUser.setPassword(passwordEncoder.encode(registrationRequestDTO.getPassword()));
        newUser.setRole("PATIENT");
        // Add the new fields
        newUser.setDateOfBirth(registrationRequestDTO.getDateOfBirth());
        newUser.setGender(registrationRequestDTO.getGender());
        newUser.setAddress(registrationRequestDTO.getAddress());

        return userRepository.save(newUser);
    }

    @Override
    public User loginUser(LoginRequest loginRequest) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );
        return userRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found after authentication"));
    }
    
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
    
    @Override
    public User registerDoctor(RegistrationRequestDTO registrationRequestDTO) {
        if (userRepository.findByEmail(registrationRequestDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        User doctorUser = new User();
        doctorUser.setFullName(registrationRequestDTO.getFullName());
        doctorUser.setEmail(registrationRequestDTO.getEmail());
        doctorUser.setPassword(passwordEncoder.encode(registrationRequestDTO.getPassword()));
        doctorUser.setRole("DOCTOR");
        // Add the new fields
        doctorUser.setDateOfBirth(registrationRequestDTO.getDateOfBirth());
        doctorUser.setGender(registrationRequestDTO.getGender());
        doctorUser.setAddress(registrationRequestDTO.getAddress());
        userRepository.save(doctorUser);

        Doctor doctorProfile = new Doctor();
        doctorProfile.setSpecialization(registrationRequestDTO.getSpecialization());
        doctorProfile.setBranch(registrationRequestDTO.getBranch());
        doctorProfile.setUser(doctorUser);
        doctorRepository.save(doctorProfile);

        return doctorUser;
    }
    @Override
    public User updateUserProfile(String email, UpdateProfileRequestDTO updateProfileRequestDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(updateProfileRequestDTO.getFullName());
        // Add the new fields
        user.setDateOfBirth(updateProfileRequestDTO.getDateOfBirth());
        user.setGender(updateProfileRequestDTO.getGender());
        user.setAddress(updateProfileRequestDTO.getAddress());

        return userRepository.save(user);
    }
 // In UserServiceImpl.java
    @Override
    public UserDTO getPatientDetails(String doctorEmail, Long patientId) {
        boolean appointmentExists = appointmentRepository.existsByDoctorUserEmailAndPatientId(doctorEmail, patientId);
        if (!appointmentExists) {
            throw new SecurityException("Doctor is not authorized to view this patient's details.");
        }

        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        UserDTO userDTO = new UserDTO();
        userDTO.setId(patient.getId());
        userDTO.setFullName(patient.getFullName());
        userDTO.setEmail(patient.getEmail());
        userDTO.setRole(patient.getRole());
        userDTO.setDateOfBirth(patient.getDateOfBirth());
        userDTO.setGender(patient.getGender());
        userDTO.setAddress(patient.getAddress());

        return userDTO;
    }

}