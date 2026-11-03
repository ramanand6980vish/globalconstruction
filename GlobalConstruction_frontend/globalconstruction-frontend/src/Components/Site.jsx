// src/pages/Site.jsx

import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:8081/api";

const emptyForm = {
  companyId: "",
  clientId: "",
  siteCode: "",
  siteName: "",
  siteAddress: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  startDate: "",
  endDate: "",
  status: "ACTIVE",
};

const styles = {
  page: {
    padding: "24px",
    color: "#1f2937",
    fontFamily: "Arial, sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  heading: {
    margin: "0 0 6px",
    fontSize: "26px",
    color: "#0f172a",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: "22px",
  },
  panel: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "22px",
    marginBottom: "22px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#475569",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "14px",
    background: "#fff",
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "20px",
  },
  button: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
  },
  tableWrap: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px",
  },
  th: {
    background: "#f1f5f9",
    padding: "13px",
    textAlign: "left",
    fontSize: "12px",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px",
    fontSize: "13px",
    borderBottom: "1px solid #e2e8f0",
    verticalAlign: "middle",
  },
  message: {
    padding: "12px 14px",
    borderRadius: "7px",
    marginBottom: "16px",
    fontSize: "14px",
  },
};

// --------------------------------------------------
// RESPONSE HELPERS
// --------------------------------------------------

function extractRows(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.records)) return data.records;
  if (Array.isArray(data?.data?.content)) return data.data.content;

  return [];
}

function valueOf(obj, ...keys) {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null) {
      return obj[key];
    }
  }

  return "";
}

function getCompanyId(company) {
  return String(
    valueOf(company, "companyId", "company_id", "id")
  ).trim();
}

function getCompanyName(company) {
  return (
    valueOf(
      company,
      "companyName",
      "company_name",
      "name",
      "companyCode"
    ) || getCompanyId(company)
  );
}

function getClientId(client) {
  return String(
    valueOf(client, "clientId", "client_id", "id")
  ).trim();
}

function getClientCode(client) {
  return valueOf(client, "clientCode", "client_code") || "";
}

function getClientName(client) {
  return (
    valueOf(client, "clientName", "client_name", "name") ||
    "Unnamed client"
  );
}

function getSiteId(site) {
  return valueOf(site, "siteId", "site_id", "id");
}

function getSiteClientId(site) {
  return String(
    valueOf(site, "clientId", "client_id")
  ).trim();
}

function getErrorMessage(data, fallback) {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  return (
    data?.message ||
    data?.detail ||
    data?.error ||
    fallback
  );
}

