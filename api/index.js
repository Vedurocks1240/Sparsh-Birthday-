const { createClient } = require('@vercel/postgres');

// CORS headers
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function initDB(client) {
  await client.sql`
    CREATE TABLE IF NOT EXISTS celebrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      compliment TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

module.exports = async (req, res) => {
  // Set CORS
  Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const client = createClient();
  await client.connect();

  try {
    await initDB(client);

    if (req.method === 'GET') {
      const { rows: celebrations } = await client.sql`SELECT * FROM celebrations ORDER BY created_at DESC`;
      const { rows: count } = await client.sql`SELECT COUNT(*) as total FROM celebrations`;
      return res.json({ celebrations, total: parseInt(count[0].total) });
    }

    if (req.method === 'POST') {
      const { name, compliment } = req.body || {};
      await client.sql`
        INSERT INTO celebrations (name, compliment) 
        VALUES (${name || 'Anonymous'}, ${compliment || ''})
      `;
      const { rows: celebrations } = await client.sql`SELECT * FROM celebrations ORDER BY created_at DESC`;
      const { rows: count } = await client.sql`SELECT COUNT(*) as total FROM celebrations`;
      return res.json({ success: true, celebrations, total: parseInt(count[0].total) });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
};
