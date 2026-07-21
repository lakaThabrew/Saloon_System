package com.salonbooking.salonbackend.dto;

import java.time.LocalDateTime;

public record UserProfileResponse(
        Integer id,
        String fullName,
        String email,
        String phone,
        String role,
        String gender,
        String preferences,
        LocalDateTime createdAt
) {}
