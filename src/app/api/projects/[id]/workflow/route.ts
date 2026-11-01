import { NextResponse } from 'next/server';
import { runWorkflow } from '@/server/agents/workflow';

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await runWorkflow(params.id);
    return NextResponse.json({
      status: 'success',
      workflow: result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Workflow execution failed', details: String(error) },
      { status: 500 }
    );
  }
}
