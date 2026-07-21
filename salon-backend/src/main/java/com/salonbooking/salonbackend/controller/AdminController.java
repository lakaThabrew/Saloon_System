package com.salonbooking.salonbackend.controller;

import com.salonbooking.salonbackend.dto.AdminAppointmentResponse;
import com.salonbooking.salonbackend.dto.AdminUserResponse;
import com.salonbooking.salonbackend.dto.AppointmentStatusRequest;
import com.salonbooking.salonbackend.dto.AppointmentRequest;
import com.salonbooking.salonbackend.dto.AdminUserRequest;
import com.salonbooking.salonbackend.dto.AdminUserUpdateRequest;
import com.salonbooking.salonbackend.dto.UserRoleRequest;
import com.salonbooking.salonbackend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/appointments")
    public ResponseEntity<List<AdminAppointmentResponse>> getAppointments() {
        return ResponseEntity.ok(adminService.getAppointments());
    }

    @PostMapping("/appointments")
    public ResponseEntity<AdminAppointmentResponse> createAppointment(@RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(adminService.createAppointment(request));
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<AdminAppointmentResponse> updateAppointmentStatus(
            @PathVariable Integer id, @Valid @RequestBody AppointmentStatusRequest request) {
        return ResponseEntity.ok(adminService.updateAppointmentStatus(id, request.status()));
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Integer id) {
        adminService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<AdminUserResponse> createUser(@Valid @RequestBody AdminUserRequest request) {
        return ResponseEntity.ok(adminService.createUser(request));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<AdminUserResponse> updateUser(
            @PathVariable Integer id, @Valid @RequestBody AdminUserUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateUser(id, request));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<AdminUserResponse> changeRole(
            @PathVariable Integer id, @Valid @RequestBody UserRoleRequest request, Authentication authentication) {
        return ResponseEntity.ok(adminService.changeRole(id, request.role(), authentication.getName()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id, Authentication authentication) {
        adminService.deleteUser(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
