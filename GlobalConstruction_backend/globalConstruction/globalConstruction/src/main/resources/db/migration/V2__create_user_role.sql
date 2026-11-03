-- ============================================================
-- ROLE
-- ============================================================

CREATE TABLE role (
    role_id VARCHAR(36) NOT NULL,
    role_code VARCHAR(30) NOT NULL,
    role_name VARCHAR(50) NOT NULL,
    description VARCHAR(255),

    CONSTRAINT pk_role
        PRIMARY KEY (role_id),

    CONSTRAINT uk_role_code
        UNIQUE (role_code)
);

-- ============================================================
-- USER
-- ============================================================

CREATE TABLE `user` (
    user_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(30) NOT NULL,
    employee_id VARCHAR(36),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    mobile_no VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_user
        PRIMARY KEY (user_id),

    CONSTRAINT uk_user_username
        UNIQUE (username),

    CONSTRAINT uk_user_email
        UNIQUE (email),

    CONSTRAINT fk_user_company
        FOREIGN KEY (company_id)
        REFERENCES company(company_id)
);

-- ============================================================
-- USER ROLE
-- ============================================================

CREATE TABLE user_role (
    user_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(36) NOT NULL,

    CONSTRAINT pk_user_role
        PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_user_role_user
        FOREIGN KEY (user_id)
        REFERENCES `user`(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_role_role
        FOREIGN KEY (role_id)
        REFERENCES role(role_id)
        ON DELETE CASCADE
);