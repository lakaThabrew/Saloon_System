package com.salonbooking.salonbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.salonbooking.salonbackend.enums.TimeSlotStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "time_slot")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "services"})
    private Staff staff;

    @Column(name = "slot_date")
    private LocalDate slotDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TimeSlotStatus status;

}