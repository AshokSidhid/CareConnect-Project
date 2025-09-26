package com.healthcare.appointmentsystem.repository;

import com.healthcare.appointmentsystem.entity.Appointment;
import java.util.Optional; // Import this

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.healthcare.appointmentsystem.entity.User; // Import this
import com.healthcare.appointmentsystem.entity.Doctor; // Import this

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // This query finds all appointment times for a doctor on a given date
    @Query("SELECT a.appointmentDateTime FROM Appointment a WHERE a.doctor.id = :doctorId AND FUNCTION('DATE', a.appointmentDateTime) = :date")
    List<LocalDateTime> findBookedAppointmentTimesByDoctorIdAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
    List<Appointment> findByPatient(User patient);
    List<Appointment> findByDoctor(Doctor doctor); // Add this method
    Optional<Appointment> findByDoctorIdAndAppointmentDateTimeAndIdNot(Long doctorId, LocalDateTime dateTime, Long appointmentId);
    boolean existsByDoctorUserEmailAndPatientId(String doctorEmail, Long patientId); // Add this


}