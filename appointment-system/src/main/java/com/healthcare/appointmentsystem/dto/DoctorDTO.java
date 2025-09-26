package com.healthcare.appointmentsystem.dto;

import lombok.Data;

@Data
public class DoctorDTO {
    private Long id;
    private String fullName;
    private String specialization;
    private String branch; // Add this
    private Integer yearsOfExperience;
    private String biography;
}