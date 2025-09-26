package com.healthcare.appointmentsystem.dto;

import lombok.Data;
import com.healthcare.appointmentsystem.entity.Gender;
import java.time.LocalDate;

@Data
public class RegistrationRequestDTO {
    private String fullName;
    private String email;
    private String password;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String address;
    // We keep specialization and branch for the doctor registration flow
    private String specialization;
    private String branch;
}