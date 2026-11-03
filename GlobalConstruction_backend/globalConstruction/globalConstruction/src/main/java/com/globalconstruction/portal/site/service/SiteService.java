package com.globalconstruction.portal.site.service;

import java.util.List;

import com.globalconstruction.portal.site.dto.SiteRequest;
import com.globalconstruction.portal.site.dto.SiteResponse;

public interface SiteService {

    SiteResponse createSite(SiteRequest request);

    List<SiteResponse> getAllSites();

    SiteResponse getSiteById(String siteId);

    SiteResponse updateSite(String siteId, SiteRequest request);

    void deleteSite(String siteId);

    List<SiteResponse> getSitesByCompanyId(String companyId);

    List<SiteResponse> getSitesByClientId(String clientId);

    List<SiteResponse> getSitesByStatus(String status);
}