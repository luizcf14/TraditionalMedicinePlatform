
const fs = require('fs');
const path = require('path');

const CSV_PATH = 'C:\\Users\\Solved-Blerys-Win\\Documents\\Povos\\medicina\\TraditionalMedicinePlatform\\CID-10-SUBCATEGORIAS.CSV';
const OUTPUT_PATH = 'C:\\Users\\Solved-Blerys-Win\\Documents\\Povos\\medicina\\TraditionalMedicinePlatform\\database\\migrations\\016_seed_icd_10_data.sql';

const generate = () => {
    console.log('Generating SQL from CSV...');
    if (!fs.existsSync(CSV_PATH)) {
        console.error('CSV not found');
        return;
    }

    const content = fs.readFileSync(CSV_PATH, { encoding: 'latin1' });
    const lines = content.split('\n');

    // We will use a transaction and multi-row inserts for performance/size
    let sql = 'BEGIN;\n\n';
    sql += 'TRUNCATE TABLE icd_10 RESTART IDENTITY;\n\n';
    sql += 'INSERT INTO icd_10 (code, description) VALUES\n';

    let values = [];
    let processed = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('CAT')) continue; // Skip header/empty

        const parts = line.split(';');
        const rawCode = parts[0]; // e.g. A000
        const description = parts[4];

        if (!rawCode || !description) continue;

        // Format code
        let formattedCode = rawCode;
        if (rawCode.length > 3 && rawCode.indexOf('.') === -1) {
            formattedCode = `${rawCode.substring(0, 3)}.${rawCode.substring(3)}`;
        }

        // Escape single quotes in description
        const safeDesc = description.replace(/'/g, "''");

        values.push(`('${formattedCode}', '${safeDesc}')`);
        processed++;
    }

    if (values.length > 0) {
        sql += values.join(',\n') + ';\n\n';
    }

    sql += 'COMMIT;\n';

    fs.writeFileSync(OUTPUT_PATH, sql, 'utf8');
    console.log(`Generated ${OUTPUT_PATH} with ${processed} records.`);
};

generate();
