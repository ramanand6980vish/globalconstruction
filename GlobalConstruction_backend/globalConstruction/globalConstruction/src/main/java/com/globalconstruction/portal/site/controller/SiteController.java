package com.globalconstruction.portal.site.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.globalconstruction.portal.site.dto.SiteRequest;
import com.globalconstruction.portal.site.dto.SiteResponse;
import com.globalconstruction.portal.site.service.SiteService;

@RestController
@RequestMapping("/api/sites")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://your-vercel-domain.vercel.app",
    "https://globalconstruction.onrender.com"
})
public class SiteController {

    private final SiteService siteService;

    public SiteController(SiteService siteService) {
        this.siteService = siteService;
    }

    // Create site
    @PostMapping
    public ResponseEntity<SiteResponse> createSite(
            @Valid @RequestBody SiteRequest request) {

        SiteResponse response = siteService.createSite(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all sites
    @GetMapping
    public ResponseEntity<List<SiteResponse>> getAllSites() {
        return ResponseEntity.ok(siteService.getAllSites());
    }

    // Get site by ID
    @GetMapping("/{siteId}")
    public ResponseEntity<SiteResponse> getSiteById(
            @PathVariable String siteId) {

        return ResponseEntity.ok(siteService.getSiteById(siteId));
    }

    // Update site
    @PutMapping("/{siteId}")
    public ResponseEntity<SiteResponse> updateSite(
            @PathVariable String siteId,
            @Valid @RequestBody SiteRequest request) {

        return ResponseEntity.ok(
                siteService.updateSite(siteId, request));
    }

    // Delete site
    @DeleteMapping("/{siteId}")
    public ResponseEntity<Void> deleteSite(
            @PathVariable String siteId) {

        siteService.deleteSite(siteId);
        return ResponseEntity.noContent().build();
    }

    // Get sites by company
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<SiteResponse>> getSitesByCompanyId(
            @PathVariable String companyId) {

        return ResponseEntity.ok(
                siteService.getSitesByCompanyId(companyId));
    }

    // Get sites by client
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<SiteResponse>> getSitesByClientId(
            @PathVariable String clientId) {

        return ResponseEntity.ok(
                siteService.getSitesByClientId(clientId));
    }

    // Get sites by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<SiteResponse>> getSitesByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                siteService.getSitesByStatus(status));
    }
}
