-- Create Function to Auto-Conclude Appointment
CREATE OR REPLACE FUNCTION auto_conclude_appointment()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE appointments
    SET status = 'Concluida', updated_at = NOW()
    WHERE id = NEW.appointment_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger on Prescriptions Table
DROP TRIGGER IF EXISTS trigger_auto_conclude ON prescriptions;
CREATE TRIGGER trigger_auto_conclude
AFTER INSERT ON prescriptions
FOR EACH ROW
EXECUTE FUNCTION auto_conclude_appointment();
