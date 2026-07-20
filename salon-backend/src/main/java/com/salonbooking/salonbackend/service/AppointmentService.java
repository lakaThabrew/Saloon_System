package com.salonbooking.salonbackend.service;

import com.salonbooking.salonbackend.dto.AppointmentRequest;
import com.salonbooking.salonbackend.entity.Appointment;
import com.salonbooking.salonbackend.enums.AppointmentStatus;
import com.salonbooking.salonbackend.enums.TimeSlotStatus;
import com.salonbooking.salonbackend.exception.BadRequestException;
import com.salonbooking.salonbackend.exception.ResourceNotFoundException;
import com.salonbooking.salonbackend.repository.AppointmentRepository;
import com.salonbooking.salonbackend.repository.CustomerRepository;
import com.salonbooking.salonbackend.repository.ServiceRepository;
import com.salonbooking.salonbackend.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final CustomerRepository customerRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final ServiceRepository serviceRepository;

    @Transactional
    public Appointment bookAppointment(AppointmentRequest request) {
        var customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        var slot = timeSlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Time slot not found"));

        if (slot.getStatus() != TimeSlotStatus.AVAILABLE) {
            throw new BadRequestException("Time slot is not available");
        }

        var services = serviceRepository.findAllById(request.getServiceIds());

        Appointment appointment = new Appointment();
        appointment.setCustomer(customer);
        appointment.setSlot(slot);
        appointment.setNotes(request.getNotes());
        appointment.setStatus(AppointmentStatus.BOOKED);
        appointment.setServices(services);

        slot.setStatus(TimeSlotStatus.BOOKED);
        timeSlotRepository.save(slot);

        return appointmentRepository.save(appointment);
    }

    public Appointment getAppointmentById(Integer id) {
        return appointmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
    }
}
