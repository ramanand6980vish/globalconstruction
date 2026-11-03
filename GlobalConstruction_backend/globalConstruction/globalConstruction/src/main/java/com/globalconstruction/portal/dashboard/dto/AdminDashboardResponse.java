package com.globalconstruction.portal.dashboard.dto;

import java.time.LocalDate;
import java.util.List;

public class AdminDashboardResponse {

    private LocalDate asOf;
    private String contractorName;

    private DashboardSummaryDTO summary;
    private AttendanceOverviewDTO attendanceSummary;

    private List<SiteWorkforceDTO> workforceBySite;

    private PendingActionsDTO pendingActions;

    private PayrollOverviewDTO payrollStatus;

    public AdminDashboardResponse(
            LocalDate asOf,
            String contractorName,
            DashboardSummaryDTO summary,
            AttendanceOverviewDTO attendanceSummary,
            List<SiteWorkforceDTO> workforceBySite,
            PendingActionsDTO pendingActions,
            PayrollOverviewDTO payrollStatus) {

        this.asOf = asOf;
        this.contractorName = contractorName;
        this.summary = summary;
        this.attendanceSummary = attendanceSummary;
        this.workforceBySite = workforceBySite;
        this.pendingActions = pendingActions;
        this.payrollStatus = payrollStatus;
    }

    public LocalDate getAsOf() {
        return asOf;
    }

    public String getContractorName() {
        return contractorName;
    }

    public DashboardSummaryDTO getSummary() {
        return summary;
    }

    public AttendanceOverviewDTO getAttendanceSummary() {
        return attendanceSummary;
    }

    public List<SiteWorkforceDTO> getWorkforceBySite() {
        return workforceBySite;
    }

    public PendingActionsDTO getPendingActions() {
        return pendingActions;
    }

    public PayrollOverviewDTO getPayrollStatus() {
        return payrollStatus;
    }
}