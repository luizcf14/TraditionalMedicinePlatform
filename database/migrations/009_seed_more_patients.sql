-- Ensure unique constraint on cns exists (Drop standard index from 002 first)
DROP INDEX IF EXISTS idx_patients_cns;
CREATE UNIQUE INDEX IF NOT EXISTS idx_patients_cns ON patients(cns);

-- Seed More Patients
INSERT INTO patients (name, mother_name, dob, village, ethnicity, cns, cpf, status_id, image_url, allergies, conditions, blood_type)
VALUES 
(
    'Iracema Pataxó',
    'Jurema Pataxó',
    '1992-03-10',
    'Aldeia Coroa Vermelha',
    'Pataxó',
    '700000000000002',
    '123.456.789-00',
    (SELECT id FROM patient_statuses WHERE label = 'Aguardando'),
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAfzomiUCPd39Snktnyr86sMaQ2nNRXGMg6TgHtl9p77-vowxGIYtIJR_H34u9_uGAOQ6BrcsrH6Gnqmr6vt3cI3hS8dmxfCzrslMvr5N9Gt74Sg4HODCy1JUGZjIS99aZMnZTy6NEyU5gs6fciD4_MlXjnkfpBRGz59VqyIUEp9nmEkmrbIJcZZESSycNTmkh2CAQrHbxd3jH0GLqmm9oY1-y_r_sDTGjsSmmy7JqoeyxHElptTBVQIazK1pE_YwWthshY48mcSSw',
    'Nenhuma',
    'Gestante',
    'A+'
),
(
    'Raoni Kayapó',
    'Niara Kayapó',
    '1960-11-05',
    'Aldeia Metuktire',
    'Kayapó',
    '700000000000003',
    '987.654.321-99',
    (SELECT id FROM patient_statuses WHERE label = 'Em Tratamento'),
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC4RhLLdMvP9af8lqdepQvH2ZT2JnTPBSR0YL9olWGuXg7evXxQYq6__6-1Tpch5UfGflTgIvL2vyv22Q9hE1mfgsE8qSqJQh2Af4hV3_HuAkBeJwDwCNkX2SNmwiPbQ8Q_VaktpRsLCZ2-MfqoqI-I4KyHRbaki0msMyFOBZZB8CMpqQc5Gm0PC9U0BJyZf-NOT7LNAUM-G8zlPjl9Jdy7xEEajXwvhgcrb_O1Db7pL3t-yJ2jBEWrHErcgc4R7gmfXA-QMQiJAjU',
    'Penicilina',
    'Dor crônica nas costas',
    'O-'
)
ON CONFLICT (cns) DO NOTHING;

-- Seed Appointment for Today (for Dashboard Demo)
INSERT INTO appointments (patient_id, doctor_id, date, reason, notes, status)
VALUES 
(
    (SELECT id FROM patients WHERE cns = '700000000000002'), -- Iracema
    (SELECT id FROM users WHERE email = 'luizcf14@gmail.com'),
    CURRENT_DATE + INTERVAL '14 hours', -- 14:00 Today
    'Consulta',
    'Acompanhamento de rotina.',
    'Agendada'
);
