-- Standardize Appointment Statuses
-- Map legacy English statuses to new Portuguese fixed set: 'Agendada', 'Concluida', 'Cancelada'

UPDATE appointments 
SET status = 'Agendada' 
WHERE status IN ('Scheduled', 'In Progress', 'Rescheduled');

UPDATE appointments 
SET status = 'Concluida' 
WHERE status IN ('Completed', 'Done');

UPDATE appointments 
SET status = 'Cancelada' 
WHERE status IN ('Cancelled', 'Canceled');

-- Ensure all others default to Agendada if not matched (safety net)
UPDATE appointments 
SET status = 'Agendada' 
WHERE status NOT IN ('Agendada', 'Concluida', 'Cancelada');
