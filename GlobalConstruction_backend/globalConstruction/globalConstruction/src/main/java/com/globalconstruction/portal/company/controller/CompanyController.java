package com.globalconstruction.portal.company.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.globalconstruction.portal.company.entity.Company;
import com.globalconstruction.portal.company.service.CompanyService;

@RestController
@RequestMapping("/api/companies")
//@CrossOrigin(origins = "http://localhost:5173")
@CrossOrigin(origins = "*")

public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    public ResponseEntity<Company> createCompany(
            @RequestBody Company company) {

        Company savedCompany = companyService.createCompany(company);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedCompany);
    }

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {

        return ResponseEntity.ok(
                companyService.getAllCompanies());
    }

    @GetMapping("/{companyId}")
    public ResponseEntity<Company> getCompanyById(
            @PathVariable String companyId) {

        return ResponseEntity.ok(
                companyService.getCompanyById(companyId));
    }
}