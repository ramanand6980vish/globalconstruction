EmployeeResponse getById(String employeeId);

EmployeeResponse getByEmployeeCode(String employeeCode);

List<EmployeeResponse> getByCompany(String companyId);

List<EmployeeResponse> getByDepartment(String departmentId);

List<EmployeeResponse> getByDesignation(String designationId);

List<EmployeeResponse> getByStatus(EmployeeStatus status);
