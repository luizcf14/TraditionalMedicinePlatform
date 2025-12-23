
import fs from 'fs';
import path from 'path';
import { pool } from '../server/db';

const FILE_PATH = 'C:\\Users\\Solved-Blerys-Win\\Documents\\Povos\\medicina\\TraditionalMedicinePlatform\\CID-10-SUBCATEGORIAS.CSV';

const seedICD = async () => {
    console.log('Starting ICD-10 Seed...');

    try {
        if (!fs.existsSync(FILE_PATH)) {
            console.error('File not found:', FILE_PATH);
            process.exit(1);
        }

        // Read file with latin1 (ISO-8859-1) encoding commonly used in Brazil gov data
        const content = fs.readFileSync(FILE_PATH, { encoding: 'latin1' });
        const lines = content.split('\n');

        console.log(`Read ${lines.length} lines. Processing...`);

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Optional: Clear table first? Or just UPSERT? 
            // User might want to keep existing seeds if they are custom. 
            // But usually this replaces the dummy seed.
            // Let's TRUNCATE to be clean since we have the full official list.
            await client.query('TRUNCATE TABLE icd_10 RESTART IDENTITY');

            let values: any[] = [];
            let count = 0;
            const BATCH_SIZE = 1000;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const parts = line.split(';');
                // Format: A000;;;;Descrição;...
                // Col 0: Code (A000)
                // Col 4: Description

                const rawCode = parts[0];
                const description = parts[4];

                if (!rawCode || !description) continue;

                // Format code: A000 -> A00.0
                let formattedCode = rawCode;
                if (rawCode.length > 3) {
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

const insertBatch = async (client: any, values: any[]) => {
    if (values.length === 0) return;

    // Construct placeholder $1, $2, $3, $4 ...
    const placeholders: string[] = [];
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
