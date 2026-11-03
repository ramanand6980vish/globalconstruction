-- ============================================================
-- V10: SYSTEM, NOTIFICATION & AUDIT TABLES
-- ============================================================

-- ============================================================
-- NOTIFICATION
-- ============================================================

CREATE TABLE notification (
    notification_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(30) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    reference_type VARCHAR(50),
    reference_id VARCHAR(36),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_notification
        PRIMARY KEY (notification_id),

    CONSTRAINT fk_notification_company
        FOREIGN KEY (company_id)
        REFERENCES company(company_id),

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES `user`(user_id)
);

-- ============================================================
-- AUDIT LOG
-- ============================================================

CREATE TABLE audit_log (
    audit_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(30) NOT NULL,
    user_id VARCHAR(36),
    `action` VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_audit_log
        PRIMARY KEY (audit_id),

    CONSTRAINT fk_audit_company
        FOREIGN KEY (company_id)
        REFERENCES company(company_id),

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id)
        REFERENCES `user`(user_id)
);