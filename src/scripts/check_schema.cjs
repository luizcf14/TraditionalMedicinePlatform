
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medicina'
});

const check = async () => {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'prescriptions' AND column_name = 'cid_codes'
        `);
        if (res.rows.length > 0) {
            console.log('VERIFIED: cid_codes exists.');
        } else {
            console.log('FAILED: cid_codes missing.');
        }
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        await pool.end();
    }
};

check();
