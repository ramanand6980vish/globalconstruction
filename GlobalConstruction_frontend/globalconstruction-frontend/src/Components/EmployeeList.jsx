
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cssFiles/empDetail&List.css";

const EMPLOYEE_API = "http://localhost:8081/api/employees";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(EMPLOYEE_API, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setEmployees(
          Array.isArray(data) ? data : Array.isArray(data.content) ? data.content : []
        );
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setError("Unable to load employees. Please check the backend API.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="employee-page">Loading employees...</div>;
  }

  if (error) {
    return <div className="employee-page employee-error">{error}</div>;
  }

  return (
    <div className="employee-page">
      <div className="employee-page-header">
        <div>
          <h1>Employees</h1>
          <p>View and manage employee information.</p>
        </div>

        <span className="employee-count">
          Total Employees: {employees.length}
        </span>
      </div>

      <div className="employee-table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Name</th>
              <th>Department ID</th>
              <th>Designation ID</th>
              <th>Mobile</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="employee-empty">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.employeeId}>
                  <td>{employee.employeeCode || "-"}</td>

                  <td>
                    <button
                      type="button"
                      className="employee-name-link"
                      onClick={() =>
                        navigate(
                          `/admin/employees/${encodeURIComponent(
                            employee.employeeId
                          )}`
                        )
                      }
                    >
                      {[
                        employee.firstName,
                        employee.middleName,
                        employee.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ") || "View employee"}
                    </button>
                  </td>

                  <td>{employee.departmentId || "-"}</td>
                  <td>{employee.designationId || "-"}</td>
                  <td>{employee.mobileNo || "-"}</td>

                  <td>
                    <span
                      className={`employee-status status-${String(
                        employee.status || "unknown"
                      ).toLowerCase()}`}
                    >
                      {employee.status || "-"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeList;
