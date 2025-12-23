import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query, pool } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verify user using pgcrypto's crypt function
        const result = await query(
            `SELECT id, full_name, role, email 
       FROM users 
       WHERE email = $1 AND password_hash = crypt($2, password_hash)`,
            [email, password]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.json({
                success: true,
                user: {
                    id: user.id,
                    name: user.full_name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Patient Search Route
app.get('/api/patients', async (req, res) => {
    const { q } = req.query;

    try {
        let text = `
            SELECT 
                p.id, 
                p.name, 
                p.mother_name as "motherName", 
                EXTRACT(YEAR FROM AGE(p.dob)) as age, 
                p.dob, 
                p.village, 
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM appointments a 
                        WHERE a.patient_id = p.id 
                        AND a.date::date = CURRENT_DATE 
                        AND a.status = 'Agendada'
                    ) THEN 'Aguardando'
                    ELSE ps.label 
                END as status, 
                p.cns,
                p.cpf,
                p.image_url as image 
            FROM patients p
            LEFT JOIN patient_statuses ps ON p.status_id = ps.id
        `;
        let values: any[] = [];

        if (q) {
            text += ' WHERE p.name ILIKE $1 OR p.cns ILIKE $1';
            values = [`%${q}%`];
        }

        text += ' ORDER BY p.name ASC LIMIT 20';

        const result = await query(text, values);
        res.json({ success: true, patients: result.rows });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get Patient by ID Route
app.get('/api/patients/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const text = `
            SELECT 
                p.id, 
                p.name, 
                p.mother_name as "motherName", 
                EXTRACT(YEAR FROM AGE(p.dob)) as age, 
                p.dob, 
                p.village, 
                p.ethnicity,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM appointments a 
                        WHERE a.patient_id = p.id 
                        AND a.date::date = CURRENT_DATE 
                        AND a.status = 'Agendada'
                    ) THEN 'Aguardando'
                    ELSE ps.label 
                END as status, 
                p.image_url as image,
                p.cns,
                p.cpf,
                p.allergies,
                p.conditions,
                p.blood_type as "bloodType",
                p.indigenous_name as "indigenousName"
            FROM patients p
            LEFT JOIN patient_statuses ps ON p.status_id = ps.id
            WHERE p.id = $1
        `;

        const result = await query(text, [id]);

        if (result.rows.length > 0) {
            res.json({ success: true, patient: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Get patient error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get Patient Appointments Route
app.get('/api/patients/:id/appointments', async (req, res) => {
    const { id } = req.params;

    try {
        const text = `
            SELECT 
                a.id, 
                a.patient_id as "patientId", 
                a.doctor_id as "doctorId", 
                u.full_name as "doctorName",
                a.date, 
                a.reason, 
                a.notes, 
                a.status,
                pr.diagnosis,
                pr.id as "prescriptionId",
                (
                    SELECT json_agg(json_build_object('name', pi.name, 'dosage', pi.dosage, 'frequency', pi.frequency, 'type', pi.type))
                    FROM prescription_items pi
                    WHERE pi.prescription_id = pr.id
                ) as "prescriptionItems"
            FROM appointments a
            LEFT JOIN users u ON a.doctor_id = u.id
            LEFT JOIN prescriptions pr ON a.id = pr.appointment_id
            WHERE a.patient_id = $1
            ORDER BY a.date DESC
        `;

        const result = await query(text, [id]);
        res.json({ success: true, appointments: result.rows });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Create Appointment Route
app.post('/api/appointments', async (req, res) => {
    const { patientId, doctorId, reason, notes, status, date } = req.body;

    try {
        // For MVP, if doctorId is missing, default to the seed user
        let finalDoctorId = doctorId;
        if (!finalDoctorId) {
            const userRes = await query("SELECT id FROM users WHERE email = 'luizcf14@gmail.com' LIMIT 1");
            if (userRes.rows.length > 0) {
                finalDoctorId = userRes.rows[0].id;
            }
        }

        const text = `
            INSERT INTO appointments (patient_id, doctor_id, date, reason, notes, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;
        // Use provided date. If it's just a YYYY-MM-DD string, force Noon to prevent timezone shifts.
        // If it's a full ISO string (has 'T'), trust the client's time.
        let appointmentDate;
        if (date) {
            if (date.length <= 10) {
                appointmentDate = new Date(date + 'T12:00:00');
            } else {
                appointmentDate = new Date(date);
            }
        } else {
            appointmentDate = new Date();
        }

        const values = [patientId, finalDoctorId, appointmentDate, reason || 'Consulta Inicial', notes || '', status || 'Agendada'];

        const result = await query(text, values);
        res.json({ success: true, appointmentId: result.rows[0].id });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update Appointment Route
app.put('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const { status, date } = req.body;

    try {
        let text = 'UPDATE appointments SET ';
        const values = [];
        let index = 1;

        if (status) {
            text += `status = $${index}, `;
            values.push(status);
            index++;
        }

        if (date) {
            text += `date = $${index}, `;
            values.push(date);
            index++;
        }

        // Remove trailing comma and space
        text = text.slice(0, -2);

        text += ` WHERE id = $${index}`;
        values.push(id);

        await query(text, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/api/prescriptions', async (req, res) => {
    const { appointmentId, doctorId, items, notes, diagnosis } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Create Prescription
        const prescriptionRes = await client.query(
            `INSERT INTO prescriptions (appointment_id, doctor_id, notes, diagnosis) 
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [appointmentId, doctorId, notes, diagnosis]
        );
        const prescriptionId = prescriptionRes.rows[0].id;

        // 2. Insert Items
        if (items && Array.isArray(items)) {
            for (const item of items) {
                await client.query(
                    `INSERT INTO prescription_items (prescription_id, type, name, dosage, frequency, duration, end_date, treatment_id, plant_id)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [
                        prescriptionId,
                        item.type,
                        item.name,
                        item.dosage,
                        item.frequency,
                        item.duration || null,
                        item.endDate || null,
                        item.treatmentDetails?.id || null,
                        item.plantDetails?.id || null
                    ]
                );
            }
        }

        // 3. Update Appointment Status
        // TRIGGER handles this now: auto_conclude_appointment()
        // Removed manual update to rely on database rule.

        await client.query('COMMIT');
        res.json({ success: true, prescriptionId });
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Prescription transaction error:', e);
        res.status(500).json({ success: false, message: 'Failed to save prescription' });
    } finally {
        client.release();
    }
});

// Get Appointments (Agenda)
app.get('/api/appointments', async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        let text = `
            SELECT 
                a.id, 
                a.date, 
                a.status, 
                a.reason,
                a.patient_id as "patientId",
                p.name as "patientName", 
                p.image_url as "patientImage"
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
        `;
        const params: any[] = [];

        if (startDate && endDate) {
            text += ` WHERE a.date BETWEEN $1 AND $2`;
            params.push(startDate, endDate);
        }

        text += ` ORDER BY a.date ASC`;

        const result = await query(text, params);
        res.json({ success: true, appointments: result.rows });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get Active Treatments Route
app.get('/api/patients/:id/active-treatments', async (req, res) => {
    const { id } = req.params;
    try {
        const text = `
            SELECT 
                pi.id,
                pi.name,
                pi.type,
                pi.dosage,
                pi.frequency,
                pi.duration,
                pi.end_date as "endDate",
                p.date as "startDate",
                u.full_name as "doctorName"
            FROM prescription_items pi
            JOIN prescriptions p ON pi.prescription_id = p.id
            JOIN appointments a ON p.appointment_id = a.id
            LEFT JOIN users u ON p.doctor_id = u.id
            WHERE a.patient_id = $1
            AND (pi.end_date >= CURRENT_DATE OR pi.duration ILIKE '%contínuo%' OR pi.duration ILIKE '%continuo%')
            ORDER BY pi.end_date DESC NULLS LAST
        `;
        const result = await query(text, [id]);
        res.json({ success: true, treatments: result.rows });
    } catch (error) {
        console.error('Get active treatments error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/api/appointments/:id/details', async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch Appointment Basics
        const appointmentRes = await query(
            `SELECT 
                a.id,
                a.patient_id as "patientId",
                a.doctor_id as "doctorId",
                a.date,
                a.reason,
                a.notes,
                a.status,
                u.full_name as "doctorName"
             FROM appointments a 
             LEFT JOIN users u ON a.doctor_id = u.id 
             WHERE a.id = $1`,
            [id]
        );

        if (appointmentRes.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Appointment not found' });
            return;
        }

        const appointment = appointmentRes.rows[0];

        // Fetch Prescription (if exists)
        const prescriptionRes = await query(
            `SELECT * FROM prescriptions WHERE appointment_id = $1`,
            [id]
        );

        let prescription = null;
        let items = [];

        if (prescriptionRes.rows.length > 0) {
            prescription = prescriptionRes.rows[0];
            const itemsRes = await query(
                `SELECT 
                    pi.*,
                    row_to_json(t.*) as treatment_details,
                    row_to_json(pl.*) as plant_details
                 FROM prescription_items pi
                 LEFT JOIN treatments t ON pi.treatment_id = t.id
                 LEFT JOIN plants pl ON pi.plant_id = pl.id
                 WHERE pi.prescription_id = $1`,
                [prescription.id]
            );
            items = itemsRes.rows.map(row => ({
                ...row,
                treatmentDetails: row.treatment_details ? {
                    id: row.treatment_details.id,
                    name: row.treatment_details.name,
                    origin: row.treatment_details.origin,
                    ingredients: row.treatment_details.ingredients, // Ensure JSON is parsed if needed, but pg usually handles row_to_json well
                    preparationMethod: row.treatment_details.preparation_method,
                    sideEffects: row.treatment_details.side_effects,
                    // Map other needed fields if necessary
                } : undefined,
                plantDetails: row.plant_details ? {
                    id: row.plant_details.id,
                    name: row.plant_details.name,
                    scientificName: row.plant_details.scientific_name,
                    preparation: row.plant_details.preparation,
                    contraindications: row.plant_details.contraindications
                    // Map other needed fields if necessary
                } : undefined
            }));
        }

        res.json({
            success: true,
            appointment: {
                ...appointment,
                doctorName: appointment.doctor_name
            },
            prescription,
            items
        });

    } catch (error) {
        console.error('Error fetching appointment details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.post('/api/patients', async (req, res) => {
    const { name, dob, village, ethnicity, cns, cpf, motherName, indigenousName, bloodType, allergies, conditions, image } = req.body;

    // Basic validation
    if (!name || !village) {
        res.status(400).json({ success: false, message: 'Nome e Aldeia são obrigatórios.' });
        return;
    }

    try {
        // Get 'Aguardando' or default status
        let statusId = null;
        const statusRes = await query("SELECT id FROM patient_statuses WHERE label = 'Aguardando' LIMIT 1");
        if (statusRes.rows.length > 0) {
            statusId = statusRes.rows[0].id;
        }

        // Use provided image or generate placeholder
        const imageUrl = image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

        const text = `
            INSERT INTO patients (name, dob, village, ethnicity, cns, mother_name, status_id, image_url, indigenous_name, cpf, blood_type, allergies, conditions)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id
        `;
        const values = [name, dob || null, village, ethnicity || null, cns || null, motherName || null, statusId, imageUrl, indigenousName || null, cpf || null, bloodType || null, allergies || null, conditions || null];

        const result = await query(text, values);
        res.json({ success: true, patientId: result.rows[0].id });

    } catch (error) {
        console.error('Create patient error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.put('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { name, dob, village, ethnicity, cns, cpf, motherName, indigenousName, bloodType, allergies, conditions, image } = req.body;

    try {
        let text = `
            UPDATE patients 
            SET name = $1, dob = $2, village = $3, ethnicity = $4, cns = $5, mother_name = $6, indigenous_name = $7, cpf = $8, blood_type = $9, allergies = $10, conditions = $11, updated_at = NOW()
        `;
        const values = [name, dob || null, village, ethnicity || null, cns || null, motherName || null, indigenousName || null, cpf || null, bloodType || null, allergies || null, conditions || null];
        let paramIndex = 12;

        if (image) {
            text += `, image_url = $${paramIndex}`;
            values.push(image);
            paramIndex++;
        }

        text += ` WHERE id = $${paramIndex}`;
        values.push(id);

        await query(text, values);
        res.json({ success: true });

    } catch (error) {
        console.error('Update patient error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Pharmacy Routes
app.get('/api/pharmacy/plants', async (req, res) => {
    try {
        const result = await query('SELECT * FROM plants ORDER BY name ASC');
        const plants = result.rows.map(p => ({
            id: p.id,
            name: p.name,
            scientificName: p.scientific_name,
            indigenousName: p.indigenous_name,
            description: p.description,
            mainUse: p.main_use,
            usageParts: p.usage_parts,
            indications: p.indications,
            preparation: p.preparation,
            dosage: p.dosage,
            contraindications: p.contraindications,
            cultivation: p.cultivation_info,
            image: p.image_url
        }));
        res.json({ success: true, plants });
    } catch (error) {
        console.error('Error fetching plants:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/api/pharmacy/treatments', async (req, res) => {
    try {
        const result = await query('SELECT * FROM treatments ORDER BY name ASC');
        const treatments = result.rows.map(t => ({
            id: t.id,
            name: t.name,
            origin: t.origin,
            indications: t.indications,
            ingredients: t.ingredients,
            preparationMethod: t.preparation_method,
            duration: t.duration,
            frequency: t.frequency,
            sideEffects: t.side_effects,
            notes: t.notes
        }));
        res.json({ success: true, treatments });
    } catch (error) {
        console.error('Error fetching treatments:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/api/pharmacy/plants', async (req, res) => {
    const { name, scientificName, indigenousName, description, mainUse, usageParts, indications, preparation, dosage, contraindications, cultivation, image } = req.body;

    // Basic validation
    if (!name) {
        res.status(400).json({ success: false, message: 'Name is required' });
        return;
    }

    try {
        const text = `
            INSERT INTO plants (name, scientific_name, indigenous_name, description, main_use, usage_parts, indications, preparation, dosage, contraindications, cultivation_info, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id
        `;
        const values = [name, scientificName, indigenousName, description, mainUse, JSON.stringify(usageParts || []), indications, preparation, dosage, contraindications, JSON.stringify(cultivation || {}), image];

        const result = await query(text, values);
        res.json({ success: true, id: result.rows[0].id });
    } catch (error) {
        console.error('Error creating plant:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/api/pharmacy/treatments', async (req, res) => {
    const { name, origin, indications, ingredients, preparationMethod, duration, frequency, sideEffects, notes } = req.body;

    if (!name) {
        res.status(400).json({ success: false, message: 'Name is required' });
        return;
    }

    try {
        const text = `
            INSERT INTO treatments (name, origin, indications, ingredients, preparation_method, duration, frequency, side_effects, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;
        const values = [name, origin, indications, JSON.stringify(ingredients || []), preparationMethod, duration, frequency, sideEffects, notes];

        const result = await query(text, values);
        res.json({ success: true, id: result.rows[0].id });
    } catch (error) {
        console.error('Error creating treatment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



app.put('/api/pharmacy/plants/:id', async (req, res) => {
    const { id } = req.params;
    const { name, scientificName, indigenousName, description, mainUse, usageParts, indications, preparation, dosage, contraindications, cultivation, image } = req.body;

    if (!name) {
        res.status(400).json({ success: false, message: 'Name is required' });
        return;
    }

    try {
        const text = `
            UPDATE plants 
            SET name = $1, scientific_name = $2, indigenous_name = $3, description = $4, main_use = $5, usage_parts = $6, indications = $7, preparation = $8, dosage = $9, contraindications = $10, cultivation_info = $11, image_url = $12
            WHERE id = $13
        `;
        const values = [name, scientificName, indigenousName, description, mainUse, JSON.stringify(usageParts || []), indications, preparation, dosage, contraindications, JSON.stringify(cultivation || {}), image, id];

        await query(text, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating plant:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.put('/api/pharmacy/treatments/:id', async (req, res) => {
    const { id } = req.params;
    const { name, origin, indications, ingredients, preparationMethod, duration, frequency, sideEffects, notes } = req.body;

    if (!name) {
        res.status(400).json({ success: false, message: 'Name is required' });
        return;
    }

    try {
        const text = `
            UPDATE treatments
            SET name = $1, origin = $2, indications = $3, ingredients = $4, preparation_method = $5, duration = $6, frequency = $7, side_effects = $8, notes = $9
            WHERE id = $10
        `;
        const values = [name, origin, indications, JSON.stringify(ingredients || []), preparationMethod, duration, frequency, sideEffects, notes, id];

        await query(text, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating treatment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.delete('/api/pharmacy/plants/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM plants WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting plant:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.delete('/api/pharmacy/treatments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM treatments WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting treatment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Global Search Route
app.get('/api/search', async (req, res) => {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.length < 2) {
        return res.json({ success: true, patients: [], plants: [], treatments: [] });
    }

    try {
        const term = `%${q}%`;

        // Parallel Search
        const [patientsRes, plantsRes, treatmentsRes] = await Promise.all([
            query(
                `SELECT id, name, image_url as image, village, cns 
                 FROM patients 
                 WHERE name ILIKE $1 OR cns ILIKE $1 
                 LIMIT 5`,
                [term]
            ),
            query(
                `SELECT id, name, scientific_name as "scientificName", image_url as image 
                 FROM plants 
                 WHERE name ILIKE $1 OR scientific_name ILIKE $1 OR indigenous_name ILIKE $1 
                 LIMIT 5`,
                [term]
            ),
            query(
                `SELECT id, name, indications 
                 FROM treatments 
                 WHERE name ILIKE $1 OR indications ILIKE $1 
                 LIMIT 5`,
                [term]
            )
        ]);

        res.json({
            success: true,
            patients: patientsRes.rows,
            plants: plantsRes.rows,
            treatments: treatmentsRes.rows
        });

    } catch (error) {
        console.error('Global search error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Dashboard Stats Route
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const treatmentsRes = await query('SELECT COUNT(*) FROM treatments');
        const prescriptionsRes = await query('SELECT COUNT(*) FROM prescriptions');
        const patientsRes = await query('SELECT COUNT(*) FROM patients');

        res.json({
            success: true,
            treatmentsCount: parseInt(treatmentsRes.rows[0].count, 10),
            prescriptionsCount: parseInt(prescriptionsRes.rows[0].count, 10),
            patientsCount: parseInt(patientsRes.rows[0].count, 10)
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
