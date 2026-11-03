
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../cssFiles/empDetail&List.css";

const EMPLOYEE_API = "http://localhost:8081/api/employees";

const EMPTY_EMPLOYEE = {
  employeeId: "",
  employeeCode: "",
  companyId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  fatherName: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  mobileNo: "",
  bloodGroup: "",
  departmentId: "",
  designationId: "",
  grade: "",
  joiningDate: "",
  terminationDate: "",
  gatePassNo: "",
  billableStatus: "",
  status: "ACTIVE",
  createdAt: "",
  updatedAt: "",
};

const FIELDS = [
  { key: "employeeId", label: "Employee ID", readOnly: true },
  { key: "employeeCode", label: "Employee Code", required: true },
  { key: "companyId", label: "Company ID", required: true },
  { key: "firstName", label: "First Name", required: true },
  { key: "middleName", label: "Middle Name" },
  { key: "lastName", label: "Last Name" },
  { key: "fatherName", label: "Father Name" },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" },
  {
    key: "gender",
    label: "Gender",
    type: "select",
    options: ["MALE", "FEMALE", "OTHER"],
  },
  {
    key: "maritalStatus",
    label: "Marital Status",
    type: "select",
    options: ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "OTHER"],
  },
  { key: "mobileNo", label: "Mobile Number" },
  { key: "bloodGroup", label: "Blood Group" },
  { key: "departmentId", label: "Department ID" },
  { key: "designationId", label: "Designation ID" },
  { key: "grade", label: "Grade" },
  { key: "joiningDate", label: "Joining Date", type: "date" },
  { key: "terminationDate", label: "Termination Date", type: "date" },
  { key: "gatePassNo", label: "Gate Pass Number" },
  {
    key: "billableStatus",
    label: "Billable Status",
    type: "select",
    options: ["BILLABLE", "NON_BILLABLE"],
  },
  {
    key: "status",
    label: "Employee Status",
    type: "select",
    options: ["ACTIVE", "INACTIVE", "ON_LEAVE", "SUSPENDED", "TERMINATED"],
  },
  { key: "createdAt", label: "Created At", readOnly: true },
  { key: "updatedAt", label: "Updated At", readOnly: true },
];

