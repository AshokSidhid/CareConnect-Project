package com.healthcare.appointmentsystem.dto;

import lombok.Data;
import com.healthcare.appointmentsystem.entity.Gender;
import java.time.LocalDate;

@Data
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String address;
}