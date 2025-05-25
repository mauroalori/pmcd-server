CREATE TABLE measurement (
    id SERIAL PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    
    static_pressure_in DOUBLE PRECISION,
    dynamic_pressure_in DOUBLE PRECISION,
    static_pressure_out DOUBLE PRECISION,
    dynamic_pressure_out DOUBLE PRECISION,
    
    flow_rate_in DOUBLE PRECISION,
    flow_rate_out DOUBLE PRECISION,
    
    ambient_temperature DOUBLE PRECISION,
    ambient_humidity DOUBLE PRECISION,
    ambient_pressure DOUBLE PRECISION
);
