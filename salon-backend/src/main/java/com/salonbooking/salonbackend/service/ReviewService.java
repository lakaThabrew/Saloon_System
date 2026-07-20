package com.salonbooking.salonbackend.service;

import com.salonbooking.salonbackend.entity.Review;
import com.salonbooking.salonbackend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByStaffId(Integer staffId) {
        return reviewRepository.findByStaffId(staffId);
    }
}

