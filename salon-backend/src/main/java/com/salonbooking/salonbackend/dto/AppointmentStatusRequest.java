package com.salonbooking.salonbackend.dto;

import com.salonbooking.salonbackend.enums.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

public record AppointmentStatusRequest(@NotNull AppointmentStatus status) {}
