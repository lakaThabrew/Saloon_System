package com.salonbooking.salonbackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AppointmentRequest {
    private Integer customerId;
    private Integer slotId;
    private List<Integer> serviceIds;
    private String notes;
}
