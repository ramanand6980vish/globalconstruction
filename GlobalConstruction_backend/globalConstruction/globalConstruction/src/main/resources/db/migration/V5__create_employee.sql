-- ============================================================
-- EMPLOYEE
-- ============================================================

CREATE TABLE employee (
    employee_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(30) NOT NULL,
    employee_code VARCHAR(30) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    father_name VARCHAR(150),
    date_of_birth DATE,
    gender VARCHAR(20),
    marital_status VARCHAR(30),
    mobile_no VARCHAR(20),
    blood_group VARCHAR(10),
    department_id VARCHAR(30),
    designation_id VARCHAR(30),
    grade VARCHAR(30),
    joining_date DATE,
    termination_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    gate_pass_no VARCHAR(50),
    billable_status VARCHAR(30),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_employee
        PRIMARY KEY (employee_id),

    CONSTRAINT uk_employee_code
        UNIQUE (employee_code),

    CONSTRAINT fk_employee_company
        FOREIGN KEY (company_id)
        REFERENCES company(company_id),

    CONSTRAINT fk_employee_department
        FOREIGN KEY (department_id)
        REFERENCES department(department_id),

    CONSTRAINT fk_employee_designation
        FOREIGN KEY (designation_id)
        REFERENCES designation(designation_id)
);

-- ============================================================
-- USER -> EMPLOYEE
-- Added here because employee did not exist when V2 ran.
-- ============================================================

ALTER TABLE `user`
    ADD CONSTRAINT fk_user_employee
    FOREIGN KEY (employee_id)
    REFERENCES employee(employee_id);