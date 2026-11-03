package com.globalconstruction.portal.dashboard.dto;

import java.math.BigDecimal;

public class PayrollOverviewDTO {

    private String month;
    private BigDecimal amount;
    private String status;
    private String runId;

    public PayrollOverviewDTO(
            String month,
            BigDecimal amount,
            String status,
            String runId) {

        this.month = month;
        this.amount = amount;
        this.status = status;
        this.runId = runId;
    }

    public String getMonth() {
        return month;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getStatus() {
        return status;
    }

    public String getRunId() {
        return runId;
    }
}