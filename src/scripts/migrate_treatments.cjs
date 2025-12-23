
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medicina'
});

const migrate = async () => {
    console.log('Running migration for treatments...');
    const client = await pool.connect();
    try {
        await client.query(`
            ALTER TABLE treatments 
            ADD COLUMN IF NOT EXISTS contraindications TEXT;
        `);
        console.log('Migration successful: Added contraindications to treatments.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
};

migrate();
