import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      whatsapp,
      school,
      department,
      kashKnowledge,
      kashImprovements,
      contributionIntent,
      learningExpectations,
    } = body;

    // Basic validation
    if (!name || !email || !whatsapp || !school || !department) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sql = `
      INSERT INTO applications 
      (name, email, whatsapp, school, department, kash_knowledge, kash_improvements, contribution_intent, learning_expectations) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id;
    `;

    const values = [
      name,
      email,
      whatsapp,
      school,
      department,
      kashKnowledge,
      kashImprovements,
      contributionIntent,
      learningExpectations,
    ];

    await query(sql, values);

    return NextResponse.json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
