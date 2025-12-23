-- Enable pgcrypto for UUID generation and password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop users table to reset
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'doctor', -- 'doctor', 'admin', 'receptionist'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert initial seed user
-- Password: "qazx74123" hashed using bcrypt
INSERT INTO users (email, full_name, role, password_hash)
VALUES (
    'luizcf14@gmail.com',
    'Luiz Neto',
    'doctor',
    crypt('qazx74123', gen_salt('bf'))
)
ON CONFLICT (email) DO NOTHING;
