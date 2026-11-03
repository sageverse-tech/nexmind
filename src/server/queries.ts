import { db } from './db';
import { projects, sourceEvents, candidateClaims, knowledgeGaps, reviewActions, handoverVersions, workflowRuns } from './db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getProjectStats(projectId: string) {
  const [project] = await db().select().from(projects).where(eq(projects.id, projectId)).limit(1);

  if (!project) {
    throw new Error('Project not found');
  }

  const events = await db().select().from(sourceEvents).where(eq(sourceEvents.projectId, projectId));
  const claims = await db().select().from(candidateClaims).where(eq(candidateClaims.projectId, projectId));
  const gaps = await db().select().from(knowledgeGaps).where(eq(knowledgeGaps.projectId, projectId));
  const reviews = await db().select().from(reviewActions).where(eq(reviewActions.projectId, projectId));
  const handovers = await db().select().from(handoverVersions).where(eq(handoverVersions.projectId, projectId));
  const workflows = await db().select().from(workflowRuns).where(eq(workflowRuns.projectId, projectId)).orderBy(desc(workflowRuns.startedAt));

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
    gapsByPriority[g.priority || 'medium'] = (gapsByPriority[g.priority || 'medium'] || 0) + 1;
  });

  return {
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
      latestWorkflow: workflows[0],
    },
    data: { events, claims, gaps, reviews, handovers, workflows },
  };
}

export async function generateHandoverDossier(projectId: string) {
  const [project] = await db().select().from(projects).where(eq(projects.id, projectId)).limit(1);

  if (!project) {
    throw new Error('Project not found');
  }

  const approvedClaims = await db()
    .select()
    .from(candidateClaims)
    .where(eq(candidateClaims.projectId, projectId));

  const events = await db()
    .select()
    .from(sourceEvents)
    .where(eq(sourceEvents.projectId, projectId))
    .orderBy(sourceEvents.timestamp);

  const gaps = await db().select().from(knowledgeGaps).where(eq(knowledgeGaps.projectId, projectId));

  const dossier = {
    project,
    generatedAt: new Date(),
    summary: {
      totalSourceEvents: events.length,
      totalApprovedClaims: approvedClaims.length,
      knowledgeGaps: gaps.length,
      coveragePeriod: {
        start: events[0]?.timestamp,
        end: events[events.length - 1]?.timestamp,
      },
    },
    approvedClaims: approvedClaims.filter(c => c.reviewStatus === 'approved'),
    sourceEvents: events,
    knowledgeGaps: gaps,
  };

  return dossier;
}
