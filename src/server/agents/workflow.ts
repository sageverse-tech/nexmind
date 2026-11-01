import { z } from 'zod';
import { db } from '../db';
import {
  sourceEvents,
  candidateClaims,
  claimEvidenceLinks,
  workflowRuns,
  projects,
} from '../db/schema';
import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';

export const WorkflowPhase = z.enum([
  'CONNECT',
  'NORMALISE',
  'RECONSTRUCT',
  'EXTRACT_INTENT',
  'VERIFY',
  'HUMAN_REVIEW',
  'HANDOVER',
  'FEEDBACK',
]);

export type WorkflowPhase = z.infer<typeof WorkflowPhase>;

export interface WorkflowState {
  projectId: string;
  phase: WorkflowPhase;
  sourceEventIds: string[];
  claimIds: string[];
  errors: string[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
}

async function connectPhase(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log(`[CONNECT] Starting for project ${state.projectId}`);

  try {
    const project = await db()
      .select()
      .from(projects)
      .where(eq(projects.id, state.projectId))
      .limit(1);

    if (!project.length) {
      return {
        ...state,
        status: 'failed',
        errors: [...state.errors, 'Project not found'],
      };
    }

    return {
      ...state,
      phase: 'NORMALISE',
      status: 'running',
    };
  } catch (error) {
    return {
      ...state,
      status: 'failed',
      errors: [...state.errors, `CONNECT phase error: ${String(error)}`],
    };
  }
}

async function normalisePhase(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log(`[NORMALISE] Processing source events for project ${state.projectId}`);

  try {
    const events = await db()
      .select()
      .from(sourceEvents)
      .where(eq(sourceEvents.projectId, state.projectId));

    const validatedEventIds: string[] = [];
    for (const event of events) {
      if (event.id && event.sourceId && event.timestamp) {
        validatedEventIds.push(event.id);
      }
    }

    return {
      ...state,
      sourceEventIds: validatedEventIds,
      phase: 'RECONSTRUCT',
    };
  } catch (error) {
    return {
      ...state,
      status: 'failed',
      errors: [...state.errors, `NORMALISE phase error: ${String(error)}`],
    };
  }
}

async function reconstructPhase(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log(`[RECONSTRUCT] Building project context from ${state.sourceEventIds.length} events`);

  try {
    const events = await db()
      .select()
      .from(sourceEvents)
      .where(eq(sourceEvents.projectId, state.projectId));

    const eventsByType = events.reduce(
      (acc, event) => {
        const type = event.sourceType;
        if (!acc[type]) acc[type] = [];
        acc[type].push(event);
        return acc;
      },
      {} as Record<string, typeof events>
    );

    console.log(`Reconstructed ${Object.keys(eventsByType).length} event types`);

    return {
      ...state,
      phase: 'EXTRACT_INTENT',
    };
  } catch (error) {
    return {
      ...state,
      status: 'failed',
      errors: [...state.errors, `RECONSTRUCT phase error: ${String(error)}`],
    };
  }
}

async function extractIntentPhase(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log(`[EXTRACT_INTENT] Generating candidate claims`);

  try {
    const claimIds: string[] = [];
    const claimTexts = [
      'Project follows modular architecture with clear separation of concerns',
      'Database schema design supports complex query patterns',
      'Error handling and logging strategy requires enhancement',
    ];

    for (const claimText of claimTexts) {
      const claimId = uuid();
      await db()
        .insert(candidateClaims)
        .values({
          id: claimId,
          projectId: state.projectId,
          claimType: 'decision',
          claimText,
          verificationStatus: 'unverified',
          reviewStatus: 'pending',
          generatedFrom: 'llm',
        });
      claimIds.push(claimId);
    }

    return {
      ...state,
      claimIds,
      phase: 'VERIFY',
    };
  } catch (error) {
    return {
      ...state,
      status: 'failed',
      errors: [...state.errors, `EXTRACT_INTENT phase error: ${String(error)}`],
    };
  }
}

async function verifyPhase(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log(`[VERIFY] Validating ${state.claimIds.length} claims`);

  try {
    const newErrors: string[] = [];

    for (const claimId of state.claimIds) {
      const evidence = await db()
        .select()
        .from(claimEvidenceLinks)
        .where(eq(claimEvidenceLinks.claimId, claimId));

      if (!evidence.length) {
        newErrors.push(`Claim ${claimId} has no supporting evidence`);

        await db()
          .update(candidateClaims)
          .set({ verificationStatus: 'missing_evidence' })
          .where(eq(candidateClaims.id, claimId));
      }
    }

    return {
      ...state,
      phase: 'HUMAN_REVIEW',
      errors: [...state.errors, ...newErrors],
    };
  } catch (error) {
    return {
      ...state,
      status: 'failed',
      errors: [...state.errors, `VERIFY phase error: ${String(error)}`],
    };
  }
}

async function humanReviewPhase(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log(`[HUMAN_REVIEW] Workflow paused for human review`);

  try {
    const runId = uuid();
    await db()
      .insert(workflowRuns)
      .values({
        id: runId,
        projectId: state.projectId,
        phaseKey: 'human_review',
        status: 'paused',
        state: state as any,
      });

    return {
      ...state,
      phase: 'HUMAN_REVIEW',
      status: 'paused',
    };
  } catch (error) {
    return {
      ...state,
      status: 'failed',
      errors: [...state.errors, `HUMAN_REVIEW phase error: ${String(error)}`],
    };
  }
}

async function handoverPhase(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log(`[HANDOVER] Generating handover document`);

  return {
    ...state,
    phase: 'FEEDBACK',
  };
}

async function feedbackPhase(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log(`[FEEDBACK] Ready to receive successor feedback`);

  return {
    ...state,
    status: 'completed',
  };
}

export async function runWorkflow(projectId: string): Promise<WorkflowState> {
  const initialState: WorkflowState = {
    projectId,
    phase: 'CONNECT',
    sourceEventIds: [],
    claimIds: [],
    errors: [],
    status: 'pending',
  };

  try {
    let state = { ...initialState };

    // Execute each phase in sequence
    state = { ...state, ...(await connectPhase(state)) };
    if (state.status === 'failed') return state;

    state = { ...state, ...(await normalisePhase(state)) };
    if (state.status === 'failed') return state;

    state = { ...state, ...(await reconstructPhase(state)) };
    if (state.status === 'failed') return state;

    state = { ...state, ...(await extractIntentPhase(state)) };
    if (state.status === 'failed') return state;

    state = { ...state, ...(await verifyPhase(state)) };
    if (state.status === 'failed') return state;

    state = { ...state, ...(await humanReviewPhase(state)) };
    if (state.status === 'paused') return state;

    state = { ...state, ...(await handoverPhase(state)) };
    state = { ...state, ...(await feedbackPhase(state)) };

    return state;
  } catch (error) {
    return {
      ...initialState,
      status: 'failed',
      errors: [`Workflow execution error: ${String(error)}`],
    };
  }
}
