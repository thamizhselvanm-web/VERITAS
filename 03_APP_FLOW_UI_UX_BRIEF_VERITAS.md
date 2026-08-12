# VERITAS --- App Flow + UI/UX Brief

**Design direction:** Premium institutional fintech/security platform.

## 1. Design Philosophy

VERITAS should feel like software used by a serious financial risk team.

It should NOT look like: - a neon AI landing page; - a generic SaaS
admin template; - a dashboard full of decorative charts; - a
glassmorphism demo.

**Design principle:** Quiet confidence. High information density. Strong
hierarchy. Zero visual noise.

## 2. Visual Identity

Dark-first institutional interface.

Use: - graphite/near-black surfaces; - neutral text; - restrained green
for verified; - amber for review; - red only for serious risk; - subtle
blue/indigo for informational states.

Avoid rainbow gradients, glowing cards, excessive rounded containers and
decorative animation.

## 3. Typography

Use one professional family such as Inter, Geist or IBM Plex Sans.

``` text
Display: 36–48
Page title: 28–32
Section: 18–22
Body: 14–16
Metadata: 12–13
```

Use tabular numerals for financial values.

## 4. Spacing

Use a 4/8px system:

``` text
4 8 12 16 24 32 40 48 64
```

## 5. Information Architecture

``` text
VERITAS
├── Overview
├── Trust Cases
│   ├── All Cases
│   ├── Needs Review
│   └── Evidence Requests
├── Invoices
│   ├── All
│   ├── Upload
│   └── Verification
├── Trust Graph
├── Monitoring
├── Audit & Proof
├── Integrations
└── Administration
```

## 6. Analyst Flow

``` text
Login
 → MFA
 → Overview
 → Review Queue
 → Case
 → Invoice Evidence
 → Trust Profile
 → Risk Signals
 → Relationship Graph
 → Evidence Timeline
 → Request Evidence / Decide
 → Audit
```

## 7. Upload Flow

``` text
Upload
 → Secure upload
 → Security scan
 → Processing
 → Extraction
 → Verification
 → Similarity
 → Risk analysis
 → Trust profile
```

Show a live processing timeline rather than a spinner.

## 8. Overview

Header:

``` text
Trust Operations
Tuesday, 11 August 2026
12 cases require attention
```

KPIs:

``` text
Open Cases | High Risk | Evidence Gap | Avg. Review Time
```

Primary content: - priority review queue; - trust health; - recent
verification events.

Do not fill the dashboard with vanity metrics.

## 9. Case Screen

Header:

``` text
CASE VRT-28491
Seller: Acme Components
Buyer: Meridian Industries
₹5,00,000
Invoice INV-1024
[Request Evidence] [Assign] [Review]
```

Trust summary:

``` text
Trust: 82/100
Confidence: 64/100
Evidence: 71%
Recommendation: MANUAL REVIEW
```

## 10. Evidence Ledger

``` text
IDENTITY
✓ Seller verified
✓ Buyer verified

DOCUMENT
✓ Invoice fields consistent

DUPLICATE
⚠ 94% similarity with INV-984

BEHAVIOUR
⚠ Amount is 18.7× historical median

EVIDENCE
⚠ Payment history unavailable
```

Every item expands to show source, timestamp, confidence and evidence.

## 11. Explainability

For each risk reason show:

``` text
Signal
Impact
Evidence
Confidence
Source
Timestamp
```

Example:

``` text
AMOUNT ANOMALY
Current invoice: ₹95,00,000
Historical median: ₹5,10,000
Deviation: 18.6×
Confidence: High
```

## 12. Trust Graph

The graph must answer: \> Why is this relationship relevant?

Nodes: - buyer; - seller; - invoice; - payment; - financing; -
verification.

Interactions: - click node; - inspect relationship; - filter by time; -
highlight risk; - open evidence.

## 13. Evidence Request

``` text
What evidence would reduce uncertainty?

[ ] Buyer confirmation
[ ] Purchase order
[ ] Delivery proof
[ ] Payment evidence
[ ] Business verification
[ ] Other
```

This is a core workflow, not a cosmetic modal.

## 14. Decision UX

``` text
○ Approve recommendation
○ Manual review
○ Request more evidence
○ Flag high risk
○ Reject according to policy
```

If overriding:

``` text
Override reason *
Evidence supporting override *
```

No silent override.

## 15. Audit/Proof

Show:

``` text
Invoice fingerprint
Verification event timestamp
Proof status
Chain reference
Data stored on-chain: hash + event metadata
Sensitive invoice data: OFF-CHAIN
```

## 16. Public QR Verification

Minimal page:

``` text
VERITAS
✓ Proof verified
VERITAS ID: VRT-928374
Status: REGISTERED
Timestamp: 11 Aug 2026
Sensitive financial information: Not displayed
```

## 17. Motion

Motion communicates state: - 120--220ms transitions; - progress
transitions; - drawer expansion; - graph focus.

No decorative infinite animations.

## 18. Accessibility

Target WCAG 2.2 AA principles: - keyboard navigation; - visible focus; -
semantic HTML; - accessible labels; - no colour-only status; - reduced
motion; - screen-reader-friendly tables.

## 19. Design System

Components:

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
ScoreSummary
TrustSignal
RiskReason
GraphNode
AuditEvent
FileUploader
EmptyState
CommandPalette
```

Every component needs loading, disabled, error, empty, focus and
responsive states.

## 20. Premium Quality Bar

Before release: - no generic template; - strict grid; - consistent
typography; - meaningful whitespace; - restrained colour; - useful
charts; - polished empty/error/loading states; - accessible
interactions; - intentional motion; - no fake metrics.
