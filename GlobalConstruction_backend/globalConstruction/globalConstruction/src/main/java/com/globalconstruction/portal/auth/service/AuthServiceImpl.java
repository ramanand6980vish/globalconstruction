package com.globalconstruction.portal.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.globalconstruction.portal.auth.dto.LoginRequest;
import com.globalconstruction.portal.auth.dto.LoginResponse;
import com.globalconstruction.portal.auth.entity.User;
import com.globalconstruction.portal.auth.repository.UserRepository;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    // Constructor injection
    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            UserRepository userRepository) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        // Authenticate the username and password.
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );

        // Retrieve the authenticated username.
        String username = authentication.getName();

        // Find the authenticated user in the database.
        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found: " + username
                        )
                );

        // Return user details without exposing the password.
        return new LoginResponse(
                user.getUserId(),
                user.getUsername(),
                user.getRole(),
                "Login successful"
        );
    }
}