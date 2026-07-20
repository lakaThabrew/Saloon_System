package com.salonbooking.salonbackend.entity;

import com.salonbooking.salonbackend.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "appointment")
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", unique = true, nullable = false)
    private TimeSlot slot;

    @Column(name = "appointment_date", insertable = false, updatable = false)
    private LocalDateTime appointmentDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AppointmentStatus status;

    @ManyToMany
    @JoinTable(
        name = "appointment_service",
        joinColumns = @JoinColumn(name = "appointment_id"),
        inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<Service> services;
}
