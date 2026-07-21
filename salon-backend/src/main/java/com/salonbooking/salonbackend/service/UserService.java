package com.salonbooking.salonbackend.service;

import com.salonbooking.salonbackend.dto.ProfileUpdateRequest;
import com.salonbooking.salonbackend.dto.UserProfileResponse;
import com.salonbooking.salonbackend.entity.Customer;
import com.salonbooking.salonbackend.entity.User;
import com.salonbooking.salonbackend.exception.ResourceNotFoundException;
import com.salonbooking.salonbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUserByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String email) {
        return toProfile(getUserByEmail(email));
    }

    @Transactional
    public UserProfileResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = getUserByEmail(email);
        user.setFullName(request.fullName());
        user.setPhone(request.phone());
        if (user instanceof Customer customer) {
            customer.setPreferences(request.preferences());
        }
        return toProfile(userRepository.save(user));
    }

    private UserProfileResponse toProfile(User user) {
        String gender = null;
        String preferences = null;
        if (user instanceof Customer customer) {
            gender = customer.getGender() == null ? null : customer.getGender().name();
            preferences = customer.getPreferences();
        }
        return new UserProfileResponse(
                user.getId(), user.getFullName(), user.getEmail(), user.getPhone(), user.getRole().name(),
                gender, preferences, user.getCreatedAt());
    }
}
