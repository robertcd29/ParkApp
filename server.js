const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configurare PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'parking_db',
    password: 'parola_ta', // Schimbă cu parola ta
    port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Test conexiune
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Eroare la conectarea la PostgreSQL:', err.stack);
    }
    console.log('✅ Conectat cu succes la PostgreSQL');
    release();
});

// Endpoint pentru a obține toate parcările
app.get('/parking_lot', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM parking_lot ORDER BY parking_number'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Eroare la interogare:', err);
        res.status(500).json({ error: 'Eroare la obținerea datelor' });
    }
});

// Endpoint pentru a obține o parcare specifică
app.get('/parking_lot/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const result = await pool.query(
            'SELECT * FROM parking_lot WHERE LOWER(parking_name) = LOWER($1)',
            [name]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Parcare negăsită' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Eroare la interogare:', err);
        res.status(500).json({ error: 'Eroare la obținerea datelor' });
    }
});

// Endpoint pentru a actualiza locurile disponibile
app.put('/parking_lot/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { empty_spots, occupied_spots } = req.body;
        
        const result = await pool.query(
            'UPDATE parking_lot SET empty_spots = $1, occupied_spots = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
            [empty_spots, occupied_spots, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Parcare negăsită' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Eroare la actualizare:', err);
        res.status(500).json({ error: 'Eroare la actualizarea datelor' });
    }
});

// Endpoint pentru statistici
app.get('/stats', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total_zones,
                SUM(empty_spots) as total_empty,
                SUM(occupied_spots) as total_occupied,
                SUM(empty_spots + occupied_spots) as total_spots
            FROM parking_lot
        `);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Eroare la statistici:', err);
        res.status(500).json({ error: 'Eroare la obținerea statisticilor' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server pornit pe http://localhost:${PORT}`);
});