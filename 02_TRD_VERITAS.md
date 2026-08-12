# VERITAS --- Technical Requirements Document (TRD)

**Architecture:** Secure modular event-driven platform

## 1. Reference Architecture

``` text
Web Client
   ↓ TLS
API Gateway / WAF
   ↓
API + Auth
   ├── PostgreSQL
   ├── Object Storage
   └── Job Queue
          ├── OCR Worker
          ├── Verification Worker
          ├── Similarity Worker
          └── Trust Worker
                 ↓
          Decision / Case Service
                 ↓
          Audit + Proof Service
                 ↓
             Blockchain
```

Do not build a single privileged "upload PDF → AI says fraud" endpoint.

## 2. Recommended Stack

Frontend: - React + TypeScript - Vite - Tailwind CSS - TanStack Query -
React Hook Form + Zod

Backend: - Node.js + TypeScript - Fastify or Express - PostgreSQL -
Redis - BullMQ/equivalent queue - private S3-compatible object storage

ML: - Python + FastAPI - scikit-learn/XGBoost where justified - SHAP
where appropriate - OCR/document intelligence - model registry

Security: - OIDC identity provider - KMS - secrets manager - WAF -
centralized logging - SAST/DAST - dependency/container scanning

Blockchain: - permissioned ledger for institutional privacy, or
EVM-compatible network for prototype verification. - Store hashes/proof
metadata only.

## 3. Service Boundaries

### Auth Service

Authentication, MFA, sessions and role mapping.

### Invoice Service

Invoice metadata, ownership and lifecycle.

### Document Service

OCR, extraction, provenance and normalization.

### Verification Service

Authorized external verification adapters.

### Similarity Service

Canonical fingerprint, exact duplicate and near-duplicate analysis.

### Trust Service

Features, score, confidence, evidence completeness and explanations.

### Case Service

Review queue, assignment, evidence requests and overrides.

### Monitoring Service

Event ingestion and trust recalculation.

### Audit Service

Append-only audit events.

### Proof Service

Canonical event hashing and chain verification.

## 4. Secure Upload Pipeline

``` text
Authenticated Upload Intent
 → short-lived signed upload URL
 → private object storage
 → malware scan
 → MIME/signature validation
 → OCR sandbox
 → extraction
 → normalization
 → verification
 → similarity
 → trust
```

Never trust client MIME type or filename.

## 5. API Requirements

Example endpoints:

``` text
POST /api/v1/invoices
GET  /api/v1/invoices/:invoiceId
GET  /api/v1/invoices/:invoiceId/trust-profile
GET  /api/v1/invoices/:invoiceId/evidence
POST /api/v1/invoices/:invoiceId/evidence-request
GET  /api/v1/cases
POST /api/v1/cases/:caseId/decision
GET  /api/v1/audit-events
GET  /api/v1/proofs/:proofId
```

Every endpoint must validate input, authenticate, authorize, enforce
tenant scope, rate-limit, use correlation IDs and avoid sensitive data
in logs.

## 6. Authorization

Use RBAC plus resource-level authorization.

Roles: - PLATFORM_ADMIN - TENANT_ADMIN - RISK_ANALYST - REVIEWER -
AUDITOR - MSME_USER - INTEGRATION_SERVICE

Server-side authorization must verify tenant ownership and required
permissions. Deny by default.

## 7. Authentication

Prefer OIDC/OAuth-compatible identity, short-lived access tokens,
rotating refresh tokens, MFA for privileged users and secure session
invalidation. If local passwords are used, use Argon2id.

## 8. File Security

Treat invoices as hostile input.

Controls: - private bucket; - short-lived signed URLs; - size/page
limits; - malware scanning; - file signature validation; - PDF parser
sandboxing; - no public object URLs; - encrypted storage.

## 9. AI Security

If an LLM is used: - invoice text is untrusted input; - document text
cannot override system instructions; - extraction is separated from
decision policy; - tool access is constrained; - outputs use structured
schemas; - output is validated; - LLM cannot directly approve
financing; - prompt/model versions are logged; - prompt injection is
tested.

## 10. Trust Engine

