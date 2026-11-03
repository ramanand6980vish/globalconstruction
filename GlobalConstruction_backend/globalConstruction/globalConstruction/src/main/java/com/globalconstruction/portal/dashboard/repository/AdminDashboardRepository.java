package com.globalconstruction.portal.dashboard.repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.globalconstruction.portal.dashboard.dto.AttendanceOverviewDTO;
import com.globalconstruction.portal.dashboard.dto.SiteWorkforceDTO;
import com.globalconstruction.portal.dashboard.dto.PayrollOverviewDTO;

@Repository
public class AdminDashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    public AdminDashboardRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 1. Total active employees
    public long getTotalEmployees() {

        String sql = """
                SELECT COUNT(*)
                FROM employee
                WHERE status = 'ACTIVE'
                """;

        Long result = jdbcTemplate.queryForObject(sql, Long.class);

        return result == null ? 0L : result;
    }

    // 2. Today's attendance summary
    public AttendanceOverviewDTO getAttendanceSummary(LocalDate date) {

        String sql = """
                SELECT
                    COALESCE(SUM(
                        CASE WHEN attendance_status = 'PRESENT'
                        THEN 1 ELSE 0 END
                    ), 0) AS present_count,

                    COALESCE(SUM(
                        CASE WHEN attendance_status = 'ABSENT'
                        THEN 1 ELSE 0 END
                    ), 0) AS absent_count,

                    COALESCE(SUM(
                        CASE WHEN attendance_status = 'HALF_DAY'
                        THEN 1 ELSE 0 END
                    ), 0) AS half_day_count,

                    COALESCE(SUM(
                        CASE WHEN attendance_status = 'LEAVE'
                        THEN 1 ELSE 0 END
                    ), 0) AS leave_count

                FROM attendance
                WHERE attendance_date = ?
                """;

        return jdbcTemplate.queryForObject(
                sql,
                (rs, rowNum) -> new AttendanceOverviewDTO(
                        rs.getLong("present_count"),
                        rs.getLong("absent_count"),
                        rs.getLong("half_day_count"),
                        rs.getLong("leave_count")
                ),
                date
        );
    }

    // 3. Workforce grouped by site
    public List<SiteWorkforceDTO> getWorkforceBySite(LocalDate date) {

        String sql = """
                SELECT
                    s.site_id,
                    s.site_name,
                    COUNT(DISTINCT a.employee_id) AS employee_count

                FROM attendance a

                INNER JOIN site s
                    ON s.site_id = a.site_id

                WHERE a.attendance_date = ?
                  AND a.attendance_status IN ('PRESENT', 'HALF_DAY')

                GROUP BY s.site_id, s.site_name

                ORDER BY employee_count DESC
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new SiteWorkforceDTO(
                        rs.getString("site_id"),
                        rs.getString("site_name"),
                        rs.getLong("employee_count")
                ),
                date
        );
    }

    // 4. Pending attendance approvals.
    // SUBMITTED is the workflow status in your attendance table.
    public long getPendingAttendanceCorrections() {

        String sql = """
                SELECT COUNT(*)
                FROM attendance
                WHERE status = 'SUBMITTED'
                """;

        Long result = jdbcTemplate.queryForObject(sql, Long.class);

        return result == null ? 0L : result;
    }

    // 5. Pending advance requests
    public long getPendingAdvanceRequests() {

        String sql = """
                SELECT COUNT(*)
                FROM advance
                WHERE UPPER(status) = 'PENDING'
                """;

        Long result = jdbcTemplate.queryForObject(sql, Long.class);

        return result == null ? 0L : result;
    }

    // 6. Documents waiting for verification
    public long getPendingDocuments() {

        String sql = """
                SELECT COUNT(*)
                FROM employee_document
                WHERE UPPER(verification_status) = 'PENDING'
                """;

        Long result = jdbcTemplate.queryForObject(sql, Long.class);

        return result == null ? 0L : result;
    }

    // 7. Latest payroll period
    public PayrollOverviewDTO getLatestPayroll() {

        String sql = """
                SELECT
                    pay_period_start,
                    pay_period_end,
                    COALESCE(SUM(net_salary), 0) AS total_amount,

                    CASE
                        WHEN SUM(
                            CASE WHEN UPPER(payment_status) = 'PENDING'
                            THEN 1 ELSE 0 END
                        ) > 0
                        THEN 'UNDER_REVIEW'

                        WHEN SUM(
                            CASE WHEN UPPER(payment_status) = 'PAID'
                            THEN 1 ELSE 0 END
                        ) = COUNT(*)
                        THEN 'PAID'

                        ELSE 'PROCESSING'
                    END AS payroll_status

                FROM payroll

                GROUP BY pay_period_start, pay_period_end

                ORDER BY pay_period_end DESC, pay_period_start DESC

                LIMIT 1
                """;

        List<PayrollOverviewDTO> result = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> mapPayroll(rs)
        );

        if (result.isEmpty()) {
            return new PayrollOverviewDTO(
                    "No payroll available",
                    BigDecimal.ZERO,
                    "NOT_STARTED",
                    null
            );
        }

        return result.get(0);
    }

    private PayrollOverviewDTO mapPayroll(ResultSet rs)
            throws SQLException {

        LocalDate startDate =
                rs.getDate("pay_period_start").toLocalDate();

        String month = startDate.getMonth()
                .getDisplayName(
                        java.time.format.TextStyle.FULL,
                        java.util.Locale.ENGLISH
                ) + " " + startDate.getYear();

        return new PayrollOverviewDTO(
                month,
                rs.getBigDecimal("total_amount"),
                rs.getString("payroll_status"),
                null
        );
    }
}