// --------------------------------------------------
// API REQUEST
// --------------------------------------------------

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });

  const responseText = await response.text();

  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        `Request failed with status ${response.status}`
      )
    );
  }

  return data;
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function Site() {
  const [sites, setSites] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [clients, setClients] = useState([]);

  const [form, setForm] = useState({ ...emptyForm });

  const [editingSiteId, setEditingSiteId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ------------------------------------------------
  // LOAD ALL DATA
  // ------------------------------------------------

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [siteData, companyData, clientData] =
        await Promise.all([
          apiRequest(`${API_BASE}/sites`),
          apiRequest(`${API_BASE}/companies`),
          apiRequest(`${API_BASE}/clients`),
        ]);

      setSites(extractRows(siteData));

      setCompanies(
        extractRows(companyData).filter(
          (item) => getCompanyId(item)
        )
      );

      setClients(
        extractRows(clientData).filter(
          (item) => getClientId(item)
        )
      );
    } catch (err) {
      setError(
        `${err.message}. Check that Spring Boot is running and these endpoints are available: /api/sites, /api/companies and /api/clients.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ------------------------------------------------
  // FILTER CLIENTS BY SELECTED COMPANY
  // ------------------------------------------------

  const availableClients = useMemo(() => {
    if (!form.companyId) return [];

    return clients.filter((client) => {
      const clientCompanyId = String(
        valueOf(client, "companyId", "company_id")
      ).trim();

      return clientCompanyId === String(form.companyId).trim();
    });
  }, [clients, form.companyId]);

  // ------------------------------------------------
  // CLIENT LOOKUP USING CLIENT ID
  // ------------------------------------------------

  const clientById = useMemo(() => {
    const map = new Map();

    clients.forEach((client) => {
      map.set(getClientId(client), client);
    });

    return map;
  }, [clients]);

  // ------------------------------------------------
  // SEARCH SITES
  // ------------------------------------------------

  const filteredSites = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return sites;

    return sites.filter((site) => {
      const linkedClient = clientById.get(
        getSiteClientId(site)
      );

      const searchable = [
        valueOf(site, "siteCode", "site_code"),
        valueOf(site, "siteName", "site_name"),
        valueOf(site, "companyId", "company_id"),
        getClientCode(linkedClient || site),
        getClientName(linkedClient || site),
        valueOf(site, "city"),
        valueOf(site, "state"),
        valueOf(site, "status"),
      ];

      return searchable.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );
    });
  }, [sites, search, clientById]);

  // ------------------------------------------------
  // FORM CHANGE
  // ------------------------------------------------

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,

      // Changing company clears previously selected client.
      ...(name === "companyId" ? { clientId: "" } : {}),
    }));

    setError("");
    setSuccess("");
  }

  // ------------------------------------------------
  // RESET FORM
  // ------------------------------------------------

  function resetForm() {
    setForm({ ...emptyForm });
    setEditingSiteId(null);
    setError("");
    setSuccess("");
  }

  // ------------------------------------------------
  // VALIDATION
  // ------------------------------------------------

  function validateForm() {
    if (!form.companyId) {
      return "Please select a company.";
    }

    if (!form.clientId) {
      return "Please select a client.";
    }

    const selectedCompany = companies.find(
      (company) => getCompanyId(company) === form.companyId
    );

    if (!selectedCompany) {
      return "Selected company is not available. Refresh and select an existing company.";
    }

    const selectedClient = clients.find(
      (client) => getClientId(client) === form.clientId
    );

    if (!selectedClient) {
      return "Selected client does not exist. Refresh the client list.";
    }

    const selectedClientCompanyId = String(
      valueOf(selectedClient, "companyId", "company_id")
    ).trim();

    if (selectedClientCompanyId !== form.companyId) {
      return "The selected client does not belong to the selected company.";
    }

    if (!form.siteCode.trim()) {
      return "Site code is required.";
    }

    if (!form.siteName.trim()) {
      return "Site name is required.";
    }

    if (
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
      return "End date cannot be before the start date.";
    }

    return "";
  }

  // ------------------------------------------------
  // CREATE / UPDATE SITE
  // ------------------------------------------------

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    // IMPORTANT:
    // Send clientId, not clientCode.
    // Client name and code are only used for display.

    const payload = {
      companyId: form.companyId,
      clientId: form.clientId,

      siteCode: form.siteCode.trim(),
      siteName: form.siteName.trim(),

      siteAddress: form.siteAddress.trim(),

      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country.trim(),

      pincode: form.pincode.trim(),

      startDate: form.startDate || null,
      endDate: form.endDate || null,

      status: form.status || "ACTIVE",
    };

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const isEditing = Boolean(editingSiteId);

      const url = isEditing
        ? `${API_BASE}/sites/${encodeURIComponent(editingSiteId)}`
        : `${API_BASE}/sites`;

      await apiRequest(url, {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      setSuccess(
        isEditing
          ? "Site updated successfully."
          : "Site created successfully."
      );

      setForm({ ...emptyForm });
      setEditingSiteId(null);

      await loadData();
    } catch (err) {
      setError(err.message || "Unable to save the site.");
    } finally {
      setSaving(false);
    }
  }

  // ------------------------------------------------
  // EDIT SITE
  // ------------------------------------------------

  function handleEdit(site) {
    const siteId = getSiteId(site);

    const clientId = getSiteClientId(site);

    const companyId = String(
      valueOf(site, "companyId", "company_id")
    ).trim();

    setEditingSiteId(siteId);

    setForm({
      companyId,
      clientId,

      siteCode: valueOf(site, "siteCode", "site_code"),
      siteName: valueOf(site, "siteName", "site_name"),

      siteAddress: valueOf(
        site,
        "siteAddress",
        "site_address",
        "address"
      ),

      city: valueOf(site, "city"),
      state: valueOf(site, "state"),
      country: valueOf(site, "country") || "India",

      pincode: valueOf(
        site,
        "pincode",
        "pinCode",
        "pin_code"
      ),

      startDate: valueOf(
        site,
        "startDate",
        "start_date",
        "contractStartDate"
      ),

      endDate: valueOf(
        site,
        "endDate",
        "end_date",
        "contractEndDate"
      ),

      status: valueOf(site, "status") || "ACTIVE",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ------------------------------------------------
  // DELETE SITE
  // ------------------------------------------------

  async function handleDelete(site) {
    const siteId = getSiteId(site);

    const siteName = valueOf(
      site,
      "siteName",
      "site_name"
    ) || "this site";

    if (!window.confirm(`Delete site "${siteName}"?`)) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await apiRequest(
        `${API_BASE}/sites/${encodeURIComponent(siteId)}`,
        { method: "DELETE" }
      );

      setSuccess("Site deleted successfully.");

      if (String(editingSiteId) === String(siteId)) {
        resetForm();
      }

      await loadData();
    } catch (err) {
      setError(err.message || "Unable to delete the site.");
    }
  }

  // ------------------------------------------------
  // BUTTON STYLE
  // ------------------------------------------------

  const primaryButton = {
    ...styles.button,
    background: saving ? "#94a3b8" : "#2563eb",
    color: "#fff",
    cursor: saving ? "not-allowed" : "pointer",
  };

  // ------------------------------------------------
  // UI
  // ------------------------------------------------

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Site Management</h1>

      <p style={styles.subtitle}>
        Create, view, update and manage construction sites.
      </p>

      {error && (
        <div
          role="alert"
          style={{
            ...styles.message,
            background: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          style={{
            ...styles.message,
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
          }}
        >
          {success}
        </div>
      )}

      {/* ==========================================
          ADD / UPDATE SITE FORM
      ========================================== */}

      <section style={styles.panel}>
        <h2 style={{ marginTop: 0, fontSize: "19px" }}>
          {editingSiteId ? "Update Site" : "Add New Site"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>

            {/* COMPANY DROPDOWN */}

            <label style={styles.field}>
              <span style={styles.label}>Company *</span>

              <select
                name="companyId"
                value={form.companyId}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select company</option>

                {companies.map((company) => {
                  const id = getCompanyId(company);

                  return (
                    <option key={id} value={id}>
                      {getCompanyName(company)} ({id})
                    </option>
                  );
                })}
              </select>
            </label>

            {/* CLIENT DROPDOWN */}

            <label style={styles.field}>
              <span style={styles.label}>Client *</span>

              <select
                name="clientId"
                value={form.clientId}
                onChange={handleChange}
                required
                disabled={!form.companyId}
                style={styles.input}
              >
                <option value="">
                  {!form.companyId
                    ? "Select company first"
                    : "Select client"}
                </option>

                {availableClients.map((client) => {
                  const id = getClientId(client);

                  return (
                    <option key={id} value={id}>
                      {getClientName(client)} (
                      {getClientCode(client) || "No code"})
                    </option>
                  );
                })}
              </select>

              {form.companyId &&
                availableClients.length === 0 && (
                  <small style={{ color: "#b45309" }}>
                    No clients found for this company.
                  </small>
                )}
            </label>

            {/* SITE CODE */}

            <label style={styles.field}>
              <span style={styles.label}>Site Code *</span>

              <input
                name="siteCode"
                value={form.siteCode}
                onChange={handleChange}
                required
                maxLength={30}
                placeholder="e.g. SITE-003"
                style={styles.input}
              />
            </label>

            {/* SITE NAME */}

            <label style={styles.field}>
              <span style={styles.label}>Site Name *</span>

              <input
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="e.g. Ranchi Construction Site"
                style={styles.input}
              />
            </label>

            {/* SITE ADDRESS */}

            <label style={styles.field}>
              <span style={styles.label}>Site Address</span>

              <input
                name="siteAddress"
                value={form.siteAddress}
                onChange={handleChange}
                placeholder="Enter site address"
                style={styles.input}
              />
            </label>

            {/* CITY */}

            <label style={styles.field}>
              <span style={styles.label}>City</span>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                maxLength={100}
                style={styles.input}
              />
            </label>

            {/* STATE */}

            <label style={styles.field}>
              <span style={styles.label}>State</span>

              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                maxLength={100}
                style={styles.input}
              />
            </label>

            {/* COUNTRY */}

            <label style={styles.field}>
              <span style={styles.label}>Country</span>

              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                maxLength={100}
                style={styles.input}
              />
            </label>

            {/* PINCODE */}

            <label style={styles.field}>
              <span style={styles.label}>Pincode</span>

              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                maxLength={10}
                style={styles.input}
              />
            </label>

            {/* START DATE */}

            <label style={styles.field}>
              <span style={styles.label}>Start Date</span>

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                style={styles.input}
              />
            </label>

            {/* END DATE */}

            <label style={styles.field}>
              <span style={styles.label}>End Date</span>

              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                min={form.startDate || undefined}
                style={styles.input}
              />
            </label>

            {/* STATUS */}

            <label style={styles.field}>
              <span style={styles.label}>Status</span>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="ON_HOLD">ON_HOLD</option>
              </select>
            </label>
          </div>

          {/* FORM BUTTONS */}

          <div style={styles.buttonRow}>
            <button
              type="submit"
              disabled={
                saving ||
                loading ||
                companies.length === 0 ||
                clients.length === 0
              }
              style={primaryButton}
            >
              {saving
                ? "Saving..."
                : editingSiteId
                  ? "Update Site"
                  : "Create Site"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={{
                ...styles.button,
                background: "#e2e8f0",
                color: "#334155",
              }}
            >
              {editingSiteId ? "Cancel Edit" : "Reset"}
            </button>

            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              style={{
                ...styles.button,
                background: "#0f766e",
                color: "#fff",
              }}
            >
              Refresh
            </button>
          </div>
        </form>
      </section>

      {/* ==========================================
          SITE LIST
      ========================================== */}

      <section style={styles.panel}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "19px" }}>
            Site List ({filteredSites.length})
          </h2>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search code, name, client, city..."
            aria-label="Search sites"
            style={{
              ...styles.input,
              maxWidth: "340px",
            }}
          />
        </div>

        {loading ? (
          <p>Loading sites...</p>
        ) : filteredSites.length === 0 ? (
          <p style={{ color: "#64748b" }}>
            No sites found. Create a site or change your search.
          </p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Site Code</th>
                  <th style={styles.th}>Site Name</th>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Client</th>
                  <th style={styles.th}>City</th>
                  <th style={styles.th}>Start Date</th>
                  <th style={styles.th}>End Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSites.map((site) => {
                  const siteId = getSiteId(site);

                  const client = clientById.get(
                    getSiteClientId(site)
                  );

                  const company = companies.find(
                    (item) =>
                      getCompanyId(item) ===
                      String(
                        valueOf(site, "companyId", "company_id")
                      ).trim()
                  );

                  const clientDisplay = client
                    ? `${getClientName(client)} (${getClientCode(client) || "No code"})`
                    : valueOf(site, "clientName", "client_name")
                      ? `${valueOf(site, "clientName", "client_name")} (${valueOf(site, "clientCode", "client_code") || "No code"})`
                      : `Client ID: ${getSiteClientId(site) || "—"}`;

                  const status =
                    valueOf(site, "status") || "UNKNOWN";

                  return (
                    <tr key={siteId}>
                      <td style={styles.td}>
                        {valueOf(site, "siteCode", "site_code")}
                      </td>

                      <td style={styles.td}>
                        {valueOf(site, "siteName", "site_name")}
                      </td>

                      <td style={styles.td}>
                        {company
                          ? getCompanyName(company)
                          : valueOf(site, "companyId", "company_id")}
                      </td>

                      <td style={styles.td}>
                        {clientDisplay}
                      </td>

                      <td style={styles.td}>
                        {valueOf(site, "city") || "-"}
                      </td>

                      <td style={styles.td}>
                        {valueOf(
                          site,
                          "startDate",
                          "start_date",
                          "contractStartDate"
                        ) || "-"}
                      </td>

                      <td style={styles.td}>
                        {valueOf(
                          site,
                          "endDate",
                          "end_date",
                          "contractEndDate"
                        ) || "-"}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "5px 9px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: 700,

                            background:
                              status === "ACTIVE"
                                ? "#dcfce7"
                                : status === "COMPLETED"
                                  ? "#dbeafe"
                                  : "#f1f5f9",

                            color:
                              status === "ACTIVE"
                                ? "#166534"
                                : status === "COMPLETED"
                                  ? "#1d4ed8"
                                  : "#475569",
                          }}
                        >
                          {status}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <div
                          style={{
                            display: "flex",
                            gap: "7px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleEdit(site)}
                            style={{
                              ...styles.button,
                              padding: "7px 10px",
                              background: "#dbeafe",
                              color: "#1d4ed8",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(site)}
                            style={{
                              ...styles.button,
                              padding: "7px 10px",
                              background: "#fee2e2",
                              color: "#b91c1c",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}