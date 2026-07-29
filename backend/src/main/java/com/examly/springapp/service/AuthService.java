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
        // SRS Validation Rule 1: Name must contain alphabetic characters and spaces only
        if (user.getName() == null || !user.getName().trim().matches("^[A-Za-z\\s]+$")) {
            throw new InvalidNameException("Name must not contain numbers or special characters");
        }

        // SRS Validation Rule 2: Phone number must be exactly 10 digits
        if (user.getPhoneNumber() == null || !user.getPhoneNumber().trim().matches("^\\d{10}$")) {
            throw new InvalidPhoneException("Phone Number must be exactly 10 digits long");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("This email is already registered");
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
