package com.salonbooking.salonbackend.repository;

import com.salonbooking.salonbackend.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<Staff, Integer> {
}
