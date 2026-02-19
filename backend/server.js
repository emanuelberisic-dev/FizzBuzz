const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});


app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'Server and DB working' });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.post('/result', async (req, res) => {
  console.log("BODY:", req.body);

  const { username, score } = req.body;

  const scoreNum = Number(score);

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Invalid username' });
  }

  if (!Number.isInteger(scoreNum) || scoreNum < 0) {
    return res.status(400).json({ error: 'Invalid score' });
  }

  try {
    const query = `
      INSERT INTO leaderboard (username, score)
      VALUES ($1, $2)
      RETURNING id, username, score, created_at
    `;

    const result = await pool.query(query, [username.trim(), scoreNum]);

    console.log("Inserted:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ error: 'Failed to save result' });
  }
});


// Dohvat leaderboarda
app.get('/leaderboard', async (req, res) => {
  try {
    const query = `
      SELECT id, username, score, created_at
      FROM leaderboard
      ORDER BY score DESC
    `;

    const result = await pool.query(query);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Pokretanje servera
const PORT = 3000;

app.listen(PORT, () => {
 console.log(`Server running on http://10.67.76.187:${PORT}`);
 //console.log(`Server running on http://localhost:${PORT}`);
});
