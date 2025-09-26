package com.healthcare.appointmentsystem.controller;

import com.healthcare.appointmentsystem.dto.UserDTO;
import com.healthcare.appointmentsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getPatientById(@PathVariable Long id, Principal principal) {
        String doctorEmail = principal.getName();
        UserDTO patientDetails = userService.getPatientDetails(doctorEmail, id);
        return ResponseEntity.ok(patientDetails);
    }
}