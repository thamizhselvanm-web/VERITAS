# VERITAS --- Premium Product Implementation Plan

## 0. Definition of Done

VERITAS is demo-ready when: - end-to-end workflow works; - every major
screen has loading/error/empty states; - tenant authorization is
enforced; - hostile files are handled safely; - AI decisions are
explainable; - confidence is separate from risk; - evidence completeness
exists; - manual review works; - Trust Graph works; - continuous
monitoring is demonstrated; - audit trail is visible; - proof
verification works; - no secrets are committed.

## 1. Build Strategy

Build one vertical slice first:

``` text
Login
 → Upload
 → Extract
 → Analyze
 → Trust Profile
 → Review
 → Audit
 → Proof
```

Then add graph, monitoring and integrations.

## 2. Repository

``` text
veritas/
├── apps/web
├── apps/api
├── services/document-worker
├── services/trust-engine
├── services/verification-service
├── services/proof-service
├── packages/ui
├── packages/types
├── packages/validation
├── ml
├── infra
├── database
└── docs
```

## 3. Phase 1 --- Foundation

Deliver: - monorepo; - strict TypeScript; - lint/format; - CI; -
Docker; - PostgreSQL; - Redis; - private object storage; - environment
separation.

Security immediately: - secret scanning; - dependency scanning; -
SAST; - `.env.example`; - no credentials in Git.

## 4. Phase 2 --- Design System

Build reusable:

``` text
Button
Input
Select
Badge
Status
Card
DataTable
Drawer
Modal
Timeline
EvidenceItem
TrustScore
ConfidenceMeter
EvidenceMeter
RiskSignal
FileUploader
CommandPalette
```

Define design tokens before pages.

## 5. Phase 3 --- Authentication

Implement: - OIDC-compatible authentication; - MFA; - sessions; - role
mapping; - tenant context.

Acceptance test:

``` text
Tenant A user → Tenant A invoice ✓
Tenant A user → Tenant B invoice ✗
```

## 6. Phase 4 --- Secure Upload

``` text
Upload Intent
 → Signed URL
 → Private Storage
 → Malware Scan
 → File Validation
 → Queue
```

Test: - renamed executables; - invalid MIME; - oversized files; -
malformed PDFs; - decompression bombs; - path traversal; - unauthorized
downloads.

## 7. Phase 5 --- Document Intelligence

``` text
RAW
 → OCR
 → Extraction
 → Confidence
 → Normalization
 → Validation
```

Show field confidence and source location.

## 8. Phase 6 --- Duplicate Detection

Exact: - canonicalization; - SHA-256.

Near: - field similarity; - text similarity; - line-item similarity; -
structural similarity.

Show matched and changed fields. Never reject solely from similarity.

## 9. Phase 7 --- Trust Engine

Start deterministic, then add ML.

Example explainable score components:

``` text
Identity
Invoice integrity
Duplicate status
Behaviour
Relationship
Evidence
```

The score must be reproducible and versioned.

## 10. Phase 8 --- Confidence

Separate:

``` text
Trust
Confidence
Evidence Completeness
```

Example:

``` text
Trust: 81
Confidence: 49
Evidence: 43%
Recommendation: REQUEST_MORE_EVIDENCE
```

This is a core product differentiator.

## 11. Phase 9 --- Trust Graph

Start with PostgreSQL relationships.

Show:

``` text
SELLER
 ├── invoice ── BUYER
 ├── payment
 └── previous invoice
```

Interactions: - select node; - inspect edge; - filter time; - highlight
suspicious relationships; - open supporting evidence.

## 12. Phase 10 --- Review Workflow

``` text
Needs Review
 → Case
 → Evidence
 → Graph
 → Request Evidence / Decide
 → Mandatory Override Reason
 → Audit
```

Decisions are historical events, not mutable status changes.

## 13. Phase 11 --- Continuous Monitoring

Create demo event simulator:

``` text
PAYMENT_RECEIVED
PAYMENT_DELAYED
NEW_SIMILAR_INVOICE
BUYER_CONFIRMATION
IDENTITY_CHANGE
```

Demonstrate:

``` text
Trust 89
 → payment delayed
Trust 72
 → similar invoice
Trust 51
 → manual review
```

## 14. Phase 12 --- Proof

``` text
Decision Event
 → Canonical JSON
 → SHA-256
 → Proof Record
 → Blockchain
```

Show hash, timestamp, transaction and verification state.

