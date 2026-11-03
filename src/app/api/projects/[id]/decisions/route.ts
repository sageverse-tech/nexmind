import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { candidateClaims, claimEvidenceLinks, sourceEvents } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const claims = await db()
      .select()
      .from(candidateClaims)
      .where(eq(candidateClaims.projectId, params.id))
      .orderBy(desc(candidateClaims.createdAt));

    // Fetch evidence for each claim
    const decisionsWithEvidence = await Promise.all(
      claims.map(async (claim) => {
        const evidence = await db()
          .select()
          .from(claimEvidenceLinks)
          .where(eq(claimEvidenceLinks.claimId, claim.id));

        // Fetch the related source events
        const sourceEventsList = await Promise.all(
          evidence.map(async (ev) => {
            const [sourceEvent] = await db()
              .select()
              .from(sourceEvents)
              .where(eq(sourceEvents.id, ev.sourceEventId))
              .limit(1);
            return { ...ev, sourceEvent };
          })
        );

        const supporting = sourceEventsList.filter(
          (e) => e.evidenceType === 'supporting'
        );
        const contradicting = sourceEventsList.filter(
          (e) => e.evidenceType === 'contradicting'
        );
        const related = sourceEventsList.filter(
          (e) => e.evidenceType === 'related'
        );

        return {
          ...claim,
          evidence: {
            supporting,
            contradicting,
            related,
          },
        };
      })
    );

    return NextResponse.json({
      decisions: decisionsWithEvidence,
      count: decisionsWithEvidence.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch decisions', details: String(error) },
      { status: 500 }
    );
  }
}
