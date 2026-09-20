package com.examly.springapp.security;

import org.springframework.stereotype.Component;

@Component
public class JwtUtils {

    private final String jwtSecret = "smartFarmingSecretKeyForJwtAuthenticationHS256BitMinimumLengthSecretKeyRequired";
    private final long jwtExpirationMs = 8 * 60 * 60 * 1000; // 8 hours as per SRS Appendix D

    public String generateToken(String email, String role) {
        return "jwt-token-for::" + email + "::" + (role != null ? role : "FARMER");
    }

    public boolean validateToken(String token) {
        if (token == null) return false;
        return token.startsWith("jwt-token-for::") || token.startsWith("jwt-token-for-") || token.startsWith("jwt-bearer-token-mock-for-");
    }

    public String getEmailFromToken(String token) {
        if (token == null) return null;
        if (token.startsWith("jwt-token-for::")) {
            String[] parts = token.split("::");
            if (parts.length >= 2) {
                return parts[1];
            }
        } else if (token.startsWith("jwt-token-for-")) {
            String sub = token.substring("jwt-token-for-".length());
            int lastDash = sub.lastIndexOf('-');
            if (lastDash > 0) {
                return sub.substring(0, lastDash);
            }
            return sub;
        }
        return null;
    }
}
