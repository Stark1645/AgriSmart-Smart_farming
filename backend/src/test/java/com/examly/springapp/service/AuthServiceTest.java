package com.examly.springapp.service;

import com.examly.springapp.exception.UnauthorisedAccessException;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Spy
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Spy
    private JwtUtils jwtUtils = new JwtUtils();

    @InjectMocks
    private AuthService authService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Rajesh Patel");
        mockUser.setEmail("rajesh-farmer@agrismart.in");
        mockUser.setPhoneNumber("9876543210");
        mockUser.setRole("FARMER");
        mockUser.setPasswordHash(passwordEncoder.encode("SecretPass123!"));
    }

    @Test
    void testLoginWithValidPasswordSucceeds() {
        when(userRepository.findByEmail("rajesh-farmer@agrismart.in")).thenReturn(Optional.of(mockUser));

        Map<String, Object> result = authService.loginUser("rajesh-farmer@agrismart.in", "SecretPass123!");

        assertNotNull(result);
        assertNotNull(result.get("token"));
        assertEquals(mockUser, result.get("user"));
        assertTrue(result.get("token").toString().startsWith("jwt-token-for::"));
    }

    @Test
    void testLoginWithInvalidPasswordThrowsException() {
        when(userRepository.findByEmail("rajesh-farmer@agrismart.in")).thenReturn(Optional.of(mockUser));

        assertThrows(UnauthorisedAccessException.class, () -> {
            authService.loginUser("rajesh-farmer@agrismart.in", "WrongPassword!");
        });
    }

    @Test
    void testRegisterUserHashesPassword() {
        User newUser = new User();
        newUser.setName("Vikram Singh");
        newUser.setEmail("vikram@agrismart.in");
        newUser.setPasswordHash("plainTextPassword");
        newUser.setPhoneNumber("9876543210");

        when(userRepository.existsByEmail("vikram@agrismart.in")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User saved = authService.registerUser(newUser);

        assertNotNull(saved);
        assertTrue(saved.getPasswordHash().startsWith("$2a$") || saved.getPasswordHash().startsWith("$2b$"));
        assertTrue(passwordEncoder.matches("plainTextPassword", saved.getPasswordHash()));
    }

    @Test
    void testGetProfileWithValidBearerTokenReturnsAuthenticatedUser() {
        String token = jwtUtils.generateToken("rajesh-farmer@agrismart.in", "FARMER");
        when(userRepository.findByEmail("rajesh-farmer@agrismart.in")).thenReturn(Optional.of(mockUser));

        User profile = authService.getProfile("Bearer " + token);

        assertNotNull(profile);
        assertEquals("rajesh-farmer@agrismart.in", profile.getEmail());
    }

    @Test
    void testJwtUtilsWithHyphenatedEmail() {
        String token = jwtUtils.generateToken("john-doe-farmer@test.org", "FARMER");
        assertTrue(jwtUtils.validateToken(token));
        assertEquals("john-doe-farmer@test.org", jwtUtils.getEmailFromToken(token));
    }
}
