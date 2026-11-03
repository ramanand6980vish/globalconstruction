-- ============================================================
-- V6: EMPLOYEE INFORMATION & STATUTORY COMPLIANCE
-- ============================================================

-- ============================================================
-- EMPLOYEE ASSIGNMENT
-- ============================================================

CREATE TABLE employee_assignment (
    assignment_id VARCHAR(30) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    site_id VARCHAR(30) NOT NULL,
    supervisor_employee_id VARCHAR(36),
    designation_id VARCHAR(30),
    department_id VARCHAR(30),
    start_date DATE NOT NULL,
    end_date DATE,
    billable_status VARCHAR(30),
    gate_pass_no VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_employee_assignment
        PRIMARY KEY (assignment_id),

    CONSTRAINT fk_assignment_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id),

    CONSTRAINT fk_assignment_site
        FOREIGN KEY (site_id)
        REFERENCES site(site_id),

    CONSTRAINT fk_assignment_supervisor
        FOREIGN KEY (supervisor_employee_id)
        REFERENCES employee(employee_id),

    CONSTRAINT fk_assignment_designation
        FOREIGN KEY (designation_id)
        REFERENCES designation(designation_id),

    CONSTRAINT fk_assignment_department
        FOREIGN KEY (department_id)
        REFERENCES department(department_id)
);

-- ============================================================
-- EMPLOYEE DOCUMENT
-- ============================================================

CREATE TABLE employee_document (
    document_id VARCHAR(30) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(150),
    file_name VARCHAR(255),
    file_url TEXT,
    file_size BIGINT,
    mime_type VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    verification_status VARCHAR(30),
    verified_by VARCHAR(36),
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_employee_document
        PRIMARY KEY (document_id),

    CONSTRAINT fk_document_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id),

    CONSTRAINT fk_document_verified_by
        FOREIGN KEY (verified_by)
        REFERENCES `user`(user_id)
);

-- ============================================================
-- EMPLOYEE IDENTIFICATION
-- ============================================================

CREATE TABLE employee_identification (
    identification_id VARCHAR(30) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    identification_type VARCHAR(50) NOT NULL,
    identification_number VARCHAR(100) NOT NULL,
    name_on_document VARCHAR(150),
    issue_date DATE,
    expiry_date DATE,
    verification_status VARCHAR(30),
    document_id VARCHAR(30),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_employee_identification
        PRIMARY KEY (identification_id),

    CONSTRAINT fk_identification_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id),

    CONSTRAINT fk_identification_document
        FOREIGN KEY (document_id)
        REFERENCES employee_document(document_id)
);

-- ============================================================
-- EMPLOYEE STATUTORY
-- ============================================================

CREATE TABLE employee_statutory (
    statutory_id VARCHAR(30) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    uan_number VARCHAR(30),
    pf_number VARCHAR(30),
    esic_number VARCHAR(30),
    pf_applicable BOOLEAN NOT NULL DEFAULT FALSE,
    esic_applicable BOOLEAN NOT NULL DEFAULT FALSE,
    pf_join_date DATE,
    esic_join_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_employee_statutory
        PRIMARY KEY (statutory_id),

    CONSTRAINT fk_statutory_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
);

-- ============================================================
-- EMPLOYEE BANK ACCOUNT
-- ============================================================

CREATE TABLE employee_bank_account (
    bank_account_id VARCHAR(30) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_holder_name VARCHAR(150),
    account_number VARCHAR(50) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    upi_id VARCHAR(100),
    account_type VARCHAR(30),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_employee_bank_account
        PRIMARY KEY (bank_account_id),

    CONSTRAINT fk_bank_account_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
);

-- ============================================================
-- EMPLOYEE EMERGENCY CONTACT
-- ============================================================

CREATE TABLE employee_emergency_contact (
    emergency_contact_id VARCHAR(30) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    name VARCHAR(150) NOT NULL,
    relationship VARCHAR(50),
    mobile_no VARCHAR(20),
    alternate_mobile_no VARCHAR(20),
    address TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_employee_emergency_contact
        PRIMARY KEY (emergency_contact_id),

    CONSTRAINT fk_emergency_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
);