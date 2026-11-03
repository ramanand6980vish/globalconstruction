CREATE TABLE id_sequence (
    prefix VARCHAR(3) NOT NULL,
    year_suffix VARCHAR(2) NOT NULL,
    next_value BIGINT NOT NULL,
    PRIMARY KEY (prefix, year_suffix)
);