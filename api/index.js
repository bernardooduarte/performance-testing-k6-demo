const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
});

const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS items (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tabela 'items' pronta!");
    } catch (err) {
        console.error("Erro ao criar tabela:", err);
    }
};

app.post('/items', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO items (name) VALUES ($1) RETURNING *',
            [name || 'Item Padrão']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/items', async (req, res) => {
    setTimeout(async () => {
        try {
            const result = await pool.query('SELECT * FROM items');
            res.json(result.rows);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }, 100);
});

const PORT = 3000;
app.listen(PORT, () => {
    initDb();
    console.log(`API rodando na porta ${PORT}`);
});