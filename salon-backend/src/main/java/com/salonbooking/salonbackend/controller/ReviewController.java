package com.salonbooking.salonbackend.controller;

import com.salonbooking.salonbackend.entity.Review;
import com.salonbooking.salonbackend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.createReview(review));
    }

    @GetMapping("/staff/{id}")
    public ResponseEntity<List<Review>> getReviewsByStaffId(@PathVariable Integer id) {
        return ResponseEntity.ok(reviewService.getReviewsByStaffId(id));
    }
}
