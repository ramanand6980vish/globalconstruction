package com.globalconstruction.portal.dashboard.dto;

public class PendingActionsDTO {

    private long attendanceCorrections;
    private long advanceRequests;
    private long documentsPending;

    public PendingActionsDTO(
            long attendanceCorrections,
            long advanceRequests,
            long documentsPending) {

        this.attendanceCorrections = attendanceCorrections;
        this.advanceRequests = advanceRequests;
        this.documentsPending = documentsPending;
    }

    public long getAttendanceCorrections() {
        return attendanceCorrections;
    }

    public long getAdvanceRequests() {
        return advanceRequests;
    }

    public long getDocumentsPending() {
        return documentsPending;
    }
}