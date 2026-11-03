package com.globalconstruction.portal.site.mapper;

import org.springframework.stereotype.Component;

import com.globalconstruction.portal.site.dto.SiteRequest;
import com.globalconstruction.portal.site.dto.SiteResponse;
import com.globalconstruction.portal.site.entity.Site;

@Component
public class SiteMapper {

    public Site toEntity(SiteRequest request) {
        Site site = new Site();
        updateEntity(site, request);
        return site;
    }

    public void updateEntity(Site site, SiteRequest request) {
    	 site.setCompanyId(request.getCompanyId().trim());

    	    site.setClientId(request.getClientId().trim());

    	    site.setSiteCode(request.getSiteCode().trim());

    	    site.setSiteName(request.getSiteName().trim());

    	    site.setLocation(request.getLocation());

    	    site.setAddress(request.getAddress());
        site.setCity(request.getCity());
        site.setState(request.getState());
        site.setPincode(request.getPincode());
        site.setContractStartDate(request.getContractStartDate());
        site.setContractEndDate(request.getContractEndDate());

        if (request.getStatus() != null
                && !request.getStatus().trim().isEmpty()) {
            site.setStatus(request.getStatus().trim().toUpperCase());
        } else if (site.getStatus() == null
                || site.getStatus().trim().isEmpty()) {
            site.setStatus("ACTIVE");
        }
    }

    public SiteResponse toResponse(Site site) {
        SiteResponse response = new SiteResponse();

        response.setSiteId(site.getSiteId());
        response.setCompanyId(site.getCompanyId());
        response.setClientId(site.getClientId());
        response.setSiteCode(site.getSiteCode());
        response.setSiteName(site.getSiteName());
        response.setLocation(site.getLocation());
        response.setAddress(site.getAddress());
        response.setCity(site.getCity());
        response.setState(site.getState());
        response.setPincode(site.getPincode());
        response.setContractStartDate(site.getContractStartDate());
        response.setContractEndDate(site.getContractEndDate());
        response.setStatus(site.getStatus());
        response.setCreatedAt(site.getCreatedAt());
        response.setUpdatedAt(site.getUpdatedAt());

        return response;
    }
}