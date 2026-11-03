
import React, { useEffect, useMemo, useState } from "react";
import "../cssFiles/attendance.css";
// Change this URL if your backend runs on another port or ngrok URL.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const ATTENDANCE_STATUSES = [
  "PRESENT",
  "ABSENT",
  "HALF_DAY",
  "LEAVE",
  "HOLIDAY",
  "WEEK_OFF",
];

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatStatus = (status) => {
  if (!status) return "Not Marked";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatTime = (value) => {
  if (!value) return "";

  // Backend LocalDateTime format: 2026-11-01T09:00:00
  return value.length >= 16 ? value.substring(11, 16) : value;
};

const getErrorMessage = async (response) => {
  try {
    const data = await response.json();
    return data.message || data.error || "Something went wrong.";
  } catch {
    return `Request failed with status ${response.status}.`;
  }
};

function Attendance() {
  const [sites, setSites] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedSite, setSelectedSite] = useState("");
  const [selectedDate, setSelectedDate] = useState(getToday());

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const [savingEmployee, setSavingEmployee] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dirtyEmployees, setDirtyEmployees] = useState(new Set());

  // ----------------------------------------------------
  // 1. LOAD ACTIVE SITES
  // ----------------------------------------------------

  useEffect(() => {
    const loadSites = async () => {
      try {
        setLoadingSites(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/attendance/sites`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(await getErrorMessage(response));
        }

        const data = await response.json();

        setSites(data);

        if (data.length > 0) {
          setSelectedSite(data[0].siteCode);
        }
      } catch (err) {
        setError(err.message || "Unable to load sites.");
      } finally {
        setLoadingSites(false);
      }
    };

    loadSites();
  }, []);

  // ----------------------------------------------------
  // 2. LOAD EMPLOYEE ROSTER FOR DATE AND SITE
  // ----------------------------------------------------

  useEffect(() => {
    if (!selectedSite || !selectedDate) {
      setEmployees([]);
      return;
    }

    const loadRoster = async () => {
      try {
        setLoadingRoster(true);
        setError("");
        setSuccess("");

        const params = new URLSearchParams({
          date: selectedDate,
          siteCode: selectedSite,
        });

        const response = await fetch(
          `${API_BASE_URL}/api/attendance/roster?${params.toString()}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(await getErrorMessage(response));
        }

        const data = await response.json();

        const preparedEmployees = data.map((employee) => ({
          ...employee,
          attendanceStatus: employee.attendanceStatus || "",
          remarks: employee.remarks || "",
          overtimeHours: employee.overtimeHours ?? 0,
          regularHours: employee.regularHours ?? 0,
          halfDayHours: employee.halfDayHours ?? 0,
          checkInTime: formatTime(employee.checkInTime),
          checkOutTime: formatTime(employee.checkOutTime),
        }));

        setEmployees(preparedEmployees);
      } catch (err) {
        setEmployees([]);
        setError(err.message || "Unable to load attendance roster.");
      } finally {
        setLoadingRoster(false);
      }
    };

    loadRoster();
  }, [selectedSite, selectedDate]);

  // ----------------------------------------------------
  // 3. UPDATE ROW INPUTS LOCALLY
  // ----------------------------------------------------

  const updateEmployee = (employeeId, field, value) => {
    setEmployees((previous) =>
      previous.map((employee) =>
        employee.employeeId === employeeId
          ? { ...employee, [field]: value }
          : employee
      )
    );

    setDirtyEmployees((previous) => {
      const updated = new Set(previous);
      updated.add(employeeId);
      return updated;
    });
  };

  // ----------------------------------------------------
  // 4. FRONTEND SEARCH AND STATUS FILTERING
  // ----------------------------------------------------

  const filteredEmployees = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !searchText ||
        (employee.employeeName || "").toLowerCase().includes(searchText) ||
        (employee.employeeCode || "").toLowerCase().includes(searchText) ||
        (employee.employeeId || "").toLowerCase().includes(searchText) ||
        (employee.department || "").toLowerCase().includes(searchText) ||
        (employee.designation || "").toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "NOT_MARKED"
          ? !employee.attendanceStatus
          : employee.attendanceStatus === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  // ----------------------------------------------------
  // 5. FRONTEND SUMMARY CALCULATION
  // ----------------------------------------------------

  const summary = useMemo(() => {
    const total = filteredEmployees.length;

    const count = (status) =>
      filteredEmployees.filter(
        (employee) => employee.attendanceStatus === status
      ).length;

    const overtime = filteredEmployees.reduce(
      (totalHours, employee) =>
        totalHours + Number(employee.overtimeHours || 0),
      0
    );

    return {
      total,
      present: count("PRESENT"),
      absent: count("ABSENT"),
      halfDay: count("HALF_DAY"),
      leave: count("LEAVE"),
      holiday: count("HOLIDAY"),
      weekOff: count("WEEK_OFF"),
      notMarked: filteredEmployees.filter(
        (employee) => !employee.attendanceStatus
      ).length,
      overtime: overtime.toFixed(2),
    };
  }, [filteredEmployees]);

  // ----------------------------------------------------
  // 6. SAVE INDIVIDUAL EMPLOYEE ATTENDANCE
  // ----------------------------------------------------

  const saveAttendance = async (employee) => {
    if (!employee.attendanceStatus) {
      setError(
        `Please select attendance status for ${employee.employeeName}.`
      );
      setSuccess("");
      return;
    }

    const overtime = Number(employee.overtimeHours || 0);

    if (!Number.isFinite(overtime) || overtime < 0 || overtime > 99.99) {
      setError("Overtime must be between 0 and 99.99 hours.");
      setSuccess("");
      return;
    }

    const requestBody = {
      employeeId: employee.employeeId,
      siteCode: employee.siteCode || selectedSite,
      attendanceDate: selectedDate,
      attendanceStatus: employee.attendanceStatus,

      checkInTime: employee.checkInTime || null,
      checkOutTime: employee.checkOutTime || null,

      regularHours: Number(employee.regularHours || 0),
      halfDayHours: Number(employee.halfDayHours || 0),
      overtimeHours: overtime,

      remarks: employee.remarks || "",
    };

    try {
      setSavingEmployee(employee.employeeId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/api/attendance/mark`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const savedEmployee = await response.json();

      // Update only the employee whose attendance was saved.
      setEmployees((previous) =>
        previous.map((item) =>
          item.employeeId === employee.employeeId
            ? {
              ...item,
              ...savedEmployee,
              attendanceStatus:
                savedEmployee.attendanceStatus || item.attendanceStatus,
              remarks: savedEmployee.remarks ?? item.remarks,
              overtimeHours:
                savedEmployee.overtimeHours ?? item.overtimeHours,
              regularHours:
                savedEmployee.regularHours ?? item.regularHours,
              halfDayHours:
                savedEmployee.halfDayHours ?? item.halfDayHours,
              checkInTime:
                formatTime(savedEmployee.checkInTime) || item.checkInTime,
              checkOutTime:
                formatTime(savedEmployee.checkOutTime) || item.checkOutTime,
            }
            : item
        )
      );

      setDirtyEmployees((previous) => {
        const updated = new Set(previous);
        updated.delete(employee.employeeId);
        return updated;
      });

      setSuccess(
        `Attendance saved successfully for ${employee.employeeName}.`
      );
    } catch (err) {
      setError(err.message || "Unable to save attendance.");
    } finally {
      setSavingEmployee(null);
    }
  };

  // ----------------------------------------------------
  // 7. REFRESH ROSTER
  // ----------------------------------------------------

  const refreshRoster = () => {
    if (!selectedSite || !selectedDate) return;

    const params = new URLSearchParams({
      date: selectedDate,
      siteCode: selectedSite,
    });

    setLoadingRoster(true);
    setError("");

    fetch(`${API_BASE_URL}/api/attendance/roster?${params.toString()}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await getErrorMessage(response));
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(
          data.map((employee) => ({
            ...employee,
            attendanceStatus: employee.attendanceStatus || "",
            remarks: employee.remarks || "",
            overtimeHours: employee.overtimeHours ?? 0,
            regularHours: employee.regularHours ?? 0,
            halfDayHours: employee.halfDayHours ?? 0,
            checkInTime: formatTime(employee.checkInTime),
            checkOutTime: formatTime(employee.checkOutTime),
          }))
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingRoster(false));
  };

  // ----------------------------------------------------
  // 8. UI
  // ----------------------------------------------------

  return (
    <div className="attendance-page">


      {/* HEADER */}
      <div className="attendance-header">
        <div>
          <h2>Attendance Management</h2>
          <p>Manage and record daily employee attendance.</p>
        </div>

        <button
          type="button"
          className="attendance-btn refresh-btn"
          onClick={refreshRoster}
          disabled={!selectedSite || loadingRoster}
        >
          ↻ Refresh
        </button>
      </div>

      {/* FILTERS */}
      <div className="attendance-filters">
        <div className="attendance-field">
          <label>Select Site</label>

          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            disabled={loadingSites || sites.length === 0}
          >
            <option value="">Select Site</option>

            {sites.map((site) => (
              <option key={site.siteId} value={site.siteCode}>
                {site.siteName} ({site.siteCode})
              </option>
            ))}
          </select>
        </div>

        <div className="attendance-field">
          <label>Attendance Date</label>

          <input
            type="date"
            value={selectedDate}
            max={getToday()}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="attendance-field">
          <label>Search Employee</label>

          <input
            type="text"
            placeholder="Name, code or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="attendance-field">
          <label>Attendance Status</label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="NOT_MARKED">Not Marked</option>

            {ATTENDANCE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MESSAGES */}
      {error && (
        <div className="attendance-message attendance-error">
          {error}
        </div>
      )}

      {success && (
        <div className="attendance-message attendance-success">
          {success}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="attendance-summary">
        <div className="attendance-card">
          <span>Total Employees</span>
          <strong>{summary.total}</strong>
          <small>Matching current filters</small>
        </div>

        <div className="attendance-card">
          <span>Present</span>
          <strong>{summary.present}</strong>
          <small>Employees present</small>
        </div>

        <div className="attendance-card">
          <span>Absent</span>
          <strong>{summary.absent}</strong>
          <small>Employees absent</small>
        </div>

        <div className="attendance-card">
          <span>Half Day</span>
          <strong>{summary.halfDay}</strong>
          <small>Half-day attendance</small>
        </div>

        <div className="attendance-card">
          <span>On Leave</span>
          <strong>{summary.leave}</strong>
          <small>Employees on leave</small>
        </div>

        <div className="attendance-card">
          <span>Not Marked</span>
          <strong>{summary.notMarked}</strong>
          <small>Pending attendance</small>
        </div>

        <div className="attendance-card">
          <span>Holiday / Week Off</span>
          <strong>{summary.holiday + summary.weekOff}</strong>
          <small>
            Holiday: {summary.holiday} | Week off: {summary.weekOff}
          </small>
        </div>

        <div className="attendance-card">
          <span>Total Overtime</span>
          <strong>{summary.overtime}h</strong>
          <small>Hours in filtered roster</small>
        </div>
      </div>

      {/* EMPLOYEE ATTENDANCE TABLE */}
      <div className="attendance-table-container">
        <div className="attendance-table-heading">
          <h3>Employee Attendance</h3>

          <span>
            {filteredEmployees.length} employees displayed
          </span>
        </div>

        {loadingSites || loadingRoster ? (
          <div className="attendance-loading">
            Loading attendance records...
          </div>
        ) : !selectedSite ? (
          <div className="attendance-empty">
            Please select an active site.
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="attendance-empty">
            No employees found for the selected filters.
          </div>
        ) : (
          <div className="attendance-table-scroll">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Attendance</th>
                  <th>Overtime (Hrs)</th>
                  <th>Remarks</th>
                  <th>Current Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee, index) => {
                  const isSaving =
                    savingEmployee === employee.employeeId;

                  const badgeClass =
                    employee.attendanceStatus === "PRESENT"
                      ? "status-present"
                      : employee.attendanceStatus === "ABSENT"
                        ? "status-absent"
                        : employee.attendanceStatus === "HALF_DAY"
                          ? "status-half"
                          : employee.attendanceStatus
                            ? "status-other"
                            : "status-unmarked";

                  return (
                    <tr key={employee.employeeId}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="employee-name">
                          {employee.employeeName}
                        </div>

                        <div className="employee-code">
                          {employee.employeeCode}
                        </div>
                      </td>

                      <td>{employee.department || "—"}</td>

                      <td>{employee.designation || "—"}</td>

                      <td>
                        <select
                          className="status-select"
                          value={employee.attendanceStatus}
                          onChange={(e) =>
                            updateEmployee(
                              employee.employeeId,
                              "attendanceStatus",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select Status</option>

                          {ATTENDANCE_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <input
                          className="hours-input"
                          type="number"
                          min="0"
                          max="99.99"
                          step="0.25"
                          value={employee.overtimeHours}
                          onChange={(e) =>
                            updateEmployee(
                              employee.employeeId,
                              "overtimeHours",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="remarks-input"
                          type="text"
                          placeholder="Add remarks..."
                          value={employee.remarks}
                          onChange={(e) =>
                            updateEmployee(
                              employee.employeeId,
                              "remarks",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <span className={`status-badge ${badgeClass}`}>
                          {formatStatus(employee.attendanceStatus)}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`attendance-btn save-attendance-btn ${dirtyEmployees.has(employee.employeeId)
                            ? "is-dirty"
                            : "is-clean"
                            }`}
                          onClick={() => saveAttendance(employee)}
                          disabled={
                            !dirtyEmployees.has(employee.employeeId) ||
                            isSaving ||
                            savingEmployee !== null
                          }
                        >
                          {isSaving ? "Saving..." : "OK"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
