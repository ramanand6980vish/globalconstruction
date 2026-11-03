
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cssFiles/createDesignation.css";

const DESIGNATION_API = "http://localhost:8081/api/designations";
const COMPANY_API = "http://localhost:8081/api/companies";

const initialForm = {
  companyId: "",
  designationCode: "",
  designationName: "",
  description: "",
  status: "ACTIVE",
};

export default function CreateDesignation() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [designations, setDesignations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setFetching(true);
    setError("");

    try {
      const [designationResponse, companyResponse] = await Promise.all([
        fetch(DESIGNATION_API),
        fetch(COMPANY_API),
      ]);

      if (!designationResponse.ok) {
        throw new Error("Unable to load designations.");
      }

      if (!companyResponse.ok) {
        throw new Error("Unable to load companies.");
      }

      const designationData = await designationResponse.json();
      const companyData = await companyResponse.json();

      setDesignations(
        Array.isArray(designationData) ? designationData : []
      );
      setCompanies(Array.isArray(companyData) ? companyData : []);
    } catch (err) {
      setError(err.message || "Unable to load data. Check your backend.");
    } finally {
      setFetching(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const payload = {
        companyId: form.companyId,
        designationCode: form.designationCode.trim(),
        designationName: form.designationName.trim(),
        description: form.description.trim(),
        status: form.status,
      };

      const response = await fetch(DESIGNATION_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          responseText || `Failed to create designation (${response.status}).`
        );
      }

      setMessage("Designation created successfully!");
      setForm(initialForm);
      await loadData();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const filteredDesignations = useMemo(() => {
    const query = search.toLowerCase().trim();

    return designations.filter((designation) =>
      [
        designation.designationId,
        designation.designationCode,
        designation.designationName,
        designation.companyId,
        designation.description,
        designation.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [designations, search]);

  function getCompanyName(companyId) {
    const company = companies.find(
      (item) => String(item.companyId) === String(companyId)
    );

    return company
      ? company.companyName
      : companyId || "—";
  }

  return (
    <main className="designation-page">
      <header className="designation-header">
        <div className="designation-heading">
          <div className="designation-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="10" cy="7" r="4" />
              <path d="M20 8v6M17 11h6" />
            </svg>
          </div>

          <div>
            <span className="designation-eyebrow">
              ORGANIZATION MANAGEMENT
            </span>
            <h1>Designation Management</h1>
            <p>Create and manage employee designations.</p>
          </div>
        </div>

        <button
          type="button"
          className="designation-back-button"
          onClick={() => navigate("/admin-dashboard")}
        >
          <span aria-hidden="true">←</span>
          Back to Admin Dashboard
        </button>
      </header>

      {message && (
        <div className="designation-alert success" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="designation-alert error" role="alert">
          {error}
        </div>
      )}

      <section className="designation-stats">
        <div className="designation-stat-card">
          <span className="stat-label">Total Designations</span>
          <strong>{designations.length}</strong>
          <span className="stat-description">All registered designations</span>
        </div>

        <div className="designation-stat-card">
          <span className="stat-label">Active Designations</span>
          <strong>
            {
              designations.filter(
                (item) => item.status?.toUpperCase() === "ACTIVE"
              ).length
            }
          </strong>
          <span className="stat-description">Currently active</span>
        </div>

        <div className="designation-stat-card">
          <span className="stat-label">Companies</span>
          <strong>{companies.length}</strong>
          <span className="stat-description">Available companies</span>
        </div>
      </section>

      <section className="designation-panel">
        <div className="designation-panel-heading">
          <div>
            <h2>Create New Designation</h2>
            <p>Enter the designation details below.</p>
          </div>
          <span className="designation-required">* Required fields</span>
        </div>

        <form onSubmit={handleSubmit} className="designation-form">
          <div className="designation-form-grid">
            <div className="designation-field">
              <label htmlFor="companyId">Company *</label>
              <select
                id="companyId"
                name="companyId"
                value={form.companyId}
                onChange={handleChange}
                required
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option
                    key={company.companyId}
                    value={company.companyId}
                  >
                    {company.companyName} ({company.companyId})
                  </option>
                ))}
              </select>
            </div>

            <div className="designation-field">
              <label htmlFor="designationCode">Designation Code *</label>
              <input
                id="designationCode"
                name="designationCode"
                type="text"
                value={form.designationCode}
                onChange={handleChange}
                placeholder="e.g. DES-MGR"
                maxLength={30}
                required
              />
            </div>

            <div className="designation-field">
              <label htmlFor="designationName">Designation Name *</label>
              <input
                id="designationName"
                name="designationName"
                type="text"
                value={form.designationName}
                onChange={handleChange}
                placeholder="e.g. Project Manager"
                maxLength={100}
                required
              />
            </div>

            <div className="designation-field">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="designation-field full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter a brief description of this designation"
                rows={4}
                maxLength={255}
              />
            </div>
          </div>

          <div className="designation-form-actions">
            <button
              type="button"
              className="designation-reset-button"
              onClick={() => {
                setForm(initialForm);
                setMessage("");
                setError("");
              }}
            >
              Reset
            </button>

            <button
              type="submit"
              className="designation-submit-button"
              disabled={loading || fetching || companies.length === 0}
            >
              {loading ? "Creating..." : "+ Create Designation"}
            </button>
          </div>
        </form>
      </section>

      <section className="designation-panel designation-list-panel">
        <div className="designation-panel-heading list-heading">
          <div>
            <h2>Existing Designations</h2>
            <p>View all designations registered in the system.</p>
          </div>

          <input
            className="designation-search"
            type="search"
            placeholder="Search designations..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search designations"
          />
        </div>

        <div className="designation-table-wrapper">
          <table className="designation-table">
            <thead>
              <tr>
                <th>Designation ID</th>
                <th>Code</th>
                <th>Designation Name</th>
                <th>Company</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan="6" className="designation-empty">
                    Loading designations...
                  </td>
                </tr>
              ) : filteredDesignations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="designation-empty">
                    No designations found.
                  </td>
                </tr>
              ) : (
                filteredDesignations.map((designation) => (
                  <tr key={designation.designationId}>
                    <td>{designation.designationId}</td>
                    <td>
                      <span className="designation-code">
                        {designation.designationCode}
                      </span>
                    </td>
                    <td className="designation-name-cell">
                      {designation.designationName}
                    </td>
                    <td>{getCompanyName(designation.companyId)}</td>
                    <td>{designation.description || "—"}</td>
                    <td>
                      <span
                        className={`designation-status ${
                          designation.status?.toUpperCase() === "ACTIVE"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {designation.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
