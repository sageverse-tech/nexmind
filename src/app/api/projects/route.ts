import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { projects } from '@/server/db/schema';
import { v4 as uuid } from 'uuid';

export async function GET() {
  try {
    const allProjects = await db().select().from(projects);
    return NextResponse.json(allProjects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, repositoryUrl } = body;

    if (!name || !repositoryUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: name, repositoryUrl' },
        { status: 400 }
      );
    }

    const newProject = await db()
      .insert(projects)
      .values({
        id: uuid(),
        name,
        description,
        repositoryUrl,
      })
      .returning();

    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project', details: String(error) },
      { status: 500 }
    );
  }
}
