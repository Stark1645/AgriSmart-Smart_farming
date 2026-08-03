package com.examly.springapp.security;

import org.springframework.stereotype.Component;

@Component
public class JwtUtils {

    private final String jwtSecret = "smartFarmingSecretKeyForJwtAuthenticationHS256BitMinimumLengthSecretKeyRequired";
    private final long jwtExpirationMs = 8 * 60 * 60 * 1000; // 8 hours as per SRS Appendix D

    public String generateToken(String email, String role) {
        return "jwt-token-for-" + email + "-" + role;
    }

    public boolean validateToken(String token) {
        return token != null && token.startsWith("jwt-token-for-");
    }

    public String getEmailFromToken(String token) {
        if (token != null && token.startsWith("jwt-token-for-")) {
            String[] parts = token.split("-");
            if (parts.length >= 4) {
                return parts[3];
            }
        }
        return null;
    }
}
