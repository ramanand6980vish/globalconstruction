package com.globalconstruction.portal.company.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.globalconstruction.portal.common.id.IdGeneratorService;
import com.globalconstruction.portal.company.entity.Company;
import com.globalconstruction.portal.company.repository.CompanyRepository;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final IdGeneratorService idGeneratorService;

    public CompanyServiceImpl(
            CompanyRepository companyRepository,
            IdGeneratorService idGeneratorService) {

        this.companyRepository = companyRepository;
        this.idGeneratorService = idGeneratorService;
    }

    @Override
    @Transactional
    public Company createCompany(Company company) {

        if (company.getCompanyCode() == null
                || company.getCompanyCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Company code is required");
        }

        if (company.getCompanyName() == null
                || company.getCompanyName().trim().isEmpty()) {
            throw new IllegalArgumentException("Company name is required");
        }

        String companyCode = company.getCompanyCode().trim();

        if (companyRepository.existsByCompanyCode(companyCode)) {
            throw new IllegalArgumentException(
                    "Company code already exists: " + companyCode);
        }

        company.setCompanyId(idGeneratorService.generateId("COM"));
        company.setCompanyCode(companyCode);
        company.setCompanyName(company.getCompanyName().trim());

        if (company.getStatus() == null
                || company.getStatus().trim().isEmpty()) {
            company.setStatus("ACTIVE");
        }

        return companyRepository.save(company);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Company getCompanyById(String companyId) {

        return companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Company not found: " + companyId));
    }
}