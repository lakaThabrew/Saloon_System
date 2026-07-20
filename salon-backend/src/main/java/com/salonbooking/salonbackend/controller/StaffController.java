package com.salonbooking.salonbackend.controller;

import com.salonbooking.salonbackend.entity.Staff;
import com.salonbooking.salonbackend.entity.TimeSlot;
import com.salonbooking.salonbackend.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Integer id) {
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<List<TimeSlot>> getStaffSlots(
            @PathVariable Integer id,
            @RequestParam("date") String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        return ResponseEntity.ok(staffService.getStaffSlots(id, date));
    }
}
