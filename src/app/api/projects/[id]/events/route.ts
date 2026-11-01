import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { sourceEvents } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const events = await db()
      .select()
      .from(sourceEvents)
      .where(eq(sourceEvents.projectId, params.id));

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch source events', details: String(error) },
      { status: 500 }
    );
  }
}
