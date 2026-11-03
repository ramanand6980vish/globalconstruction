
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cssFiles/createDepartment.css";

const DEPARTMENT_API = "http://localhost:8081/api/departments";
const COMPANY_API = "http://localhost:8081/api/companies";

const initialForm = {
  departmentCode: "",
  departmentName: "",
  companyId: "",
  description: "",
  status: "ACTIVE",
};

export default function CreateDepartment() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...initialForm });
  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoadingData(true);
    setError("");

    try {
      const [departmentResponse, companyResponse] = await Promise.all([
        fetch(DEPARTMENT_API),
        fetch(COMPANY_API),
      ]);

      if (!departmentResponse.ok) {
        throw new Error("Unable to load departments.");
      }

      if (!companyResponse.ok) {
        throw new Error("Unable to load companies.");
      }

      const departmentData = await departmentResponse.json();
      const companyData = await companyResponse.json();

      setDepartments(
        Array.isArray(departmentData) ? departmentData : []
      );

      setCompanies(
        Array.isArray(companyData) ? companyData : []
      );
    } catch (err) {
      setError(err.message || "Unable to load department data.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(DEPARTMENT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const text = await response.text();

      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Department creation failed."
        );
      }

      setSuccess(
        `Department created successfully${
          data.departmentId
            ? `. Department ID: ${data.departmentId}`
            : "."
        }`
      );

      setForm({ ...initialForm });
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to create department.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return departments.filter((department) => {
      const company = companies.find(
        (item) => item.companyId === department.companyId
      );

      const searchableValues = [
        department.departmentId,
        department.departmentCode,
        department.departmentName,
        department.description,
        company?.companyName,
      ];

      return searchableValues.some((value) =>
        String(value || "").toLowerCase().includes(query)
      );
    });
  }, [departments, companies, search]);

  const activeCount = departments.filter(
    (department) =>
      String(department.status || "").toUpperCase() === "ACTIVE"
  ).length;

  return (
    <main className="department-page">
      <header className="department-page-header">
        <div className="department-heading-content">
          <div className="department-heading-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="3" width="8" height="8" rx="2" />
              <rect x="13" y="3" width="8" height="8" rx="2" />
              <rect x="3" y="13" width="8" height="8" rx="2" />
              <rect x="13" y="13" width="8" height="8" rx="2" />
            </svg>
          </div>

          <div>
            <div className="department-eyebrow">
              ORGANIZATION MANAGEMENT
            </div>
            <h1>Create Department</h1>
            <p>
              Organize company operations into departments.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="department-back-button"
          onClick={() => navigate("/admin-dashboard")}
        >
          <span>←</span>
          Back to Admin Dashboard
        </button>
      </header>

      <section className="department-summary-grid">
        <article className="department-summary-card">
          <span>Total Departments</span>
          <strong>{departments.length}</strong>
          <small>Registered departments</small>
        </article>

        <article className="department-summary-card">
          <span>Active Departments</span>
          <strong>{activeCount}</strong>
          <small>Currently active</small>
        </article>

        <article className="department-summary-card">
          <span>Companies</span>
          <strong>{companies.length}</strong>
          <small>Available for assignment</small>
        </article>
      </section>

      <section className="department-panel">
        <div className="department-panel-heading">
          <div>
            <h2>Department Information</h2>
            <p>
              Complete the form to register a department.
              Fields marked with <span>*</span> are required.
            </p>
          </div>

          <span className="department-form-tag">
            NEW REGISTRATION
          </span>
        </div>

        {error && (
          <div className="department-alert department-alert-error">
            {error}
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="department-alert department-alert-success">
            {success}
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="department-form-grid">
            <div className="department-field">
              <label htmlFor="departmentCode">
                Department Code <span>*</span>
              </label>
              <input
                id="departmentCode"
                name="departmentCode"
                value={form.departmentCode}
                onChange={handleChange}
                placeholder="e.g. DEP001"
                required
              />
            </div>

            <div className="department-field">
              <label htmlFor="departmentName">
                Department Name <span>*</span>
              </label>
              <input
                id="departmentName"
                name="departmentName"
                value={form.departmentName}
                onChange={handleChange}
                placeholder="e.g. Human Resources"
                required
              />
            </div>

            <div className="department-field">
              <label htmlFor="companyId">
                Company <span>*</span>
              </label>
              <select
                id="companyId"
                name="companyId"
                value={form.companyId}
                onChange={handleChange}
                required
              >
                <option value="">Select a company</option>

                {companies.map((company) => (
                  <option
                    key={company.companyId}
                    value={company.companyId}
                  >
                    {company.companyName} (
                    {company.companyCode || company.companyId})
                  </option>
                ))}
              </select>
            </div>

            <div className="department-field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="department-field department-field-full">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the department's responsibilities..."
                rows="4"
              />
            </div>
          </div>

          <div className="department-form-footer">
            <p>Review the details before creating the department.</p>

            <div className="department-form-actions">
              <button
                type="button"
                className="department-btn department-btn-secondary"
                onClick={() => {
                  setForm({ ...initialForm });
                  setError("");
                  setSuccess("");
                }}
                disabled={loading}
              >
                Reset Form
              </button>

              <button
                type="submit"
                className="department-btn department-btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "+ Create Department"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="department-panel">
        <div className="department-panel-heading">
          <div>
            <h2>Registered Departments</h2>
            <p>Review departments currently in the system.</p>
          </div>

          <button
            type="button"
            className="department-btn department-btn-secondary"
            onClick={loadData}
            disabled={loadingData}
          >
            {loadingData ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        <div className="department-search-row">
          <input
            type="search"
            placeholder="Search departments..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search departments"
          />
          <span>{filteredDepartments.length} results</span>
        </div>

        <div className="department-table-wrapper">
          <table className="department-table">
            <thead>
              <tr>
                <th>Department ID</th>
                <th>Department</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loadingData ? (
                <tr>
                  <td colSpan="4" className="department-empty-cell">
                    Loading departments...
                  </td>
                </tr>
              ) : filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => {
                  const company = companies.find(
                    (item) =>
                      item.companyId === department.companyId
                  );

                  const active =
                    String(department.status || "").toUpperCase() ===
                    "ACTIVE";

                  return (
                    <tr key={department.departmentId}>
                      <td>{department.departmentId || "-"}</td>
                      <td>
                        <div className="department-name-cell">
                          <strong>
                            {department.departmentName || "-"}
                          </strong>
                          <span>
                            {department.departmentCode || "-"}
                          </span>
                        </div>
                      </td>
                      <td>
                        {company?.companyName ||
                          department.companyId ||
                          "-"}
                      </td>
                      <td>
                        <span
                          className={`department-status ${
                            active
                              ? "department-status-active"
                              : "department-status-inactive"
                          }`}
                        >
                          {department.status || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="department-empty-cell">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="department-page-footer">
        Department Management • GlobalConstruction Portal
      </footer>
    </main>
  );
}
