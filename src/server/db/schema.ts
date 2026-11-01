import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  varchar,
  integer,
  boolean,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    repositoryUrl: varchar('repository_url', { length: 512 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    urlIdx: uniqueIndex('projects_repository_url_idx').on(table.repositoryUrl),
  })
);

export const projectMembers = pgTable(
  'project_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }),
    role: varchar('role', { length: 50 }).notNull(), // 'lead', 'contributor', 'successor'
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    projectIdIdx: index('project_members_project_id_idx').on(table.projectId),
  })
);

export const sourceConnections = pgTable(
  'source_connections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    sourceType: varchar('source_type', { length: 50 }).notNull(), // 'github', 'markdown', 'csv', 'note'
    connectionUrl: varchar('connection_url', { length: 1024 }),
    metadata: jsonb('metadata'),
    isAuthorised: boolean('is_authorised').default(false).notNull(),
    lastSyncedAt: timestamp('last_synced_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    projectIdIdx: index('source_connections_project_id_idx').on(table.projectId),
  })
);

export const sourceEvents = pgTable(
  'source_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    sourceConnectionId: uuid('source_connection_id')
      .notNull()
      .references(() => sourceConnections.id, { onDelete: 'cascade' }),
    sourceType: varchar('source_type', { length: 50 }).notNull(), // 'commit', 'pull_request', 'issue', 'markdown', 'csv_record', 'note'
    sourceId: varchar('source_id', { length: 512 }).notNull(),
    title: varchar('title', { length: 512 }),
    content: text('content'),
    metadata: jsonb('metadata'),
    sourceUrl: varchar('source_url', { length: 1024 }),
    timestamp: timestamp('timestamp').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    projectIdIdx: index('source_events_project_id_idx').on(table.projectId),
    sourceIdIdx: uniqueIndex('source_events_source_id_project_id_idx').on(
      table.sourceId,
      table.projectId
    ),
  })
);

export const candidateClaims = pgTable(
  'candidate_claims',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    claimType: varchar('claim_type', { length: 50 }).notNull(), // 'decision', 'rationale', 'rejected_approach', 'experiment_result', 'unfinished_task', 'dependency', 'ownership', 'open_question'
    claimText: text('claim_text').notNull(),
    verificationStatus: varchar('verification_status', { length: 50 }).default('unverified').notNull(), // 'supported', 'partially_supported', 'unverified', 'conflicting', 'missing_evidence'
    reviewStatus: varchar('review_status', { length: 50 }).default('pending').notNull(), // 'pending', 'approved', 'rejected', 'flagged'
    generatedFrom: varchar('generated_from', { length: 50 }), // 'llm', 'manual', 'import'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    projectIdIdx: index('candidate_claims_project_id_idx').on(table.projectId),
    verificationStatusIdx: index('candidate_claims_verification_status_idx').on(
      table.verificationStatus
    ),
  })
);

export const claimEvidenceLinks = pgTable(
  'claim_evidence_links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    claimId: uuid('claim_id')
      .notNull()
      .references(() => candidateClaims.id, { onDelete: 'cascade' }),
    sourceEventId: uuid('source_event_id')
      .notNull()
      .references(() => sourceEvents.id, { onDelete: 'cascade' }),
    evidenceType: varchar('evidence_type', { length: 50 }).notNull(), // 'supporting', 'contradicting', 'related'
    confidence: integer('confidence').default(50), // 0-100
    explanation: text('explanation'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    claimIdIdx: index('claim_evidence_links_claim_id_idx').on(table.claimId),
    sourceEventIdIdx: index('claim_evidence_links_source_event_id_idx').on(
      table.sourceEventId
    ),
  })
);

export const knowledgeGaps = pgTable(
  'knowledge_gaps',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    description: text('description').notNull(),
    relatedClaimId: uuid('related_claim_id').references(() => candidateClaims.id, {
      onDelete: 'set null',
    }),
    priority: varchar('priority', { length: 20 }).default('medium'), // 'low', 'medium', 'high', 'critical'
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    projectIdIdx: index('knowledge_gaps_project_id_idx').on(table.projectId),
  })
);

