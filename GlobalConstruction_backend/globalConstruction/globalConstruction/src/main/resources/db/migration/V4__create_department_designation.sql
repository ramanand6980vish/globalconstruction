
-- ============================================================
-- DEPARTMENT
-- ============================================================

CREATE TABLE department (
    department_id VARCHAR(30) NOT NULL,
    company_id VARCHAR(30) NOT NULL,
    department_code VARCHAR(30) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_department
        PRIMARY KEY (department_id),

    CONSTRAINT uk_department_code
        UNIQUE (department_code),

    CONSTRAINT fk_department_company
        FOREIGN KEY (company_id)
        REFERENCES company(company_id)
);

-- ============================================================
-- DESIGNATION
-- ============================================================

CREATE TABLE designation (
    designation_id VARCHAR(30) NOT NULL,
    company_id VARCHAR(30) NOT NULL,
    designation_code VARCHAR(30) NOT NULL,
    designation_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_designation
        PRIMARY KEY (designation_id),

    CONSTRAINT uk_designation_code
        UNIQUE (designation_code),

    CONSTRAINT fk_designation_company
        FOREIGN KEY (company_id)
        REFERENCES company(company_id)
);
