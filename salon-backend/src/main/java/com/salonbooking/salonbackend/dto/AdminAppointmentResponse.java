package com.salonbooking.salonbackend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record AdminAppointmentResponse(
        Integer id,
        String customerName,
        String customerEmail,
        String customerPhone,
        String staffName,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        List<String> services,
        String notes,
        String status
) {}
