package com.globalconstruction.portal.attendance.service;

import java.time.LocalDate;
import java.util.List;

import com.globalconstruction.portal.attendance.dto.AttendanceInitialDataDTO;
import com.globalconstruction.portal.attendance.dto.AttendanceRequest;
import com.globalconstruction.portal.attendance.dto.AttendanceRosterDTO;

public interface AttendanceService {

    AttendanceInitialDataDTO getInitialData();

    List<AttendanceRosterDTO> getAttendanceRecords(
            LocalDate date);

    AttendanceRosterDTO markAttendance(
            AttendanceRequest request);
}
