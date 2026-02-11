
import { query, pool } from './db.js';

const plants = [
    {
        name: 'Erva-baleeira',
        scientific_name: 'Cordia verbenacea',
        indigenous_name: 'Tira-dor',
        main_use: 'Analgesico',
        usage_parts: JSON.stringify(['Folhas']),
        indications: 'Dores musculares, contusões e reumatismo',
        description: 'Utilizada amplamente para tratar dores musculares, contusões e reumatismo. O óleo essencial extraído das folhas possui potente atividade anti-inflamatória.',
        preparation: 'Infusão (Chá): 1 colher de sopa de folhas picadas para 1 xícara de água fervente. Abafar por 10 min. Cataplasma: Macerar as folhas frescas e aplicar diretamente sobre a área afetada 3x ao dia.',
        dosage: '3x ao dia',
        contraindications: 'Não recomendado para gestantes ou lactantes sem orientação. Pode causar irritação gástrica se consumido em excesso.',
        cultivation_info: JSON.stringify({
            climate: 'Sol Pleno',
            water: 'Moderada',
            harvest: 'Ano todo (Folhas)',
            soil: 'Arenoso e drenado'
        })
    },
    {
        name: 'Alecrim do Campo',
        scientific_name: 'Baccharis dracunculifolia',
        indigenous_name: 'Vassourinha',
        main_use: 'Anti-inflamatório',
        usage_parts: JSON.stringify(['Folhas', 'Flores']),
        description: 'Planta nativa do Brasil, muito comum em áreas de cerrado.',
        cultivation_info: JSON.stringify({ climate: 'Sol Pleno' })
    },
    {
        name: 'Guaco',
        scientific_name: 'Mikania glomerata',
        indigenous_name: 'Coração de Jesus',
        main_use: 'Expectorante',
        usage_parts: JSON.stringify(['Folhas']),
        description: 'Trepadeira nativa da Mata Atlântica.',
        cultivation_info: JSON.stringify({ climate: 'Sombra parcial' })
    },
    {
        name: 'Copaíba',
        scientific_name: 'Copaifera langsdorffii',
        indigenous_name: "Kupa'iwa",
        main_use: 'Cicatrizante',
        usage_parts: JSON.stringify(['Óleo-resina']),
        description: 'Árvore de grande porte da Amazônia.',
        cultivation_info: JSON.stringify({ climate: 'Tropical' })
    }
];

const treatments = [
    {
        name: 'Chá de Casca de Jatobá',
        origin: 'Povo Tukano',
        indications: 'Febre, dores musculares, inflamação na garganta',
        ingredients: JSON.stringify([{ name: 'Casca de Jatobá', quantity: '3 lascas' }, { name: 'Água', quantity: '1 litro' }]),
        preparation_method: 'Ferver as cascas na água por 15 minutos. Deixar amornar.',
        frequency: 'Tomar 1 xícara a cada 6 horas',
        duration: 'Até passar os sintomas'
    }
];

async function seed() {
    try {
        console.log('Seeding Plants...');
        for (const p of plants) {
            await query(`
                INSERT INTO plants (name, scientific_name, indigenous_name, main_use, usage_parts, description, preparation, dosage, contraindications, cultivation_info)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `, [p.name, p.scientific_name, p.indigenous_name, p.main_use, p.usage_parts, p.description, p.preparation, p.dosage, p.contraindications, p.cultivation_info]);
        }

        console.log('Seeding Treatments...');
        for (const t of treatments) {
            await query(`
                INSERT INTO treatments (name, origin, indications, ingredients, preparation_method, frequency, duration)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [t.name, t.origin, t.indications, t.ingredients, t.preparation_method, t.frequency, t.duration]);
        }

        console.log('Seeding Complete!');
    } catch (e) {
        console.error('Error seeding:', e);
    } finally {
        pool.end();
    }
}

seed();
