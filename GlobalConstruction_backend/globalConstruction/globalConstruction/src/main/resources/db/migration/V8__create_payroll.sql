-- ============================================================
-- PAYROLL
-- ============================================================

CREATE TABLE IF NOT EXISTS payroll (
    payroll_id VARCHAR(20) NOT NULL,
    company_id VARCHAR(30) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,

    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,

    basic_salary DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    allowances DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    overtime_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    bonus DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    deductions DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    gross_salary DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    net_salary DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_date DATE NULL,
    payment_reference VARCHAR(100) NULL,
    remarks VARCHAR(500) NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (payroll_id),

    CONSTRAINT fk_payroll_company
        FOREIGN KEY (company_id)
        REFERENCES company(company_id),

    CONSTRAINT fk_payroll_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id),

    CONSTRAINT chk_payroll_period
        CHECK (pay_period_end >= pay_period_start),

    CONSTRAINT chk_payroll_amounts
        CHECK (
            basic_salary >= 0
            AND allowances >= 0
            AND overtime_amount >= 0
            AND bonus >= 0
            AND deductions >= 0
            AND tax_amount >= 0
            AND gross_salary >= 0
            AND net_salary >= 0
        )
);

-- ============================================================
-- PAYROLL RUN
-- ============================================================

CREATE TABLE payroll_run (
    payroll_run_id VARCHAR(255) NOT NULL PRIMARY KEY,
    company_id VARCHAR(30),
    payroll_month INT,
    payroll_year INT,
    period_start DATE,
    period_end DATE,
    status VARCHAR(30),
    total_employees INT,
    total_gross NUMERIC(12,2),
    total_pf NUMERIC(12,2),
    total_esic NUMERIC(12,2),
    total_advance NUMERIC(12,2),
    total_deductions NUMERIC(12,2),
    total_net_payable NUMERIC(12,2),
    calculated_at TIMESTAMP,
    calculated_by VARCHAR(255),
    approved_at TIMESTAMP,
    approved_by VARCHAR(255),
    finalized_at TIMESTAMP,
    finalized_by VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    FOREIGN KEY (company_id)
        REFERENCES company(company_id)
);

-- ============================================================
-- PAYROLL DETAIL
-- ============================================================

CREATE TABLE payroll_detail (
    payroll_detail_id VARCHAR(255) NOT NULL PRIMARY KEY,
    payroll_run_id VARCHAR(255),
    employee_id VARCHAR(36),
    working_days NUMERIC(4,1),
    present_days NUMERIC(4,1),
    absent_days NUMERIC(4,1),
    half_days NUMERIC(4,1),
    leave_days NUMERIC(4,1),
    holiday_days NUMERIC(4,1),
    basic_amount NUMERIC(10,2),
    wage_amount NUMERIC(10,2),
    overtime_amount NUMERIC(10,2),
    bonus_amount NUMERIC(10,2),
    gross_amount NUMERIC(10,2),
    pf_employee NUMERIC(10,2),
    esic_employee NUMERIC(10,2),
    advance_recovery NUMERIC(10,2),
    other_deductions NUMERIC(10,2),
    total_deductions NUMERIC(10,2),
    net_payable NUMERIC(10,2),
    bank_account_id VARCHAR(30),
    status VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    FOREIGN KEY (payroll_run_id)
        REFERENCES payroll_run(payroll_run_id),

    FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id),

    FOREIGN KEY (bank_account_id)
        REFERENCES employee_bank_account(bank_account_id)
);