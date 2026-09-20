package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Authentication Controller", description = "User registration, authentication and session management")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "User Registration (FR1)")
    @PostMapping("/auth/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User created = authService.registerUser(user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "User Login & Session (FR2)")
    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> result = authService.loginUser(credentials.get("email"), credentials.get("password"));
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "User Logout")
    @PostMapping("/auth/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Successfully logged out and token invalidated"));
    }

    @Operation(summary = "Get Logged-in User Profile")
    @GetMapping("/users/profile")
    public ResponseEntity<User> getProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(authService.getProfile(authHeader));
    }
}
