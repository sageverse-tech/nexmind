import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { successorFeedback, handoverVersions } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const handovers = await db()
      .select()
      .from(handoverVersions)
      .where(eq(handoverVersions.projectId, params.id))
      .orderBy(desc(handoverVersions.createdAt))
      .limit(1);

    if (!handovers.length) {
      return NextResponse.json({ feedback: [], count: 0 });
    }

    const feedback = await db()
      .select()
      .from(successorFeedback)
      .where(eq(successorFeedback.handoverVersionId, handovers[0].id))
      .orderBy(desc(successorFeedback.createdAt));

    return NextResponse.json({
      feedback,
      count: feedback.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch feedback', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      feedbackType,
      feedbackText,
    } = body;

    // Get latest handover version
    const [latestHandover] = await db()
      .select()
      .from(handoverVersions)
      .where(eq(handoverVersions.projectId, params.id))
      .orderBy(desc(handoverVersions.createdAt))
      .limit(1);

    if (!latestHandover) {
      return NextResponse.json(
        { error: 'No handover version found for project' },
        { status: 404 }
      );
    }

    const feedbackRecord = await db()
      .insert(successorFeedback)
      .values({
        handoverVersionId: latestHandover.id,
        successorId: crypto.randomUUID(), // Demo mode, generate ID
        feedbackType: feedbackType || 'general',
        feedbackText: feedbackText || '',
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(feedbackRecord[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save feedback', details: String(error) },
      { status: 500 }
    );
  }
}
