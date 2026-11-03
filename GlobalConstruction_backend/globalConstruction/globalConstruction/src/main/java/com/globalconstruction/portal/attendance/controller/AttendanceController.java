
package com.globalconstruction.portal.attendance.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.globalconstruction.portal.attendance.dto.AttendanceRequest;
import com.globalconstruction.portal.attendance.dto.AttendanceRosterDTO;
import com.globalconstruction.portal.attendance.dto.SiteOptionDTO;
import com.globalconstruction.portal.attendance.service.AttendanceService;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5173"
})
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/sites")
    public ResponseEntity<?> getActiveSites() {

        try {
            List<SiteOptionDTO> sites =
                attendanceService.getActiveSites();

            return ResponseEntity.ok(sites);

        } catch (Exception ex) {
            return ResponseEntity.status(
                HttpStatus.INTERNAL_SERVER_ERROR
            ).body(Map.of(
                "message", "Unable to load active sites."
            ));
        }
    }

    @GetMapping("/roster")
    public ResponseEntity<?> getRoster(
            @RequestParam LocalDate date,
            @RequestParam String siteCode) {

        try {
            List<AttendanceRosterDTO> roster =
                attendanceService.getRoster(date, siteCode);

            return ResponseEntity.ok(roster);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(
                Map.of("message", ex.getMessage())
            );

        } catch (Exception ex) {
            ex.printStackTrace();

            return ResponseEntity.status(
                HttpStatus.INTERNAL_SERVER_ERROR
            ).body(Map.of(
                "message", "Unable to load attendance roster."
            ));
        }
    }

    @PutMapping("/mark")
    public ResponseEntity<?> markAttendance(
            @RequestBody AttendanceRequest request) {

        try {
            AttendanceRosterDTO saved =
                attendanceService.markAttendance(request);

            return ResponseEntity.ok(saved);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(
                Map.of("message", ex.getMessage())
            );

        } catch (Exception ex) {
            ex.printStackTrace();

            return ResponseEntity.status(
                HttpStatus.INTERNAL_SERVER_ERROR
            ).body(Map.of(
                "message", "Unable to save attendance."
            ));
        }
    }
}
