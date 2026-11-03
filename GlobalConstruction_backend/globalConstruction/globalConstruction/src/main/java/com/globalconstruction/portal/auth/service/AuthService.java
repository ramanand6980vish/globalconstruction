package com.globalconstruction.portal.auth.service;

import com.globalconstruction.portal.auth.dto.LoginRequest;
import com.globalconstruction.portal.auth.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}