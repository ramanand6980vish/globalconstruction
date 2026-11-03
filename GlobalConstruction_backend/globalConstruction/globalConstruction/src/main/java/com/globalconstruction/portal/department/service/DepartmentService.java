package com.globalconstruction.portal.department.service;

import java.util.List;

import com.globalconstruction.portal.department.entity.Department;

public interface DepartmentService {

    Department createDepartment(Department department);

    List<Department> getAllDepartments();

    Department getDepartmentById(String departmentId);

    List<Department> getDepartmentsByCompany(String companyId);
}