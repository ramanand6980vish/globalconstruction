
-- ============================================================
-- CLIENT
-- ============================================================

CREATE TABLE client (
    client_id VARCHAR(30) NOT NULL,
    company_id VARCHAR(30) NOT NULL,
    client_code VARCHAR(30) NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150),
    mobile_no VARCHAR(20),
    email VARCHAR(150),
    address TEXT,
    gstin VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_client PRIMARY KEY (client_id),
    CONSTRAINT uk_client_code UNIQUE (client_code),
    CONSTRAINT fk_client_company
        FOREIGN KEY (company_id)
        REFERENCES company(company_id)
);

CREATE TABLE site (
    site_id VARCHAR(30) NOT NULL,
    company_id VARCHAR(30) NOT NULL,
    client_id VARCHAR(30) NOT NULL,
    site_code VARCHAR(30) NOT NULL,
    site_name VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    contract_start_date DATE,
    contract_end_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_site PRIMARY KEY (site_id),
    CONSTRAINT uk_site_code UNIQUE (site_code),
    CONSTRAINT fk_site_company
        FOREIGN KEY (company_id)
        REFERENCES company(company_id),
    CONSTRAINT fk_site_client
        FOREIGN KEY (client_id)
        REFERENCES client(client_id)
);