``` text
Evidence Snapshot
 → Feature Pipeline
 → Rules + ML
 → Risk Signals
 → Score
 → Calibration
 → Confidence
 → Explanation
```

Feature groups: - DOCUMENT - ENTITY - DUPLICATE - RELATIONSHIP -
BEHAVIOUR - PAYMENT - EVIDENCE_AVAILABILITY

Every feature retains source, timestamp, reliability and missingness.

## 11. Score Contract

``` json
{
  "trust_score": 82,
  "confidence_score": 64,
  "evidence_completeness": 71,
  "risk_level": "MEDIUM",
  "recommendation": "MANUAL_REVIEW",
  "model_version": "risk-0.3.0",
  "reasons": []
}
```

A low confidence result may trigger REQUEST_MORE_EVIDENCE instead of
REJECT.

## 12. Model Governance

Each model release requires: - model ID/version; - training dataset
version; - feature schema version; - evaluation metrics; - known
limitations; - approval state; - deployment timestamp; - rollback
version.

Store model version with every decision.

## 13. Near-Duplicate Engine

Canonicalize whitespace, dates, currency, numeric precision, tax
representation and field ordering.

Generate SHA-256 for exact fingerprints.

Near-duplicate analysis can combine: - field similarity; - text
similarity; - line-item similarity; - structural similarity; -
image/document similarity.

Never use one similarity score as the sole fraud decision.

## 14. Trust Graph

Entities:

``` text
Seller
Buyer
Invoice
FinancingEvent
PaymentEvent
VerificationEvent
BusinessIdentity
```

Edges:

``` text
SELLS_TO
ISSUED
FINANCED_BY
PAID_BY
VERIFIED_AS
SIMILAR_TO
REGISTERED_AS
```

Use PostgreSQL first. Introduce a graph database only if demonstrated
scale/analytics needs justify it.

## 15. Continuous Monitoring

Events:

``` text
PAYMENT_RECEIVED
PAYMENT_DELAYED
NEW_INVOICE
DUPLICATE_DISCOVERED
IDENTITY_CHANGED
BUYER_CONFIRMED
VERIFICATION_EXPIRED
MODEL_UPDATED
```

Each event creates a new evidence/decision version. Never overwrite old
decisions.

## 16. Privacy

Classify data as: - Public - Internal - Confidential - Restricted

Use encryption and least privilege according to classification.
Sensitive invoice data stays off-chain.

## 17. Cryptography

Prefer: - TLS 1.3 where available; - AES-256-GCM for application-level
encryption; - SHA-256 fingerprints; - KMS-managed keys; - key rotation.

Do not invent cryptography.

## 18. Logging

Never log: - passwords; - tokens; - secrets; - raw invoice contents; -
full sensitive identifiers.

Log:

``` text
timestamp
actor_id
tenant_id
action
resource
result
correlation_id
```

## 19. Reliability

Use: - asynchronous jobs; - idempotency keys; - retries with exponential
backoff; - dead-letter queues; - circuit breakers; - timeouts; - health
checks.

External verification unavailable must become UNKNOWN/UNAVAILABLE, never
VERIFIED.

## 20. Threat Model

Threats: 1. account takeover; 2. broken object authorization; 3.
cross-tenant leakage; 4. malicious files; 5. parser exploitation; 6.
prompt injection; 7. model manipulation; 8. API abuse; 9. insider
misuse; 10. data exfiltration; 11. supply-chain compromise; 12.
proof-key compromise; 13. audit tampering; 14. replay attacks; 15.
malicious external responses.

Every threat needs asset, attacker, attack path, control, detection and
response.

## 21. Security Testing

Mandatory: - unit tests; - integration tests; - authorization tests; -
tenant-isolation tests; - API fuzzing; - SAST/DAST; - dependency
scanning; - secret scanning; - container scanning; - malware upload
tests; - SSRF tests; - BOLA/IDOR tests; - privilege escalation tests; -
prompt-injection tests; - model-abuse tests.

## 22. Production Gate

No production release with critical vulnerabilities, incomplete
authorization coverage, unverified tenant isolation, exposed secrets,
untested backups or untraceable model decisions.
