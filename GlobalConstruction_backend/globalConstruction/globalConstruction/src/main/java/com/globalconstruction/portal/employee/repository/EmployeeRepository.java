package com.globalconstruction.portal.employee.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.globalconstruction.portal.employee.entity.Employee;
import com.globalconstruction.portal.employee.entity.EmployeeStatus;

public interface EmployeeRepository
        extends JpaRepository<Employee, String> {

    boolean existsByEmployeeCode(
            String employeeCode);

    Optional<Employee> findByEmployeeCode(
            String employeeCode);

    List<Employee> findByCompanyId(
            String companyId);

    List<Employee> findByDepartmentId(
    		String departmentId);

    List<Employee> findByDesignationId(
    		String designationId);

    List<Employee> findByStatus(
            EmployeeStatus status);
}