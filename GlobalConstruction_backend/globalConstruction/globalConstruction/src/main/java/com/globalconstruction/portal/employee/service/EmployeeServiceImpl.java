 package com.globalconstruction.portal.employee.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.globalconstruction.portal.common.id.IdGeneratorService;
import com.globalconstruction.portal.employee.dto.EmployeeRequest;
import com.globalconstruction.portal.employee.dto.EmployeeResponse;
import com.globalconstruction.portal.employee.entity.Employee;
import com.globalconstruction.portal.employee.entity.EmployeeStatus;
import com.globalconstruction.portal.employee.mapper.EmployeeMapper;
import com.globalconstruction.portal.employee.repository.EmployeeRepository;

@Service 
@Transactional 
public class EmployeeServiceImpl implements EmployeeService { 
	private final EmployeeRepository employeeRepository; 
	private final EmployeeMapper employeeMapper; 
	private final IdGeneratorService idGeneratorService; 
	
	public EmployeeServiceImpl( EmployeeRepository employeeRepository, EmployeeMapper employeeMapper, IdGeneratorService idGeneratorService) { 
		this.employeeRepository = employeeRepository; 
		this.employeeMapper = employeeMapper; 
		this.idGeneratorService = idGeneratorService; 
	}

    // CREATE EMPLOYEE
    @Override
    public EmployeeResponse create(EmployeeRequest request) {

        // Validate employee code
        if (request.getEmployeeCode() == null
                || request.getEmployeeCode().isBlank()) {
            throw new IllegalArgumentException(
                    "Employee code is required");
        }

        // Prevent duplicate employee codes
        if (employeeRepository.existsByEmployeeCode(
                request.getEmployeeCode())) {
            throw new IllegalArgumentException(
                    "Employee code already exists: "
                            + request.getEmployeeCode());
        }

        // Convert request to entity
        Employee employee = employeeMapper.toEntity(request);

        // Always generate employee ID on the backend
        employee.setEmployeeId(
                idGeneratorService.generateId("EMP"));

        // Set default status
        if (employee.getStatus() == null) {
            employee.setStatus(EmployeeStatus.ACTIVE);
        }

        // Save employee
        Employee savedEmployee =
                employeeRepository.save(employee);

        // Return response
        return employeeMapper.toResponse(savedEmployee);
    }

    // UPDATE EMPLOYEE
    @Override
    public EmployeeResponse update(
            String employeeId,
            EmployeeRequest request) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException(
                        "Employee not found: " + employeeId));

        // Prevent changing the primary ID
        String existingEmployeeId = employee.getEmployeeId();

        // Check employee-code uniqueness if the code changes
        if (request.getEmployeeCode() != null
                && !request.getEmployeeCode().equals(
                        employee.getEmployeeCode())
                && employeeRepository.existsByEmployeeCode(
                        request.getEmployeeCode())) {
            throw new IllegalArgumentException(
                    "Employee code already exists: "
                            + request.getEmployeeCode());
        }

        employeeMapper.updateEntity(employee, request);

        // Keep the original primary ID
        employee.setEmployeeId(existingEmployeeId);

        Employee updatedEmployee =
                employeeRepository.save(employee);

        return employeeMapper.toResponse(updatedEmployee);
    }

    // GET EMPLOYEE BY ID
    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getById(String employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException(
                        "Employee not found: " + employeeId));

        return employeeMapper.toResponse(employee);
    }

    // GET EMPLOYEE BY EMPLOYEE CODE
    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getByEmployeeCode(String employeeCode) {

        Employee employee = employeeRepository
                .findByEmployeeCode(employeeCode)
                .orElseThrow(() -> new RuntimeException(
                        "Employee not found with code: "
                                + employeeCode));

        return employeeMapper.toResponse(employee);
    }

    // GET ALL EMPLOYEES
    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAll() {

        return employeeRepository.findAll()
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    // GET EMPLOYEES BY COMPANY
    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getByCompany(String companyId) {

        return employeeRepository.findByCompanyId(companyId)
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    // GET EMPLOYEES BY DEPARTMENT
    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getByDepartment(
            String departmentId) {

        return employeeRepository.findByDepartmentId(departmentId)
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    // GET EMPLOYEES BY DESIGNATION
    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getByDesignation(
            String designationId) {

        return employeeRepository.findByDesignationId(designationId)
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    // GET EMPLOYEES BY STATUS
    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getByStatus(
            EmployeeStatus status) {

        return employeeRepository.findByStatus(status)
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    // DELETE EMPLOYEE
    @Override
    public void delete(String employeeId) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new RuntimeException(
                    "Employee not found: " + employeeId);
        }

        employeeRepository.deleteById(employeeId);
    }
}

