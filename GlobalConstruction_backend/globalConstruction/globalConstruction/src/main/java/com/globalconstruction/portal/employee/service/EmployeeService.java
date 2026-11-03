package com.globalconstruction.portal.employee.service;

import java.util.List;
import java.util.UUID;

import com.globalconstruction.portal.employee.dto.EmployeeRequest;
import com.globalconstruction.portal.employee.dto.EmployeeResponse;
import com.globalconstruction.portal.employee.entity.EmployeeStatus;

public interface EmployeeService {

	EmployeeResponse create(EmployeeRequest request);

	EmployeeResponse update(String employeeId, EmployeeRequest request);

	EmployeeResponse getById(String employeeId);

	EmployeeResponse getByEmployeeCode(String employeeCode);

	List<EmployeeResponse> getAll();

	List<EmployeeResponse> getByCompany(String companyId);

	List<EmployeeResponse> getByDepartment(String departmentId);

	List<EmployeeResponse> getByDesignation(String designationId);

	List<EmployeeResponse> getByStatus(EmployeeStatus status);

	void delete(String employeeId);
}