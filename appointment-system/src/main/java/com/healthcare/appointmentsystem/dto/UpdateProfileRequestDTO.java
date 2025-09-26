package com.healthcare.appointmentsystem.dto;

import lombok.Data;
import com.healthcare.appointmentsystem.entity.Gender;
import java.time.LocalDate;

@Data
public class UpdateProfileRequestDTO {
    private String fullName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String address;
}