import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { projects } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db()
      .select()
      .from(projects)
      .where(eq(projects.id, params.id))
      .limit(1);

    if (!project.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project', details: String(error) },
      { status: 500 }
    );
  }
}
