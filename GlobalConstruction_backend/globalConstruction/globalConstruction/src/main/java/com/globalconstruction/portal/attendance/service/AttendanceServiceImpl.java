
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

import com.globalconstruction.portal.attendance.dto.AttendanceRequest;
import com.globalconstruction.portal.attendance.dto.AttendanceRosterDTO;
import com.globalconstruction.portal.attendance.dto.SiteOptionDTO;
import com.globalconstruction.portal.attendance.mapper.AttendanceMapper;

@Service
public class AttendanceServiceImpl implements AttendanceService {

	private final JdbcTemplate jdbcTemplate;
	private final AttendanceMapper attendanceMapper;

	public AttendanceServiceImpl(JdbcTemplate jdbcTemplate, AttendanceMapper attendanceMapper) {

		this.jdbcTemplate = jdbcTemplate;
		this.attendanceMapper = attendanceMapper;
	}

	@Override
	public List<SiteOptionDTO> getActiveSites() {

		String sql = """
				SELECT site_id, site_code, site_name
				FROM site
				WHERE status = 'ACTIVE'
				ORDER BY site_name
				""";

		return jdbcTemplate.query(sql, (rs, rowNum) -> new SiteOptionDTO(rs.getString("site_id"),
				rs.getString("site_code"), rs.getString("site_name")));
	}

