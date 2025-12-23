
const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const FILE_PATH = 'C:\\Users\\Solved-Blerys-Win\\Documents\\Povos\\medicina\\TraditionalMedicinePlatform\\CID-10-SUBCATEGORIAS.CSV';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medicina'
});

const seedICD = async () => {
    console.log('Starting ICD-10 Seed (JS)...');

    try {
        if (!fs.existsSync(FILE_PATH)) {
            console.error('File not found:', FILE_PATH);
            process.exit(1);
        }

        const content = fs.readFileSync(FILE_PATH, { encoding: 'latin1' });
        const lines = content.split('\n');

        console.log(`Read ${lines.length} lines. Processing...`);

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Create table if not exists
            await client.query(`
                CREATE TABLE IF NOT EXISTS icd_10 (
                    code VARCHAR(10) PRIMARY KEY,
                    description TEXT NOT NULL
                );
            `);

            await client.query('TRUNCATE TABLE icd_10 RESTART IDENTITY');

            let values = [];
            let count = 0;
            const BATCH_SIZE = 1000;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                // Skip header if it exists (usually starts with 'CAT' or similar)
                if (!line || line.startsWith('CAT')) continue;

                const parts = line.split(';');
                // A000;;;;Desc;DescShort;...

                const rawCode = parts[0];
                const description = parts[4];

                if (!rawCode || !description) continue;

                let formattedCode = rawCode;
                if (rawCode.length > 3 && rawCode.indexOf('.') === -1) {
                    formattedCode = `${rawCode.substring(0, 3)}.${rawCode.substring(3)}`;
                }

                values.push(formattedCode, description);
                count++;

                if (count % BATCH_SIZE === 0) {
                    await insertBatch(client, values);
                    values = [];
                    console.log(`Inserted ${count} records...`);
                }
            }

            if (values.length > 0) {
                await insertBatch(client, values);
            }

            await client.query('COMMIT');
            console.log(`Successfully inserted ${count} ICD-10 codes.`);

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Seed error:', error);
    } finally {
        await pool.end();
    }
};

const insertBatch = async (client, values) => {
    if (values.length === 0) return;

    const placeholders = [];
    for (let i = 0; i < values.length; i += 2) {
        const offset = i + 1;
        placeholders.push(`($${offset}, $${offset + 1})`);
    }

    const text = `
        INSERT INTO icd_10 (code, description) 
        VALUES ${placeholders.join(', ')}
        ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description
    `;

    await client.query(text, values);
};

seedICD();
