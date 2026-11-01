import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { candidateClaims } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const claims = await db()
      .select()
      .from(candidateClaims)
      .where(eq(candidateClaims.projectId, params.id));

    return NextResponse.json(claims);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch claims', details: String(error) },
      { status: 500 }
    );
  }
}
