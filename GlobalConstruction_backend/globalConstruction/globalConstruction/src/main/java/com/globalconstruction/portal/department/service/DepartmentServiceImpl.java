package com.globalconstruction.portal.department.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.globalconstruction.portal.common.id.IdGeneratorService;
import com.globalconstruction.portal.company.repository.CompanyRepository;
import com.globalconstruction.portal.department.entity.Department;
import com.globalconstruction.portal.department.repository.DepartmentRepository;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;
    private final IdGeneratorService idGeneratorService;

    public DepartmentServiceImpl(
            DepartmentRepository departmentRepository,
            CompanyRepository companyRepository,
            IdGeneratorService idGeneratorService) {

        this.departmentRepository = departmentRepository;
        this.companyRepository = companyRepository;
        this.idGeneratorService = idGeneratorService;
    }

    @Override
    @Transactional
    public Department createDepartment(Department department) {

        if (department.getCompanyId() == null
                || department.getCompanyId().trim().isEmpty()) {
            throw new IllegalArgumentException("Company is required");
        }

        if (department.getDepartmentCode() == null
                || department.getDepartmentCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Department code is required");
        }

        if (department.getDepartmentName() == null
                || department.getDepartmentName().trim().isEmpty()) {
            throw new IllegalArgumentException("Department name is required");
        }

        String companyId = department.getCompanyId().trim();
        String departmentCode = department.getDepartmentCode().trim();

        if (!companyRepository.existsById(companyId)) {
            throw new IllegalArgumentException(
                    "Company not found: " + companyId);
        }

        if (departmentRepository.existsByDepartmentCode(departmentCode)) {
            throw new IllegalArgumentException(
                    "Department code already exists: " + departmentCode);
        }

        department.setDepartmentId(idGeneratorService.generateId("DEP"));
        department.setCompanyId(companyId);
        department.setDepartmentCode(departmentCode);
        department.setDepartmentName(
                department.getDepartmentName().trim());

        if (department.getStatus() == null
                || department.getStatus().trim().isEmpty()) {
            department.setStatus("ACTIVE");
        }

        return departmentRepository.save(department);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Department getDepartmentById(String departmentId) {

        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Department not found: " + departmentId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> getDepartmentsByCompany(String companyId) {

        if (!companyRepository.existsById(companyId)) {
            throw new IllegalArgumentException(
                    "Company not found: " + companyId);
        }

        return departmentRepository.findByCompanyId(companyId);
    }
}