---
name: round2_requirements
description: Complete Phase 2 spec with 8 functional screens, demo workflow, and deployment targets
metadata:
  type: project
---

## Phase 2 Core Deliverables

### 1. Landing & Demo Entry
- Professional product page explaining problem + solution
- "Open Demo Workspace" CTA
- Guided demo entry using Smart Agriculture dataset
- No API key configuration required for demo
- Clear fallback messaging if LLM unavailable

### 2. Eight Functional Screens
1. **Overview** — Real project stats, import status, workflow progress, counters from DB
2. **Activity Timeline** — Chronological import records, filterable by date/source type
3. **Decision Trails** — Evidence-first interface showing Claim→Evidence→Verification
4. **Knowledge Gaps** — README-vs-code contradictions, missing info, unresolved conflicts
5. **Review Centre** — Contributor review + Project Lead approval (distinct steps)
6. **Successor Handover** — Final verified dossier, structured, downloadable
7. **Feedback** — Post-handover collection (was useful? missing info? next actions?)
8. **Settings** — Project configuration

### 3. Repository Connection & Import
- Accept authorized GitHub URLs
- Validate and fetch metadata
- Show actual imported records
- Support demo/sample option
- Handle import errors honestly
- Prevent duplicates on re-import

### 4. 8-Phase Workflow Progress
Display real state:
- CONNECT (project validation)
- NORMALISE (data cleaning)
- RECONSTRUCT (context building)
- EXTRACT_INTENT (claim generation)
- VERIFY (validation)
- HUMAN_REVIEW (pause for review)
- HANDOVER (document generation)
- FEEDBACK (collection)

Show: completed, active, pending, failed states

### 5. Decision Trails Evidence Model
Each claim displays:
- Decision statement
- Why system identified it
- Related source events
- Supporting evidence (excerpts/links)
- Contradictory evidence
- Verification status
- Review status
- Next actions

Users can open evidence and inspect original records.

### 6. Knowledge Gaps Detection
Detect and display:
- README-versus-code contradictions
- Missing decision rationale
- Unverified AI claims
- Stale records
- Unresolved dependencies
- Unknown ownership
- Incomplete handover info

Each gap explains: what's missing? why matters? what to verify?

### 7. Review Centre (Human-in-the-Loop)
**Contributor Phase**:
- Read generated claim
- Inspect evidence
- Edit claim text
- Approve/reject
- Add comments
- Record unresolved questions

**Project Lead Phase**:
- Review contributor decisions
- Verify completeness
- Check permissions
- Approve final handover
- Sign off

Server-side validation for all actions.

### 8. Successor Handover Workspace
Generate structured dossier:
1. Project overview
2. Current state
3. Chronological milestones
4. Important decisions + rationale
5. Supporting references
6. Failed/abandoned experiments
7. Active/unfinished tasks
8. Dependencies + ownership
9. Contradictions + unknowns
10. Recommended next actions
11. Approval status + version

**Format**: Clean HTML/print view + downloadable (Markdown/JSON/PDF)
**Permissions**: Enforced server-side before export
**Finalization**: Not shareable until all review gates passed

### 9. Feedback Collection
After successor views dossier, collect:
- Was it useful?
- Missing information?
- Helpful next actions?
- Claims needing correction?
- Additional context?

Store against project + handover version.

## Demonstration Experience (Smart Agriculture)

**Must expose three planted knowledge issues**:
1. README-versus-code contradiction
2. Abandoned high-scoring branch (latency)
3. Orphaned API dependency

**Complete 10-step flow for judge**:
1. Enter demo project
2. Inspect imported records
3. Run reconstruction pipeline
4. Explore candidate decisions
5. Open supporting evidence
6. Identify gaps/contradictions
7. Contributor review + correct a claim
8. Project-lead review + approve
9. Open successor dossier
10. Submit feedback

Each step genuinely functional (not scripted).

## Vercel-Compatible Workflow Execution

- Persisted workflow-run records
- Bounded batch processing
- Saved progress + safe retry
- Prevent duplicate imports/claims
- Accurate run status to UI
- Handle rate limits + timeouts
- Make partial failures understandable
- No in-memory long-running processes
- No client-side expensive analysis
- Server-only credentials

## Security & Trust

- Least-privilege source access
- Server-only credentials
- Secret redaction (where practical)
- Source content isolation
- Evidence validation
- Role-aware exports
- Explicit human approval
- Clear distinction: facts vs candidates vs unknowns

## Three Round 3 Improvements (MUST BE PROPOSED, NOT CLAIMED AS DONE)

1. **Knowledge Debt Radar**: Detect poorly documented components, fragile dependencies, single-owner concentration
2. **Successor Readiness Simulator**: Practice environment with documented decisions, edge cases, recovery procedures
3. **Adaptive Project Memory**: Provenance-preserving memory, updated via approved decisions + corrections

## Actual Metrics (From Round 1 Benchmarks)

Must show test set, numerator, denominator, result, false positives/negatives:
- Evidence coverage ≥95%
- Planted contradiction recall ≥80%
- Next-action recall ≥90%
- Permission boundary tests 100% pass

If not measured: label "Not measured"

## Quality Assurance Test Matrix

**Must Pass**:
- Unit tests
- API integration tests
- Database tests
- Workflow checkpoint tests
- Source provenance tests
- Human review + approval tests
- Permission filter tests
- Import retry + idempotency tests
- **End-to-end demo**: GitHub/demo → timeline → claims → gaps → contributor review → lead approval → handover → feedback

**Edge Cases**:
- Invalid repo URLs
- GitHub rate limits
- Missing LLM credentials
- Unsupported source refs
- Duplicate imports
- Contradictory docs
- Malformed CSVs
- Missing evidence
- Unauthorized exports
- Interrupted workflow recovery
- Failed approval
- Empty project states

**Verification**: Type checking, linting, formatting, production build, all tests pass

## Round 2 Documentation

1. Updated README (project description, architecture, installation, demo)
2. System architecture diagram
3. Technology & implementation details
4. Complete features list (Completed/Partial/Planned)
5. Changes from Round 1 plan
6. Actual testing results + benchmarks
7. Known limitations
8. Three Round 3 improvements
9. Vercel deployment instructions
10. Environment variable docs
11. Updated Round 2 project PDF (retain NEXMIND identity, explain Next.js migration, preserve problem statement, 8 phases)

**PDF requirement**: Real screenshots from actual implementation OR print-ready source + report blocker

## Vercel Deployment Checklist

- [x] Next.js production build passes
- [ ] Node.js runtime compatible
- [ ] PostgreSQL via Neon/Marketplace
- [ ] All env vars configured server-only
- [ ] Database migrations safe + tested
- [ ] GitHub + LLM credentials set
- [ ] API routes verify
- [ ] Demo workspace seeded
- [ ] Complete demo workflow tested on deployed URL
- [ ] Secrets not exposed in bundles
- [ ] Demo data not local-only

## Git & Final Submission

- **Remote**: https://github.com/sageverse-tech/nexmind.git
- **Branch**: `round2/phase-2-product-deploy`
- **Push**: Before final commit, verify no `.env`, tokens, temp files
- **Final Acceptance Test**: Judge can independently complete full 12-step flow
- **Deliverables**: Architecture, features list, test results, metrics, deployment URL (if ready), repo URL, commit hashes, PDF, Round 3 improvements