function getInputValue(value, type) {
  if (value === null || value === undefined) return "";

  if (type === "date") {
    return String(value).slice(0, 10);
  }

  return String(value);
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

async function getErrorMessage(response) {
  const responseText = await response.text();

  if (!responseText) {
    return `Request failed with status ${response.status}`;
  }

  try {
    const data = JSON.parse(responseText);
    return (
      data.message ||
      data.error ||
      data.detail ||
      `Request failed with status ${response.status}`
    );
  } catch {
    return responseText;
  }
}

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [form, setForm] = useState(EMPTY_EMPLOYEE);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadEmployee = useCallback(async (signal) => {
    if (!id) {
      setError("Employee ID is missing from the URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${EMPLOYEE_API}/${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          signal,
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();
      const normalized = { ...EMPTY_EMPLOYEE, ...data };

      setEmployee(normalized);
      setForm(normalized);
      setEditing(false);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Unable to load employee details.");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();

    loadEmployee(controller.signal);

    return () => controller.abort();
  }, [loadEmployee]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  }

  function handleEdit() {
    if (!employee || saving || deleting) return;

    // Only changes local React state. No API request is made here.
    setForm({ ...employee });
    setEditing(true);
    setError("");
    setMessage("");
  }

  function handleCancel() {
    setForm({ ...employee });
    setEditing(false);
    setError("");
    setMessage("");
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!employee || saving || deleting || !editing) return;

    if (!form.employeeCode?.trim() || !form.firstName?.trim()) {
      setError("Employee Code and First Name are required.");
      return;
    }

    if (!form.companyId?.trim()) {
      setError("Company ID is required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = { ...form };

      // Keep optional empty fields as null for date fields.
      for (const key of [
        "dateOfBirth",
        "joiningDate",
        "terminationDate",
      ]) {
        if (!payload[key]) payload[key] = null;
      }

      // PUT is called only after clicking Save Changes.
      const response = await fetch(
        `${EMPLOYEE_API}/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const responseText = await response.text();
      let savedEmployee = payload;

      if (responseText.trim()) {
        try {
          savedEmployee = {
            ...payload,
            ...JSON.parse(responseText),
          };
        } catch {
          // If the response body is not JSON, keep the submitted values.
        }
      }

      const normalized = { ...EMPTY_EMPLOYEE, ...savedEmployee };

      setEmployee(normalized);
      setForm(normalized);
      setEditing(false);
      setMessage("Employee details saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save employee details.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!employee || deleting || saving) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete employee ${employee.employeeCode || id}? This action may be permanent.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${EMPLOYEE_API}/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      navigate("/admin/employees", {
        state: { message: "Employee deleted successfully." },
      });
    } catch (err) {
      setError(err.message || "Unable to delete employee.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="employee-detail-page">
        <p className="employee-state-message">Loading employee details...</p>
      </main>
    );
  }

  if (!employee) {
    return (
      <main className="employee-detail-page">
        <button
          type="button"
          className="employee-secondary-button"
          onClick={() => navigate("/admin/employees")}
        >
          Back to Employees
        </button>

        <p className="employee-error" role="alert">
          {error || "Employee not found."}
        </p>
      </main>
    );
  }

  return (
    <main className="employee-detail-page">
      <div className="employee-detail-header">
        <div>
          <h1>Employee Details</h1>
          <p>View and manage employee information.</p>
        </div>

        <button
          type="button"
          className="employee-secondary-button"
          onClick={() => navigate("/admin/employees")}
          disabled={saving || deleting}
        >
          Back to Employees
        </button>
      </div>

      {error && (
        <div className="employee-error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="employee-success" role="status">
          {message}
        </div>
      )}

      <form className="employee-detail-card" onSubmit={handleSave}>
        <div className="employee-detail-card-header">
          <div>
            <h2>
              {formatValue(employee.firstName)}{" "}
              {formatValue(employee.lastName)}
            </h2>
            <p>Employee Code: {formatValue(employee.employeeCode)}</p>
          </div>

          <span className="employee-status">
            {formatValue(employee.status)}
          </span>
        </div>

        <div className="employee-fields-grid">
          {FIELDS.map((field) => {
            const value = form[field.key] ?? "";
            const isReadOnly = field.readOnly || !editing;

            return (
              <div className="employee-field" key={field.key}>
                <label htmlFor={field.key}>{field.label}</label>

                {isReadOnly ? (
                  <p className="employee-field-value">
                    {formatValue(employee[field.key])}
                  </p>
                ) : field.type === "select" ? (
                  <select
                    id={field.key}
                    name={field.key}
                    value={value}
                    onChange={handleInputChange}
                    required={Boolean(field.required)}
                    disabled={saving || deleting}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option value={option} key={option}>
                        {option.replaceAll("_", " ")}
                      </option>
                    ))}
                    {/* Preserve an existing value not listed in the options. */}
                    {value &&
                      !field.options.includes(value) && (
                        <option value={value}>{value}</option>
                      )}
                  </select>
                ) : (
                  <input
                    id={field.key}
                    name={field.key}
                    type={field.type || "text"}
                    value={getInputValue(value, field.type)}
                    onChange={handleInputChange}
                    required={Boolean(field.required)}
                    disabled={saving || deleting}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="employee-detail-actions">
          {!editing ? (
            <button
              type="button"
              className="employee-primary-button"
              onClick={handleEdit}
              disabled={saving || deleting}
            >
              Edit Employee
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="employee-primary-button"
                disabled={saving || deleting}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                className="employee-secondary-button"
                onClick={handleCancel}
                disabled={saving || deleting}
              >
                Cancel
              </button>
            </>
          )}

          <button
            type="button"
            className="employee-delete-button"
            onClick={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? "Deleting..." : "Delete Employee"}
          </button>
        </div>
      </form>
    </main>
  );
}
