import { db } from './index';
import {
  projects,
  projectMembers,
  sourceConnections,
  sourceEvents,
  candidateClaims,
  claimEvidenceLinks,
  experimentRecords,
} from './schema';
import { v4 as uuid } from 'uuid';

export async function seedSmartAgricultureDataset() {
  // Create the Smart Agriculture project
  const projectId = uuid();
  await db().insert(projects).values({
    id: projectId,
    name: 'Smart Agriculture Prediction',
    description: 'ML model for crop yield prediction using soil and weather data',
    repositoryUrl: 'https://github.com/demo/smart-agriculture',
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
    connectionUrl: 'https://github.com/demo/smart-agriculture',
    isAuthorised: true,
    metadata: { owner: 'demo', repo: 'smart-agriculture' },
  });

  // Create sample source events (commits, PRs, issues)
  const sourceEventIds: string[] = [];
  const events = [
    {
      sourceId: 'commit-001',
      title: 'Initial project setup',
      content: 'Set up ML pipeline structure',
      timestamp: new Date('2024-01-15'),
      sourceUrl: 'https://github.com/demo/smart-agriculture/commit/abc123',
    },
    {
      sourceId: 'commit-002',
      title: 'Add soil sensor integration',
      content: 'Integrated with IoT soil sensors',
      timestamp: new Date('2024-01-20'),
      sourceUrl: 'https://github.com/demo/smart-agriculture/commit/def456',
    },
    {
      sourceId: 'pr-001',
      title: 'PR: Weather API integration',
      content: 'Added OpenWeatherMap API for real-time data',
      timestamp: new Date('2024-02-01'),
      sourceUrl: 'https://github.com/demo/smart-agriculture/pull/1',
    },
    {
      sourceId: 'issue-001',
      title: 'High latency in prediction API',
      content: 'Response times exceed SLA requirements',
      timestamp: new Date('2024-02-15'),
      sourceUrl: 'https://github.com/demo/smart-agriculture/issues/5',
    },
    {
      sourceId: 'commit-003',
      title: 'Experiment: XGBoost model optimization',
      content: 'Tested XGBoost with 100 estimators',
      timestamp: new Date('2024-02-20'),
      sourceUrl: 'https://github.com/demo/smart-agriculture/commit/ghi789',
    },
  ];

  for (const event of events) {
    const eventId = uuid();
    sourceEventIds.push(eventId);
    await db().insert(sourceEvents).values({
      id: eventId,
      projectId,
      sourceConnectionId: githubConnectionId,
      sourceType: event.sourceId.startsWith('pr') ? 'pull_request' : 'commit',
      sourceId: event.sourceId,
      title: event.title,
      content: event.content,
      sourceUrl: event.sourceUrl,
      timestamp: event.timestamp,
      metadata: { author: 'test@example.com' },
    });
  }

  // Create candidate claims
  const claimIds: string[] = [];
  const claims = [
    {
      claimType: 'decision' as const,
      claimText: 'Chose PostgreSQL for data persistence due to ACID compliance requirements',
    },
    {
      claimType: 'rejected_approach' as const,
      claimText: 'Abandoned Redis caching layer due to high latency in prediction path',
    },
    {
      claimType: 'experiment_result' as const,
      claimText: 'XGBoost model achieved 87% accuracy on validation set',
    },
    {
      claimType: 'unfinished_task' as const,
      claimText: 'GPU acceleration for model training still pending resource allocation',
    },
    {
      claimType: 'open_question' as const,
      claimText: 'What are the implications of using synthetic weather data for training?',
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
      explanation: 'This commit directly supports the claim',
    });
  }

  // Create experiment records from CSV
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

  console.log('✓ Smart Agriculture dataset seeded successfully');
  console.log(`  - Project ID: ${projectId}`);
  console.log(`  - Source events: ${sourceEventIds.length}`);
  console.log(`  - Claims: ${claimIds.length}`);
}

if (require.main === module) {
  seedSmartAgricultureDataset().catch(console.error);
}
