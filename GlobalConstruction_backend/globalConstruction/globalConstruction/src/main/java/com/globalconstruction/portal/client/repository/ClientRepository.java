package com.globalconstruction.portal.client.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.globalconstruction.portal.client.entity.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, String> {

    Optional<Client> findByClientCode(String clientCode);

    List<Client> findByCompanyId(String companyId);

    List<Client> findByStatusIgnoreCase(String status);
}