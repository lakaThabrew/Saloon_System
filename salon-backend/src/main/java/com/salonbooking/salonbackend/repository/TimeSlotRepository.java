package com.salonbooking.salonbackend.repository;

import com.salonbooking.salonbackend.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {
    List<TimeSlot> findByStaffIdAndSlotDate(Integer staffId, LocalDate slotDate);
}
