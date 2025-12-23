
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medicina'
});

const migrate = async () => {
    console.log('Running migration...');
    const client = await pool.connect();
    try {
        await client.query(`
            ALTER TABLE prescriptions 
            ADD COLUMN IF NOT EXISTS cid_codes JSONB;
        `);
        console.log('Migration successful: Added cid_codes to prescriptions.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
};

migrate();
