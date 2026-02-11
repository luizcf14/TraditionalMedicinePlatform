
import { query, pool } from './db.js';

async function fixStatus() {
    try {
        await query(`
      UPDATE patients 
      SET status_id = (SELECT id FROM patient_statuses WHERE label = 'Em Tratamento') 
      WHERE name ILIKE '%Iracema%'
    `);
        console.log('Updated Iracema status to Em Tratamento');
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

fixStatus();
