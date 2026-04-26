import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_wgLxc1GDb6ti@ep-dark-shape-a7upyo6f-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getPortfolioData() {
  const result = await query(`
    SELECT 
      (SELECT content FROM chatbot_knowledge WHERE category = 'about' ORDER BY created_at DESC LIMIT 1) as about,
      (SELECT content FROM chatbot_knowledge WHERE category = 'skills' ORDER BY created_at DESC LIMIT 1) as skills,
      (SELECT content FROM chatbot_knowledge WHERE category = 'projects' ORDER BY created_at DESC LIMIT 1) as projects,
      (SELECT content FROM chatbot_knowledge WHERE category = 'contact' ORDER BY created_at DESC LIMIT 1) as contact;
  `);
  return result.rows[0];
}