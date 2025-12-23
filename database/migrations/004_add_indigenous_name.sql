-- Add indigenous_name column to patients table
ALTER TABLE patients ADD COLUMN IF NOT EXISTS indigenous_name VARCHAR(255);
