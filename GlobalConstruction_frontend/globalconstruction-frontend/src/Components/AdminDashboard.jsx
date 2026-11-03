import React, { useEffect, useState } from "react";
import "../cssFiles/adminDashboard.css";

const API_URL =
  `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8081"}/api/admin/dashboard`;

const navigation = [
  { label: "Dashboard", icon: "▦", path: "/admin/dashboard" },
  { label: "Employees", icon: "♙", path: "/employees" },
  { label: "Attendance", icon: "▣", path: "/attendance" },
  { label: "Payroll", icon: "▤", path: "/payroll" },
  { label: "Advances", icon: "▥", path: "/advances" },
  { label: "PF / ESIC", icon: "▧", path: "/pf-esic" },
  { label: "Sites & Plants", icon: "▦", path: "/sites" },
  { label: "Reports", icon: "▤", path: "/reports" },
  { label: "Documents", icon: "▱", path: "/documents" },
  { label: "Settings", icon: "⚙", path: "/settings" }
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function formatShortCurrency(value) {
  const amount = Number(value || 0);

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }

  return formatCurrency(amount);
}

function DashboardRow({ label, value }) {
  return (
    <div className="dashboard-data-row">
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
    </div>
  );
}

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(
            `Dashboard request failed: HTTP ${response.status}`
          );
        }

        const data = await response.json();

        if (active) {
          setDashboard(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Unable to load dashboard data."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const contractorName = dashboard?.contractorName || "Manoj";
  const summary = dashboard?.summary || {};
  const attendance = dashboard?.attendanceSummary || {};
  const pending = dashboard?.pendingActions || {};
  const payroll = dashboard?.payrollStatus || {};

  const payrollStatus = String(
    payroll.status || "NOT_STARTED"
  ).replaceAll("_", " ");

  const payrollButtonPath = "/payroll";

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div className="dashboard-brand">
          <div className="brand-logo">🌐</div>

          <div>
            <h3>M/s Global<br />Construction</h3>
          </div>
        </div>

        <div className="contractor-label">
          Contractor: {contractorName}
        </div>

        <nav className="dashboard-navigation">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className={
                item.label === "Dashboard"
                  ? "dashboard-nav-item active"
                  : "dashboard-nav-item"
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* TOP HEADER */}
        <header className="dashboard-topbar">

          <div className="dashboard-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search employees, sites..."
              aria-label="Search employees and sites"
            />
          </div>

          <div className="dashboard-user">
            <button
              type="button"
              className="notification-button"
              aria-label="Notifications"
              title="Notifications"
            >
              ♧
              <span className="notification-dot"></span>
            </button>

            <div className="user-avatar">
              {contractorName.charAt(0).toUpperCase()}
            </div>

            <div className="user-information">
              <strong>{contractorName}</strong>
              <span>Contractor / Owner</span>
            </div>
          </div>

        </header>

        {/* DASHBOARD BODY */}
        <section className="dashboard-content">

          <div className="dashboard-heading">
            <div>
              <h1>Dashboard</h1>
              <p>
                Welcome back, {contractorName}. Here is today's
                workforce overview.
              </p>
            </div>

            {dashboard?.asOf && (
              <span className="dashboard-date">
                {dashboard.asOf}
              </span>
            )}
          </div>

          {loading && (
            <div className="dashboard-message">
              Loading dashboard data...
            </div>
          )}

          {!loading && error && (
            <div className="dashboard-error">
              <strong>Unable to load dashboard</strong>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && dashboard && (
            <>

              {/* SUMMARY CARDS */}
              <div className="dashboard-summary-grid">

                <div className="summary-card">
                  <div>
                    <span className="summary-label">
                      Total Employees
                    </span>

                    <h2>{summary.totalEmployees ?? 0}</h2>

                    <p>Active workforce</p>
                  </div>

                  <div className="summary-icon green">♙</div>
                </div>

                <div className="summary-card">
                  <div>
                    <span className="summary-label">
                      Present Today
                    </span>

                    <h2>{summary.presentToday ?? 0}</h2>

                    <p>Present workforce</p>
                  </div>

                  <div className="summary-icon green">♙</div>
                </div>

                <div className="summary-card">
                  <div>
                    <span className="summary-label">
                      Absent Today
                    </span>

                    <h2>{summary.absentToday ?? 0}</h2>

                    <p>Needs attention</p>
                  </div>

                  <div className="summary-icon red">♙</div>
                </div>

                <div className="summary-card">
                  <div>
                    <span className="summary-label">
                      Payroll
                    </span>

                    <h2>
                      {formatShortCurrency(payroll.amount)}
                    </h2>

                    <p>{payroll.month || "No payroll available"}</p>
                  </div>

                  <div className="summary-icon green">▤</div>
                </div>

              </div>

              {/* ATTENDANCE + SITE WORKFORCE */}
              <div className="dashboard-panels-grid">

                <section className="dashboard-panel">
                  <h3>Today's Attendance</h3>

                  <DashboardRow
                    label="Present"
                    value={attendance.present}
                  />

                  <DashboardRow
                    label="Absent"
                    value={attendance.absent}
                  />

                  <DashboardRow
                    label="Half Day"
                    value={attendance.halfDay}
                  />

                  <DashboardRow
                    label="Leave"
                    value={attendance.leave}
                  />
                </section>

                <section className="dashboard-panel">
                  <h3>Workforce by Site</h3>

                  {dashboard.workforceBySite?.length > 0 ? (
                    dashboard.workforceBySite.map((site) => (
                      <DashboardRow
                        key={site.siteId}
                        label={site.siteName}
                        value={site.employeeCount}
                      />
                    ))
                  ) : (
                    <p className="empty-dashboard">
                      No site attendance available today.
                    </p>
                  )}
                </section>

                {/* PENDING ACTIONS */}
                <section className="dashboard-panel">
                  <h3>Pending Actions</h3>

                  <DashboardRow
                    label="Attendance corrections"
                    value={pending.attendanceCorrections}
                  />

                  <DashboardRow
                    label="Advance requests"
                    value={pending.advanceRequests}
                  />

                  <DashboardRow
                    label="Documents pending"
                    value={pending.documentsPending}
                  />
                </section>

                {/* PAYROLL STATUS */}
                <section className="dashboard-panel payroll-panel">
                  <h3>Payroll Status</h3>

                  <p className="payroll-month">
                    {payroll.month || "No payroll available"}
                  </p>

                  <span
                    className={`payroll-status ${
                      String(payroll.status || "")
                        .toLowerCase()
                        .replaceAll("_", "-")
                    }`}
                  >
                    {payrollStatus}
                  </span>

                  <p className="payroll-amount">
                    {formatCurrency(payroll.amount)}
                  </p>

                  <button
                    type="button"
                    className="continue-payroll-button"
                    onClick={() => {
                      window.location.href = payrollButtonPath;
                    }}
                  >
                    Continue Payroll
                  </button>
                </section>

              </div>
            </>
          )}

        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;


// import React, { useCallback, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../cssFiles/adminDashboard.css";

// import AddEmployee from "./AddEmployee";
// import CreateCompany from "./CreateCompany";
// import CreateDepartment from "./CreateDepartment";
// import CreateDesignation from "./CreateDesignation";

// // =====================================================
// // API CONFIGURATION
// // =====================================================

// const API_BASE_URL = "http://localhost:8081";
// // const API_BASE_URL = "https://passivism-episode-richly.ngrok-free.dev";

// const EMPLOYEE_API = `${API_BASE_URL}/api/employees`;
// const ATTENDANCE_API = `${API_BASE_URL}/api/attendance`;

// // =====================================================
// // HELPER FUNCTIONS
// // =====================================================

// const getToday = () => {
//   const today = new Date();

//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };

// const getEmployeeName = (employee) =>
//   [
//     employee.firstName,
//     employee.middleName,
//     employee.lastName,
//   ]
//     .filter(Boolean)
//     .join(" ");

// const formatDate = (date) => {
//   if (!date) return "—";

//   const parsedDate = new Date(
//     `${String(date).slice(0, 10)}T00:00:00`
//   );

//   if (Number.isNaN(parsedDate.getTime())) {
//     return String(date);
//   }

//   return parsedDate.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatTime = (dateTime) => {
//   if (!dateTime) return "—";

//   const date = new Date(dateTime);

//   if (Number.isNaN(date.getTime())) {
//     return String(dateTime);
//   }

//   return date.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const normalizeList = (data) => {
//   if (Array.isArray(data)) return data;

//   if (Array.isArray(data?.data)) return data.data;
//   if (Array.isArray(data?.content)) return data.content;
//   if (Array.isArray(data?.employees)) return data.employees;
//   if (Array.isArray(data?.attendance)) return data.attendance;
//   if (Array.isArray(data?.records)) return data.records;

//   return [];
// };

// const normalizeStatus = (value) =>
//   String(value ?? "")
//     .trim()
//     .toUpperCase()
//     .replace(/[\s-]+/g, "_");

// const isActive = (employee) =>
//   normalizeStatus(employee.status) === "ACTIVE";

// const isMale = (employee) =>
//   normalizeStatus(employee.gender) === "MALE";

// const getAttendanceStatus = (record) =>
//   normalizeStatus(
//     record.attendanceStatus ??
//     record.attendance_status ??
//     record.status
//   );

// const isPending = (record) =>
//   normalizeStatus(record.status) === "SUBMITTED" ||
//   normalizeStatus(record.approvalStatus) === "PENDING" ||
//   normalizeStatus(record.attendanceStatus) === "PENDING";

// // =====================================================
// // DASHBOARD CARD CONFIGURATION
// // =====================================================

// const STAT_CARD_CONFIG = [
//   {
//     key: "totalEmployees",
//     label: "Total Employees",
//     icon: "👥",
//     color: "blue",
//   },
//   {
//     key: "activeEmployees",
//     label: "Active Employees",
//     icon: "✓",
//     color: "green",
//   },
//   {
//     key: "inactiveEmployees",
//     label: "Inactive Employees",
//     icon: "!",
//     color: "red",
//   },
//   {
//     key: "maleEmployees",
//     label: "Male Employees",
//     icon: "♂",
//     color: "blue",
//   },
// ];

// const ATTENDANCE_CARD_CONFIG = [
//   {
//     key: "present",
//     label: "Present",
//     icon: "✓",
//     color: "green",
//   },
//   {
//     key: "absent",
//     label: "Absent",
//     icon: "×",
//     color: "red",
//   },
//   {
//     key: "halfDay",
//     label: "Half Day",
//     icon: "½",
//     color: "yellow",
//   },
//   {
//     key: "pending",
//     label: "Pending Approval",
//     icon: "⌛",
//     color: "purple",
//   },
// ];

// // =====================================================
// // STATISTICS CARD
// // =====================================================

// function StatCard({ label, value, icon, color }) {
//   return (
//     <div className="gc-stat-card">
//       <div className={`gc-stat-icon ${color}`}>
//         {icon}
//       </div>

//       <div className="gc-stat-content">
//         <p>{label}</p>
//         <h3>{value}</h3>
//       </div>
//     </div>
//   );
// }

// // =====================================================
// // STATUS BADGE
// // =====================================================

// function StatusBadge({ status }) {
//   const normalized = normalizeStatus(status);

//   const className = normalized
//     .toLowerCase()
//     .replace(/_/g, "-");

//   return (
//     <span className={`gc-status-badge ${className}`}>
//       {normalized.replace(/_/g, " ") || "UNKNOWN"}
//     </span>
//   );
// }

// // =====================================================
// // ADMIN DASHBOARD
// // =====================================================

// export default function AdminDashboard() {
//   // ---------------------------------------------------
//   // STATE
//   // ---------------------------------------------------

//   const [selectedDate, setSelectedDate] = useState(getToday());

//   const [employees, setEmployees] = useState([]);
//   const [attendance, setAttendance] = useState([]);

//   const [employeeLoading, setEmployeeLoading] = useState(true);
//   const [attendanceLoading, setAttendanceLoading] = useState(true);

//   const [employeeError, setEmployeeError] = useState("");
//   const [attendanceError, setAttendanceError] = useState("");

//   const [refreshing, setRefreshing] = useState(false);

//   // Creation dropdown state
//   const [showCreateMenu, setShowCreateMenu] = useState(false);
//   const [activeCreatePage, setActiveCreatePage] = useState("");

//   const navigate = useNavigate();


//   // ---------------------------------------------------
//   // CREATION OPTIONS
//   // ---------------------------------------------------

//   const creationOptions = [
//     {
//       label: "Create Employee",
//       path: "/addemployee",
//     },
//     {
//       label: "Create Department",
//       path: "/createdepartment",
//     },
//     {
//       label: "Create Designation",
//       path: "/createdesignation",
//     },
//     {
//       label: "Create Company",
//       path: "/createcompany",
//     },
//     { label: "Create Site", 
//       path: "/sites"
//     },
//     { label: "Mark Attendance", 
//       path: "/markattendance"
//     },
//     { label: "Create Client", 
//       path: "/clients"
//     },
//   ];

//   const handleCreateSelection = (value) => {
//     setActiveCreatePage(value);
//     setShowCreateMenu(false);
//   };

//   const closeCreateForm = () => {
//     setActiveCreatePage("");
//   };

//   // ---------------------------------------------------
//   // LOAD EMPLOYEES
//   // ---------------------------------------------------

//   const loadEmployees = useCallback(async () => {
//     setEmployeeLoading(true);
//     setEmployeeError("");

//     try {
//       const response = await fetch(EMPLOYEE_API, {
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Could not load employees (HTTP ${response.status}).`
//         );
//       }

//       const data = await response.json();

//       setEmployees(normalizeList(data));
//     } catch (error) {
//       setEmployees([]);

//       setEmployeeError(
//         error.message ||
//         "Unable to load employee data. Check the backend connection."
//       );
//     } finally {
//       setEmployeeLoading(false);
//     }
//   }, []);

//   // ---------------------------------------------------
//   // LOAD ATTENDANCE
//   // ---------------------------------------------------

//   const loadAttendance = useCallback(async () => {
//     setAttendanceLoading(true);
//     setAttendanceError("");

//     try {
//       const response = await fetch(ATTENDANCE_API, {
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Could not load attendance (HTTP ${response.status}).`
//         );
//       }

//       const data = await response.json();

//       const records = normalizeList(data);

//       const filteredRecords = records.filter((record) => {
//         const recordDate =
//           record.attendanceDate ??
//           record.date ??
//           record.attendance_date;

//         return (
//           recordDate &&
//           String(recordDate).slice(0, 10) === selectedDate
//         );
//       });

//       setAttendance(filteredRecords);
//     } catch (error) {
//       setAttendance([]);

//       setAttendanceError(
//         error.message ||
//         "Unable to load attendance data. Check the backend connection."
//       );
//     } finally {
//       setAttendanceLoading(false);
//     }
//   }, [selectedDate]);

//   // ---------------------------------------------------
//   // REFRESH DASHBOARD
//   // ---------------------------------------------------

//   const refreshDashboard = useCallback(async () => {
//     setRefreshing(true);

//     try {
//       await Promise.all([
//         loadEmployees(),
//         loadAttendance(),
//       ]);
//     } finally {
//       setRefreshing(false);
//     }
//   }, [loadEmployees, loadAttendance]);

//   // ---------------------------------------------------
//   // INITIAL DATA LOADING
//   // ---------------------------------------------------

//   useEffect(() => {
//     loadEmployees();
//   }, [loadEmployees]);

//   useEffect(() => {
//     loadAttendance();
//   }, [loadAttendance]);

//   // ---------------------------------------------------
//   // EMPLOYEE STATISTICS
//   // ---------------------------------------------------

//   const employeeStats = {
//     totalEmployees: employees.length,

//     activeEmployees: employees.filter(isActive).length,

//     inactiveEmployees: employees.filter(
//       (employee) => !isActive(employee)
//     ).length,

//     maleEmployees: employees.filter(isMale).length,
//   };

//   // ---------------------------------------------------
//   // ATTENDANCE STATISTICS
//   // ---------------------------------------------------

//   const attendanceStats = {
//     present: attendance.filter(
//       (record) => getAttendanceStatus(record) === "PRESENT"
//     ).length,

//     absent: attendance.filter(
//       (record) => getAttendanceStatus(record) === "ABSENT"
//     ).length,

//     halfDay: attendance.filter(
//       (record) => getAttendanceStatus(record) === "HALF_DAY"
//     ).length,

//     pending: attendance.filter(isPending).length,
//   };

//   // ---------------------------------------------------
//   // RECENT EMPLOYEES
//   // ---------------------------------------------------

//   const recentEmployees = [...employees]
//     .sort((a, b) => {
//       const dateA = a.createdAt
//         ? new Date(a.createdAt).getTime()
//         : 0;

//       const dateB = b.createdAt
//         ? new Date(b.createdAt).getTime()
//         : 0;

//       return dateB - dateA;
//     })
//     .slice(0, 5);

//   // ---------------------------------------------------
//   // EMPLOYEE ID -> EMPLOYEE NAME
//   // ---------------------------------------------------

//   const employeeMap = new Map(
//     employees.map((employee) => [
//       employee.employeeId,
//       getEmployeeName(employee),
//     ])
//   );

//   // ---------------------------------------------------
//   // RENDER
//   // ---------------------------------------------------

//   return (
//     <div className="gc-dashboard">
//       <main className="gc-dashboard-main">

//         {/* =============================================
//             DASHBOARD HEADER
//         ============================================= */}

//         <section className="gc-page-heading">
//           <div>
//             <h2>Admin Dashboard</h2>
//             <p>Overview of employees and attendance</p>
//           </div>

//           <div className="gc-header-actions">

//             {/* CREATE NEW DROPDOWN */}

//             <div className="create-menu">
//               <button
//                 type="button"
//                 className="create-menu-button"
//                 onClick={() => setShowCreateMenu((previous) => !previous)}
//               >
//                 + Create New
//               </button>

//               {showCreateMenu && (
//                 <div className="create-menu-dropdown">
//                   {creationOptions.map((option) => (
//                     <button
//                       key={option.path}
//                       type="button"
//                       onClick={() => {
//                         setShowCreateMenu(false);
//                         navigate(option.path);
//                       }}
//                     >
//                       {option.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>


//             {/* REFRESH BUTTON */}

//             <button
//               type="button"
//               className="gc-refresh-button"
//               onClick={refreshDashboard}
//               disabled={refreshing}
//             >
//               {refreshing ? "Refreshing..." : "↻ Refresh"}
//             </button>
//           </div>
//         </section>

//         {/* =============================================
//             SELECTED CREATION FORM
//         ============================================= */}

//         {activeCreatePage && (
//           <section className="gc-data-panel gc-create-form-panel">

//             <div className="gc-panel-heading gc-create-form-heading">
//               <div>
//                 <h3>
//                   {activeCreatePage === "employee" &&
//                     "Add New Employee"}

//                   {activeCreatePage === "department" &&
//                     "Add New Department"}

//                   {activeCreatePage === "designation" &&
//                     "Add New Designation"}

//                   {activeCreatePage === "company" &&
//                     "Add New Company"}
//                 </h3>

//                 <p>
//                   Complete the form below and submit to save the details.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 className="gc-refresh-button"
//                 onClick={closeCreateForm}
//               >
//                 Close Form ✕
//               </button>
//             </div>

//             {/* EMPLOYEE FORM */}

//             {activeCreatePage === "employee" && (
//               <AddEmployee
//                 onCancel={closeCreateForm}
//                 onSuccess={async () => {
//                   closeCreateForm();
//                   await loadEmployees();
//                 }}
//               />
//             )}

//             {/* DEPARTMENT FORM */}

//             {activeCreatePage === "department" && (
//               <CreateDepartment />
//             )}

//             {/* DESIGNATION FORM */}

//             {activeCreatePage === "designation" && (
//               <CreateDesignation />
//             )}

//             {/* COMPANY FORM */}

//             {activeCreatePage === "company" && (
//               <CreateCompany />
//             )}
//           </section>
//         )}

//         {/* =============================================
//             EMPLOYEE OVERVIEW
//         ============================================= */}

//         <section className="gc-section">
//           <h3 className="gc-section-title">
//             Employee Overview
//           </h3>

//           <div className="gc-stats-grid">
//             {STAT_CARD_CONFIG.map((card) => (
//               <StatCard
//                 key={card.key}
//                 label={card.label}
//                 icon={card.icon}
//                 color={card.color}
//                 value={
//                   employeeLoading
//                     ? "..."
//                     : employeeStats[card.key]
//                 }
//               />
//             ))}
//           </div>
//         </section>

//         {/* =============================================
//             ATTENDANCE OVERVIEW
//         ============================================= */}

//         <section className="gc-section">
//           <div className="gc-section-heading">
//             <h3 className="gc-section-title">
//               Attendance Overview
//             </h3>

//             <label className="gc-date-filter">
//               <span>Date</span>

//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(event) =>
//                   setSelectedDate(event.target.value)
//                 }
//               />
//             </label>
//           </div>

//           <div className="gc-stats-grid">
//             {ATTENDANCE_CARD_CONFIG.map((card) => (
//               <StatCard
//                 key={card.key}
//                 label={card.label}
//                 icon={card.icon}
//                 color={card.color}
//                 value={
//                   attendanceLoading
//                     ? "..."
//                     : attendanceStats[card.key]
//                 }
//               />
//             ))}
//           </div>
//         </section>

//         {/* =============================================
//             EMPLOYEE TABLE
//         ============================================= */}

//         <section className="gc-data-panel">
//           <div className="gc-panel-heading">
//             <h3>Employees</h3>
//             <p>Recently added employees</p>
//           </div>

//           {employeeLoading ? (
//             <div className="gc-info-message">
//               Loading employees...
//             </div>
//           ) : employeeError ? (
//             <div className="gc-error-message">
//               {employeeError}
//             </div>
//           ) : recentEmployees.length === 0 ? (
//             <div className="gc-empty-message">
//               No employees found. Add an employee to get started.
//             </div>
//           ) : (
//             <div className="gc-table-wrapper">
//               <table className="gc-table">
//                 <thead>
//                   <tr>
//                     <th>Employee Code</th>
//                     <th>Name</th>
//                     <th>Department ID</th>
//                     <th>Designation ID</th>
//                     <th>Joining Date</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {recentEmployees.map((employee) => (
//                     <tr
//                       key={
//                         employee.employeeId ||
//                         employee.id ||
//                         employee.employeeCode
//                       }
//                     >
//                       <td>
//                         {employee.employeeCode || "—"}
//                       </td>

//                       <td>
//                         {getEmployeeName(employee) || "—"}
//                       </td>

//                       <td>
//                         {employee.departmentName ||
//                           employee.departmentId ||
//                           "—"}
//                       </td>

//                       <td>
//                         {employee.designationName ||
//                           employee.designationId ||
//                           "—"}
//                       </td>

//                       <td>
//                         {formatDate(
//                           employee.joiningDate ??
//                           employee.dateOfJoining
//                         )}
//                       </td>

//                       <td>
//                         <StatusBadge status={employee.status} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>

//         {/* =============================================
//             ATTENDANCE TABLE
//         ============================================= */}

//         <section className="gc-data-panel">
//           <div className="gc-panel-heading">
//             <h3>Attendance</h3>
//             <p>{formatDate(selectedDate)}</p>
//           </div>

//           {attendanceLoading ? (
//             <div className="gc-info-message">
//               Loading attendance...
//             </div>
//           ) : attendanceError ? (
//             <div className="gc-error-message">
//               {attendanceError}
//             </div>
//           ) : attendance.length === 0 ? (
//             <div className="gc-empty-message">
//               No attendance records found for this date.
//             </div>
//           ) : (
//             <div className="gc-table-wrapper">
//               <table className="gc-table">
//                 <thead>
//                   <tr>
//                     <th>Employee ID</th>
//                     <th>Employee Name</th>
//                     <th>Date</th>
//                     <th>Check In</th>
//                     <th>Check Out</th>
//                     <th>Attendance</th>
//                     <th>Approval</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {attendance.map((record) => (
//                     <tr
//                       key={
//                         record.attendanceId ||
//                         record.id
//                       }
//                     >
//                       <td>
//                         {record.employeeId || "—"}
//                       </td>

//                       <td>
//                         {employeeMap.get(record.employeeId) ||
//                           record.employeeName ||
//                           "—"}
//                       </td>

//                       <td>
//                         {formatDate(
//                           record.attendanceDate ??
//                           record.date ??
//                           record.attendance_date
//                         )}
//                       </td>

//                       <td>
//                         {formatTime(record.checkInTime)}
//                       </td>

//                       <td>
//                         {formatTime(record.checkOutTime)}
//                       </td>

//                       <td>
//                         <StatusBadge
//                           status={
//                             record.attendanceStatus ??
//                             record.attendance_status ??
//                             record.status
//                           }
//                         />
//                       </td>

//                       <td>
//                         <StatusBadge
//                           status={
//                             normalizeStatus(record.status) ===
//                               "APPROVED"
//                               ? "APPROVED"
//                               : isPending(record)
//                                 ? "PENDING"
//                                 : record.approvalStatus ||
//                                 record.status
//                           }
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>

//       </main>
//     </div>
//   );
// }