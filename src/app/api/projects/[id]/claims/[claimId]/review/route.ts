import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { candidateClaims, reviewActions } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

export async function POST(
  request: Request,
  { params }: { params: { id: string; claimId: string } }
) {
  try {
    const body = await request.json();
    const {
      reviewType, // 'contributor' or 'lead'
      decision, // 'approved', 'rejected', 'flagged'
      comment,
      editedText,
    } = body;

    // Update the claim if edited
    if (editedText) {
      await db()
        .update(candidateClaims)
        .set({ claimText: editedText })
        .where(eq(candidateClaims.id, params.claimId));
    }

    // Record the review action
    const review = await db()
      .insert(reviewActions)
      .values({
        id: uuid(),
        projectId: params.id,
        claimId: params.claimId,
        reviewedBy: reviewType || 'unknown',
        decision,
        comment: comment || null,
        createdAt: new Date(),
      })
      .returning();

    // Update claim verification status based on review
    let newStatus = 'unverified';
    if (decision === 'approved') {
      newStatus = 'supported';
    } else if (decision === 'rejected') {
      newStatus = 'missing_evidence';
    } else if (decision === 'flagged') {
      newStatus = 'conflicting';
    }

    await db()
      .update(candidateClaims)
      .set({ verificationStatus: newStatus })
      .where(eq(candidateClaims.id, params.claimId));

    return NextResponse.json(review[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process review', details: String(error) },
      { status: 500 }
    );
  }
}
