-- ============================================================
-- V9: ADVANCE & AMORTIZATION
-- ============================================================

-- ============================================================
-- ADVANCE
-- ============================================================

CREATE TABLE advance (
    advance_id VARCHAR(36) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    site_id VARCHAR(30) NOT NULL,
    request_date DATE NOT NULL,
    amount_requested NUMERIC(10,2) NOT NULL,
    amount_approved NUMERIC(10,2),
    purpose TEXT,
    status VARCHAR(20) NOT NULL,
    approved_by VARCHAR(36),
    approved_at TIMESTAMP,
    payment_date DATE,
    payment_reference VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_advance
        PRIMARY KEY (advance_id),

    CONSTRAINT fk_advance_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id),

    CONSTRAINT fk_advance_site
        FOREIGN KEY (site_id)
        REFERENCES site(site_id),

    CONSTRAINT fk_advance_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES `user`(user_id)
);

-- ============================================================
-- ADVANCE RECOVERY
-- ============================================================

CREATE TABLE advance_recovery (
    recovery_id VARCHAR(36) NOT NULL,
    advance_id VARCHAR(36) NOT NULL,
    payroll_detail_id VARCHAR(255),
    recovery_date DATE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_advance_recovery
        PRIMARY KEY (recovery_id),

    CONSTRAINT fk_recovery_advance
        FOREIGN KEY (advance_id)
        REFERENCES advance(advance_id),

    CONSTRAINT fk_recovery_payroll_detail
        FOREIGN KEY (payroll_detail_id)
        REFERENCES payroll_detail(payroll_detail_id)
);

-- ============================================================
-- RATE CARD
-- ============================================================

CREATE TABLE rate_card (
    rate_card_id VARCHAR(255) NOT NULL PRIMARY KEY,
    company_id VARCHAR(30),
    rate_card_name VARCHAR(100),
    grade VARCHAR(30),
    general_rate_per_hour NUMERIC(10,2),
    normal_rate_per_day NUMERIC(10,2),
    overtime_rate_per_hour NUMERIC(10,2),
    minimum_wage_per_day NUMERIC(10,2),
    effective_from DATE,
    effective_to DATE,
    status VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    FOREIGN KEY (company_id)
        REFERENCES company(company_id)
);

-- ============================================================
-- EMPLOYEE RATE HISTORY
-- ============================================================

CREATE TABLE employee_rate_history (
    employee_rate_id VARCHAR(255) NOT NULL PRIMARY KEY,
    employee_id VARCHAR(36),
    rate_card_id VARCHAR(255),
    effective_from DATE,
    effective_to DATE,
    basic_rate NUMERIC(10,2),
    daily_rate NUMERIC(10,2),
    hourly_rate NUMERIC(10,2),
    overtime_rate NUMERIC(10,2),
    minimum_wage NUMERIC(10,2),
    status VARCHAR(20),
    created_at TIMESTAMP,

    FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id),

    FOREIGN KEY (rate_card_id)
        REFERENCES rate_card(rate_card_id)
);

-- ============================================================
-- PAYROLL ADJUSTMENT
-- ============================================================

CREATE TABLE payroll_adjustment (
    adjustment_id VARCHAR(255) NOT NULL PRIMARY KEY,
    payroll_detail_id VARCHAR(255),
    adjustment_type VARCHAR(50),
    description VARCHAR(255),
    amount NUMERIC(10,2),
    calculation_type VARCHAR(30),
    percentage NUMERIC(5,2),
    status VARCHAR(20),
    created_at TIMESTAMP,

    FOREIGN KEY (payroll_detail_id)
        REFERENCES payroll_detail(payroll_detail_id)
);

-- ============================================================
-- PAYROLL PAYMENT
-- ============================================================

CREATE TABLE payroll_payment (
    payment_id VARCHAR(255) NOT NULL PRIMARY KEY,
    payroll_detail_id VARCHAR(255),
    payment_date DATE,
    payment_method VARCHAR(30),
    amount NUMERIC(10,2),
    bank_reference VARCHAR(100),
    transaction_reference VARCHAR(100),
    payment_status VARCHAR(20),
    remarks TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    FOREIGN KEY (payroll_detail_id)
        REFERENCES payroll_detail(payroll_detail_id)
);