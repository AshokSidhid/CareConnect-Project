package com.healthcare.appointmentsystem.service;

import com.healthcare.appointmentsystem.dto.LoginRequest;
import com.healthcare.appointmentsystem.dto.UpdateProfileRequestDTO; // Import this

import com.healthcare.appointmentsystem.dto.RegistrationRequestDTO;
import com.healthcare.appointmentsystem.entity.User;
import com.healthcare.appointmentsystem.dto.UserDTO;

public interface UserService {
    // Ensure this method uses the DTO
    User registerUser(RegistrationRequestDTO registrationRequestDTO);

    User loginUser(LoginRequest loginRequest);

    User findByEmail(String email);
    User registerDoctor(RegistrationRequestDTO registrationRequestDTO);
    User updateUserProfile(String email, UpdateProfileRequestDTO updateProfileRequestDTO); // Add this
    UserDTO getPatientDetails(String doctorEmail, Long patientId); // Add this

}