package com.salonbooking.salonbackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;

@Entity
@Table(name = "staff_schedule")
@Data
public class StaffSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @Column(name = "day_of_week", length = 10)
    private String dayOfWeek;

    @Column(name = "work_start", nullable = false)
    private LocalTime workStart;

    @Column(name = "work_end", nullable = false)
    private LocalTime workEnd;
}