	@Override
	public List<AttendanceRosterDTO> getRoster(LocalDate date, String siteCode) {

		if (date == null) {
			throw new IllegalArgumentException("Attendance date is required.");
		}

		if (isBlank(siteCode)) {
			throw new IllegalArgumentException("Site code is required.");
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

			        ? AS attendance_date,

			        a.attendance_status,
			        a.check_in_time,
			        a.check_out_time,
			        a.regular_hours,
			        a.half_day_hours,
			        a.overtime_hours,
			        a.remarks,
			        a.source,
			        a.status AS approval_status

			    FROM employee e

			    CROSS JOIN site s

			    LEFT JOIN attendance a
			        ON a.employee_id = e.employee_id
			        AND a.site_id = s.site_id
			        AND a.attendance_date = ?

			    LEFT JOIN department d
			        ON d.department_id = e.department_id

			    LEFT JOIN designation des
			        ON des.designation_id = e.designation_id

			    WHERE e.status = 'ACTIVE'
			        AND s.status = 'ACTIVE'
			        AND s.site_code = ?

			    ORDER BY e.employee_code
			    """;
		return jdbcTemplate.query(sql, attendanceMapper, date, date, siteCode.trim());
	}

	@Override
	@Transactional
	public AttendanceRosterDTO markAttendance(AttendanceRequest request) {

		validateRequest(request);

		String employeeId = request.getEmployeeId().trim();
		String siteCode = request.getSiteCode().trim();

		LocalDate attendanceDate = request.getAttendanceDate();

		// Verify employee.
		Integer employeeCount = jdbcTemplate.queryForObject("""
				SELECT COUNT(*)
				FROM employee
				WHERE employee_id = ?
				  AND status = 'ACTIVE'
				""", Integer.class, employeeId);

		if (employeeCount == null || employeeCount == 0) {
			throw new IllegalArgumentException("Active employee not found.");
		}

		// Verify site and retrieve site ID.
		List<String> siteIds = jdbcTemplate.query("""
				SELECT site_id
				FROM site
				WHERE site_code = ?
				  AND status = 'ACTIVE'
				""", (rs, rowNum) -> rs.getString("site_id"), siteCode);

		if (siteIds.isEmpty()) {
			throw new IllegalArgumentException("Active site not found.");
		}

		String siteId = siteIds.get(0);

		// Check whether attendance already exists.
		List<String> attendanceIds = jdbcTemplate.query("""
				SELECT attendance_id
				FROM attendance
				WHERE employee_id = ?
				  AND site_id = ?
				  AND attendance_date = ?
				LIMIT 1
				""", (rs, rowNum) -> rs.getString("attendance_id"), employeeId, siteId, attendanceDate);

		String attendanceStatus = request.getAttendanceStatus().trim().toUpperCase();

		LocalDateTime now = LocalDateTime.now();

		Timestamp checkIn = request.getCheckInTime() == null ? null
				: Timestamp.valueOf(attendanceDate.atTime(request.getCheckInTime()));

		Timestamp checkOut = request.getCheckOutTime() == null ? null
				: Timestamp.valueOf(attendanceDate.atTime(request.getCheckOutTime()));

		BigDecimal regularHours = zeroIfNull(request.getRegularHours());

		BigDecimal halfDayHours = zeroIfNull(request.getHalfDayHours());

		BigDecimal overtimeHours = zeroIfNull(request.getOvertimeHours());

		if (!attendanceIds.isEmpty()) {

			// Update existing attendance.
			String attendanceId = attendanceIds.get(0);

			jdbcTemplate.update("""
					UPDATE attendance
					SET attendance_status = ?,
					    check_in_time = ?,
					    check_out_time = ?,
					    regular_hours = ?,
					    half_day_hours = ?,
					    overtime_hours = ?,
					    remarks = ?,
					    source = 'WEB',
					    status = 'SUBMITTED',
					    approved_by = NULL,
					    approved_at = NULL,
					    updated_at = ?
					WHERE attendance_id = ?
					""", attendanceStatus, checkIn, checkOut, regularHours, halfDayHours, overtimeHours,
					request.getRemarks(), Timestamp.valueOf(now), attendanceId);

		} else {

			// Insert new attendance.
			String attendanceId = "ATT-" + attendanceDate.toString().replace("-", "") + "-"
					+ UUID.randomUUID().toString().substring(0, 8).toUpperCase();

			jdbcTemplate.update("""
					INSERT INTO attendance (
					    attendance_id,
					    employee_id,
					    site_id,
					    site_code,
					    attendance_date,
					    attendance_status,
					    check_in_time,
					    check_out_time,
					    regular_hours,
					    half_day_hours,
					    overtime_hours,
					    remarks,
					    source,
					    status,
					    created_at,
					    updated_at
					)
					VALUES (
					    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
					    ?, 'WEB', 'SUBMITTED', ?, ?
					)
					""", attendanceId, employeeId, siteId, siteCode, attendanceDate, attendanceStatus, checkIn,
					checkOut, regularHours, halfDayHours, overtimeHours, request.getRemarks(), Timestamp.valueOf(now),
					Timestamp.valueOf(now));
		}

		// Return the updated roster row.
		return getRoster(attendanceDate, siteCode).stream().filter(row -> employeeId.equals(row.getEmployeeId()))
				.findFirst()
				.orElseThrow(() -> new IllegalStateException("Attendance saved, but roster row was not found."));
	}

	private void validateRequest(AttendanceRequest request) {

		if (request == null) {
			throw new IllegalArgumentException("Request body is required.");
		}

		if (isBlank(request.getEmployeeId())) {
			throw new IllegalArgumentException("Employee ID is required.");
		}

		if (isBlank(request.getSiteCode())) {
			throw new IllegalArgumentException("Site code is required.");
		}

		if (request.getAttendanceDate() == null) {
			throw new IllegalArgumentException("Attendance date is required.");
		}

		if (isBlank(request.getAttendanceStatus())) {
			throw new IllegalArgumentException("Attendance status is required.");
		}

		List<String> allowedStatuses = List.of("PRESENT", "ABSENT", "HALF_DAY", "LEAVE", "HOLIDAY", "WEEK_OFF");

		String status = request.getAttendanceStatus().trim().toUpperCase();

		if (!allowedStatuses.contains(status)) {
			throw new IllegalArgumentException("Invalid attendance status: " + status);
		}

		validateHours(request.getRegularHours(), "Regular hours");
		validateHours(request.getHalfDayHours(), "Half-day hours");
		validateHours(request.getOvertimeHours(), "Overtime hours");

		if (request.getCheckInTime() != null && request.getCheckOutTime() != null
				&& request.getCheckOutTime().isBefore(request.getCheckInTime())) {

			throw new IllegalArgumentException("Check-out time cannot be before check-in time.");
		}
	}

	private void validateHours(BigDecimal value, String fieldName) {

		if (value != null && (value.compareTo(BigDecimal.ZERO) < 0 || value.compareTo(new BigDecimal("99.99")) > 0
				|| value.scale() > 2)) {

			throw new IllegalArgumentException(
					fieldName + " must be between 0 and 99.99 with at most 2 decimal places.");
		}
	}

	private BigDecimal zeroIfNull(BigDecimal value) {
		return value == null ? BigDecimal.ZERO : value;
	}

	private boolean isBlank(String value) {
		return value == null || value.trim().isEmpty();
	}
}