Never send invoice contents to the chain.

## 15. Phase 13 --- Premium UI

Build: 1. Login 2. Overview 3. Review queue 4. Case detail 5. Trust
graph 6. Audit/proof

The case detail is the flagship screen.

## 16. Flagship Case Layout

``` text
CASE HEADER
────────────────────────
TRUST | CONFIDENCE | EVIDENCE
────────────────────────
INVOICE | TOP RISK SIGNALS
────────────────────────
TRUST GRAPH
────────────────────────
EVIDENCE TIMELINE
────────────────────────
DECISION ACTIONS
```

## 17. Security Checklist

Identity: - MFA; - secure sessions; - rate limits; - brute-force
protection.

Authorization: - tenant isolation; - object-level authorization; -
function-level authorization; - deny by default.

API: - strict schemas; - request limits; - rate limits; - idempotency; -
safe errors.

Files: - malware scan; - private storage; - signed URLs; - signature
validation; - sandbox processing.

Database: - parameterized queries; - least privilege; - migrations; -
backups; - RLS evaluation.

Secrets: - secrets manager; - no frontend secrets; - rotation.

AI: - prompt-injection defense; - structured outputs; - model
versioning; - output validation; - human approval.

Supply chain: - lockfiles; - dependency scan; - SAST; - container
scan; - SBOM.

## 18. Testing

Unit: - scoring; - normalization; - hashing; - authorization.

Integration: - upload; - OCR; - verification; - duplicate; - case
creation.

Security: - IDOR/BOLA; - cross-tenant access; - privilege escalation; -
SSRF; - malicious files; - rate-limit bypass; - token replay.

AI: - prompt injection; - malformed extraction; - hallucinated fields; -
contradictory evidence.

E2E:

``` text
Login
→ Upload
→ Process
→ Trust Profile
→ Review
→ Evidence Request
→ Decision
→ Audit
→ Proof
```

## 19. CI/CD

Pull request:

``` text
Install
 → Lint
 → Typecheck
 → Unit Tests
 → SAST
 → Dependency Scan
 → Secret Scan
 → Build
```

Staging:

``` text
Integration
 → DAST
 → E2E
 → Security Regression
```

Production:

``` text
Approval
 → Migration Check
 → Deploy
 → Smoke Test
 → Monitor
```

## 20. Observability

Every request gets a correlation ID.

Track: - latency; - queue depth; - OCR duration; - model duration; -
verification failures; - failed logins; - authorization denials; -
suspicious uploads; - error rates.

Do not log invoice contents.

## 21. Demo Dataset

Create synthetic fixtures: 1. legitimate invoice; 2. exact duplicate; 3.
near duplicate; 4. cold-start entity; 5. behaviour anomaly; 6.
relationship anomaly; 7. evidence-gap case.

Clearly label all synthetic data.

## 22. Demo Story

Case 1:

``` text
Trust 91
Confidence 94
Evidence 93%
Approve recommendation
```

Case 2:

``` text
Trust 54
Confidence 76
Evidence 91%
Manual review
```

Case 3:

``` text
Trust 78
Confidence 42
Evidence 51%
Request more evidence
```

Case 4: A later payment-delay event causes recalculation and shows
continuous trust.

## 23. Quality Gate

### Product

-   problem obvious in 30 seconds;
-   differentiator obvious;
-   reviewer understands the decision.

### Engineering

-   happy path works;
-   failures work;
-   jobs are idempotent;
-   models are versioned.

### Security

-   no cross-tenant access;
-   malicious PDFs isolated;
-   overrides require reasons;
-   audit cannot be altered;
-   secrets never reach browser.

### Design

-   no template feel;
-   intentional states;
-   useful charts;
-   calm visual language.

## 24. Final Product Sentence

> VERITAS builds a continuously updated, explainable trust profile for
> invoice-financing requests so institutions can see not only the risk,
> but the evidence, uncertainty and next action.

## 25. Priority

``` text
P0 — Core
Auth
Tenant isolation
Upload
OCR
Extraction
Duplicate detection
Trust score
Confidence
Evidence completeness
Explainability
Review

P1 — Winning
Trust graph
Evidence request
Continuous monitoring
Audit timeline
Proof verification

P2 — Enterprise
External integrations
Advanced ML
Graph analytics
Model governance
SIEM integration
Enterprise deployment

P3 — Only if time remains
Mobile app
Public-chain expansion
AI chat
Decorative analytics
```
