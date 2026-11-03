
package com.globalconstruction.portal.attendance.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.globalconstruction.portal.attendance.entity.Attendance;

@Repository
public interface AttendanceRepository
        extends JpaRepository<Attendance, String> {

    Optional<Attendance> findFirstByEmployeeIdAndSiteIdAndAttendanceDate(
            String employeeId,
            String siteId,
            LocalDate attendanceDate
    );

    boolean existsByEmployeeIdAndSiteIdAndAttendanceDate(
            String employeeId,
            String siteId,
            LocalDate attendanceDate
    );
}
