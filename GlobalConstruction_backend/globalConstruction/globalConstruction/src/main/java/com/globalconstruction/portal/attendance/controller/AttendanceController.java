package com.globalconstruction.portal.attendance.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.globalconstruction.portal.attendance.dto.AttendanceInitialDataDTO;
import com.globalconstruction.portal.attendance.dto.AttendanceRequest;
import com.globalconstruction.portal.attendance.dto.AttendanceRosterDTO;
import com.globalconstruction.portal.attendance.service.AttendanceService;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5175",
    "https://global-construction-portal.vercel.app"
})
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // Initial data: all employees and active sites
    @GetMapping
    public ResponseEntity<?> getInitialData() {

        try {
            AttendanceInitialDataDTO data =
                    attendanceService.getInitialData();

            return ResponseEntity.ok(data);

        } catch (Exception ex) {
            ex.printStackTrace();

            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "message",
                        "Unable to load attendance data."
                    ));
        }
    }

    // Fetch attendance for selected date across all sites
    @GetMapping("/records")
    public ResponseEntity<?> getAttendanceRecords(
            @RequestParam LocalDate date) {

        try {
            List<AttendanceRosterDTO> records =
                    attendanceService.getAttendanceRecords(date);

            return ResponseEntity.ok(records);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", ex.getMessage()));

        } catch (Exception ex) {
            ex.printStackTrace();

            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "message",
                        "Unable to load attendance records."
                    ));
        }
    }

    // Mark or update attendance
    @PutMapping("/mark")
    public ResponseEntity<?> markAttendance(
            @RequestBody AttendanceRequest request) {

        try {
            AttendanceRosterDTO saved =
                    attendanceService.markAttendance(request);

            return ResponseEntity.ok(saved);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", ex.getMessage()));

        } catch (Exception ex) {
            ex.printStackTrace();

            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "message",
                        "Unable to save attendance."
                    ));
        }
    }
}
