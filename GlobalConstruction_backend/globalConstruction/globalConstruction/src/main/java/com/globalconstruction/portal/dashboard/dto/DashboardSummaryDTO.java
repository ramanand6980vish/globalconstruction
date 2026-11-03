package com.globalconstruction.portal.dashboard.dto;

public class DashboardSummaryDTO {

    private long totalEmployees;
    private long presentToday;
    private long absentToday;

    public DashboardSummaryDTO(
            long totalEmployees,
            long presentToday,
            long absentToday) {

        this.totalEmployees = totalEmployees;
        this.presentToday = presentToday;
        this.absentToday = absentToday;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public long getPresentToday() {
        return presentToday;
    }

    public long getAbsentToday() {
        return absentToday;
    }
}