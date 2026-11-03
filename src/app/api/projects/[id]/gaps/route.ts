import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { knowledgeGaps } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gaps = await db()
      .select()
      .from(knowledgeGaps)
      .where(eq(knowledgeGaps.projectId, params.id))
      .orderBy(desc(knowledgeGaps.createdAt));

    // Group by priority
    const gapsByPriority: Record<string, any[]> = {};
    gaps.forEach((gap) => {
      const priority = gap.priority || 'medium';
      if (!gapsByPriority[priority]) {
        gapsByPriority[priority] = [];
      }
      gapsByPriority[priority].push(gap);
    });

    return NextResponse.json({
      gaps,
      count: gaps.length,
      byPriority: gapsByPriority,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch knowledge gaps', details: String(error) },
      { status: 500 }
    );
  }
}
