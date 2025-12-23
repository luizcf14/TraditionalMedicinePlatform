import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query, pool } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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
                ps.label as status, 
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
                ps.label as status, 
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
                a.status 
            FROM appointments a
            LEFT JOIN users u ON a.doctor_id = u.id
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
    const { appointmentId, doctorId, items, notes } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Create Prescription
        const prescriptionRes = await client.query(
            `INSERT INTO prescriptions (appointment_id, doctor_id, notes) 
             VALUES ($1, $2, $3) RETURNING id`,
            [appointmentId, doctorId, notes]
        );
        const prescriptionId = prescriptionRes.rows[0].id;

        // 2. Insert Items
        if (items && Array.isArray(items)) {
            for (const item of items) {
                await client.query(
                    `INSERT INTO prescription_items (prescription_id, type, name, dosage, frequency, duration, end_date)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [prescriptionId, item.type, item.name, item.dosage, item.frequency, item.duration || null, item.endDate || null]
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
            `SELECT a.*, u.full_name as doctor_name 
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
                `SELECT * FROM prescription_items WHERE prescription_id = $1`,
                [prescription.id]
            );
            items = itemsRes.rows;
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
    const { name, dob, village, ethnicity, cns, cpf, motherName, indigenousName } = req.body;

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

        // Generate placeholder image if none provided
        // Use a generated initials avatar service or similar placeholder
        const imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

        const text = `
            INSERT INTO patients (name, dob, village, ethnicity, cns, mother_name, status_id, image_url, indigenous_name, cpf)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id
        `;
        const values = [name, dob || null, village, ethnicity || null, cns || null, motherName || null, statusId, imageUrl, indigenousName || null, cpf || null];

        const result = await query(text, values);
        res.json({ success: true, patientId: result.rows[0].id });

    } catch (error) {
        console.error('Create patient error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.put('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { name, dob, village, ethnicity, cns, cpf, motherName, indigenousName } = req.body;

    try {
        const text = `
            UPDATE patients 
            SET name = $1, dob = $2, village = $3, ethnicity = $4, cns = $5, mother_name = $6, indigenous_name = $7, cpf = $8, updated_at = NOW()
            WHERE id = $9
        `;
        const values = [name, dob || null, village, ethnicity || null, cns || null, motherName || null, indigenousName || null, cpf || null, id];

        await query(text, values);
        res.json({ success: true });

    } catch (error) {
        console.error('Update patient error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
