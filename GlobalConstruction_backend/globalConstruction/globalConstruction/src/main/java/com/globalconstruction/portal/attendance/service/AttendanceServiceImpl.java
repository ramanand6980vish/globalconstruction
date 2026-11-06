package com.globalconstruction.portal.attendance.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.globalconstruction.portal.attendance.dto.AttendanceEmployeeDTO;
import com.globalconstruction.portal.attendance.dto.AttendanceInitialDataDTO;
import com.globalconstruction.portal.attendance.dto.AttendanceRequest;
import com.globalconstruction.portal.attendance.dto.AttendanceRosterDTO;
import com.globalconstruction.portal.attendance.dto.SiteOptionDTO;
import com.globalconstruction.portal.attendance.mapper.AttendanceMapper;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    private final JdbcTemplate jdbcTemplate;
    private final AttendanceMapper attendanceMapper;

    public AttendanceServiceImpl(
            JdbcTemplate jdbcTemplate,
            AttendanceMapper attendanceMapper) {

        this.jdbcTemplate = jdbcTemplate;
        this.attendanceMapper = attendanceMapper;
    }

    // =====================================================
    // INITIAL DATA: EMPLOYEES + SITES
    // =====================================================

    @Override
    public AttendanceInitialDataDTO getInitialData() {

        String employeeSql = """
                SELECT
                    e.employee_id,
                    e.employee_code,

                    TRIM(CONCAT_WS(' ',
                        e.first_name,
                        NULLIF(e.middle_name, ''),
                        NULLIF(e.last_name, '')
                    )) AS employee_name,

                    COALESCE(d.department_name, 'N/A') AS department,
                    COALESCE(des.designation_name, 'N/A') AS designation

                FROM employee e

                LEFT JOIN department d
                    ON d.department_id = e.department_id

                LEFT JOIN designation des
                    ON des.designation_id = e.designation_id

                WHERE e.status = 'ACTIVE'

                ORDER BY e.employee_code
                """;

        List<AttendanceEmployeeDTO> employees =
                jdbcTemplate.query(employeeSql, (rs, rowNum) ->
                        new AttendanceEmployeeDTO(
                                rs.getString("employee_id"),
                                rs.getString("employee_code"),
                                rs.getString("employee_name"),
                                rs.getString("department"),
                                rs.getString("designation")
                        )
                );

        String siteSql = """
                SELECT
                    site_id,
                    site_code,
                    site_name

                FROM site

                WHERE status = 'ACTIVE'

                ORDER BY site_name
                """;

        List<SiteOptionDTO> sites =
                jdbcTemplate.query(siteSql, (rs, rowNum) ->
                        new SiteOptionDTO(
                                rs.getString("site_id"),
                                rs.getString("site_code"),
                                rs.getString("site_name")
                        )
                );

        return new AttendanceInitialDataDTO(
                employees,
                sites
        );
    }

    // =====================================================
    // ATTENDANCE RECORDS FOR SELECTED DATE
    // =====================================================

    @Override
    public List<AttendanceRosterDTO> getAttendanceRecords(
            LocalDate date) {

        if (date == null) {
            throw new IllegalArgumentException(
                    "Attendance date is required.");
        }

        String sql = """
                SELECT
                    a.attendance_id,

                    e.employee_id,
                    e.employee_code,

                    TRIM(CONCAT_WS(' ',
                        e.first_name,
                        NULLIF(e.middle_name, ''),
                        NULLIF(e.last_name, '')
                    )) AS employee_name,

                    COALESCE(d.department_name, 'N/A') AS department,
                    COALESCE(des.designation_name, 'N/A') AS designation,

                    s.site_id,
                    s.site_code,
                    s.site_name,

                    a.attendance_date,

                    a.attendance_status,
                    a.check_in_time,
                    a.check_out_time,
                    a.regular_hours,
                    a.half_day_hours,

                    COALESCE((
                        SELECT SUM(o.hours)
                        FROM overtime o
                        WHERE o.attendance_id = a.attendance_id
                    ), 0) AS overtime_hours,

                    a.remarks,
                    a.source,
                    a.status AS approval_status

                FROM attendance a

                INNER JOIN employee e
                    ON e.employee_id = a.employee_id

                INNER JOIN site s
                    ON s.site_id = a.site_id

                LEFT JOIN department d
                    ON d.department_id = e.department_id

                LEFT JOIN designation des
                    ON des.designation_id = e.designation_id

                WHERE a.attendance_date = ?

                ORDER BY s.site_name, e.employee_code
                """;

        return jdbcTemplate.query(
                sql,
                attendanceMapper,
                date
        );
    }

    // =====================================================
    // MARK / UPDATE ATTENDANCE
    // =====================================================

    @Override
    @Transactional
    public AttendanceRosterDTO markAttendance(
            AttendanceRequest request) {

        validateRequest(request);

        String employeeId = request.getEmployeeId().trim();
        String siteCode = request.getSiteCode().trim();

        LocalDate attendanceDate =
                request.getAttendanceDate();

        Integer employeeCount =
                jdbcTemplate.queryForObject(
                        """
                        SELECT COUNT(*)
                        FROM employee
                        WHERE employee_id = ?
                          AND status = 'ACTIVE'
                        """,
                        Integer.class,
                        employeeId
                );

        if (employeeCount == null || employeeCount == 0) {
            throw new IllegalArgumentException(
                    "Active employee not found.");
        }

        List<String> siteIds =
                jdbcTemplate.query(
                        """
                        SELECT site_id
                        FROM site
                        WHERE site_code = ?
                          AND status = 'ACTIVE'
                        """,
                        (rs, rowNum) ->
                                rs.getString("site_id"),
                        siteCode
                );

        if (siteIds.isEmpty()) {
            throw new IllegalArgumentException(
                    "Active site not found.");
        }

        String siteId = siteIds.get(0);

        List<String> attendanceIds =
                jdbcTemplate.query(
                        """
                        SELECT attendance_id
                        FROM attendance
                        WHERE employee_id = ?
                          AND site_id = ?
                          AND attendance_date = ?
                        LIMIT 1
                        """,
                        (rs, rowNum) ->
                                rs.getString("attendance_id"),
                        employeeId,
                        siteId,
                        attendanceDate
                );

        String attendanceStatus =
                request.getAttendanceStatus()
                        .trim()
                        .toUpperCase();

        LocalDateTime now = LocalDateTime.now();

        Timestamp checkIn =
                request.getCheckInTime() == null
                        ? null
                        : Timestamp.valueOf(
                                attendanceDate.atTime(
                                        request.getCheckInTime()));

        Timestamp checkOut =
                request.getCheckOutTime() == null
                        ? null
                        : Timestamp.valueOf(
                                attendanceDate.atTime(
                                        request.getCheckOutTime()));

        BigDecimal regularHours =
                zeroIfNull(request.getRegularHours());

        BigDecimal halfDayHours =
                zeroIfNull(request.getHalfDayHours());

        if (!attendanceIds.isEmpty()) {

            String attendanceId =
                    attendanceIds.get(0);

            String updateSql = """
                    UPDATE attendance

                    SET attendance_status = ?,
                        check_in_time = ?,
                        check_out_time = ?,
                        regular_hours = ?,
                        half_day_hours = ?,
                        remarks = ?,
                        source = 'WEB',
                        status = 'SUBMITTED',
                        approved_by = NULL,
                        approved_at = NULL,
                        updated_at = ?

                    WHERE attendance_id = ?
                    """;

            jdbcTemplate.update(
                    updateSql,
                    attendanceStatus,
                    checkIn,
                    checkOut,
                    regularHours,
                    halfDayHours,
                    request.getRemarks(),
                    Timestamp.valueOf(now),
                    attendanceId
            );

        } else {

            String attendanceId =
                    "ATT-"
                    + attendanceDate.toString()
                            .replace("-", "")
                    + "-"
                    + UUID.randomUUID()
                            .toString()
                            .substring(0, 8)
                            .toUpperCase();

            String insertSql = """
                    INSERT INTO attendance (
                        attendance_id,
                        employee_id,
                        site_id,
                        attendance_date,
                        attendance_status,
                        check_in_time,
                        check_out_time,
                        regular_hours,
                        half_day_hours,
                        remarks,
                        source,
                        status,
                        created_at,
                        updated_at
                    )

                    VALUES (
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                        'WEB', 'SUBMITTED', ?, ?
                    )
                    """;

            jdbcTemplate.update(
                    insertSql,
                    attendanceId,
                    employeeId,
                    siteId,
                    attendanceDate,
                    attendanceStatus,
                    checkIn,
                    checkOut,
                    regularHours,
                    halfDayHours,
                    request.getRemarks(),
                    Timestamp.valueOf(now),
                    Timestamp.valueOf(now)
            );
        }

        // Return the saved record for this employee and site.
        return getAttendanceRecords(attendanceDate)
                .stream()
                .filter(row ->
                        employeeId.equals(row.getEmployeeId())
                        && siteId.equals(row.getSiteId()))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Attendance saved, but record was not found."));
    }

    // =====================================================
    // VALIDATION
    // =====================================================

    private void validateRequest(
            AttendanceRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Request body is required.");
        }

        if (isBlank(request.getEmployeeId())) {
            throw new IllegalArgumentException(
                    "Employee ID is required.");
        }

        if (isBlank(request.getSiteCode())) {
            throw new IllegalArgumentException(
                    "Site code is required.");
        }

        if (request.getAttendanceDate() == null) {
            throw new IllegalArgumentException(
                    "Attendance date is required.");
        }

        if (isBlank(request.getAttendanceStatus())) {
            throw new IllegalArgumentException(
                    "Attendance status is required.");
        }

        List<String> allowedStatuses = List.of(
                "PRESENT",
                "ABSENT",
                "HALF_DAY",
                "LEAVE",
                "HOLIDAY",
                "WEEK_OFF"
        );

        String status =
                request.getAttendanceStatus()
                        .trim()
                        .toUpperCase();

        if (!allowedStatuses.contains(status)) {
            throw new IllegalArgumentException(
                    "Invalid attendance status: " + status);
        }

        validateHours(
                request.getRegularHours(),
                "Regular hours");

        validateHours(
                request.getHalfDayHours(),
                "Half-day hours");

        validateHours(
                request.getOvertimeHours(),
                "Overtime hours");

        if (request.getCheckInTime() != null
                && request.getCheckOutTime() != null
                && request.getCheckOutTime()
                        .isBefore(request.getCheckInTime())) {

            throw new IllegalArgumentException(
                    "Check-out time cannot be before check-in time.");
        }
    }

    private void validateHours(
            BigDecimal value,
            String fieldName) {

        if (value != null
                && (value.compareTo(BigDecimal.ZERO) < 0
                || value.compareTo(
                        new BigDecimal("99.99")) > 0
                || value.scale() > 2)) {

            throw new IllegalArgumentException(
                    fieldName
                    + " must be between 0 and 99.99 "
                    + "with at most 2 decimal places.");
        }
    }

    private BigDecimal zeroIfNull(
            BigDecimal value) {

        return value == null
                ? BigDecimal.ZERO
                : value;
    }

    private boolean isBlank(
            String value) {

        return value == null
                || value.trim().isEmpty();
    }
}
