
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cssFiles/createCompany.css";

const API = "http://localhost:8081/api/companies";

const initialForm = {
    companyCode: "",
    companyName: "",
    legalName: "",
    contactPerson: "",
    mobileNo: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    gstin: "",
    pan: "",
    status: "ACTIVE",
};

const fields = [
    {
        name: "companyCode",
        label: "Company Code",
        required: true,
        placeholder: "e.g. GC001",
        section: "basic",
    },
    {
        name: "companyName",
        label: "Company Name",
        required: true,
        placeholder: "Enter company name",
        section: "basic",
    },
    {
        name: "legalName",
        label: "Legal Name",
        placeholder: "Enter registered legal name",
        section: "basic",
    },
    {
        name: "contactPerson",
        label: "Contact Person",
        placeholder: "Enter contact person's name",
        section: "contact",
    },
    {
        name: "mobileNo",
        label: "Mobile Number",
        placeholder: "Enter mobile number",
        section: "contact",
        type: "tel",
    },
    {
        name: "email",
        label: "Email Address",
        placeholder: "name@company.com",
        section: "contact",
        type: "email",
    },
    {
        name: "addressLine1",
        label: "Address Line 1",
        placeholder: "Building, street, or area",
        section: "address",
    },
    {
        name: "addressLine2",
        label: "Address Line 2",
        placeholder: "Landmark or additional address",
        section: "address",
    },
    {
        name: "city",
        label: "City",
        placeholder: "Enter city",
        section: "address",
    },
    {
        name: "state",
        label: "State",
        placeholder: "Enter state",
        section: "address",
    },
    {
        name: "pincode",
        label: "PIN Code",
        placeholder: "Enter PIN code",
        section: "address",
        type: "text",
    },
    {
        name: "gstin",
        label: "GSTIN",
        placeholder: "Enter GSTIN",
        section: "tax",
    },
    {
        name: "pan",
        label: "PAN",
        placeholder: "Enter PAN",
        section: "tax",
    },
];

function getCompanyStatus(status) {
    return String(status || "").toUpperCase();
}

