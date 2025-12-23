-- Add duration and end_date to prescription_items table available for both traditional and allopathic items
ALTER TABLE prescription_items ADD COLUMN IF NOT EXISTS duration VARCHAR(100);
ALTER TABLE prescription_items ADD COLUMN IF NOT EXISTS end_date DATE;

-- Create index for performance on fetching active treatments
CREATE INDEX IF NOT EXISTS idx_prescription_items_end_date ON prescription_items(end_date);
