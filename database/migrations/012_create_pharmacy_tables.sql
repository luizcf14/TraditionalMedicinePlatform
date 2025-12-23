-- Create Plants Table
CREATE TABLE IF NOT EXISTS plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    scientific_name TEXT,
    indigenous_name TEXT,
    description TEXT,
    main_use TEXT,
    usage_parts JSONB DEFAULT '[]',
    indications TEXT,
    preparation TEXT,
    dosage TEXT,
    contraindications TEXT,
    cultivation_info JSONB DEFAULT '{}',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Treatments Table
CREATE TABLE IF NOT EXISTS treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    origin TEXT,
    indications TEXT,
    ingredients JSONB DEFAULT '[]',
    preparation_method TEXT,
    duration TEXT,
    frequency TEXT,
    side_effects TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add Foreign Keys to prescription_items
ALTER TABLE prescription_items 
ADD COLUMN IF NOT EXISTS plant_id UUID REFERENCES plants(id),
ADD COLUMN IF NOT EXISTS treatment_id UUID REFERENCES treatments(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_prescription_items_plant_id ON prescription_items(plant_id);
CREATE INDEX IF NOT EXISTS idx_prescription_items_treatment_id ON prescription_items(treatment_id);
