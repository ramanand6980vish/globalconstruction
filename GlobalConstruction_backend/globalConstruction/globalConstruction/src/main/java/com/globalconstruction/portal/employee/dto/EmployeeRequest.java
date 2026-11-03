package com.globalconstruction.portal.employee.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.globalconstruction.portal.employee.entity.EmployeeStatus;
import com.globalconstruction.portal.employee.entity.Gender;
import com.globalconstruction.portal.employee.entity.MaritalStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EmployeeRequest {

    @NotNull(message = "Company ID is required")
    private String companyId;

    @NotBlank(message = "Employee code is required")
    private String employeeCode;

    @NotBlank(message = "First name is required")
    private String firstName;

    private String middleName;
    private String lastName;
    private String fatherName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private MaritalStatus maritalStatus;
    private String mobileNo;
    private String bloodGroup;

    private String departmentId;
    private String designationId;

    private String grade;
    private LocalDate joiningDate;
    private LocalDate terminationDate;

    private EmployeeStatus status;

    private String gatePassNo;
    private String billableStatus;


    // =========================
    // GETTERS
    // =========================

    public String getCompanyId() {
        return companyId;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFatherName() {
        return fatherName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public Gender getGender() {
        return gender;
    }

    public MaritalStatus getMaritalStatus() {
        return maritalStatus;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public String getDepartmentId() {
        return departmentId;
    }

    public String getDesignationId() {
        return designationId;
    }

    public String getGrade() {
        return grade;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public LocalDate getTerminationDate() {
        return terminationDate;
    }

    public EmployeeStatus getStatus() {
        return status;
    }

    public String getGatePassNo() {
        return gatePassNo;
    }

    public String getBillableStatus() {
        return billableStatus;
    }


    // =========================
    // SETTERS
    // =========================

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public void setMaritalStatus(MaritalStatus maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    public void setDesignationId(String designationId) {
        this.designationId = designationId;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public void setTerminationDate(LocalDate terminationDate) {
        this.terminationDate = terminationDate;
    }

    public void setStatus(EmployeeStatus status) {
        this.status = status;
    }

    public void setGatePassNo(String gatePassNo) {
        this.gatePassNo = gatePassNo;
    }

    public void setBillableStatus(String billableStatus) {
        this.billableStatus = billableStatus;
    }
}