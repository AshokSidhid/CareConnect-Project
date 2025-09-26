package com.healthcare.appointmentsystem.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RescheduleRequestDTO {
    private LocalDateTime newAppointmentDateTime;
}