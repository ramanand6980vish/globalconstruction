package com.globalconstruction.portal.auth.service;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.globalconstruction.portal.auth.dto.UserRequest;
import com.globalconstruction.portal.auth.dto.UserResponse;
import com.globalconstruction.portal.auth.entity.Role;
import com.globalconstruction.portal.auth.entity.User;
import com.globalconstruction.portal.auth.repository.UserRepository;
import com.globalconstruction.portal.common.id.IdGeneratorService;

@Service
@Transactional
public class UserServiceImpl implements UserService {

private final UserRepository userRepository;
private final IdGeneratorService idGeneratorService;
private final PasswordEncoder passwordEncoder;

public UserServiceImpl(
        UserRepository userRepository,
        IdGeneratorService idGeneratorService,
        PasswordEncoder passwordEncoder) {

    this.userRepository = userRepository;
    this.idGeneratorService = idGeneratorService;
    this.passwordEncoder = passwordEncoder;
}

@Override
public UserResponse createUser(UserRequest request) {

    if (userRepository.existsByUsername(request.getUsername())) {
        throw new IllegalArgumentException("Username already exists");
    }

    if (userRepository.existsByEmail(request.getEmail())) {
        throw new IllegalArgumentException("Email already exists");
    }

    User user = new User();

    user.setUserId(idGeneratorService.generateId("USR"));
    user.setCompanyId(request.getCompanyId());
    user.setEmployeeId(request.getEmployeeId());
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());

    if (request.getPassword() == null
            || request.getPassword().isBlank()) {
        throw new IllegalArgumentException("Password is required");
    }

    user.setPasswordHash(
            passwordEncoder.encode(request.getPassword()));

    user.setRole(validateRole(request.getRole()));
    user.setStatus("ACTIVE");

    User savedUser = userRepository.save(user);

    return convertToResponse(savedUser);
}

@Override
@Transactional(readOnly = true)
public List<UserResponse> getAllUsers() {

    return userRepository.findAll()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
}

@Override
@Transactional(readOnly = true)
public UserResponse getUserById(String userId) {

    User user = userRepository.findById(userId)
            .orElseThrow(() ->
                    new IllegalArgumentException(
                            "User not found: " + userId));

    return convertToResponse(user);
}

@Override
public UserResponse updateUser(
        String userId,
        UserRequest request) {

    User user = userRepository.findById(userId)
            .orElseThrow(() ->
                    new IllegalArgumentException(
                            "User not found: " + userId));

    if (request.getUsername() != null
            && !request.getUsername().equals(user.getUsername())) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException(
                    "Username already exists");
        }

        user.setUsername(request.getUsername());
    }

    if (request.getEmail() != null
            && !request.getEmail().equalsIgnoreCase(user.getEmail())) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Email already exists");
        }

        user.setEmail(request.getEmail());
    }

    if (request.getCompanyId() != null) {
        user.setCompanyId(request.getCompanyId());
    }

    if (request.getEmployeeId() != null) {
        user.setEmployeeId(request.getEmployeeId());
    }

    if (request.getRole() != null
            && !request.getRole().isBlank()) {
        user.setRole(validateRole(request.getRole()));
    }

    if (request.getPassword() != null
            && !request.getPassword().isBlank()) {
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword()));
    }

    User updatedUser = userRepository.save(user);

    return convertToResponse(updatedUser);
}

@Override
public void deleteUser(String userId) {

    User user = userRepository.findById(userId)
            .orElseThrow(() ->
                    new IllegalArgumentException(
                            "User not found: " + userId));

    userRepository.delete(user);
}

private String validateRole(String role) {

    if (role == null || role.isBlank()) {
        throw new IllegalArgumentException("Role is required");
    }

    try {
        return Role.valueOf(
                role.trim().toUpperCase(Locale.ROOT)).name();
    } catch (IllegalArgumentException ex) {
        throw new IllegalArgumentException(
                "Invalid role. Allowed roles: ADMIN, HR, "
                + "ACCOUNTANT, SITE_MANAGER, EMPLOYEE");
    }
}

private UserResponse convertToResponse(User user) {

    UserResponse response = new UserResponse();

    response.setUserId(user.getUserId());
    response.setCompanyId(user.getCompanyId());
    response.setEmployeeId(user.getEmployeeId());
    response.setUsername(user.getUsername());
    response.setEmail(user.getEmail());
    response.setRole(user.getRole());
    response.setStatus(user.getStatus());
    response.setCreatedAt(user.getCreatedAt());
    response.setUpdatedAt(user.getUpdatedAt());

    return response;
}
 
}
