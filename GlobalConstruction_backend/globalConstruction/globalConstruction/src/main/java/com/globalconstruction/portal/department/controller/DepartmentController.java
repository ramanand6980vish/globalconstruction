package com.globalconstruction.portal.department.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.globalconstruction.portal.department.entity.Department;
import com.globalconstruction.portal.department.service.DepartmentService;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:5173")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    public ResponseEntity<Department> createDepartment(
            @RequestBody Department department) {

        Department savedDepartment =
                departmentService.createDepartment(department);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDepartment);
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {

        return ResponseEntity.ok(
                departmentService.getAllDepartments());
    }

    @GetMapping("/{departmentId}")
    public ResponseEntity<Department> getDepartmentById(
            @PathVariable String departmentId) {

        return ResponseEntity.ok(
                departmentService.getDepartmentById(departmentId));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Department>> getDepartmentsByCompany(
            @PathVariable String companyId) {

        return ResponseEntity.ok(
                departmentService.getDepartmentsByCompany(companyId));
    }
}