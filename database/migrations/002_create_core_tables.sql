-- Drop tables if they create conflicts or to reset
DROP TABLE IF EXISTS prescription_items CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS pharmacy_items CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS patient_statuses CASCADE;

-- Create Patient Statuses Table
CREATE TABLE IF NOT EXISTS patient_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(50) UNIQUE NOT NULL
);

-- Create Patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    mother_name VARCHAR(255),
    dob DATE,
    village VARCHAR(255) NOT NULL,
    ethnicity VARCHAR(255),
    cns VARCHAR(50), -- Cartão SUS
    image_url TEXT,
    status_id UUID REFERENCES patient_statuses(id),
    allergies TEXT,
    conditions TEXT,
    blood_type VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Pharmacy Items table (Farmácia Viva Inventory)
CREATE TABLE IF NOT EXISTS pharmacy_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255),
    type VARCHAR(50), -- 'Dried', 'Fresh', 'Tincture', 'Syrup', etc.
    stock_quantity INTEGER DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'units', -- 'g', 'ml', 'units'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT,
    notes TEXT, -- Prontuário / Observações
    status VARCHAR(50) DEFAULT 'Scheduled', -- 'Scheduled', 'Completed', 'Cancelled', 'In Progress'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id),
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Prescription Items table
CREATE TABLE IF NOT EXISTS prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    pharmacy_item_id UUID REFERENCES pharmacy_items(id) ON DELETE SET NULL, -- Optional link to pharmacy stock
    type VARCHAR(50) NOT NULL, -- 'Alopático' or 'Tradicional'
    name VARCHAR(255) NOT NULL, -- Copied from pharmacy item OR typed manually
    dosage VARCHAR(255) NOT NULL,
    frequency VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
CREATE INDEX IF NOT EXISTS idx_patients_cns ON patients(cns);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_prescriptions_appointment_id ON prescriptions(appointment_id);
