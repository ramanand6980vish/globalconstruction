package com.globalconstruction.portal.dashboard.dto;

public class SiteWorkforceDTO {

    private String siteId;
    private String siteName;
    private long employeeCount;

    public SiteWorkforceDTO(
            String siteId,
            String siteName,
            long employeeCount) {

        this.siteId = siteId;
        this.siteName = siteName;
        this.employeeCount = employeeCount;
    }

    public String getSiteId() {
        return siteId;
    }

    public String getSiteName() {
        return siteName;
    }

    public long getEmployeeCount() {
        return employeeCount;
    }
}