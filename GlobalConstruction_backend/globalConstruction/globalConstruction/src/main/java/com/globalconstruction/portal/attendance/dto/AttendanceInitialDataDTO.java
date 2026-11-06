package com.globalconstruction.portal.attendance.dto;

import java.util.List;

public class AttendanceInitialDataDTO {

    private List<AttendanceEmployeeDTO> employees;
    private List<SiteOptionDTO> sites;

    public AttendanceInitialDataDTO() {
    }

    public AttendanceInitialDataDTO(
            List<AttendanceEmployeeDTO> employees,
            List<SiteOptionDTO> sites) {

        this.employees = employees;
        this.sites = sites;
    }

    public List<AttendanceEmployeeDTO> getEmployees() {
        return employees;
    }

    public void setEmployees(
            List<AttendanceEmployeeDTO> employees) {
        this.employees = employees;
    }

    public List<SiteOptionDTO> getSites() {
        return sites;
    }

    public void setSites(
            List<SiteOptionDTO> sites) {
        this.sites = sites;
    }
}
