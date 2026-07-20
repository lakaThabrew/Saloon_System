package com.salonbooking.salonbackend.service;

import com.salonbooking.salonbackend.dto.AuthResponse;
import com.salonbooking.salonbackend.dto.LoginRequest;
import com.salonbooking.salonbackend.dto.RegisterRequest;
import com.salonbooking.salonbackend.entity.Customer;
import com.salonbooking.salonbackend.enums.Gender;
import com.salonbooking.salonbackend.enums.Role;
import com.salonbooking.salonbackend.repository.CustomerRepository;
import com.salonbooking.salonbackend.repository.UserRepository;
import com.salonbooking.salonbackend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.salonbooking.salonbackend.exception.ResourceAlreadyExistsException;
import com.salonbooking.salonbackend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResourceAlreadyExistsException("Email is already taken");
        }

        Customer customer = new Customer();
        customer.setFullName(request.getFullName());
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setPhone(request.getPhone());
        customer.setRole(Role.CUSTOMER);

        if (request.getGender() != null) {
            customer.setGender(Gender.valueOf(request.getGender().toUpperCase()));
        }
        customer.setPreferences(request.getPreferences());

        customerRepository.save(customer);

        var jwtToken = jwtUtil.generateToken(customer);
        return new AuthResponse(jwtToken, customer.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var jwtToken = jwtUtil.generateToken(user);
        return new AuthResponse(jwtToken, user.getRole().name());
    }
}
