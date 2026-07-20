package com.salonbooking.salonbackend.repository;

import com.salonbooking.salonbackend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}

