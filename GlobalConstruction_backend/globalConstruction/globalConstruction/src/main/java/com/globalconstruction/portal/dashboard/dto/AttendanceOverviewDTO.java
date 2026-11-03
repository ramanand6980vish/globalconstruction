package com.globalconstruction.portal.dashboard.dto;

public class AttendanceOverviewDTO {

    private long present;
    private long absent;
    private long halfDay;
    private long leave;

    public AttendanceOverviewDTO(
            long present,
            long absent,
            long halfDay,
            long leave) {

        this.present = present;
        this.absent = absent;
        this.halfDay = halfDay;
        this.leave = leave;
    }

    public long getPresent() {
        return present;
    }

    public long getAbsent() {
        return absent;
    }

    public long getHalfDay() {
        return halfDay;
    }

    public long getLeave() {
        return leave;
    }
}