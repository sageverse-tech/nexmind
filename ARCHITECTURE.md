# NEXMIND Phase 1 Architecture

## Overview

NEXMIND is a Next.js full-stack application designed to reconstruct project knowledge and create verified handovers for successors. Phase 1 establishes the foundational infrastructure.

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Route Handlers, Node.js runtime
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **AI Workflow**: LangGraph.js with 8-phase pipeline
- **External APIs**: GitHub REST API
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # Route handlers (API endpoints)
│   │   └── projects/
│   │       ├── route.ts          # List/create projects
│   │       ├── [id]/route.ts     # Get project details
│   │       ├── [id]/import/route.ts      # GitHub import
│   │       ├── [id]/events/route.ts      # Source events
│   │       ├── [id]/claims/route.ts      # Candidate claims
│   │       └── [id]/workflow/route.ts    # Workflow execution
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
├── features/                     # Domain-specific features
├── server/                       # Server-only code
│   ├── db/
│   │   ├── schema.ts             # Drizzle ORM schema
│   │   ├── index.ts              # Database client
│   │   ├── seed.ts               # Seed script
│   │   └── migrations/           # Auto-generated migrations
│   ├── github/
│   │   └── index.ts              # GitHub API integration
│   ├── agents/
│   │   └── workflow.ts           # LangGraph 8-phase workflow
│   └── ai/                       # LLM provider adapters
├── lib/
│   ├── validation.ts             # Zod schemas
│   └── utils.ts                  # Shared utilities
└── types/                        # TypeScript type definitions

tests/
├── database.test.ts              # Database schema tests
└── api.test.ts                   # API endpoint tests

fixtures/
└── smart-agriculture.ts          # Synthetic demo dataset
```

## Database Schema

### Core Entities

1. **projects** - Project metadata and configuration
2. **project_members** - Project team members with roles
3. **source_connections** - External data sources (GitHub, files, etc.)
4. **source_events** - Normalized source data (commits, PRs, issues, docs)
5. **candidate_claims** - AI-generated or manual claims about the project
6. **claim_evidence_links** - Links between claims and supporting evidence
7. **knowledge_gaps** - Missing or unclear information
8. **experiment_records** - Experiment runs and results
9. **review_actions** - Human review decisions on claims
10. **workflow_runs** - State for resumable workflow executions
11. **handover_versions** - Generated handover documents
12. **successor_feedback** - Feedback from knowledge recipients

## 8-Phase Workflow

### Phase 1: CONNECT
- Accept explicitly authorized sources
- Validate source connections
- Test repository access

### Phase 2: NORMALISE
- Validate and clean imported records
- Standardize timestamps
- Generate stable source-event IDs
- Prevent duplicate imports

### Phase 3: RECONSTRUCT
- Group events chronologically
- Build project activity timeline
- Identify milestones and components
- Map dependencies

### Phase 4: EXTRACT_INTENT
- Generate structured candidate claims
- Map decisions, rationale, experiments
- Identify rejected approaches
- Flag open questions

### Phase 5: VERIFY
- Validate claims against source events
- Check evidence completeness
- Identify contradictions
- Flag missing support

### Phase 6: HUMAN_REVIEW
- Pause workflow for human review
- Store workflow state persistently
- Allow contributor/lead decisions
- Support workflow resumption

### Phase 7: HANDOVER
- Generate structured handover document
- Proceed only after human approval
- Include verified claims and evidence

### Phase 8: FEEDBACK
- Collect successor feedback
- Store corrections and clarifications
- Support iterative refinement

## NEXMIND Continuity Ledger

Every claim represents a traceable relationship:

```
SOURCE EVENT → CANDIDATE CLAIM → EVIDENCE → VERIFICATION STATUS → HUMAN REVIEW
```

Verification states:
- **Supported**: Multiple sources confirm
- **Partially_supported**: Some evidence found
- **Unverified**: No evidence checked yet
- **Conflicting**: Multiple sources contradict
- **Missing_evidence**: Searched but not found

## API Endpoints

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project details

### Source Events
- `GET /api/projects/{id}/events` - List source events

### Claims
- `GET /api/projects/{id}/claims` - List claims

### Ingestion
- `POST /api/projects/{id}/import` - Import GitHub repository

### Workflow
- `POST /api/projects/{id}/workflow` - Execute workflow

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `GITHUB_TOKEN` - GitHub personal access token (optional, for private repos)
- `OPENAI_API_KEY` - OpenAI API key (for AI claim generation)
- `NODE_ENV` - Environment (development/production)

## Setup Instructions

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL**
   ```bash
   # Use Neon for managed PostgreSQL
   # Copy connection string to DATABASE_URL in .env
   ```

3. **Generate database migrations**
   ```bash
   npm run db:generate
   ```

4. **Run migrations**
   ```bash
   npm run db:push
   ```

5. **Seed demo dataset** (optional)
   ```bash
   npm run db:seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

### Production Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git push origin round2/phase-1-foundation
   ```

2. **Configure Vercel**
   - Connect GitHub repository
   - Set environment variables
   - Deploy

## Testing

### Run tests
```bash
npm test
```

### Run tests (CI mode)
```bash
npm run test:run
```

### Generate coverage report
```bash
npm run test:coverage
```

## Known Limitations (Phase 1)

1. **LLM Integration**: Currently uses placeholder LLM responses. Requires OpenAI API setup for actual claim generation.
2. **GitHub Rate Limiting**: Implements basic retry, but may need enhancement for large repositories.
3. **Workflow Persistence**: LangGraph state stored in PostgreSQL; upgrade pattern needed for recovery from failures.
4. **File Import**: CSV and Markdown importers not yet implemented; schema prepared for Phase 2.
5. **Authentication**: No user authentication in Phase 1; assumes single-user local development.
6. **Frontend UI**: Minimal technical verification interface; full UI planned for Phase 2.

## Phase 2 Planning

- Complete file importers (CSV, Markdown, notes)
- Implement LLM claim generation with provider adapters
- Add authentication and multi-user support
- Build comprehensive UI for workflow monitoring
- Implement feedback collection interface
- Add export/sharing capabilities

## Verification Checklist

- [x] Next.js TypeScript foundation
- [x] PostgreSQL schema and migrations setup
- [x] GitHub repository ingestion logic
- [x] LangGraph 8-phase workflow structure
- [x] API endpoints for core operations
- [x] Database schema with relationships
- [x] Smart Agriculture synthetic dataset seeding
- [x] Environment configuration
- [x] Basic testing infrastructure
- [ ] Full test coverage
- [ ] Production build verification
- [ ] Deployment to Vercel
