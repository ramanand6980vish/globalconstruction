
package com.globalconstruction.portal.common.id;

import java.time.Year;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IdGeneratorService {

    private final JdbcTemplate jdbcTemplate;

    public IdGeneratorService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public String generateId(String prefix) {

        if (prefix == null || !prefix.matches("[A-Z]{3}")) {
            throw new IllegalArgumentException(
                "Prefix must contain exactly three uppercase letters"
            );
        }

        String yearSuffix =
            String.valueOf(Year.now().getValue()).substring(2);

        jdbcTemplate.update(
            "INSERT INTO id_sequence (prefix, year_suffix, next_value) " +
            "VALUES (?, ?, LAST_INSERT_ID(1)) " +
            "ON DUPLICATE KEY UPDATE " +
            "next_value = LAST_INSERT_ID(next_value + 1)",
            prefix,
            yearSuffix
        );

        Long sequence = jdbcTemplate.queryForObject(
            "SELECT LAST_INSERT_ID()",
            Long.class
        );

        if (sequence == null || sequence < 1) {
            throw new IllegalStateException(
                "Unable to generate ID for prefix: " + prefix
            );
        }

        return prefix + yearSuffix +
            String.format("%03d", sequence);
    }
}

