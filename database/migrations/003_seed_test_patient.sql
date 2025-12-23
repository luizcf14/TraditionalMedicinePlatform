-- Seed Patient Statuses
INSERT INTO patient_statuses (label) VALUES 
('Em Tratamento'), 
('Concluido'), 
('Aguardando')
ON CONFLICT (label) DO NOTHING;

-- Seed Test Patient
INSERT INTO patients (name, mother_name, dob, village, ethnicity, cns, status_id, image_url, allergies, conditions, blood_type)
VALUES (
    'João Tukano',
    'Maria Tukano',
    '1985-05-15',
    'Aldeia Yawara',
    'Tukano',
    '700000000000001',
    (SELECT id FROM patient_statuses WHERE label = 'Em Tratamento'),
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC4RhLLdMvP9af8lqdepQvH2ZT2JnTPBSR0YL9olWGuXg7evXxQYq6__6-1Tpch5UfGflTgIvL2vyv22Q9hE1mfgsE8qSqJQh2Af4hV3_HuAkBeJwDwCNkX2SNmwiPbQ8Q_VaktpRsLCZ2-MfqoqI-I4KyHRbaki0msMyFOBZZB8CMpqQc5Gm0PC9U0BJyZf-NOT7LNAUM-G8zlPjl9Jdy7xEEajXwvhgcrb_O1Db7pL3t-yJ2jBEWrHErcgc4R7gmfXA-QMQiJAjU',
    'Picada de Abelha',
    'Hipertensão Leve',
    'O+'
);

-- Seed Appointments
INSERT INTO appointments (patient_id, doctor_id, date, reason, notes, status)
VALUES 
(
    (SELECT id FROM patients WHERE cns = '700000000000001'),
    (SELECT id FROM users WHERE email = 'luizcf14@gmail.com'),
    NOW() - INTERVAL '3 days',
    'Mal-estar geral',
    'Paciente relata cansaço. Prescrito banho de ervas e repouso.',
    'Completed'
),
(
    (SELECT id FROM patients WHERE cns = '700000000000001'),
    (SELECT id FROM users WHERE email = 'luizcf14@gmail.com'),
    NOW() + INTERVAL '5 days',
    'Retorno',
    'Verificar pressão arterial.',
    'Scheduled'
);
