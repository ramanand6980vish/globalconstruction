
package com.globalconstruction.portal.attendance.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.globalconstruction.portal.attendance.dto.AttendanceRosterDTO;

@Component
public class AttendanceMapper implements RowMapper<AttendanceRosterDTO> {

    @Override
    public AttendanceRosterDTO mapRow(ResultSet rs, int rowNum)
            throws SQLException {

        AttendanceRosterDTO dto = new AttendanceRosterDTO();

        dto.setAttendanceId(rs.getString("attendance_id"));

        dto.setEmployeeId(rs.getString("employee_id"));
        dto.setEmployeeCode(rs.getString("employee_code"));
        dto.setEmployeeName(rs.getString("employee_name"));

        dto.setDepartment(rs.getString("department"));
        dto.setDesignation(rs.getString("designation"));

        dto.setSiteId(rs.getString("site_id"));
        dto.setSiteCode(rs.getString("site_code"));
        dto.setSiteName(rs.getString("site_name"));

        if (rs.getDate("attendance_date") != null) {
            dto.setAttendanceDate(
                rs.getDate("attendance_date").toLocalDate()
            );
        }

        dto.setAttendanceStatus(rs.getString("attendance_status"));

        if (rs.getTimestamp("check_in_time") != null) {
            dto.setCheckInTime(
                rs.getTimestamp("check_in_time").toLocalDateTime()
            );
        }

        if (rs.getTimestamp("check_out_time") != null) {
            dto.setCheckOutTime(
                rs.getTimestamp("check_out_time").toLocalDateTime()
            );
        }

        dto.setRegularHours(rs.getBigDecimal("regular_hours"));
        dto.setHalfDayHours(rs.getBigDecimal("half_day_hours"));
        dto.setOvertimeHours(rs.getBigDecimal("overtime_hours"));

        dto.setRemarks(rs.getString("remarks"));
        dto.setSource(rs.getString("source"));
        dto.setApprovalStatus(rs.getString("approval_status"));

        return dto;
    }
}
