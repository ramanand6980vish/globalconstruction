package com.globalconstruction.portal.site.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.globalconstruction.portal.site.entity.Site;

@Repository
public interface SiteRepository extends JpaRepository<Site, String> {

    Optional<Site> findBySiteCode(String siteCode);

    List<Site> findByCompanyId(String companyId);

    List<Site> findByClientId(String clientId);

    List<Site> findByStatusIgnoreCase(String status);
}