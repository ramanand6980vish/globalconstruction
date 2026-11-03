package com.globalconstruction.portal.dashboard.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.globalconstruction.portal.dashboard.dto.AdminDashboardResponse;
import com.globalconstruction.portal.dashboard.dto.AttendanceOverviewDTO;
import com.globalconstruction.portal.dashboard.dto.DashboardSummaryDTO;
import com.globalconstruction.portal.dashboard.dto.PendingActionsDTO;
import com.globalconstruction.portal.dashboard.dto.PayrollOverviewDTO;
import com.globalconstruction.portal.dashboard.dto.SiteWorkforceDTO;
import com.globalconstruction.portal.dashboard.repository.AdminDashboardRepository;
import com.globalconstruction.portal.dashboard.service.AdminDashboardService;

@Service
@Transactional(readOnly = true)
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final AdminDashboardRepository dashboardRepository;

    public AdminDashboardServiceImpl(
            AdminDashboardRepository dashboardRepository) {

        this.dashboardRepository = dashboardRepository;
    }

    @Override
    public AdminDashboardResponse getDashboard() {

        LocalDate today = LocalDate.now();

        // Employee count
        long totalEmployees =
                dashboardRepository.getTotalEmployees();

        // Attendance summary
        AttendanceOverviewDTO attendance =
                dashboardRepository.getAttendanceSummary(today);

        // Dashboard summary cards
        DashboardSummaryDTO summary =
                new DashboardSummaryDTO(
                        totalEmployees,
                        attendance.getPresent(),
                        attendance.getAbsent()
                );

        // Site-wise workforce
        List<SiteWorkforceDTO> workforceBySite =
                dashboardRepository.getWorkforceBySite(today);

        // Pending actions
        PendingActionsDTO pendingActions =
                new PendingActionsDTO(
                        dashboardRepository.getPendingAttendanceCorrections(),
                        dashboardRepository.getPendingAdvanceRequests(),
                        dashboardRepository.getPendingDocuments()
                );

        // Payroll
        PayrollOverviewDTO payroll =
                dashboardRepository.getLatestPayroll();

        // Contractor name is static until a company/profile source
        // is provided.
        String contractorName = "Manoj";

        return new AdminDashboardResponse(
                today,
                contractorName,
                summary,
                attendance,
                workforceBySite,
                pendingActions,
                payroll
        );
    }
}