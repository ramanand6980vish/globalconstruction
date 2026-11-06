
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
import org.springframework.web.bind.annotation.RestController;

import com.globalconstruction.portal.employee.dto.EmployeeRequest;
import com.globalconstruction.portal.employee.dto.EmployeeResponse;
import com.globalconstruction.portal.employee.service.EmployeeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = {
	"https://global-construction-portal.vercel.app",
	"https://localhost:5173"
})
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // Create employee
    @PostMapping
    public ResponseEntity<EmployeeResponse> create(
            @RequestBody EmployeeRequest request) {

        EmployeeResponse response =
                employeeService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    // Get all employees
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAll() {

        return ResponseEntity.ok(
                employeeService.getAll());
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
