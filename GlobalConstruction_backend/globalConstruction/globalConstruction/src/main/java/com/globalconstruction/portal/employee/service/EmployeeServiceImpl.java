
package com.globalconstruction.portal.employee.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            EmployeeMapper employeeMapper,
            IdGeneratorService idGeneratorService) {

        this.employeeRepository = employeeRepository;
        this.employeeMapper = employeeMapper;
        this.idGeneratorService = idGeneratorService;
    }

    // CREATE EMPLOYEE
    @Override
    public EmployeeResponse create(EmployeeRequest request) {

        if (request.getEmployeeCode() == null
                || request.getEmployeeCode().isBlank()) {
            throw new IllegalArgumentException("Employee code is required");
        }

        if (employeeRepository.existsByEmployeeCode(
                request.getEmployeeCode())) {
            throw new IllegalArgumentException(
                    "Employee code already exists: "
                            + request.getEmployeeCode());
        }

        Employee employee = employeeMapper.toEntity(request);

        // Generate employee ID on backend
        employee.setEmployeeId(idGeneratorService.generateId("EMP"));

        if (employee.getStatus() == null) {
            employee.setStatus(EmployeeStatus.ACTIVE);
        }

        Employee savedEmployee = employeeRepository.save(employee);

        return employeeMapper.toResponse(savedEmployee);
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

    // UPDATE EMPLOYEE
    @Override
    public EmployeeResponse update(
            String employeeId,
            EmployeeRequest request) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException(
                        "Employee not found: " + employeeId));

        String existingEmployeeId = employee.getEmployeeId();

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

        // Preserve original employee ID
        employee.setEmployeeId(existingEmployeeId);

        Employee updatedEmployee = employeeRepository.save(employee);

        return employeeMapper.toResponse(updatedEmployee);
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
