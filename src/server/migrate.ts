import fs from 'fs';
import path from 'path';
import { query } from './db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    const migrationsDir = path.join(__dirname, '../../database/migrations');

    try {
        const files = fs.readdirSync(migrationsDir).sort();

        console.log(`Found ${files.length} migration files.`);

        for (const file of files) {
            if (file.endsWith('.sql')) {
                console.log(`Running migration: ${file}`);
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');

                await query(sql);
                console.log(`Completed: ${file}`);
            }
        }

        console.log('All migrations executed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigrations();
