package com.salonbooking.salonbackend.dto;

import com.salonbooking.salonbackend.enums.Role;
import jakarta.validation.constraints.NotNull;

public record UserRoleRequest(@NotNull Role role) {}
