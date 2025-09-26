package com.healthcare.appointmentsystem.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentRequestDTO {
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentDateTime;
    private String specialization; // Add this
    private String branch;         // Add this
}