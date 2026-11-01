import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { sourceConnections } from '@/server/db/schema';
import { importGitHubRepository, parseGitHubUrl } from '@/server/github';
import { v4 as uuid } from 'uuid';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { repositoryUrl } = body;

    if (!repositoryUrl) {
      return NextResponse.json(
        { error: 'Missing repositoryUrl' },
        { status: 400 }
      );
    }

    const { owner, repo } = await parseGitHubUrl(repositoryUrl);

    // Create source connection
    const connectionId = uuid();
    await db()
      .insert(sourceConnections)
      .values({
        id: connectionId,
        projectId: params.id,
        sourceType: 'github',
        connectionUrl: repositoryUrl,
        isAuthorised: true,
        metadata: { owner, repo },
      });

    // Import repository data
    const results = await importGitHubRepository(
      params.id,
      connectionId,
      owner,
      repo
    );

    return NextResponse.json({
      status: 'success',
      connectionId,
      imported: results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to import GitHub repository', details: String(error) },
      { status: 500 }
    );
  }
}
