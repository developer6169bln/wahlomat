import express from "express";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

const pool = process.env.DATABASE_URL
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

async function initDb() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS results (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ DEFAULT now(),
      lat DOUBLE PRECISION,
      lng DOUBLE PRECISION,
      city TEXT,
      region TEXT,
      country TEXT,
      answers JSONB NOT NULL,
      party_matches JSONB NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_results_location ON results (lat, lng);
    CREATE INDEX IF NOT EXISTS idx_results_created ON results (created_at DESC);
  `);
}

app.use(express.json());

app.post("/api/results", async (req, res) => {
  if (!pool) return res.status(503).json({ error: "Database not configured" });
  try {
    const { lat, lng, city, region, country, answers, party_matches } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO results (lat, lng, city, region, country, answers, party_matches)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [lat || null, lng || null, city || null, region || null, country || null, JSON.stringify(answers || {}), JSON.stringify(party_matches || [])]
    );
    res.status(201).json({ id: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/results", async (req, res) => {
  if (!pool) return res.status(503).json({ error: "Database not configured" });
  try {
    const { rows } = await pool.query(
      "SELECT * FROM results ORDER BY created_at DESC LIMIT 500"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static(path.join(__dirname, "../dist")));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB init failed:", err);
    app.listen(PORT, () => console.log(`Server on port ${PORT} (no DB)`));
  });
