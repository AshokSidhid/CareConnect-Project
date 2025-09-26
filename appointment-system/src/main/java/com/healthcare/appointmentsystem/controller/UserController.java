package com.healthcare.appointmentsystem.controller;

import com.healthcare.appointmentsystem.dto.LoginRequest; // Import this
import com.healthcare.appointmentsystem.dto.LoginResponse; // Import this
import com.healthcare.appointmentsystem.entity.User;
import com.healthcare.appointmentsystem.security.JwtService; // Import this
import com.healthcare.appointmentsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal; // Import this
import com.healthcare.appointmentsystem.dto.UserDTO; // Import this
import com.healthcare.appointmentsystem.dto.RegistrationRequestDTO; // Import this
import com.healthcare.appointmentsystem.dto.UpdateProfileRequestDTO; // Import this

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService; // Inject the JwtService

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegistrationRequestDTO registrationRequestDTO) {
        User registeredUser = userService.registerUser(registrationRequestDTO);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }
    @PostMapping("/register/doctor")
    public ResponseEntity<User> registerDoctor(@RequestBody RegistrationRequestDTO registrationRequestDTO) {
        User registeredDoctor = userService.registerDoctor(registrationRequestDTO);
        return new ResponseEntity<>(registeredDoctor, HttpStatus.CREATED);
    }

    // Add this POST endpoint for user login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        User authenticatedUser = userService.loginUser(loginRequest);
        String token = jwtService.generateToken(authenticatedUser.getEmail());
        LoginResponse loginResponse = new LoginResponse("Login Successful", token);
        return ResponseEntity.ok(loginResponse);
    }
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile(Principal principal) {
        User user = userService.findByEmail(principal.getName());
        
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFullName(user.getFullName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        // Add the new fields
        userDTO.setDateOfBirth(user.getDateOfBirth());
        userDTO.setGender(user.getGender());
        userDTO.setAddress(user.getAddress());
        
        return ResponseEntity.ok(userDTO);
    }
    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateUserProfile(Principal principal, @RequestBody UpdateProfileRequestDTO updateProfileRequestDTO) {
        User updatedUser = userService.updateUserProfile(principal.getName(), updateProfileRequestDTO);
        
        UserDTO userDTO = new UserDTO();
        userDTO.setId(updatedUser.getId());
        userDTO.setFullName(updatedUser.getFullName());
        userDTO.setEmail(updatedUser.getEmail());
        userDTO.setRole(updatedUser.getRole());
        // Add the new fields
        userDTO.setDateOfBirth(updatedUser.getDateOfBirth());
        userDTO.setGender(updatedUser.getGender());
        userDTO.setAddress(updatedUser.getAddress());
        
        return ResponseEntity.ok(userDTO);
    }
}