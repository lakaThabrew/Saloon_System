package com.salonbooking.salonbackend.repository;

import com.salonbooking.salonbackend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByStaffId(Integer staffId);
}

