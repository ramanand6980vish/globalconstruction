package com.globalconstruction.portal.auth.service;

import java.util.List;

import com.globalconstruction.portal.auth.dto.UserRequest;
import com.globalconstruction.portal.auth.dto.UserResponse;

public interface UserService {

    UserResponse createUser(UserRequest request);

    UserResponse getUserById(String userId);

    List<UserResponse> getAllUsers();

    UserResponse updateUser(String userId, UserRequest request);

    void deleteUser(String userId);
}