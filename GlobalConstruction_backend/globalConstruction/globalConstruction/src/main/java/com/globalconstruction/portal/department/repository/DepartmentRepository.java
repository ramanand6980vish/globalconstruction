
package com.globalconstruction.portal.department.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.globalconstruction.portal.department.entity.Department;

@Repository
public interface DepartmentRepository
        extends JpaRepository<Department, String> {

    boolean existsByDepartmentCode(String departmentCode);

    Optional<Department> findByDepartmentCode(String departmentCode);

    List<Department> findByStatus(String status);

    List<Department> findByCompanyId(String companyId);

    List<Department> findByCompanyIdAndStatus(
            String companyId, String status);

    List<Department> findByDepartmentNameContainingIgnoreCase(
            String departmentName);
}

