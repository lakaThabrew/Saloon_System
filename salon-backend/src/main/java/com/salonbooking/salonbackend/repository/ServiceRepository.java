package com.salonbooking.salonbackend.repository;

import com.salonbooking.salonbackend.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Service, Integer> {
}

