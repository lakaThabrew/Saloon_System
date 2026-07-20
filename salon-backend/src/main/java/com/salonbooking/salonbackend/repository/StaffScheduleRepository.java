package com.salonbooking.salonbackend.repository;

import com.salonbooking.salonbackend.entity.StaffSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StaffScheduleRepository extends JpaRepository<StaffSchedule, Integer> {
    List<StaffSchedule> findByStaffId(Integer staffId);
}
