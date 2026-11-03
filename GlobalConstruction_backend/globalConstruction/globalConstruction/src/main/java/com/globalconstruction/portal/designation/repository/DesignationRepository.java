
package com.globalconstruction.portal.designation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.globalconstruction.portal.designation.entity.Designation;

@Repository
public interface DesignationRepository
        extends JpaRepository<Designation, String> {

    boolean existsByDesignationCode(String designationCode);

    Optional<Designation> findByDesignationCode(String designationCode);

    List<Designation> findByStatus(String status);

    List<Designation> findByCompanyId(String companyId);

    List<Designation> findByCompanyIdAndStatus(
            String companyId, String status);

    List<Designation> findByDesignationNameContainingIgnoreCase(
            String designationName);
}

