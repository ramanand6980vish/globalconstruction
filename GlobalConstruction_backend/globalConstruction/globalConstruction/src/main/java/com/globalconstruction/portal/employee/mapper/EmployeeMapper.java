package com.globalconstruction.portal.employee.mapper;

import org.springframework.stereotype.Component;

import com.globalconstruction.portal.employee.dto.EmployeeRequest;
import com.globalconstruction.portal.employee.dto.EmployeeResponse;
import com.globalconstruction.portal.employee.entity.Employee;
import com.globalconstruction.portal.employee.entity.EmployeeStatus;

@Component
public class EmployeeMapper {

	public Employee toEntity(EmployeeRequest request) {

		Employee employee = new Employee();

		employee.setCompanyId(request.getCompanyId());

		employee.setEmployeeCode(request.getEmployeeCode());

		employee.setFirstName(request.getFirstName());

		employee.setMiddleName(request.getMiddleName());

		employee.setLastName(request.getLastName());

		employee.setFatherName(request.getFatherName());

		employee.setDateOfBirth(request.getDateOfBirth());

		employee.setGender(request.getGender());

		employee.setMaritalStatus(request.getMaritalStatus());

		employee.setMobileNo(request.getMobileNo());

		employee.setBloodGroup(request.getBloodGroup());

		employee.setDepartmentId(request.getDepartmentId());

		employee.setDesignationId(request.getDesignationId());

		employee.setGrade(request.getGrade());

		employee.setJoiningDate(request.getJoiningDate());

		employee.setTerminationDate(request.getTerminationDate());

		employee.setStatus(request.getStatus() == null ? EmployeeStatus.ACTIVE : request.getStatus());

		employee.setGatePassNo(request.getGatePassNo());

		employee.setBillableStatus(request.getBillableStatus());

		return employee;
	}

	public void updateEntity(Employee employee, EmployeeRequest request) {

		employee.setCompanyId(request.getCompanyId());

		/*
		 * Employee code is intentionally not updated. It should remain unique and
		 * stable.
		 */

		employee.setFirstName(request.getFirstName());

		employee.setMiddleName(request.getMiddleName());

		employee.setLastName(request.getLastName());

		employee.setFatherName(request.getFatherName());

		employee.setDateOfBirth(request.getDateOfBirth());

		employee.setGender(request.getGender());

		employee.setMaritalStatus(request.getMaritalStatus());

		employee.setMobileNo(request.getMobileNo());

		employee.setBloodGroup(request.getBloodGroup());

		employee.setDepartmentId(request.getDepartmentId());

		employee.setDesignationId(request.getDesignationId());

		employee.setGrade(request.getGrade());

		employee.setJoiningDate(request.getJoiningDate());

		employee.setTerminationDate(request.getTerminationDate());

		if (request.getStatus() != null) {
			employee.setStatus(request.getStatus());
		}

		employee.setGatePassNo(request.getGatePassNo());

		employee.setBillableStatus(request.getBillableStatus());
	}

	public EmployeeResponse toResponse(Employee employee) {

		EmployeeResponse response = new EmployeeResponse();

		response.setEmployeeId(employee.getEmployeeId());

		response.setCompanyId(employee.getCompanyId());

		response.setEmployeeCode(employee.getEmployeeCode());

		response.setFirstName(employee.getFirstName());

		response.setMiddleName(employee.getMiddleName());

		response.setLastName(employee.getLastName());

		response.setFatherName(employee.getFatherName());

		response.setDateOfBirth(employee.getDateOfBirth());

		response.setGender(employee.getGender());

		response.setMaritalStatus(employee.getMaritalStatus());

		response.setMobileNo(employee.getMobileNo());

		response.setBloodGroup(employee.getBloodGroup());

		response.setDepartmentId(employee.getDepartmentId());

		response.setDesignationId(employee.getDesignationId());

		response.setGrade(employee.getGrade());

		response.setJoiningDate(employee.getJoiningDate());

		response.setTerminationDate(employee.getTerminationDate());

		response.setStatus(employee.getStatus());

		response.setGatePassNo(employee.getGatePassNo());

		response.setBillableStatus(employee.getBillableStatus());

		response.setCreatedAt(employee.getCreatedAt());

		response.setUpdatedAt(employee.getUpdatedAt());

		return response;
	}
}