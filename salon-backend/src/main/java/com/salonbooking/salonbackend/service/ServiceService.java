package com.salonbooking.salonbackend.service;

import com.salonbooking.salonbackend.exception.ResourceNotFoundException;
import com.salonbooking.salonbackend.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public List<com.salonbooking.salonbackend.entity.Service> getAllServices() {
        return serviceRepository.findAll();
    }

    public com.salonbooking.salonbackend.entity.Service getServiceById(Integer id) {
        return serviceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Service not found"));
    }

    public com.salonbooking.salonbackend.entity.Service createService(com.salonbooking.salonbackend.entity.Service service) {
        return serviceRepository.save(service);
    }

    public com.salonbooking.salonbackend.entity.Service updateService(Integer id, com.salonbooking.salonbackend.entity.Service serviceDetails) {
        var service = getServiceById(id);
        service.setServiceName(serviceDetails.getServiceName());
        service.setCategory(serviceDetails.getCategory());
        service.setTargetGender(serviceDetails.getTargetGender());
        service.setDurationMinutes(serviceDetails.getDurationMinutes());
        service.setDescription(serviceDetails.getDescription());
        service.setIsActive(serviceDetails.getIsActive());
        return serviceRepository.save(service);
    }

    public void deleteService(Integer id) {
        serviceRepository.deleteById(id);
    }
}
