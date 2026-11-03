
package com.globalconstruction.portal.company.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.globalconstruction.portal.company.entity.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, String> {

    boolean existsByCompanyCode(String companyCode);

    Optional<Company> findByCompanyCode(String companyCode);

    List<Company> findByStatus(String status);

    List<Company> findByCompanyNameContainingIgnoreCase(String companyName);
}
