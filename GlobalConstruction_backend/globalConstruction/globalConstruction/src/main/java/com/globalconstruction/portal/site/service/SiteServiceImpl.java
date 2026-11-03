package com.globalconstruction.portal.site.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.globalconstruction.portal.site.dto.SiteRequest;
import com.globalconstruction.portal.site.dto.SiteResponse;
import com.globalconstruction.portal.site.entity.Site;
import com.globalconstruction.portal.site.mapper.SiteMapper;
import com.globalconstruction.portal.site.repository.SiteRepository;

@Service
@Transactional
public class SiteServiceImpl implements SiteService {

    private final SiteRepository siteRepository;
    private final SiteMapper siteMapper;

    public SiteServiceImpl(
            SiteRepository siteRepository,
            SiteMapper siteMapper) {
        this.siteRepository = siteRepository;
        this.siteMapper = siteMapper;
    }

    @Override
    public SiteResponse createSite(SiteRequest request) {
        validateDates(request);
        validateSiteCode(request.getSiteCode(), null);

        Site site = siteMapper.toEntity(request);
        Site savedSite = siteRepository.save(site);

        return siteMapper.toResponse(savedSite);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SiteResponse> getAllSites() {
        return siteRepository.findAll()
                .stream()
                .map(siteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SiteResponse getSiteById(String siteId) {
        return siteMapper.toResponse(findSite(siteId));
    }

    @Override
    public SiteResponse updateSite(String siteId, SiteRequest request) {
        Site existingSite = findSite(siteId);

        validateDates(request);
        validateSiteCode(request.getSiteCode(), siteId);

        siteMapper.updateEntity(existingSite, request);

        Site updatedSite = siteRepository.save(existingSite);
        return siteMapper.toResponse(updatedSite);
    }

    @Override
    public void deleteSite(String siteId) {
        Site site = findSite(siteId);
        siteRepository.delete(site);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SiteResponse> getSitesByCompanyId(String companyId) {
        return siteRepository.findByCompanyId(companyId)
                .stream()
                .map(siteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SiteResponse> getSitesByClientId(String clientId) {
        return siteRepository.findByClientId(clientId)
                .stream()
                .map(siteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SiteResponse> getSitesByStatus(String status) {
        return siteRepository.findByStatusIgnoreCase(status)
                .stream()
                .map(siteMapper::toResponse)
                .collect(Collectors.toList());
    }

    private Site findSite(String siteId) {
        return siteRepository.findById(siteId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Site not found with ID: " + siteId));
    }

    private void validateSiteCode(String siteCode, String currentSiteId) {
        if (siteCode == null || siteCode.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Site code is required");
        }

        siteRepository.findBySiteCode(siteCode.trim())
                .ifPresent(existingSite -> {
                    if (currentSiteId == null
                            || !existingSite.getSiteId().equals(currentSiteId)) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "Site code already exists: " + siteCode);
                    }
                });
    }

    private void validateDates(SiteRequest request) {
        if (request.getContractStartDate() != null
                && request.getContractEndDate() != null
                && request.getContractEndDate()
                        .isBefore(request.getContractStartDate())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Contract end date cannot be before contract start date");
        }
    }
}