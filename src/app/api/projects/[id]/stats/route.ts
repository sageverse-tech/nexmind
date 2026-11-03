import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { projects, sourceEvents, candidateClaims, knowledgeGaps, reviewActions, handoverVersions, workflowRuns } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [project] = await db()
      .select()
      .from(projects)
      .where(eq(projects.id, params.id))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const events = await db()
      .select()
      .from(sourceEvents)
      .where(eq(sourceEvents.projectId, params.id));

    const claims = await db()
      .select()
      .from(candidateClaims)
      .where(eq(candidateClaims.projectId, params.id));

    const gaps = await db()
      .select()
      .from(knowledgeGaps)
      .where(eq(knowledgeGaps.projectId, params.id));

    const reviews = await db()
      .select()
      .from(reviewActions)
      .where(eq(reviewActions.projectId, params.id));

    const handovers = await db()
      .select()
      .from(handoverVersions)
      .where(eq(handoverVersions.projectId, params.id));

    const workflows = await db()
      .select()
      .from(workflowRuns)
      .where(eq(workflowRuns.projectId, params.id))
      .orderBy(desc(workflowRuns.startedAt));

    const eventsByType: Record<string, number> = {};
    events.forEach(e => {
      eventsByType[e.sourceType] = (eventsByType[e.sourceType] || 0) + 1;
    });

    const claimsByStatus: Record<string, number> = {};
    claims.forEach(c => {
      claimsByStatus[c.verificationStatus] = (claimsByStatus[c.verificationStatus] || 0) + 1;
    });

    const gapsByPriority: Record<string, number> = {};
    gaps.forEach(g => {
      const priority = g.priority || 'medium';
      gapsByPriority[priority] = (gapsByPriority[priority] || 0) + 1;
    });

    return NextResponse.json({
      project,
      stats: {
        totalSourceEvents: events.length,
        eventsByType,
        totalClaims: claims.length,
        claimsByStatus,
        totalGaps: gaps.length,
        gapsByPriority,
        totalReviews: reviews.length,
        handoverStatus: handovers[0]?.approvalStatus || 'not_started',
        latestWorkflow: workflows[0] || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project stats', details: String(error) },
      { status: 500 }
    );
  }
}
