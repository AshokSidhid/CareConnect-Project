package com.healthcare.appointmentsystem.service;

import com.healthcare.appointmentsystem.dto.DoctorDTO;
import java.util.List;
import com.healthcare.appointmentsystem.dto.DoctorScheduleDTO; // Import

public interface DoctorService {
    List<DoctorDTO> getAllDoctors();
    DoctorDTO getDoctorById(Long id);
    void deleteDoctor(Long id); // Add this
    List<DoctorScheduleDTO> getDoctorSchedule(Long doctorId); // Add this

}