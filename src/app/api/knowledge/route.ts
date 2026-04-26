import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { category, content } = await request.json();

    if (!category || !content) {
      return NextResponse.json(
        { error: 'Category and content are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO chatbot_knowledge (category, content)
       VALUES ($1, $2)
       RETURNING id, category, content, created_at`,
      [category, content]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Insert error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT category, content, created_at 
      FROM chatbot_knowledge 
      ORDER BY created_at DESC
    `);
    return NextResponse.json({ data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ data: [], error: error.message });
  }
}