package com.healthcare.appointmentsystem.dto;

import com.healthcare.appointmentsystem.entity.AppointmentStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String branch; // Add this line

    private String doctorSpecialization; // Field added
    private LocalDateTime appointmentDateTime;
    private AppointmentStatus status;
}