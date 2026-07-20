package com.salonbooking.salonbackend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String gender;
    private String preferences;
}
