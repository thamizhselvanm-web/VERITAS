# VERITAS --- Backend Schema

**Database:** PostgreSQL\
**Queue/Cache:** Redis\
**Storage:** private object storage\
**Identifiers:** UUID/ULID\
**Tenant model:** strict isolation

## 1. Rules

1.  Tenant-owned tables contain `tenant_id`.
2.  Sensitive data is classified.
3.  Important events are versioned/append-only.
4.  AI decisions are immutable historical records.
5.  Evidence retains provenance.
6.  Files live outside PostgreSQL.
7.  Application users cannot delete audit records.
8.  Money is stored as integer minor units.
9.  Server derives tenant scope from authenticated context.

## 2. Tenants

``` sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE','SUSPENDED','ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 3. Users

``` sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  external_identity_id TEXT NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, external_identity_id),
  UNIQUE (tenant_id, email)
);
```

Use a dedicated identity provider for authentication secrets.

## 4. Roles

``` sql
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);
```

## 5. Entities

``` sql
CREATE TABLE entities (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  entity_type TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  external_reference TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 6. Entity Identifiers

``` sql
CREATE TABLE entity_identifiers (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  entity_id UUID NOT NULL REFERENCES entities(id),
  identifier_type TEXT NOT NULL,
  identifier_hash TEXT NOT NULL,
  masked_value TEXT,
  verification_status TEXT NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Prefer hashes/masked values for sensitive identifiers.

## 7. Invoices

``` sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  seller_entity_id UUID NOT NULL REFERENCES entities(id),
  buyer_entity_id UUID NOT NULL REFERENCES entities(id),
  invoice_number TEXT NOT NULL,
  normalized_invoice_number TEXT NOT NULL,
  invoice_date DATE,
  due_date DATE,
  currency CHAR(3),
  subtotal_minor BIGINT,
  tax_minor BIGINT,
  total_minor BIGINT NOT NULL,
  status TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Never use floating point for money.

## 8. Invoice Files

``` sql
CREATE TABLE invoice_files (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  object_key TEXT NOT NULL,
  original_filename TEXT,
  detected_mime_type TEXT NOT NULL,
  byte_size BIGINT NOT NULL,
  sha256 TEXT NOT NULL,
  malware_status TEXT NOT NULL,
  processing_status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Object storage remains private.

## 9. Extracted Fields

``` sql
CREATE TABLE invoice_fields (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  field_name TEXT NOT NULL,
  field_value JSONB NOT NULL,
  confidence NUMERIC(5,4),
  source_page INT,
  bounding_box JSONB,
  extraction_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 10. Verification

``` sql
CREATE TABLE verification_events (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  invoice_id UUID REFERENCES invoices(id),
  entity_id UUID REFERENCES entities(id),
  verification_type TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  status TEXT NOT NULL,
  response_reference TEXT,
  evidence JSONB,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);
```

Never retain unnecessary raw provider responses.

## 11. Duplicate Detection

``` sql
CREATE TABLE invoice_fingerprints (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  canonical_version TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, canonical_version, sha256)
);

CREATE TABLE invoice_similarities (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  compared_invoice_id UUID NOT NULL REFERENCES invoices(id),
  similarity_score NUMERIC(6,5) NOT NULL,
  matched_fields JSONB,
  changed_fields JSONB,
  detection_method TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 12. Trust Profiles

``` sql
CREATE TABLE trust_profiles (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  trust_score NUMERIC(5,2) NOT NULL,
  confidence_score NUMERIC(5,2) NOT NULL,
  evidence_completeness NUMERIC(5,2) NOT NULL,
  risk_level TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  model_version TEXT NOT NULL,
  feature_schema_version TEXT NOT NULL,
  evidence_snapshot_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Never overwrite old trust profiles.

## 13. Trust Signals

``` sql
CREATE TABLE trust_signals (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  trust_profile_id UUID NOT NULL REFERENCES trust_profiles(id),
  category TEXT NOT NULL,
  signal_code TEXT NOT NULL,
  severity TEXT NOT NULL,
  value JSONB,
  explanation TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_reference TEXT,
  confidence NUMERIC(5,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 14. Evidence

``` sql
CREATE TABLE evidence_items (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  invoice_id UUID REFERENCES invoices(id),
  trust_profile_id UUID REFERENCES trust_profiles(id),
  evidence_type TEXT NOT NULL,
  status TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_reference TEXT,
  reliability_score NUMERIC(5,4),
  observed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 15. Review

``` sql
CREATE TABLE review_cases (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  assigned_to UUID REFERENCES users(id),
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  reason_code TEXT,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE review_decisions (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  case_id UUID NOT NULL REFERENCES review_cases(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  decision TEXT NOT NULL,
  override_ai BOOLEAN NOT NULL DEFAULT false,
  override_reason TEXT,
  evidence_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 16. Evidence Requests

``` sql
CREATE TABLE evidence_requests (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  case_id UUID REFERENCES review_cases(id),
  requested_by UUID NOT NULL REFERENCES users(id),
  request_type TEXT NOT NULL,
  status TEXT NOT NULL,
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 17. Trust Graph

``` sql
CREATE TABLE relationship_edges (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  from_entity_id UUID NOT NULL,
  to_entity_id UUID NOT NULL,
  edge_type TEXT NOT NULL,
  confidence NUMERIC(5,4),
  first_observed_at TIMESTAMPTZ,
  last_observed_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Use PostgreSQL first. Add a graph database only when justified by
measured requirements.

## 18. Monitoring

``` sql
CREATE TABLE monitoring_events (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  invoice_id UUID REFERENCES invoices(id),
  entity_id UUID REFERENCES entities(id),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 19. Audit

``` sql
CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  actor_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  result TEXT NOT NULL,
  correlation_id TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Ordinary application users must not have UPDATE/DELETE privileges.

## 20. Proof

``` sql
CREATE TABLE proof_records (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  canonical_hash TEXT NOT NULL,
  proof_type TEXT NOT NULL,
  chain_id TEXT,
  transaction_reference TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at TIMESTAMPTZ
);
```

Never store sensitive invoice contents on-chain.

## 21. Idempotency

``` sql
CREATE TABLE idempotency_keys (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  idempotency_key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  response_hash TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, idempotency_key)
);
```

## 22. Important Indexes

``` sql
CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_cases_tenant_status ON review_cases(tenant_id, status);
CREATE INDEX idx_trust_invoice_created ON trust_profiles(invoice_id, created_at DESC);
CREATE INDEX idx_audit_tenant_created ON audit_events(tenant_id, created_at DESC);
```

Evaluate PostgreSQL Row Level Security for defense in depth.

## 23. Retention

Document retention for: - invoice files; - audit events; - trust
decisions; - verification responses; - logs; - backups; - deletion
requests.

Do not retain everything forever.
