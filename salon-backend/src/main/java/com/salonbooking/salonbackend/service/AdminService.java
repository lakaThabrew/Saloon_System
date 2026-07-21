package com.salonbooking.salonbackend.service;

import com.salonbooking.salonbackend.dto.AdminAppointmentResponse;
import com.salonbooking.salonbackend.dto.AdminUserResponse;
import com.salonbooking.salonbackend.dto.AdminUserRequest;
import com.salonbooking.salonbackend.dto.AdminUserUpdateRequest;
import com.salonbooking.salonbackend.dto.AppointmentRequest;
import com.salonbooking.salonbackend.entity.Customer;
import com.salonbooking.salonbackend.entity.Appointment;
import com.salonbooking.salonbackend.entity.Staff;
import com.salonbooking.salonbackend.entity.User;
import com.salonbooking.salonbackend.enums.AppointmentStatus;
import com.salonbooking.salonbackend.enums.Role;
import com.salonbooking.salonbackend.enums.TimeSlotStatus;
import com.salonbooking.salonbackend.exception.BadRequestException;
import com.salonbooking.salonbackend.exception.ResourceAlreadyExistsException;
import com.salonbooking.salonbackend.exception.ResourceNotFoundException;
import com.salonbooking.salonbackend.repository.AppointmentRepository;
import com.salonbooking.salonbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final AppointmentService appointmentService;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<AdminAppointmentResponse> getAppointments() {
        return appointmentRepository.findAllForAdmin().stream().map(this::toAppointmentResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .toList();
    }

    @Transactional
    public AdminAppointmentResponse createAppointment(AppointmentRequest request) {
        return toAppointmentResponse(appointmentService.bookAppointment(request));
    }

    @Transactional
    public AdminAppointmentResponse updateAppointmentStatus(Integer id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        appointment.setStatus(status);
        return toAppointmentResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public void deleteAppointment(Integer id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        appointment.getSlot().setStatus(TimeSlotStatus.AVAILABLE);
        appointmentRepository.delete(appointment);
    }

    @Transactional
    public AdminUserResponse createUser(AdminUserRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ResourceAlreadyExistsException("Email is already taken");
        }
        User user = switch (request.role()) {
            case CUSTOMER -> new Customer();
            case STAFF -> new Staff();
            case ADMIN -> new User();
        };
        user.setFullName(request.fullName());
        user.setEmail(request.email().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone());
        user.setRole(request.role());
        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public AdminUserResponse updateUser(Integer id, AdminUserUpdateRequest request) {
        User user = getUser(id);
        String email = request.email().trim().toLowerCase();
        userRepository.findByEmail(email).filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> { throw new ResourceAlreadyExistsException("Email is already taken"); });
        user.setFullName(request.fullName());
        user.setEmail(email);
        user.setPhone(request.phone());
        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public AdminUserResponse changeRole(Integer id, Role role, String currentAdminEmail) {
        User user = getUser(id);
        if (user.getEmail().equalsIgnoreCase(currentAdminEmail) && role != Role.ADMIN) {
            throw new BadRequestException("You cannot remove your own administrator access");
        }
        if (user.getRole() == role) return toUserResponse(user);

        if ((user instanceof Customer && !appointmentRepository.findByCustomerId(id).isEmpty())
                || (user instanceof Staff && !appointmentRepository.findByStaffId(id).isEmpty())) {
            throw new BadRequestException("Remove this user's bookings before changing their role");
        }

        userRepository.removeCustomerProfile(id);
        userRepository.removeStaffProfile(id);
        if (role == Role.CUSTOMER) userRepository.createCustomerProfile(id);
        if (role == Role.STAFF) userRepository.createStaffProfile(id);
        userRepository.updateRole(id, role);
        return new AdminUserResponse(id, user.getFullName(), user.getEmail(), user.getPhone(), role.name(), user.getCreatedAt());
    }

    @Transactional
    public void deleteUser(Integer id, String currentAdminEmail) {
        User user = getUser(id);
        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new BadRequestException("You cannot delete your own administrator account");
        }
        appointmentRepository.findByCustomerId(id).forEach(this::releaseAndDeleteAppointment);
        appointmentRepository.findByStaffId(id).forEach(this::releaseAndDeleteAppointment);
        appointmentRepository.flush();
        userRepository.delete(user);
    }

    private void releaseAndDeleteAppointment(Appointment appointment) {
        appointment.getSlot().setStatus(TimeSlotStatus.AVAILABLE);
        appointmentRepository.delete(appointment);
    }

    private User getUser(Integer id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AdminUserResponse toUserResponse(User user) {
        return new AdminUserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhone(),
                user.getRole().name(), user.getCreatedAt());
    }

    private AdminAppointmentResponse toAppointmentResponse(Appointment appointment) {
        var slot = appointment.getSlot();
        var customer = appointment.getCustomer();
        return new AdminAppointmentResponse(
                appointment.getId(), customer.getFullName(), customer.getEmail(), customer.getPhone(),
                slot.getStaff().getFullName(), slot.getSlotDate(), slot.getStartTime(), slot.getEndTime(),
                appointment.getServices().stream().map(service -> service.getServiceName()).toList(),
                appointment.getNotes(), appointment.getStatus().name());
    }
}
