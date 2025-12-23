-- Add cpf column to patients table
ALTER TABLE patients ADD COLUMN IF NOT EXISTS cpf VARCHAR(14);
CREATE INDEX IF NOT EXISTS idx_patients_cpf ON patients(cpf);
