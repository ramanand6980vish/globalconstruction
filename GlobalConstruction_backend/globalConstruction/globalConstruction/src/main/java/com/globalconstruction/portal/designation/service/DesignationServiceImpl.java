package com.globalconstruction.portal.designation.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.globalconstruction.portal.common.id.IdGeneratorService;
import com.globalconstruction.portal.company.repository.CompanyRepository;
import com.globalconstruction.portal.designation.entity.Designation;
import com.globalconstruction.portal.designation.repository.DesignationRepository;

@Service
public class DesignationServiceImpl implements DesignationService {

    private final DesignationRepository designationRepository;
    private final CompanyRepository companyRepository;
    private final IdGeneratorService idGeneratorService;

    public DesignationServiceImpl(
            DesignationRepository designationRepository,
            CompanyRepository companyRepository,
            IdGeneratorService idGeneratorService) {

        this.designationRepository = designationRepository;
        this.companyRepository = companyRepository;
        this.idGeneratorService = idGeneratorService;
    }

    @Override
    @Transactional
    public Designation createDesignation(Designation designation) {

        if (designation.getCompanyId() == null
                || designation.getCompanyId().trim().isEmpty()) {
            throw new IllegalArgumentException("Company is required");
        }

        if (designation.getDesignationCode() == null
                || designation.getDesignationCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Designation code is required");
        }

        if (designation.getDesignationName() == null
                || designation.getDesignationName().trim().isEmpty()) {
            throw new IllegalArgumentException("Designation name is required");
        }

        String companyId = designation.getCompanyId().trim();
        String designationCode = designation.getDesignationCode().trim();

        if (!companyRepository.existsById(companyId)) {
            throw new IllegalArgumentException(
                    "Company not found: " + companyId);
        }

        if (designationRepository.existsByDesignationCode(designationCode)) {
            throw new IllegalArgumentException(
                    "Designation code already exists: " + designationCode);
        }

        designation.setDesignationId(idGeneratorService.generateId("DES"));
        designation.setCompanyId(companyId);
        designation.setDesignationCode(designationCode);
        designation.setDesignationName(
                designation.getDesignationName().trim());

        if (designation.getStatus() == null
                || designation.getStatus().trim().isEmpty()) {
            designation.setStatus("ACTIVE");
        }

        return designationRepository.save(designation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Designation> getAllDesignations() {
        return designationRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Designation getDesignationById(String designationId) {

        return designationRepository.findById(designationId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Designation not found: " + designationId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Designation> getDesignationsByCompany(String companyId) {

        if (!companyRepository.existsById(companyId)) {
            throw new IllegalArgumentException(
                    "Company not found: " + companyId);
        }

        return designationRepository.findByCompanyId(companyId);
    }
}