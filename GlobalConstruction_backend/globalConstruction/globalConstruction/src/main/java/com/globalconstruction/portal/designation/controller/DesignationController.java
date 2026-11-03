package com.globalconstruction.portal.designation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.globalconstruction.portal.designation.entity.Designation;
import com.globalconstruction.portal.designation.service.DesignationService;

@RestController
@RequestMapping("/api/designations")
@CrossOrigin(origins = "http://localhost:5173")
public class DesignationController {

    private final DesignationService designationService;

    public DesignationController(DesignationService designationService) {
        this.designationService = designationService;
    }

    @PostMapping
    public ResponseEntity<Designation> createDesignation(
            @RequestBody Designation designation) {

        Designation savedDesignation =
                designationService.createDesignation(designation);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDesignation);
    }

    @GetMapping
    public ResponseEntity<List<Designation>> getAllDesignations() {

        return ResponseEntity.ok(
                designationService.getAllDesignations());
    }

    @GetMapping("/{designationId}")
    public ResponseEntity<Designation> getDesignationById(
            @PathVariable String designationId) {

        return ResponseEntity.ok(
                designationService.getDesignationById(designationId));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Designation>> getDesignationsByCompany(
            @PathVariable String companyId) {

        return ResponseEntity.ok(
                designationService.getDesignationsByCompany(companyId));
    }
}