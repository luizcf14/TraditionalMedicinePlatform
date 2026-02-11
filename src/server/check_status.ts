
import { query, pool } from './db.js';

async function checkPatientStatus() {
    try {
        console.log('--- Patient Status Check ---');

        // 1. Get Iracema's ID and Status
        const patientRes = await query(`
        SELECT p.id, p.name, ps.label as status, p.status_id
        FROM patients p
        LEFT JOIN patient_statuses ps ON p.status_id = ps.id
        WHERE p.name ILIKE '%Iracema%'
    `);

        if (patientRes.rows.length === 0) {
            console.log('Iracema not found.');
            return;
        }

        const iracema = patientRes.rows[0];
        console.log('Patient:', iracema);

        // 2. Check Appointments for Today
        const today = new Date().toISOString().split('T')[0];
        const apptRes = await query(`
        SELECT * FROM appointments 
        WHERE patient_id = $1 
        AND date(date) = $2
    `, [iracema.id, today]);

        console.log(`Appointments for ${today}:`, apptRes.rows.length);
        apptRes.rows.forEach(a => console.log(` - ${a.status} at ${a.date}`));

        // 3. List available statuses
        const statuses = await query('SELECT * FROM patient_statuses');
        console.log('Available Statuses:', statuses.rows.map(s => `${s.id}:${s.label}`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkPatientStatus();
