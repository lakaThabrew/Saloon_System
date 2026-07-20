package com.salonbooking.salonbackend.service;

import com.salonbooking.salonbackend.entity.Staff;
import com.salonbooking.salonbackend.entity.TimeSlot;
import com.salonbooking.salonbackend.exception.ResourceNotFoundException;
import com.salonbooking.salonbackend.repository.StaffRepository;
import com.salonbooking.salonbackend.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final TimeSlotRepository timeSlotRepository;

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Staff getStaffById(Integer id) {
        return staffRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff not found"));
    }

    public List<TimeSlot> getStaffSlots(Integer staffId, LocalDate date) {
        return timeSlotRepository.findByStaffIdAndSlotDate(staffId, date);
    }
}
