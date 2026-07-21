package com.salonbooking.salonbackend.dto;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Integer id,
        String fullName,
        String email,
        String phone,
        String role,
        LocalDateTime createdAt
) {}
