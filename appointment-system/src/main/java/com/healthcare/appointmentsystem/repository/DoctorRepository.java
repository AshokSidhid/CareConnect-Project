package com.healthcare.appointmentsystem.repository;

import com.healthcare.appointmentsystem.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.healthcare.appointmentsystem.entity.User; // Import this
import java.util.Optional; // Import this
@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    // We can add custom query methods here later if needed
    Optional<Doctor> findByUser(User user); // Add this method

}