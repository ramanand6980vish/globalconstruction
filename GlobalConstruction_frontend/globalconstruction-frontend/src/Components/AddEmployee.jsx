
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cssFiles/addEmployee.css";

const API_BASE_URL = "http://localhost:8081/api";
// const API_BASE_URL = "https://passivism-episode-richly.ngrok-free.dev/api";

// Change these paths if your Spring Boot controllers use different mappings.
const API = {
  employees: `${API_BASE_URL}/employees`,
  companies: `${API_BASE_URL}/companies`,
  departments: `${API_BASE_URL}/departments`,
  designations: `${API_BASE_URL}/designations`,
};

// Handles common API response formats:
// 1. [ {...}, {...} ]
// 2. { data: [ {...}, {...} ] }
// 3. { content: [ {...}, {...} ] }
function extractList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.items)) return response.items;
  return [];
}

function getId(item, candidates) {
  for (const key of candidates) {
    if (item?.[key] !== undefined && item?.[key] !== null) {
      return String(item[key]);
    }
  }
  return "";
}

function getLabel(item, candidates) {
  for (const key of candidates) {
    if (item?.[key]) return String(item[key]);
  }
  return "Unnamed";
}

function AddEmployee() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdEmployee, setCreatedEmployee] = useState(null);

  const [form, setForm] = useState({
    companyId: "",
    employeeCode: "",
    firstName: "",
    middleName: "",
    lastName: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    mobile: "",
    bloodGroup: "",
    departmentId: "",
    designationId: "",
    grade: "",
    joiningDate: "",
    terminationDate: "",
    gatePassNo: "",
    billableStatus: "",
    employeeStatus: "ACTIVE",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadDropdowns() {
      setLoadingDropdowns(true);
      setError("");

      try {
        const [companyResponse, departmentResponse, designationResponse] =
          await Promise.all([
            fetch(API.companies),
            fetch(API.departments),
            fetch(API.designations),
          ]);

        if (!companyResponse.ok) {
          throw new Error("Unable to load companies.");
        }

        if (!departmentResponse.ok) {
          throw new Error("Unable to load departments.");
        }

        if (!designationResponse.ok) {
          throw new Error("Unable to load designations.");
        }

        const [companyData, departmentData, designationData] =
          await Promise.all([
            companyResponse.json(),
            departmentResponse.json(),
            designationResponse.json(),
          ]);

        if (cancelled) return;

        setCompanies(extractList(companyData));
        setDepartments(extractList(departmentData));
        setDesignations(extractList(designationData));
      } catch (err) {
        if (!cancelled) {
          setError(
            `${err.message} Check the API URLs and ensure Spring Boot is running.`
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingDropdowns(false);
        }
      }
    }

    loadDropdowns();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
    setCreatedEmployee(null);
  }

  const filteredDepartments = departments.filter((department) => {
    const departmentCompanyId = getId(department, [
      "companyId",
      "company_id",
    ]);

    return (
      !departmentCompanyId ||
      departmentCompanyId === form.companyId
    );
  });

  const filteredDesignations = designations.filter((designation) => {
    const designationCompanyId = getId(designation, [
      "companyId",
      "company_id",
    ]);

    const designationDepartmentId = getId(designation, [
      "departmentId",
      "department_id",
    ]);

    const companyMatches =
      !designationCompanyId ||
      designationCompanyId === form.companyId;

    const departmentMatches =
      !designationDepartmentId ||
      !form.departmentId ||
      designationDepartmentId === form.departmentId;

    return companyMatches && departmentMatches;
  });

  function handleCompanyChange(event) {
    const companyId = event.target.value;

    setForm((previous) => ({
      ...previous,
      companyId,
      departmentId: "",
      designationId: "",
    }));

    setError("");
    setSuccess("");
    setCreatedEmployee(null);
  }

  function handleDepartmentChange(event) {
    const departmentId = event.target.value;

    setForm((previous) => ({
      ...previous,
      departmentId,
      designationId: "",
    }));

    setError("");
    setSuccess("");
    setCreatedEmployee(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setCreatedEmployee(null);

    if (!form.companyId) {
      setError("Please select a company.");
      return;
    }

    if (!form.employeeCode.trim()) {
      setError("Employee code is required.");
      return;
    }

    if (!form.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!form.joiningDate) {
      setError("Joining date is required.");
      return;
    }

    if (form.departmentId && !filteredDepartments.some(
      (department) =>
        getId(department, ["departmentId", "department_id", "id"]) ===
        form.departmentId
    )) {
      setError("Please select a valid department.");
      return;
    }

    if (form.designationId && !filteredDesignations.some(
      (designation) =>
        getId(designation, ["designationId", "designation_id", "id"]) ===
        form.designationId
    )) {
      setError("Please select a valid designation.");
      return;
    }

    const payload = {
      companyId: form.companyId,
      employeeCode: form.employeeCode.trim(),
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim() || null,
      lastName: form.lastName.trim() || null,
      fatherName: form.fatherName.trim() || null,
      dateOfBirth: form.dateOfBirth || null,
      gender: form.gender || null,
      maritalStatus: form.maritalStatus || null,
      mobile: form.mobile.trim() || null,
      bloodGroup: form.bloodGroup || null,
      departmentId: form.departmentId || null,
      designationId: form.designationId || null,
      grade: form.grade.trim() || null,
      joiningDate: form.joiningDate,
      terminationDate: form.terminationDate || null,
      gatePassNo: form.gatePassNo.trim() || null,
      billableStatus: form.billableStatus || null,
      employeeStatus: form.employeeStatus || "ACTIVE",
    };

    setSaving(true);

    try {
      const response = await fetch(API.employees, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      let responseData = {};

      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = { message: responseText };
        }
      }

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          responseData.error ||
          (Array.isArray(responseData.errors) ? responseData.errors.join(", ") : "") ||
          `Employee creation failed (HTTP ${response.status}).`
        );
      }

      setCreatedEmployee(responseData);
      setSuccess("Employee created successfully.");
    } catch (err) {
      setError(err.message || "Unable to create employee.");
    } finally {
      setSaving(false);
    }
  }

  function renderCompanyLabel(company) {
    return `${getLabel(company, [
      "companyName",
      "name",
      "company_name",
    ])} (${getId(company, ["companyId", "company_id", "id"])})`;
  }

  function renderDepartmentLabel(department) {
    return `${getLabel(department, [
      "departmentName",
      "name",
      "department_name",
    ])} (${getId(department, [
      "departmentId",
      "department_id",
      "id",
    ])})`;
  }

  function renderDesignationLabel(designation) {
    return `${getLabel(designation, [
      "designationName",
      "name",
      "designation_name",
    ])} (${getId(designation, [
      "designationId",
      "designation_id",
      "id",
    ])})`;
  }

  return (
    <div className="add-employee-page">
      <div className="add-employee-header">
        <div>
                <h1>Add New Employee</h1>
          <p className="add-employee-subtitle">
            Enter employee details.
          </p>
        </div>

        <button
          type="button"
          className="ae-back-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="ae-alert ae-alert-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="ae-alert ae-alert-success" role="status">
          {success}
        </div>
      )}

      {createdEmployee && (
        <div className="ae-created-card">
          <h2>Employee Created Successfully</h2>

          <div className="ae-generated-ids">
            <div>
              <span>Employee ID</span>
              <strong>
                {createdEmployee.employeeId || "Not returned by API"}
              </strong>
            </div>

            <div>
              <span>Employee Code</span>
              <strong>
                {createdEmployee.employeeCode || "Not returned by API"}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="ae-primary-button"
            onClick={() => navigate("/admin/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      )}

      <form className="ae-form" onSubmit={handleSubmit}>
        <section className="ae-section">
          <div className="ae-section-heading">
            <h2>Company & Employment</h2>
            <p>Select the company and employment details.</p>
          </div>

          <div className="ae-grid">
            <div className="ae-field">
              <label htmlFor="companyId">
                Company <span>*</span>
              </label>

              <select
                id="companyId"
                name="companyId"
                value={form.companyId}
                onChange={handleCompanyChange}
                required
                disabled={loadingDropdowns || saving}
              >
                <option value="">Select company</option>
                {companies.map((company) => {
                  const id = getId(company, [
                    "companyId",
                    "company_id",
                    "id",
                  ]);

                  return (
                    <option key={id} value={id}>
                      {renderCompanyLabel(company)}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="ae-field">
              <label htmlFor="departmentId">Department</label>

              <select
                id="departmentId"
                name="departmentId"
                value={form.departmentId}
                onChange={handleDepartmentChange}
                disabled={!form.companyId || loadingDropdowns || saving}
              >
                <option value="">Select department</option>
                {filteredDepartments.map((department) => {
                  const id = getId(department, [
                    "departmentId",
                    "department_id",
                    "id",
                  ]);

                  return (
                    <option key={id} value={id}>
                      {renderDepartmentLabel(department)}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="ae-field">
              <label htmlFor="designationId">Designation</label>

              <select
                id="designationId"
                name="designationId"
                value={form.designationId}
                onChange={handleChange}
                disabled={!form.companyId || loadingDropdowns || saving}
              >
                <option value="">Select designation</option>
                {filteredDesignations.map((designation) => {
                  const id = getId(designation, [
                    "designationId",
                    "designation_id",
                    "id",
                  ]);

                  return (
                    <option key={id} value={id}>
                      {renderDesignationLabel(designation)}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="ae-field">
              <label htmlFor="employeeCode">
                Employee Code <span>*</span>
              </label>
              <input
                id="employeeCode"
                name="employeeCode"
                value={form.employeeCode}
                onChange={handleChange}
                placeholder="e.g. EMP26-001"
                maxLength={50}
                required
                autoComplete="off"
              />
            </div>

            <div className="ae-field">
              <label htmlFor="grade">Grade</label>
              <input
                id="grade"
                name="grade"
                value={form.grade}
                onChange={handleChange}
                placeholder="e.g. G5"
                maxLength={30}
              />
            </div>

            <div className="ae-field">
              <label htmlFor="joiningDate">
                Joining Date <span>*</span>
              </label>
              <input
                id="joiningDate"
                name="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ae-field">
              <label htmlFor="terminationDate">Termination Date</label>
              <input
                id="terminationDate"
                name="terminationDate"
                type="date"
                value={form.terminationDate}
                onChange={handleChange}
              />
            </div>

            <div className="ae-field">
              <label htmlFor="employeeStatus">Employee Status</label>
              <select
                id="employeeStatus"
                name="employeeStatus"
                value={form.employeeStatus}
                onChange={handleChange}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>

            <div className="ae-field">
              <label htmlFor="billableStatus">Billable Status</label>
              <select
                id="billableStatus"
                name="billableStatus"
                value={form.billableStatus}
                onChange={handleChange}
              >
                <option value="">Select billable status</option>
                <option value="BILLABLE">Billable</option>
                <option value="NON_BILLABLE">Non-billable</option>
              </select>
            </div>

            <div className="ae-field">
              <label htmlFor="gatePassNo">Gate Pass Number</label>
              <input
                id="gatePassNo"
                name="gatePassNo"
                value={form.gatePassNo}
                onChange={handleChange}
                placeholder="Enter gate pass number"
                maxLength={50}
              />
            </div>
          </div>
        </section>

        <section className="ae-section">
          <div className="ae-section-heading">
            <h2>Personal Information</h2>
            <p>Enter the employee's personal details.</p>
          </div>

          <div className="ae-grid">
            <div className="ae-field">
              <label htmlFor="firstName">
                First Name <span>*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                maxLength={100}
                required
              />
            </div>

            <div className="ae-field">
              <label htmlFor="middleName">Middle Name</label>
              <input
                id="middleName"
                name="middleName"
                value={form.middleName}
                onChange={handleChange}
                placeholder="Enter middle name"
                maxLength={100}
              />
            </div>

            <div className="ae-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                maxLength={100}
              />
            </div>

            <div className="ae-field">
              <label htmlFor="fatherName">Father's Name</label>
              <input
                id="fatherName"
                name="fatherName"
                value={form.fatherName}
                onChange={handleChange}
                placeholder="Enter father's name"
                maxLength={150}
              />
            </div>

            <div className="ae-field">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="ae-field">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="ae-field">
              <label htmlFor="maritalStatus">Marital Status</label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={form.maritalStatus}
                onChange={handleChange}
              >
                <option value="">Select marital status</option>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
              </select>
            </div>

            <div className="ae-field">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                maxLength={20}
              />
            </div>

            <div className="ae-field">
              <label htmlFor="bloodGroup">Blood Group</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Select blood group</option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
              </select>
            </div>
          </div>
        </section>

        <div className="ae-form-actions">
          <button
            type="button"
            className="ae-secondary-button"
            onClick={() => navigate("/admin/dashboard")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="ae-primary-button"
            disabled={saving || loadingDropdowns}
          >
            {saving ? "Creating Employee..." : "Save Employee"}
          </button>
        </div>

        {loadingDropdowns && (
          <p className="ae-loading-message">
            Loading companies, departments, and designations...
          </p>
        )}
      </form>
    </div>
  );
}

export default AddEmployee;

