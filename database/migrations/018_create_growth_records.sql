CREATE TABLE growth_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight DECIMAL(5,2), -- kg
    height DECIMAL(5,2), -- cm
    head_circumference DECIMAL(5,2), -- cm
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster retrieval by patient and date
CREATE INDEX idx_growth_patient_date ON growth_records(patient_id, date);
