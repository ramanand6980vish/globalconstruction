package com.globalconstruction.portal.auth.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.globalconstruction.portal.auth.dto.UserRequest;
import com.globalconstruction.portal.auth.dto.UserResponse;
import com.globalconstruction.portal.auth.service.UserService;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

 private final UserService userService;

public UserController(UserService userService) {
    this.userService = userService;
}

@PostMapping
public ResponseEntity<UserResponse> createUser(
        @RequestBody UserRequest request) {

    UserResponse response = userService.createUser(request);

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
}

@GetMapping
public ResponseEntity<List<UserResponse>> getAllUsers() {

    return ResponseEntity.ok(userService.getAllUsers());
}

@GetMapping("/{userId}")
public ResponseEntity<UserResponse> getUserById(
        @PathVariable String userId) {

    return ResponseEntity.ok(userService.getUserById(userId));
}

@PutMapping("/{userId}")
public ResponseEntity<UserResponse> updateUser(
        @PathVariable String userId,
        @RequestBody UserRequest request) {

    return ResponseEntity.ok(
            userService.updateUser(userId, request));
}

@DeleteMapping("/{userId}")
public ResponseEntity<Void> deleteUser(
        @PathVariable String userId) {

    userService.deleteUser(userId);

    return ResponseEntity.noContent().build();
}
 
}
