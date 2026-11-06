package com.globalconstruction.portal.attendance.dto;

public class AttendanceEmployeeDTO {

    private String employeeId;
    private String employeeCode;
    private String employeeName;
    private String department;
    private String designation;

    public AttendanceEmployeeDTO() {
    }

    public AttendanceEmployeeDTO(
            String employeeId,
            String employeeCode,
            String employeeName,
            String department,
            String designation) {

        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.employeeName = employeeName;
        this.department = department;
        this.designation = designation;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}
