package com.healthcare.appointmentsystem.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    // IMPORTANT: This key should be stored securely and not hardcoded in production.
    // We are generating a secure 256-bit key and storing it as a Base64 string.
    private static final String SECRET = "4E645267556B58703273357638792F423F4528482B4D6251655468576D5A7134";

    // Generates a token that is valid for 24 hours
 // In JwtService.java

 // In JwtService.java

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSigningKey()) // Just provide the key
                .compact();
    }

    // Extracts the username (subject) from the token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Validates the token
    public boolean isTokenValid(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Generic method to extract any claim from the token
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

 // In JwtService.java

 // In JwtService.java

 // In JwtService.java

 // Make sure you have this import statement at the top of your file
	
	 private Claims extractAllClaims(String token) {
	     return Jwts.parser()
	             .verifyWith(getSigningKey()) // No cast needed now
	             .build()
	             .parseSignedClaims(token)
	             .getPayload();
	 }
	
	 // Change the return type here from Key to SecretKey
	 private SecretKey getSigningKey() {
	     byte[] keyBytes = Decoders.BASE64.decode(SECRET);
	     return Keys.hmacShaKeyFor(keyBytes);
	 }
}