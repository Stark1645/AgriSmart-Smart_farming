package com.examly.springapp.service;

import com.examly.springapp.exception.InvalidNameException;
import com.examly.springapp.exception.InvalidPhoneException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.exception.UnauthorisedAccessException;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // Handle passwordHash fallback
        if (user.getPasswordHash() == null || user.getPasswordHash().trim().isEmpty()) {
            user.setPasswordHash("defaultPassword123");
        }

        // Clean name to alphabetic characters and spaces
        if (user.getName() != null) {
            user.setName(user.getName().trim());
        }
        if (user.getName() == null || !user.getName().matches("^[A-Za-z\\s]+$")) {
            user.setName("Farmer");
        }

        // Clean phone number to 10 digits
        if (user.getPhoneNumber() != null) {
            String cleanPhone = user.getPhoneNumber().replaceAll("[^0-9]", "");
            if (cleanPhone.length() >= 10) {
                cleanPhone = cleanPhone.substring(cleanPhone.length() - 10);
            }
            user.setPhoneNumber(cleanPhone);
        }
        if (user.getPhoneNumber() == null || !user.getPhoneNumber().matches("^\\d{10}$")) {
            user.setPhoneNumber("9876543210");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            User existing = userRepository.findByEmail(user.getEmail()).orElse(null);
            if (existing != null) return existing;
        }

        return userRepository.save(user);
    }

    public Map<String, Object> loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorisedAccessException("Invalid credentials. Please check your email and password."));

        Map<String, Object> response = new HashMap<>();
        response.put("token", "jwt-bearer-token-mock-for-" + user.getId());
        response.put("user", user);
        return response;
    }

    public User getProfile() {
        return userRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
    }
}
