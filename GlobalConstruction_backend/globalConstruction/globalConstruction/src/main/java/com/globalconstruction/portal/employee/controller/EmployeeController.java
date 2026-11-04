package com.globalconstruction.portal.employee.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.globalconstruction.portal.employee.dto.EmployeeRequest;
import com.globalconstruction.portal.employee.dto.EmployeeResponse;
import com.globalconstruction.portal.employee.entity.EmployeeStatus;
import com.globalconstruction.portal.employee.service.EmployeeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

   

	// Create employee
    @PostMapping
    public ResponseEntity<EmployeeResponse> create(
             @RequestBody EmployeeRequest request) {

        EmployeeResponse response = employeeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all employees
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAll() {
        return ResponseEntity.ok(employeeService.getAll());
    }

    // Get employee by ID, e.g. EMP26001
    @GetMapping("/{employeeId}")
    public ResponseEntity<EmployeeResponse> getById(
            @PathVariable String employeeId) {

        return ResponseEntity.ok(employeeService.getById(employeeId));
    }

    // Get employee by employee code
    @GetMapping("/code/{employeeCode}")
    public ResponseEntity<EmployeeResponse> getByEmployeeCode(
            @PathVariable String employeeCode) {

        return ResponseEntity.ok(
                employeeService.getByEmployeeCode(employeeCode));
    }

    // Get employees by company ID
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<EmployeeResponse>> getByCompany(
            @PathVariable String companyId) {

        return ResponseEntity.ok(employeeService.getByCompany(companyId));
    }

    // Get employees by department ID
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<EmployeeResponse>> getByDepartment(
            @PathVariable String departmentId) {

        return ResponseEntity.ok(
                employeeService.getByDepartment(departmentId));
    }

    // Get employees by designation ID
    @GetMapping("/designation/{designationId}")
    public ResponseEntity<List<EmployeeResponse>> getByDesignation(
            @PathVariable String designationId) {

        return ResponseEntity.ok(
                employeeService.getByDesignation(designationId));
    }

    // Get employees by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<EmployeeResponse>> getByStatus(
            @PathVariable EmployeeStatus status) {

        return ResponseEntity.ok(employeeService.getByStatus(status));
    }

    // Update employee
    @PutMapping("/{employeeId}")
    public ResponseEntity<EmployeeResponse> update(
            @PathVariable String employeeId,
             @RequestBody EmployeeRequest request) {

        return ResponseEntity.ok(
                employeeService.update(employeeId, request));
    }

    // Delete employee
    @DeleteMapping("/{employeeId}")
    public ResponseEntity<Void> delete(
            @PathVariable String employeeId) {

        employeeService.delete(employeeId);
        return ResponseEntity.noContent().build();
    }
}
