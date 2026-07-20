package com.salonbooking.salonbackend.service;

import com.salonbooking.salonbackend.entity.User;
import com.salonbooking.salonbackend.exception.ResourceNotFoundException;
import com.salonbooking.salonbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUserByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User not found"));
    }
}
