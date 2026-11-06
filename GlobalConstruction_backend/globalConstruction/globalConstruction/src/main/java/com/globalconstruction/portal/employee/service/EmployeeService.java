package com.globalconstruction.portal.employee.service;

import java.util.List;

import com.globalconstruction.portal.employee.dto.EmployeeRequest;
import com.globalconstruction.portal.employee.dto.EmployeeResponse;

public interface EmployeeService {

    // Create a new employee
    EmployeeResponse create(EmployeeRequest request);

    // Fetch all employees
    List<EmployeeResponse> getAll();

    // Update an existing employee
    EmployeeResponse update(String employeeId, EmployeeRequest request);

    // Delete an employee
    void delete(String employeeId);
}
