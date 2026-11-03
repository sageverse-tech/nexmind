import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import {
  projects,
  sourceEvents,
  candidateClaims,
  knowledgeGaps,
  handoverVersions,
  reviewActions,
} from '@/server/db/schema';
import { eq } from 'drizzle-orm';

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

    const approvedClaims = claims.filter(
      (c) => c.verificationStatus === 'supported' || c.verificationStatus === 'partially_supported'
    );

    // Generate handover document
    const handover = {
      projectId: params.id,
      projectName: project.name,
      projectDescription: project.description,
      repositoryUrl: project.repositoryUrl,
      generatedAt: new Date().toISOString(),
      summary: {
        totalSourceEvents: events.length,
        totalApprovedClaims: approvedClaims.length,
        totalKnowledgeGaps: gaps.length,
        reviewsCompleted: reviews.length,
      },
      timeline: {
        startDate: events.length > 0 ? events[events.length - 1].timestamp : null,
        endDate: events.length > 0 ? events[0].timestamp : null,
        eventCount: events.length,
      },
      approvedDecisions: approvedClaims.map((c) => ({
        id: c.id,
        type: c.claimType,
        text: c.claimText,
        status: c.verificationStatus,
      })),
      knowledgeGaps: gaps.map((g) => ({
        id: g.id,
        description: g.description,
        priority: g.priority,
      })),
      nextActions: claims
        .filter((c) => c.claimType === 'unfinished_task')
        .map((c) => c.claimText),
    };

    // Save handover version
    const versionId = crypto.randomUUID();
    try {
      await db()
        .insert(handoverVersions)
        .values({
          id: versionId,
          projectId: params.id,
          content: handover,
          approvalStatus: 'pending',
          createdAt: new Date(),
        });
    } catch (e) {
      // Handover version may already exist, continue
      console.error('Note: Handover version insert failed (may already exist):', e);
    }

    return NextResponse.json(handover);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate handover', details: String(error) },
      { status: 500 }
    );
  }
}
