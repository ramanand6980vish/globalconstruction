 package com.globalconstruction.portal.employee.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @Column(name = "employee_id", length = 20, nullable = false)
    private String employeeId;

    @Column(name = "company_id", length = 20, nullable = false)
    private String companyId;

    @Column(name = "employee_code", length = 30, nullable = false, unique = true)
    private String employeeCode;

    @Column(name = "first_name", length = 100, nullable = false)
    private String firstName;

    @Column(name = "middle_name", length = 100)
    private String middleName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "father_name", length = 150)
    private String fatherName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 20)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "marital_status", length = 30)
    private MaritalStatus maritalStatus;

    @Column(name = "mobile_no", length = 20)
    private String mobileNo;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    @Column(name = "department_id", length = 20)
    private String departmentId;

    @Column(name = "designation_id", length = 20)
    private String designationId;

    @Column(name = "grade", length = 30)
    private String grade;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "termination_date")
    private LocalDate terminationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private EmployeeStatus status;

    @Column(name = "gate_pass_no", length = 50)
    private String gatePassNo;

    @Column(name = "billable_status", length = 30)
    private String billableStatus;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // PRE PERSIST
    @PrePersist
    public void prePersist() {

        if (status == null) {
            status = EmployeeStatus.ACTIVE;
        }

        LocalDateTime now = LocalDateTime.now();

        if (createdAt == null) {
            createdAt = now;
        }

        updatedAt = now;
    }

    // PRE UPDATE
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // GETTERS

    public String getEmployeeId() {
        return employeeId;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // SETTERS

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
 