export const experimentRecords = pgTable(
  'experiment_records',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    sourceEventId: uuid('source_event_id')
      .notNull()
      .references(() => sourceEvents.id, { onDelete: 'cascade' }),
    experimentName: varchar('experiment_name', { length: 512 }).notNull(),
    description: text('description'),
    metrics: jsonb('metrics'),
    result: varchar('result', { length: 50 }), // 'success', 'failure', 'inconclusive'
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    projectIdIdx: index('experiment_records_project_id_idx').on(table.projectId),
  })
);

export const reviewActions = pgTable(
  'review_actions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    claimId: uuid('claim_id')
      .notNull()
      .references(() => candidateClaims.id, { onDelete: 'cascade' }),
    reviewedBy: varchar('reviewed_by', { length: 255 }).notNull(),
    decision: varchar('decision', { length: 50 }).notNull(), // 'approved', 'rejected', 'needs_clarification', 'flagged'
    comment: text('comment'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    projectIdIdx: index('review_actions_project_id_idx').on(table.projectId),
    claimIdIdx: index('review_actions_claim_id_idx').on(table.claimId),
  })
);

export const workflowRuns = pgTable(
  'workflow_runs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    phaseKey: varchar('phase_key', { length: 50 }).notNull(), // 'connect', 'normalise', 'reconstruct', 'extract_intent', 'verify', 'human_review', 'handover', 'feedback'
    status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'running', 'completed', 'failed', 'paused'
    state: jsonb('state'),
    error: text('error'),
    startedAt: timestamp('started_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
  },
  (table) => ({
    projectIdIdx: index('workflow_runs_project_id_idx').on(table.projectId),
  })
);

export const handoverVersions = pgTable(
  'handover_versions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    successorId: uuid('successor_id').references(() => projectMembers.id, {
      onDelete: 'set null',
    }),
    content: jsonb('content').notNull(),
    approvedBy: varchar('approved_by', { length: 255 }),
    approvalStatus: varchar('approval_status', { length: 50 }).default('pending').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    approvedAt: timestamp('approved_at'),
  },
  (table) => ({
    projectIdIdx: index('handover_versions_project_id_idx').on(table.projectId),
  })
);

export const successorFeedback = pgTable(
  'successor_feedback',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    handoverVersionId: uuid('handover_version_id')
      .notNull()
      .references(() => handoverVersions.id, { onDelete: 'cascade' }),
    successorId: uuid('successor_id')
      .notNull()
      .references(() => projectMembers.id, { onDelete: 'cascade' }),
    feedbackType: varchar('feedback_type', { length: 50 }).notNull(), // 'correction', 'clarification', 'additional_context', 'missing_information'
    feedbackText: text('feedback_text').notNull(),
    claimId: uuid('claim_id').references(() => candidateClaims.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    handoverVersionIdIdx: index('successor_feedback_handover_version_id_idx').on(
      table.handoverVersionId
    ),
  })
);

export const projectsRelations = relations(projects, ({ many }) => ({
  members: many(projectMembers),
  sourceConnections: many(sourceConnections),
  sourceEvents: many(sourceEvents),
  candidateClaims: many(candidateClaims),
  knowledgeGaps: many(knowledgeGaps),
  experimentRecords: many(experimentRecords),
  reviewActions: many(reviewActions),
  workflowRuns: many(workflowRuns),
  handoverVersions: many(handoverVersions),
}));

export const sourceEventsRelations = relations(sourceEvents, ({ many, one }) => ({
  project: one(projects, {
    fields: [sourceEvents.projectId],
    references: [projects.id],
  }),
  connection: one(sourceConnections, {
    fields: [sourceEvents.sourceConnectionId],
    references: [sourceConnections.id],
  }),
  claimLinks: many(claimEvidenceLinks),
  experimentRecords: many(experimentRecords),
}));

export const candidateClaimsRelations = relations(candidateClaims, ({ many, one }) => ({
  project: one(projects, {
    fields: [candidateClaims.projectId],
    references: [projects.id],
  }),
  evidenceLinks: many(claimEvidenceLinks),
  reviewActions: many(reviewActions),
  knowledgeGaps: many(knowledgeGaps),
}));

export const claimEvidenceLinksRelations = relations(claimEvidenceLinks, ({ one }) => ({
  claim: one(candidateClaims, {
    fields: [claimEvidenceLinks.claimId],
    references: [candidateClaims.id],
  }),
  sourceEvent: one(sourceEvents, {
    fields: [claimEvidenceLinks.sourceEventId],
    references: [sourceEvents.id],
  }),
}));
