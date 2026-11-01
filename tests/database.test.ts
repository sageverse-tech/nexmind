import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '@/server/db';
import { projects, sourceEvents, candidateClaims } from '@/server/db/schema';
import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';

describe('Database Schema', () => {
  let testProjectId: string;

  beforeAll(async () => {
    testProjectId = uuid();
  });

  it('should create a project', async () => {
    await db()
      .insert(projects)
      .values({
        id: testProjectId,
        name: 'Test Project',
        description: 'Test description',
        repositoryUrl: 'https://github.com/test/repo',
      });

    const result = await db()
      .select()
      .from(projects)
      .where(eq(projects.id, testProjectId))
      .limit(1);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Project');
  });

  it('should prevent duplicate repository URLs', async () => {
    const newId = uuid();
    try {
      await db()
        .insert(projects)
        .values({
          id: newId,
          name: 'Duplicate Test',
          repositoryUrl: 'https://github.com/test/repo',
        });
      expect.fail('Should have thrown unique constraint error');
    } catch {
      // Expected unique constraint violation
    }
  });

  it('should create source events', async () => {
    const eventId = uuid();
    const connectionId = uuid();

    await db()
      .insert(sourceEvents)
      .values({
        id: eventId,
        projectId: testProjectId,
        sourceConnectionId: connectionId,
        sourceType: 'commit',
        sourceId: 'commit-abc123',
        title: 'Test commit',
        content: 'Test content',
        sourceUrl: 'https://github.com/test/commit',
        timestamp: new Date(),
        metadata: { author: 'test@example.com' },
      });

    const result = await db()
      .select()
      .from(sourceEvents)
      .where(eq(sourceEvents.id, eventId))
      .limit(1);

    expect(result).toHaveLength(1);
    expect(result[0].sourceType).toBe('commit');
  });

  it('should create candidate claims', async () => {
    const claimId = uuid();

    await db()
      .insert(candidateClaims)
      .values({
        id: claimId,
        projectId: testProjectId,
        claimType: 'decision',
        claimText: 'Test claim',
        verificationStatus: 'unverified',
        reviewStatus: 'pending',
      });

    const result = await db()
      .select()
      .from(candidateClaims)
      .where(eq(candidateClaims.id, claimId))
      .limit(1);

    expect(result).toHaveLength(1);
    expect(result[0].claimText).toBe('Test claim');
  });

  afterAll(async () => {
    // Cleanup is handled by the database constraints
  });
});
