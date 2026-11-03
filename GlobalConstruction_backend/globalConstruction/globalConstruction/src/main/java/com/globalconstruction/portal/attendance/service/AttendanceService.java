
package com.globalconstruction.portal.attendance.service;

import java.time.LocalDate;
import java.util.List;

import com.globalconstruction.portal.attendance.dto.AttendanceRequest;
import com.globalconstruction.portal.attendance.dto.AttendanceRosterDTO;
import com.globalconstruction.portal.attendance.dto.SiteOptionDTO;

public interface AttendanceService {

    List<SiteOptionDTO> getActiveSites();

    List<AttendanceRosterDTO> getRoster(
            LocalDate date,
            String siteCode
    );

    AttendanceRosterDTO markAttendance(
            AttendanceRequest request
    );
}
