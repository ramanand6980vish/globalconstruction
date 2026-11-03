CREATE TABLE company (
    company_id VARCHAR(30) NOT NULL,
    company_code VARCHAR(30) NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    legal_name VARCHAR(200),
    contact_person VARCHAR(150),
    mobile_no VARCHAR(20),
    email VARCHAR(150),
    address_line1 VARCHAR(250),
    address_line2 VARCHAR(250),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    gstin VARCHAR(20),
    pan VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_company
        PRIMARY KEY (company_id),

    CONSTRAINT uk_company_code
        UNIQUE (company_code)
);