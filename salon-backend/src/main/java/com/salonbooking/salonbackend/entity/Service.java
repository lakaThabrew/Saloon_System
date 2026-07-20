package com.salonbooking.salonbackend.entity;

import com.salonbooking.salonbackend.enums.Gender;
import com.salonbooking.salonbackend.enums.ServiceCategory;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "service")
@Data
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "service_name", nullable = false, length = 100)
    private String serviceName;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ServiceCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_gender", length = 20)
    private Gender targetGender;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active")
    private Boolean isActive = true;
}

