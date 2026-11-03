
package com.globalconstruction.portal.attendance.dto;

public class SiteOptionDTO {

    private String siteId;
    private String siteCode;
    private String siteName;

    public SiteOptionDTO() {
    }

    public SiteOptionDTO(String siteId, String siteCode, String siteName) {
        this.siteId = siteId;
        this.siteCode = siteCode;
        this.siteName = siteName;
    }

    public String getSiteId() { return siteId; }
    public void setSiteId(String siteId) { this.siteId = siteId; }

    public String getSiteCode() { return siteCode; }
    public void setSiteCode(String siteCode) { this.siteCode = siteCode; }

    public String getSiteName() { return siteName; }
    public void setSiteName(String siteName) { this.siteName = siteName; }
}
