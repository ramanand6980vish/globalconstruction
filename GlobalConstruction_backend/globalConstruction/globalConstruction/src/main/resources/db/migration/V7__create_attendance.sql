-- ============================================================
-- V7: ATTENDANCE MANAGEMENT
-- ============================================================

-- ============================================================
-- ATTENDANCE
-- ============================================================

CREATE TABLE attendance (
    attendance_id VARCHAR(36) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    site_id VARCHAR(30) NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_status VARCHAR(30) NOT NULL,
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    regular_hours NUMERIC(4,2),
    half_day_hours NUMERIC(4,2),
    remarks TEXT,
    source VARCHAR(30),
    approved_by VARCHAR(36),
    approved_at TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_attendance
        PRIMARY KEY (attendance_id),

    CONSTRAINT fk_attendance_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id),

    CONSTRAINT fk_attendance_site
        FOREIGN KEY (site_id)
        REFERENCES site(site_id),

    CONSTRAINT fk_attendance_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES `user`(user_id),

    CONSTRAINT uk_attendance_employee_date
        UNIQUE (employee_id, attendance_date)
);

-- ============================================================
-- OVERTIME
-- ============================================================

CREATE TABLE overtime (
    overtime_id VARCHAR(36) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    attendance_id VARCHAR(36) NOT NULL,
    site_id VARCHAR(30) NOT NULL,
    overtime_date DATE NOT NULL,
    hours NUMERIC(4,2) NOT NULL,
    rate NUMERIC(10,2),
    amount NUMERIC(10,2),
    status VARCHAR(20) NOT NULL,
    approved_by VARCHAR(36),
    approved_at TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_overtime
        PRIMARY KEY (overtime_id),

    CONSTRAINT fk_overtime_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id),

    CONSTRAINT fk_overtime_attendance
        FOREIGN KEY (attendance_id)
        REFERENCES attendance(attendance_id),

    CONSTRAINT fk_overtime_site
        FOREIGN KEY (site_id)
        REFERENCES site(site_id),

    CONSTRAINT fk_overtime_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES `user`(user_id)
);

-- ============================================================
-- HOLIDAY CALENDAR
-- ============================================================

CREATE TABLE holiday_calendar (
    holiday_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(30) NOT NULL,
    site_id VARCHAR(30),
    holiday_date DATE NOT NULL,
    holiday_name VARCHAR(100) NOT NULL,
    holiday_type VARCHAR(50),
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(20) NOT NULL,

    CONSTRAINT pk_holiday_calendar
        PRIMARY KEY (holiday_id),

    CONSTRAINT fk_holiday_company
        FOREIGN KEY (company_id)
        REFERENCES company(company_id),

    CONSTRAINT fk_holiday_site
        FOREIGN KEY (site_id)
        REFERENCES site(site_id)
);

-- ============================================================
-- LEAVE REQUEST
-- ============================================================

CREATE TABLE leave_request (
    leave_id VARCHAR(36) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    site_id VARCHAR(30),
    leave_type VARCHAR(50) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    total_days NUMERIC(4,1) NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL,
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_by VARCHAR(36),
    approved_at TIMESTAMP,
    remarks TEXT,

    CONSTRAINT pk_leave_request
        PRIMARY KEY (leave_id),

    CONSTRAINT fk_leave_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id),

    CONSTRAINT fk_leave_site
        FOREIGN KEY (site_id)
        REFERENCES site(site_id),

    CONSTRAINT fk_leave_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES `user`(user_id)
);