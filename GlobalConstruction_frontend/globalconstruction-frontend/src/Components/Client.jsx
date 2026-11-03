import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cssFiles/client.css";

const API_URL = "http://localhost:8081/api/clients";
const COMPANY_API = "http://localhost:8081/api/companies";

const emptyForm = {
  companyId: "",
  clientCode: "",
  clientName: "",
  contactPerson: "",
  mobileNo: "",
  email: "",
  address: "",
  gstin: "",
  status: "ACTIVE",
};

function getErrorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback;
}

// Supports array, Spring Page.content, and wrapped response formats.
function extractRows(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.records)) return data.records;
  return [];
}

function getCompanyId(company) {
  return company?.companyId ?? company?.company_id ?? company?.id ?? "";
}

function getCompanyName(company) {
  return (
    company?.companyName ??
    company?.company_name ??
    company?.name ??
    getCompanyId(company)
  );
}

function Client() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadClients = useCallback(async () => {
    const response = await fetch(API_URL, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Unable to load clients (${response.status}).`);
    }

    const data = await response.json();
    setClients(extractRows(data));
  }, []);

  const loadCompanies = useCallback(async () => {
    const response = await fetch(COMPANY_API, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Unable to load companies (${response.status}).`);
    }

    const data = await response.json();
    const rows = extractRows(data);

    // Normalize company IDs so the dropdown sends the actual DB company_id.
    const normalizedCompanies = rows
      .map((company) => ({
        ...company,
        companyId: String(getCompanyId(company)).trim(),
        companyName: getCompanyName(company),
      }))
      .filter((company) => company.companyId);

    setCompanies(normalizedCompanies);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        loadClients(),
        loadCompanies(),
      ]);

      if (results[0].status === "rejected") {
        throw results[0].reason;
      }

      if (results[1].status === "rejected") {
        setError(
          "Clients loaded, but companies could not be loaded. Check GET /api/companies and refresh. Client creation is disabled until companies load."
        );
      }
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load client records."));
    } finally {
      setLoading(false);
    }
  }, [loadClients, loadCompanies]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.companyId.trim()) {
      setError("Please select a company.");
      return;
    }

    // Prevent arbitrary Company IDs that violate fk_client_company.
    const selectedCompanyExists = companies.some(
      (company) =>
        String(company.companyId).trim() === form.companyId.trim()
    );

    if (!selectedCompanyExists) {
      setError(
        "The selected Company ID is not in the loaded company list. Refresh companies and select an existing company."
      );
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      companyId: form.companyId.trim(),
      clientCode: form.clientCode.trim(),
      clientName: form.clientName.trim(),
      contactPerson: form.contactPerson.trim() || null,
      mobileNo: form.mobileNo.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      gstin: form.gstin.trim() || null,
      status: form.status,
    };

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);

        throw new Error(
          body?.detail ||
            body?.message ||
            body?.error ||
            `Request failed (${response.status}).`
        );
      }

      setMessage(
        editingId
          ? "Client updated successfully."
          : "Client created successfully."
      );

      resetForm();
      await loadClients();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to save client."));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (client) => {
    setEditingId(client.clientId);

    setForm({
      companyId: client.companyId || "",
      clientCode: client.clientCode || "",
      clientName: client.clientName || "",
      contactPerson: client.contactPerson || "",
      mobileNo: client.mobileNo || "",
      email: client.email || "",
      address: client.address || "",
      gstin: client.gstin || "",
      status: client.status || "ACTIVE",
    });

    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (client) => {
    const confirmed = window.confirm(
      `Delete client "${client.clientName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${client.clientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Unable to delete client (${response.status}). It may be referenced by another record.`
        );
      }

      setMessage("Client deleted successfully.");

      if (editingId === client.clientId) {
        resetForm();
      }

      await loadClients();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete client."));
    }
  };

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesSearch = [
        client.clientCode,
        client.clientName,
        client.contactPerson,
        client.mobileNo,
        client.email,
        client.gstin,
        client.companyId,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "ALL" ||
        (client.status || "").toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const activeCount = clients.filter(
    (client) => (client.status || "").toUpperCase() === "ACTIVE"
  ).length;

  const inactiveCount = clients.filter(
    (client) => (client.status || "").toUpperCase() !== "ACTIVE"
  ).length;

  return (
    <main className="client-page">
      <header className="client-header">
        <div>
          <p className="client-eyebrow">GLOBALCONSTRUCTION / MANAGEMENT</p>
          <h1>Client Management</h1>
          <p className="client-subtitle">
            Manage client information and the companies they belong to.
          </p>
        </div>

        <button
          type="button"
          className="client-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </header>

      {error && (
        <div className="client-alert client-alert-error" role="alert">
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

      {message && (
        <div className="client-alert client-alert-success" role="status">
          {message}
          <button
            type="button"
            onClick={() => setMessage("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <section className="client-stats">
        <article className="client-stat-card">
          <span className="client-stat-icon">▤</span>
          <div>
            <p>Total clients</p>
            <strong>{clients.length}</strong>
          </div>
        </article>

        <article className="client-stat-card">
          <span className="client-stat-icon client-icon-active">✓</span>
          <div>
            <p>Active clients</p>
            <strong>{activeCount}</strong>
          </div>
        </article>

        <article className="client-stat-card">
          <span className="client-stat-icon client-icon-inactive">○</span>
          <div>
            <p>Other statuses</p>
            <strong>{inactiveCount}</strong>
          </div>
        </article>
      </section>

      <section className="client-panel">
        <div className="client-panel-heading">
          <div>
            <h2>{editingId ? "Edit client" : "Register a client"}</h2>
            <p>
              {editingId
                ? "Update the selected client's information."
                : "Enter the client details below."}
            </p>
          </div>

          <span className="client-form-badge">
            {editingId ? "EDIT RECORD" : "NEW RECORD"}
          </span>
        </div>

        <form className="client-form" onSubmit={handleSubmit}>
          <div className="client-field">
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
                  {company.companyName || company.companyId} (
                  {company.companyId})
                </option>
              ))}
            </select>

            {companies.length === 0 && (
              <small className="client-company-warning">
                No companies loaded. Create a company first or check GET
                /api/companies, then click Refresh. You cannot submit a client
                without selecting an existing company.
              </small>
            )}
          </div>

          <div className="client-field">
            <label htmlFor="clientCode">Client code *</label>
            <input
              id="clientCode"
              name="clientCode"
              value={form.clientCode}
              onChange={handleChange}
              maxLength={30}
              placeholder="e.g. CLI-001"
              required
            />
          </div>

          <div className="client-field">
            <label htmlFor="clientName">Client name *</label>
            <input
              id="clientName"
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              maxLength={200}
              placeholder="Enter client or organisation name"
              required
            />
          </div>

          <div className="client-field">
            <label htmlFor="contactPerson">Contact person</label>
            <input
              id="contactPerson"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              maxLength={150}
              placeholder="Full name"
            />
          </div>

          <div className="client-field">
            <label htmlFor="mobileNo">Mobile number</label>
            <input
              id="mobileNo"
              name="mobileNo"
              value={form.mobileNo}
              onChange={handleChange}
              maxLength={20}
              placeholder="Enter mobile number"
            />
          </div>

          <div className="client-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              maxLength={150}
              placeholder="name@company.com"
            />
          </div>

          <div className="client-field">
            <label htmlFor="gstin">GSTIN</label>
            <input
              id="gstin"
              name="gstin"
              value={form.gstin}
              onChange={handleChange}
              maxLength={20}
              placeholder="Enter GSTIN"
            />
          </div>

          <div className="client-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div className="client-field client-field-full">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              placeholder="Enter the client's registered address"
            />
          </div>

          <div className="client-form-footer">
            {editingId && (
              <button
                type="button"
                className="client-secondary-button"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}

            <button
              type="submit"
              className="client-submit-button"
              disabled={saving || companies.length === 0}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "＋ Create client"}
            </button>
          </div>
        </form>
      </section>

      <section className="client-panel client-records-panel">
        <div className="client-records-heading">
          <div>
            <h2>Client directory</h2>
            <p>Search, review, and manage registered clients.</p>
          </div>

          <span className="client-record-count">
            {filteredClients.length} records
          </span>
        </div>

        <div className="client-filters">
          <div className="client-search">
            <span aria-hidden="true">⌕</span>

            <input
              aria-label="Search clients"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, code, email, mobile..."
            />
          </div>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <button
            type="button"
            className="client-secondary-button"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
          >
            Clear filters
          </button>
        </div>

        <div className="client-table-wrapper">
          <table className="client-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Contact details</th>
                <th>Company ID</th>
                <th>GSTIN</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="client-empty-cell">
                    Loading clients...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="client-empty-cell">
                    No clients found. Create a client using the form above.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.clientId}>
                    <td>
                      <div className="client-name-cell">
                        <span className="client-avatar">
                          {(client.clientName || "C")
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <div>
                          <strong>{client.clientName}</strong>
                          <small>{client.clientCode}</small>

                          {client.contactPerson && (
                            <small>
                              Contact: {client.contactPerson}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="client-contact-cell">
                        <span>{client.email || "—"}</span>
                        <small>{client.mobileNo || "—"}</small>
                      </div>
                    </td>

                    <td>
                      <span className="client-company-id">
                        {client.companyId || "—"}
                      </span>
                    </td>

                    <td>{client.gstin || "—"}</td>

                    <td>
                      <span
                        className={`client-status client-status-${(
                          client.status || "active"
                        ).toLowerCase()}`}
                      >
                        {client.status || "ACTIVE"}
                      </span>
                    </td>

                    <td>
                      <div className="client-actions">
                        <button
                          type="button"
                          className="client-edit-button"
                          onClick={() => handleEdit(client)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="client-delete-button"
                          onClick={() => handleDelete(client)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="client-table-footer">
          <span>
            Showing {filteredClients.length} of {clients.length} clients
          </span>

          <button
            type="button"
            className="client-refresh-button"
            onClick={loadData}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </footer>
      </section>
    </main>
  );
}

export default Client;