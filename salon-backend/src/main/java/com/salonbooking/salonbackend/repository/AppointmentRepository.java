package com.salonbooking.salonbackend.repository;

import com.salonbooking.salonbackend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
   List<Appointment> findByCustomerId(Integer customerId);

   @Query("SELECT a FROM Appointment a WHERE a.slot.staff.id = :staffId")
    List<Appointment> findByStaffId(Integer staffId);
}
