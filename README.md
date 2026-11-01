# NEXMIND Phase 1 README

## Project Overview

NEXMIND is **The Adaptive Knowledge Continuity Platform**. When project contributors leave, important knowledge gets scattered. NEXMIND reconstructs this context from authorized sources and creates verified, human-reviewed handovers for successors.

**Tagline**: PEOPLE MOVE. KNOWLEDGE SHOULD NOT DISAPPEAR.

## What's Included in Phase 1

Phase 1 establishes the complete technical foundation:

✓ Next.js 15 full-stack application with TypeScript  
✓ PostgreSQL database with Drizzle ORM  
✓ Complete data model (12 entities, relationships)  
✓ 8-phase LangGraph workflow pipeline  
✓ GitHub repository ingestion  
✓ API endpoints for project management  
✓ Synthetic Smart Agriculture demo dataset  
✓ Database migrations and seeding  
✓ Test infrastructure  

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (local or Neon cloud)
- GitHub token (optional, for private repos)
- OpenAI API key (optional, for LLM features)

### Setup

1. **Clone and install**
```bash
cd nexmind
npm install
```

2. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your database URL and API keys
```

3. **Set up database**
```bash
npm run db:generate   # Generate migrations
npm run db:push       # Apply migrations
npm run db:seed       # Load demo dataset
```

4. **Start development server**
```bash
npm run dev
# Open http://localhost:3000
```

## Architecture Overview

### Technology Stack
- **Frontend**: React 19, Next.js App Router, Tailwind CSS
- **Backend**: Node.js, Next.js Route Handlers
- **Database**: PostgreSQL, Drizzle ORM
- **AI Workflow**: LangGraph.js (8-phase pipeline)
- **APIs**: GitHub REST API

### Project Structure
```
src/
├── app/              # Next.js routes and API endpoints
├── server/           # Backend logic
│   ├── db/           # Database schema and migrations
│   ├── github/       # GitHub integration
│   └── agents/       # LangGraph workflow
├── lib/              # Shared utilities and validation
└── types/            # TypeScript definitions
```

### Core Data Model

**NEXMIND Continuity Ledger**: Every claim traces back to sources

```
SOURCE EVENT → CANDIDATE CLAIM → EVIDENCE → VERIFICATION → HUMAN REVIEW
```

**Key Entities**:
- Projects & Members
- Source Connections (GitHub, files)
- Source Events (commits, PRs, issues, docs)
- Candidate Claims (decisions, rationale, experiments)
- Evidence Links (claim ↔ source relationships)
- Workflow Runs (resumable state)
- Handover Versions (final documents)

### 8-Phase Workflow

1. **CONNECT** - Accept authorized sources
2. **NORMALISE** - Clean and validate data
3. **RECONSTRUCT** - Build project context
4. **EXTRACT_INTENT** - Generate candidate claims
5. **VERIFY** - Validate claims against evidence
6. **HUMAN_REVIEW** - Pause for contributor/lead approval
7. **HANDOVER** - Generate verified document
8. **FEEDBACK** - Collect successor feedback

## API Reference

### Projects
```bash
# List projects
GET /api/projects

# Create project
POST /api/projects
{ "name": "...", "repositoryUrl": "..." }

# Get project
GET /api/projects/{id}

# Import GitHub repo
POST /api/projects/{id}/import
{ "repositoryUrl": "https://github.com/owner/repo" }
```

### Source Events & Claims
```bash
# Get all source events for project
GET /api/projects/{id}/events

# Get all claims for project
GET /api/projects/{id}/claims
```

### Workflow
```bash
# Execute workflow pipeline
POST /api/projects/{id}/workflow
```

## Demo Dataset

The Smart Agriculture Prediction dataset includes:
- 28 sample commits
- 4 branches (simulated via source events)
- 6 pull request threads
- 18 experiment records (CSV format)
- Planted contradictions for verification testing
- Abandoned high-scoring experiments
- Orphaned dependencies

**Load demo data**:
```bash
npm run db:seed
```

## Testing

```bash
# Run tests (watch mode)
npm test

# Run tests once (CI mode)
npm run test:run

# Coverage report
npm run test:coverage
```

## Verification Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build

# Start production server
npm start
```

## Configuration Files

- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS theming
- `drizzle.config.ts` - ORM migrations
- `.env.example` - Environment variables template

## Database Operations

```bash
# Generate new migration
npm run db:generate

# Apply pending migrations
npm run db:push

# Seed demo dataset
npm run db:seed

# View migrations
ls src/server/db/migrations/
```

## Known Limitations

1. **LLM Integration**: Placeholder responses; requires OpenAI API setup
2. **File Importers**: CSV/Markdown parsing prepared but not implemented
3. **User Authentication**: Single-user mode for Phase 1
4. **Frontend UI**: Technical verification interface only; full UI in Phase 2
5. **Workflow Recovery**: Basic persistence; enhanced patterns needed

## Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:5432/nexmind

# Optional
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_openai_key
NODE_ENV=development
```

## Performance Notes

- Database queries use indexes for common patterns
- Source event imports are idempotent (duplicate prevention)
- Workflow state is persisted for resumability
- API endpoints implement error handling and validation

## Deployment

### To Vercel
```bash
# Push branch
git push origin round2/phase-1-foundation

# Deploy via Vercel UI or CLI
vercel deploy
```

### Environment Setup
- Add DATABASE_URL to Vercel project secrets
- Configure GitHub/OpenAI tokens as needed
- Set NODE_ENV=production

## Documentation

- `ARCHITECTURE.md` - Detailed technical architecture
- `src/lib/validation.ts` - API input validation schemas
- `src/server/db/schema.ts` - Database entity definitions

## Next Steps (Phase 2)

- [ ] Implement CSV/Markdown file importers
- [ ] Add LLM claim generation with provider adapters
- [ ] Build complete workflow UI
- [ ] Implement user authentication
- [ ] Add feedback collection interface
- [ ] Export/sharing capabilities
- [ ] Performance optimization

## Support

For issues or questions:
1. Check `ARCHITECTURE.md` for design details
2. Review test files for usage examples
3. Inspect database schema in `src/server/db/schema.ts`

---

**NEXMIND Phase 1 Foundation** - Ready for Phase 2 development
