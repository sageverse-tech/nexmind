import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { sourceEvents } from '@/server/db/schema';
import { eq, gte, lte, desc, and } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sourceType = searchParams.get('sourceType');

    const conditions: any[] = [eq(sourceEvents.projectId, params.id)];

    if (startDate) {
      conditions.push(gte(sourceEvents.timestamp, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(sourceEvents.timestamp, new Date(endDate)));
    }
    if (sourceType) {
      conditions.push(eq(sourceEvents.sourceType, sourceType));
    }

    const events = await db()
      .select()
      .from(sourceEvents)
      .where(and(...conditions))
      .orderBy(desc(sourceEvents.timestamp));

    return NextResponse.json({
      events,
      count: events.length,
      filters: { startDate, endDate, sourceType },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch timeline', details: String(error) },
      { status: 500 }
    );
  }
}