export default function CreateCompany() {
    const [form, setForm] = useState({ ...initialForm });
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");

    const navigate = useNavigate();

    const loadCompanies = async () => {
        setLoadingCompanies(true);

        try {
            const response = await fetch(API);

            if (!response.ok) {
                throw new Error("Unable to load companies.");
            }

            const data = await response.json();
            setCompanies(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Unable to load companies.");
        } finally {
            setLoadingCompanies(false);
        }
    };

    useEffect(() => {
        loadCompanies();
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
            const response = await fetch(API, {
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
                    data.detail ||
                    "Company creation failed."
                );
            }

            setSuccess(
                `Company created successfully${data.companyId ? `. Company ID: ${data.companyId}` : "."
                }`
            );

            setForm({ ...initialForm });

            await loadCompanies();
        } catch (err) {
            setError(
                err.message ||
                "Unable to create company. Please check the server connection."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm({ ...initialForm });
        setError("");
        setSuccess("");
    };

    const filteredCompanies = useMemo(() => {
        const query = search.trim().toLowerCase();

        return companies.filter((company) => {
            const matchesSearch = [
                company.companyId,
                company.companyCode,
                company.companyName,
                company.city,
                company.state,
                company.contactPerson,
            ].some((value) =>
                String(value || "").toLowerCase().includes(query)
            );

            const status = getCompanyStatus(company.status);

            const matchesStatus =
                filterStatus === "ALL" || status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [companies, search, filterStatus]);

    const activeCompanies = companies.filter(
        (company) => getCompanyStatus(company.status) === "ACTIVE"
    ).length;

    const inactiveCompanies = companies.filter(
        (company) => getCompanyStatus(company.status) === "INACTIVE"
    ).length;

    return (
        <main className="company-page">
            {/* Page heading */}


            <header className="company-page-header">
                <div className="company-heading-content">
                    <div className="company-heading-icon" aria-hidden="true">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M3 21h18" />
                            <path d="M5 21V7l7-4 7 4v14" />
                            <path d="M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4" />
                        </svg>
                    </div>

                    <div>
                        <div className="company-eyebrow">
                            ORGANIZATION MANAGEMENT
                        </div>

                        <h1>Create Company</h1>

                        <p>
                            Register and manage companies within your organization.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="company-back-button"
                    onClick={() => navigate("/admin-dashboard")}
                >
                    <span aria-hidden="true">←</span>
                    Back to Admin Dashboard
                </button>
            </header>
            {/* Summary cards */}
            <section className="company-summary-grid">
                <article className="company-summary-card">
                    <div className="company-summary-top">
                        <span className="company-summary-label">
                            Total Companies
                        </span>
                        <span className="company-summary-icon company-icon-blue">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                                <path d="M9 10h1M14 10h1M9 14h1M14 14h1" />
                            </svg>
                        </span>
                    </div>
                    <div className="company-summary-value">
                        {companies.length}
                    </div>
                    <div className="company-summary-caption">
                        Registered in the system
                    </div>
                </article>

                <article className="company-summary-card">
                    <div className="company-summary-top">
                        <span className="company-summary-label">
                            Active Companies
                        </span>
                        <span className="company-summary-icon company-icon-green">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="m5 12 4 4L19 6" />
                                <circle cx="12" cy="12" r="9" />
                            </svg>
                        </span>
                    </div>
                    <div className="company-summary-value">
                        {activeCompanies}
                    </div>
                    <div className="company-summary-caption">
                        Currently active
                    </div>
                </article>

                <article className="company-summary-card">
                    <div className="company-summary-top">
                        <span className="company-summary-label">
                            Inactive Companies
                        </span>
                        <span className="company-summary-icon company-icon-orange">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <circle cx="12" cy="12" r="9" />
                                <path d="M8 12h8" />
                            </svg>
                        </span>
                    </div>
                    <div className="company-summary-value">
                        {inactiveCompanies}
                    </div>
                    <div className="company-summary-caption">
                        Currently inactive
                    </div>
                </article>
            </section>

            {/* Company form */}
            <section className="company-panel">
                <div className="company-panel-heading">
                    <div className="company-panel-heading-text">
                        <h2>Company Information</h2>
                        <p>
                            Enter the company details below. Fields marked with{" "}
                            <span className="company-required">*</span> are required.
                        </p>
                    </div>

                    <span className="company-form-step">
                        NEW REGISTRATION
                    </span>
                </div>

                {error && (
                    <div className="company-alert company-alert-error" role="alert">
                        <span className="company-alert-symbol">!</span>
                        <span>{error}</span>
                        <button
                            type="button"
                            className="company-alert-close"
                            aria-label="Dismiss error"
                            onClick={() => setError("")}
                        >
                            ×
                        </button>
                    </div>
                )}

                {success && (
                    <div
                        className="company-alert company-alert-success"
                        role="status"
                    >
                        <span className="company-alert-symbol">✓</span>
                        <span>{success}</span>
                        <button
                            type="button"
                            className="company-alert-close"
                            aria-label="Dismiss success message"
                            onClick={() => setSuccess("")}
                        >
                            ×
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Basic information */}
                    <div className="company-form-section">
                        <div className="company-section-title">
                            <span className="company-section-number">01</span>
                            <div>
                                <h3>Basic Information</h3>
                                <p>Company identity and registration name</p>
                            </div>
                        </div>

                        <div className="company-form-grid">
                            {fields
                                .filter((field) => field.section === "basic")
                                .map((field) => (
                                    <div
                                        className="company-field"
                                        key={field.name}
                                    >
                                        <label htmlFor={field.name}>
                                            {field.label}
                                            {field.required && (
                                                <span className="company-required"> *</span>
                                            )}
                                        </label>

                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type="text"
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            autoComplete="off"
                                        />
                                    </div>
                                ))}

                            <div className="company-field">
                                <label htmlFor="status">Company Status</label>
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
                        </div>
                    </div>

                    {/* Contact information */}
                    <div className="company-form-section">
                        <div className="company-section-title">
                            <span className="company-section-number">02</span>
                            <div>
                                <h3>Contact Information</h3>
                                <p>Primary company contact details</p>
                            </div>
                        </div>

                        <div className="company-form-grid">
                            {fields
                                .filter((field) => field.section === "contact")
                                .map((field) => (
                                    <div
                                        className="company-field"
                                        key={field.name}
                                    >
                                        <label htmlFor={field.name}>
                                            {field.label}
                                        </label>

                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type={field.type || "text"}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            autoComplete="off"
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Address information */}
                    <div className="company-form-section">
                        <div className="company-section-title">
                            <span className="company-section-number">03</span>
                            <div>
                                <h3>Registered Address</h3>
                                <p>Official company location and address</p>
                            </div>
                        </div>

                        <div className="company-form-grid">
                            {fields
                                .filter(
                                    (field) =>
                                        field.section === "address" &&
                                        field.name !== "addressLine1" &&
                                        field.name !== "addressLine2"
                                )
                                .map((field) => (
                                    <div
                                        className="company-field"
                                        key={field.name}
                                    >
                                        <label htmlFor={field.name}>
                                            {field.label}
                                        </label>

                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type={field.type || "text"}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            autoComplete="off"
                                        />
                                    </div>
                                ))}

                            {fields
                                .filter(
                                    (field) =>
                                        field.name === "addressLine1" ||
                                        field.name === "addressLine2"
                                )
                                .map((field) => (
                                    <div
                                        className="company-field company-field-full"
                                        key={field.name}
                                    >
                                        <label htmlFor={field.name}>
                                            {field.label}
                                        </label>

                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type="text"
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            autoComplete="off"
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Tax information */}
                    <div className="company-form-section">
                        <div className="company-section-title">
                            <span className="company-section-number">04</span>
                            <div>
                                <h3>Tax & Compliance</h3>
                                <p>Business tax registration details</p>
                            </div>
                        </div>

                        <div className="company-form-grid">
                            {fields
                                .filter((field) => field.section === "tax")
                                .map((field) => (
                                    <div
                                        className="company-field"
                                        key={field.name}
                                    >
                                        <label htmlFor={field.name}>
                                            {field.label}
                                        </label>

                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type="text"
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            autoComplete="off"
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Form actions */}
                    <div className="company-form-footer">
                        <p className="company-footer-note">
                            Please review the company information before saving.
                        </p>

                        <div className="company-form-actions">
                            <button
                                type="button"
                                className="company-btn company-btn-secondary"
                                onClick={handleReset}
                                disabled={loading}
                            >
                                Reset Form
                            </button>

                            <button
                                type="submit"
                                className="company-btn company-btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="company-spinner" />
                                        Saving Company...
                                    </>
                                ) : (
                                    <>
                                        <span className="company-btn-plus">+</span>
                                        Create Company
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </section>

            {/* Existing companies */}
            <section className="company-panel company-list-panel">
                <div className="company-panel-heading company-list-heading">
                    <div className="company-panel-heading-text">
                        <h2>Registered Companies</h2>
                        <p>
                            View and search companies registered in the system.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="company-btn company-btn-outline"
                        onClick={loadCompanies}
                        disabled={loadingCompanies}
                    >
                        <span className={loadingCompanies ? "company-refresh-spin" : ""}>
                            ↻
                        </span>
                        {loadingCompanies ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                <div className="company-table-toolbar">
                    <div className="company-search-box">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m16 16 4 4" />
                        </svg>

                        <input
                            type="search"
                            placeholder="Search company, code, city..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            aria-label="Search companies"
                        />
                    </div>

                    <select
                        className="company-status-filter"
                        value={filterStatus}
                        onChange={(event) => setFilterStatus(event.target.value)}
                        aria-label="Filter companies by status"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>

                    <span className="company-result-count">
                        {filteredCompanies.length}{" "}
                        {filteredCompanies.length === 1 ? "company" : "companies"}
                    </span>
                </div>

                <div className="company-table-wrapper">
                    <table className="company-table">
                        <thead>
                            <tr>
                                <th>Company ID</th>
                                <th>Company Details</th>
                                <th>City</th>
                                <th>Contact Person</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loadingCompanies ? (
                                <tr>
                                    <td colSpan="5" className="company-table-message">
                                        <span className="company-spinner company-spinner-dark" />
                                        Loading registered companies...
                                    </td>
                                </tr>
                            ) : filteredCompanies.length > 0 ? (
                                filteredCompanies.map((company) => (
                                    <tr key={company.companyId}>
                                        <td>
                                            <span className="company-id">
                                                {company.companyId || "-"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="company-table-name">
                                                <span className="company-avatar">
                                                    {(
                                                        company.companyName ||
                                                        company.companyCode ||
                                                        "C"
                                                    )
                                                        .trim()
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>

                                                <div>
                                                    <strong>
                                                        {company.companyName || "-"}
                                                    </strong>
                                                    <span>
                                                        {company.companyCode || "No code"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>{company.city || "-"}</td>

                                        <td>{company.contactPerson || "-"}</td>

                                        <td>
                                            <span
                                                className={`company-status-badge ${getCompanyStatus(company.status) === "ACTIVE"
                                                        ? "company-status-active"
                                                        : "company-status-inactive"
                                                    }`}
                                            >
                                                <span className="company-status-dot" />
                                                {company.status || "UNKNOWN"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="company-table-message">
                                        <div className="company-empty-state">
                                            <span className="company-empty-icon">⌕</span>
                                            <strong>No companies found</strong>
                                            <p>
                                                {search || filterStatus !== "ALL"
                                                    ? "Try changing your search or status filter."
                                                    : "Create your first company using the form above."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="company-table-footer">
                    Showing {filteredCompanies.length} of {companies.length} companies
                </div>
            </section>

            <footer className="company-page-footer">
                Company Management <span>•</span> GlobalConstruction Portal
            </footer>
        </main>
    );
}

