import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import {
  projects,
  projectMembers,
  sourceConnections,
  sourceEvents,
  candidateClaims,
  claimEvidenceLinks,
  experimentRecords,
  knowledgeGaps,
} from '@/server/db/schema';
import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';

export async function POST() {
  try {
    // Check if demo project already exists
    const existingProjects = await db()
      .select()
      .from(projects)
      .where(eq(projects.name, 'Smart Agriculture Demo'));

    if (existingProjects.length > 0) {
      return NextResponse.json(
        { message: 'Demo project already exists', projectId: existingProjects[0].id },
        { status: 200 }
      );
    }

    // Create the Smart Agriculture project
    const projectId = uuid();
    await db().insert(projects).values({
      id: projectId,
      name: 'Smart Agriculture Demo',
      description: 'Guided demo showcasing the complete NEXMIND 10-step workflow with real agricultural data insights.',
      repositoryUrl: 'https://github.com/nexmind-demo/smart-agriculture',
    });

    // Add project members
    const leadId = uuid();
    const contributorId = uuid();
    const successorId = uuid();

    await db().insert(projectMembers).values([
      {
        id: leadId,
        projectId,
        name: 'Alice Chen',
        email: 'alice@example.com',
        role: 'lead',
      },
      {
        id: contributorId,
        projectId,
        name: 'Bob Kumar',
        email: 'bob@example.com',
        role: 'contributor',
      },
      {
        id: successorId,
        projectId,
        name: 'Carol White',
        email: 'carol@example.com',
        role: 'successor',
      },
    ]);

    // Add source connections
    const githubConnectionId = uuid();
    await db().insert(sourceConnections).values({
      id: githubConnectionId,
      projectId,
      sourceType: 'github',
      connectionUrl: 'https://github.com/nexmind-demo/smart-agriculture',
      isAuthorised: true,
      metadata: { owner: 'nexmind-demo', repo: 'smart-agriculture' },
    });

    // Create sample source events (commits, PRs, issues)
    const sourceEventIds: string[] = [];
    const events = [
      {
        sourceId: 'commit-001',
        title: 'Initial project setup',
        content: 'Set up ML pipeline structure with Docker containerization for reproducibility',
        timestamp: new Date('2024-01-15'),
        sourceUrl: 'https://github.com/nexmind-demo/smart-agriculture/commit/abc123',
      },
      {
        sourceId: 'commit-002',
        title: 'Add soil sensor integration',
        content: 'Integrated with IoT soil sensors for real-time moisture and nutrient data collection',
        timestamp: new Date('2024-01-20'),
        sourceUrl: 'https://github.com/nexmind-demo/smart-agriculture/commit/def456',
      },
      {
        sourceId: 'pr-001',
        title: 'Weather API integration',
        content: 'Added OpenWeatherMap API for real-time weather data with 99.9% uptime SLA',
        timestamp: new Date('2024-02-01'),
        sourceUrl: 'https://github.com/nexmind-demo/smart-agriculture/pull/1',
      },
      {
        sourceId: 'issue-001',
        title: 'High latency in prediction API',
        content: 'Response times exceed SLA requirements. Average latency is 3.5s, target is 1s',
        timestamp: new Date('2024-02-15'),
        sourceUrl: 'https://github.com/nexmind-demo/smart-agriculture/issues/5',
      },
      {
        sourceId: 'commit-003',
        title: 'Experiment: XGBoost model optimization',
        content: 'Tested XGBoost with 100 estimators and max_depth=8. Achieved 87% accuracy.',
        timestamp: new Date('2024-02-20'),
        sourceUrl: 'https://github.com/nexmind-demo/smart-agriculture/commit/ghi789',
      },
      {
        sourceId: 'commit-004',
        title: 'Database schema design',
        content: 'Designed PostgreSQL schema with ACID compliance and proper indexing strategy',
        timestamp: new Date('2024-03-01'),
        sourceUrl: 'https://github.com/nexmind-demo/smart-agriculture/commit/jkl012',
      },
      {
        sourceId: 'issue-002',
        title: 'GPU acceleration needed',
        content: 'Training takes 45 minutes on CPU. Need GPU acceleration for faster iteration cycles.',
        timestamp: new Date('2024-03-10'),
        sourceUrl: 'https://github.com/nexmind-demo/smart-agriculture/issues/12',
      },
      {
        sourceId: 'pr-002',
        title: 'Add monitoring and alerting',
        content: 'Integrated Prometheus metrics and Grafana dashboards for production monitoring',
        timestamp: new Date('2024-03-15'),
        sourceUrl: 'https://github.com/nexmind-demo/smart-agriculture/pull/3',
      },
    ];

    for (const event of events) {
      const eventId = uuid();
      sourceEventIds.push(eventId);
      await db().insert(sourceEvents).values({
        id: eventId,
        projectId,
        sourceConnectionId: githubConnectionId,
        sourceType: event.sourceId.startsWith('pr') ? 'pull_request' : event.sourceId.startsWith('issue') ? 'issue' : 'commit',
        sourceId: event.sourceId,
        title: event.title,
        content: event.content,
        sourceUrl: event.sourceUrl,
        timestamp: event.timestamp,
        metadata: { author: 'demo@example.com' },
      });
    }

    // Create candidate claims
    const claimIds: string[] = [];
    const claims = [
      {
        claimType: 'decision',
        claimText: 'Chose PostgreSQL for data persistence due to ACID compliance requirements and complex query support',
      },
      {
        claimType: 'rejected_approach',
        claimText: 'Abandoned Redis caching layer due to high latency in prediction path and memory constraints',
      },
      {
        claimType: 'experiment_result',
        claimText: 'XGBoost model achieved 87% accuracy on validation set with 100 estimators',
      },
      {
        claimType: 'unfinished_task',
        claimText: 'GPU acceleration for model training still pending resource allocation from infrastructure team',
      },
      {
        claimType: 'open_question',
        claimText: 'What are the implications of using synthetic weather data for training edge cases?',
      },
      {
        claimType: 'dependency',
        claimText: 'Model accuracy depends on sensor calibration accuracy which must be within 2% tolerance',
      },
      {
        claimType: 'rationale',
        claimText: 'Used Docker containerization to ensure reproducibility across different deployment environments',
      },
      {
        claimType: 'ownership',
        claimText: 'Alice Chen owns the model training pipeline, Bob Kumar owns the API integration layer',
      },
    ];

    for (const claim of claims) {
      const claimId = uuid();
      claimIds.push(claimId);
      await db().insert(candidateClaims).values({
        id: claimId,
        projectId,
        claimType: claim.claimType,
        claimText: claim.claimText,
        verificationStatus: 'unverified',
        reviewStatus: 'pending',
        generatedFrom: 'llm',
      });
    }

    // Link claims to evidence
    for (let i = 0; i < Math.min(claimIds.length, sourceEventIds.length); i++) {
      await db().insert(claimEvidenceLinks).values({
        id: uuid(),
        claimId: claimIds[i],
        sourceEventId: sourceEventIds[i],
        evidenceType: 'supporting',
        confidence: 75,
        explanation: 'Source event directly supports this claim',
      });
    }

    // Create experiment records
    const experimentData = [
      {
        name: 'Random Forest - v1',
        metrics: { accuracy: 0.82, f1_score: 0.79, training_time: 245 },
        result: 'success',
      },
      {
        name: 'XGBoost - v2',
        metrics: { accuracy: 0.87, f1_score: 0.85, training_time: 312 },
        result: 'success',
      },
      {
        name: 'Deep Learning - CNN',
        metrics: { accuracy: 0.79, f1_score: 0.76, training_time: 1200 },
        result: 'failure',
      },
    ];

    for (const exp of experimentData) {
      await db().insert(experimentRecords).values({
        id: uuid(),
        projectId,
        sourceEventId: sourceEventIds[4] || sourceEventIds[0],
        experimentName: exp.name,
        description: `Experiment: ${exp.name}`,
        metrics: exp.metrics,
        result: exp.result,
      });
    }

    // Create knowledge gaps
    const gaps = [
      {
        description: 'How does model perform with extreme weather events not seen in training data?',
        priority: 'critical',
      },
      {
        description: 'What is the exact breakdown of soil sensor calibration procedures and failure recovery?',
        priority: 'high',
      },
      {
        description: 'Missing documentation on API rate limiting strategy and fallback behavior',
        priority: 'high',
      },
      {
        description: 'No details on how to handle sensor failures in production and alerting thresholds',
        priority: 'high',
      },
      {
        description: 'Unclear deployment process and rollback procedures for model updates',
        priority: 'medium',
      },
      {
        description: 'Limited information on GPU acceleration implementation timeline and resource costs',
        priority: 'medium',
      },
      {
        description: 'No cost analysis for data storage at scale and retention policies',
        priority: 'low',
      },
    ];

    for (const gap of gaps) {
      await db().insert(knowledgeGaps).values({
        id: uuid(),
        projectId,
        description: gap.description,
        priority: gap.priority,
        relatedClaimId: claimIds.length > 0 ? claimIds[0] : null,
      });
    }

    return NextResponse.json(
      {
        message: 'Demo data seeded successfully',
        projectId,
        stats: {
          events: sourceEventIds.length,
          claims: claimIds.length,
          gaps: gaps.length,
          members: 3,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to seed demo data', details: String(error) },
      { status: 500 }
    );
  }
}
