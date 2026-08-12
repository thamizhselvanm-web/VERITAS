import { InvoiceCase, Tenant, GraphNode, GraphEdge, AuditEvent, ProofRecord } from '../types';

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-a',
    name: 'Apex Capital Financing',
    code: 'APEX',
    status: 'ACTIVE',
    createdAt: '2025-01-10T00:00:00Z'
  },
  {
    id: 'tenant-b',
    name: 'Nexus Trade Credit Corp',
    code: 'NEXUS',
    status: 'ACTIVE',
    createdAt: '2025-02-15T00:00:00Z'
  }
];

export const mockCases: InvoiceCase[] = [
  {
    id: 'case-vrt-28491',
    caseNumber: 'VRT-28491',
    tenantId: 'tenant-a',
    sellerName: 'Acme Components Ltd',
    sellerTaxId: 'IN-9840291-GST',
    buyerName: 'Meridian Industries Inc',
    buyerTaxId: 'IN-1029384-GST',
    invoiceNumber: 'INV-1024',
    issueDate: '2026-08-01',
    dueDate: '2026-09-30',
    totalMinor: 50000000, // ₹5,00,000.00 per UI Brief Sec 9
    currency: 'INR',
    status: 'NEEDS_REVIEW',
    telemetry: {
      id: 'tp-28491',
      invoiceId: 'case-vrt-28491',
      trustScore: 82,
      confidenceScore: 64,
      evidenceCompleteness: 71,
      riskLevel: 'MEDIUM',
      recommendation: 'MANUAL_REVIEW',
      modelVersion: 'risk-0.3.0',
      featureSchemaVersion: 'feat-v1.4',
      reasons: [
        'Near-Duplicate 94% similarity flagged against INV-984',
        'Amount is 18.7x historical relationship median (₹5,00,000 vs ₹26,700 median)'
      ]
    },
    fields: [
      { id: 'f1', fieldName: 'invoice_number', label: 'Invoice Number', value: 'INV-1024', normalizedValue: 'INV-1024', confidence: 99, status: 'VALID', spatialBox: { x: 65, y: 12, w: 25, h: 4 } },
      { id: 'f2', fieldName: 'total_amount', label: 'Total Amount', value: '₹5,00,000.00', normalizedValue: '500000.00', confidence: 98, status: 'VALID', spatialBox: { x: 65, y: 78, w: 25, h: 5 } },
      { id: 'f3', fieldName: 'issue_date', label: 'Issue Date', value: 'August 1, 2026', normalizedValue: '2026-08-01', confidence: 97, status: 'VALID', spatialBox: { x: 65, y: 18, w: 25, h: 3 } },
      { id: 'f4', fieldName: 'due_date', label: 'Due Date', value: 'September 30, 2026', normalizedValue: '2026-09-30', confidence: 95, status: 'VALID', spatialBox: { x: 65, y: 22, w: 25, h: 3 } },
      { id: 'f5', fieldName: 'seller_tax_id', label: 'Seller GSTIN', value: 'IN-9840291-GST', normalizedValue: 'IN9840291GST', confidence: 96, status: 'VALID', spatialBox: { x: 10, y: 18, w: 30, h: 4 } },
      { id: 'f6', fieldName: 'buyer_tax_id', label: 'Buyer GSTIN', value: 'IN-1029384-GST', normalizedValue: 'IN1029384GST', confidence: 94, status: 'VALID', spatialBox: { x: 10, y: 32, w: 30, h: 4 } }
    ],
    lineItems: [
      { id: 'l1', description: 'Precision Alloy Stamping Parts', quantity: 500, unitPriceMinor: 80000, totalMinor: 40000000, confidence: 98 },
      { id: 'l2', description: 'Tooling & Quality Certification Fee', quantity: 1, unitPriceMinor: 10000000, totalMinor: 10000000, confidence: 96 }
    ],
    riskSignals: [
      {
        id: 'r1',
        title: 'Near-Duplicate Similarity Alert',
        category: 'DUPLICATE',
        severity: 'MEDIUM',
        scoreImpact: -18,
        description: 'Invoice layout, line items, and amount match INV-984 submitted 4 days ago with 94.2% fuzzy similarity.',
        ruleTriggered: 'RULE_FUZZY_LINE_ITEM_SIMILARITY',
        explainability: 'Jaro-Winkler field similarity = 0.942. Amount differs by only ₹500.',
        mitigationHint: 'Obtain buyer confirmation of original order dispatch.',
        confidence: 0.94
      },
      {
        id: 'r2',
        title: 'Amount Anomaly (18.7x Historical Median)',
        category: 'BEHAVIOR',
        severity: 'MEDIUM',
        scoreImpact: -14,
        description: 'Current invoice total (₹5,00,000) exceeds historical transaction median (₹26,700) between Acme and Meridian.',
        ruleTriggered: 'RULE_BEHAVIORAL_AMOUNT_DEVIATION',
        explainability: 'Current: ₹5,00,000 | Median: ₹26,700 | Deviation: 18.7x',
        mitigationHint: 'Verify purchase order document for expanded volume authorization.',
        confidence: 0.91
      }
    ],
    documentName: 'INV-1024_AcmeComponents.pdf',
    documentUrl: 'https://veritas-docs.s3.amazonaws.com/tenant-a/INV-1024.pdf',
    ocrProcessedAt: '2026-08-11T14:32:10Z',
    duplicateType: 'NEAR',
    duplicateMatchId: 'case-vrt-984',
    duplicateSimilarityScore: 94.2,
    evidenceItems: [
      { id: 'ev1', name: 'Seller Corporate Entity Verification', type: 'ENTITY', verified: true, required: true, uploadedAt: '2026-08-11T14:30:00Z', reliabilityScore: 0.99 },
      { id: 'ev2', name: 'Buyer Corporate Entity Verification', type: 'ENTITY', verified: true, required: true, uploadedAt: '2026-08-11T14:30:00Z', reliabilityScore: 0.99 },
      { id: 'ev3', name: 'Signed Purchase Order (PO-9920)', type: 'PO', verified: true, required: true, uploadedAt: '2026-08-11T14:31:00Z', reliabilityScore: 0.95 },
      { id: 'ev4', name: 'Proof of Delivery (Bill of Lading)', type: 'DELIVERY', verified: false, required: true, reliabilityScore: 0.0 }
    ]
  },

  {
    id: 'case-vrt-92837',
    caseNumber: 'VRT-92837',
    tenantId: 'tenant-a',
    sellerName: 'AeroDynamics Tech LLC',
    sellerTaxId: 'US-9840291',
    buyerName: 'Global Logistics Corp',
    buyerTaxId: 'US-1029384',
    invoiceNumber: 'INV-2026-8819',
    issueDate: '2026-07-28',
    dueDate: '2026-09-28',
    totalMinor: 18500000,
    currency: 'USD',
    status: 'APPROVED',
    telemetry: {
      id: 'tp-92837',
      invoiceId: 'case-vrt-92837',
      trustScore: 94,
      confidenceScore: 98,
      evidenceCompleteness: 95,
      riskLevel: 'LOW',
      recommendation: 'APPROVE_RECOMMENDATION',
      modelVersion: 'risk-0.3.0',
      featureSchemaVersion: 'feat-v1.4',
      reasons: ['All required evidence documents verified', '14 historical on-time repayments between seller and buyer']
    },
    fields: [
      { id: 'f1', fieldName: 'invoice_number', label: 'Invoice Number', value: 'INV-2026-8819', normalizedValue: 'INV-2026-8819', confidence: 99, status: 'VALID', spatialBox: { x: 65, y: 12, w: 25, h: 4 } },
      { id: 'f2', fieldName: 'total_amount', label: 'Total Amount', value: '$185,000.00', normalizedValue: '185000.00', confidence: 98, status: 'VALID', spatialBox: { x: 65, y: 78, w: 25, h: 5 } }
    ],
    lineItems: [
      { id: 'l1', description: 'Avionics Sensors Modules - Batch 4', quantity: 20, unitPriceMinor: 750000, totalMinor: 15000000, confidence: 98 },
      { id: 'l2', description: 'Integration & Testing Package', quantity: 1, unitPriceMinor: 3500000, totalMinor: 3500000, confidence: 96 }
    ],
    riskSignals: [],
    documentName: 'INV-2026-8819_AeroDynamics.pdf',
    documentUrl: 'https://veritas-docs.s3.amazonaws.com/tenant-a/INV-2026-8819.pdf',
    ocrProcessedAt: '2026-08-10T14:32:10Z',
    duplicateType: 'NONE',
    evidenceItems: [
      { id: 'ev1', name: 'Signed Purchase Order', type: 'PO', verified: true, required: true, uploadedAt: '2026-08-10T14:30:00Z', reliabilityScore: 0.99 },
      { id: 'ev2', name: 'Proof of Delivery', type: 'DELIVERY', verified: true, required: true, uploadedAt: '2026-08-10T14:30:05Z', reliabilityScore: 0.98 },
      { id: 'ev3', name: 'Bank Verification Letter', type: 'BANK', verified: true, required: true, uploadedAt: '2026-08-01T09:12:00Z', reliabilityScore: 0.95 }
    ]
  },

  {
    id: 'case-vrt-44102',
    caseNumber: 'VRT-44102',
    tenantId: 'tenant-a',
    sellerName: 'Vanguard Industrial Supply',
    sellerTaxId: 'US-5541092',
    buyerName: 'Titan Energy Grid',
    buyerTaxId: 'US-9918234',
    invoiceNumber: 'INV-2026-8819', // Exact Duplicated Number!
    issueDate: '2026-07-29',
    dueDate: '2026-09-29',
    totalMinor: 18500000,
    currency: 'USD',
    status: 'REJECTED',
    telemetry: {
      id: 'tp-44102',
      invoiceId: 'case-vrt-44102',
      trustScore: 18,
      confidenceScore: 99,
      evidenceCompleteness: 85,
      riskLevel: 'CRITICAL',
      recommendation: 'BLOCK_BY_POLICY',
      modelVersion: 'risk-0.3.0',
      featureSchemaVersion: 'feat-v1.4',
      reasons: ['CRITICAL: Exact SHA-256 canonical hash collision with funded invoice VRT-92837']
    },
    fields: [
      { id: 'f1', fieldName: 'invoice_number', label: 'Invoice Number', value: 'INV-2026-8819', normalizedValue: 'INV-2026-8819', confidence: 99, status: 'MISMATCH', spatialBox: { x: 65, y: 12, w: 25, h: 4 } }
    ],
    lineItems: [],
    riskSignals: [
      {
        id: 'r10',
        title: 'CRITICAL: Exact SHA-256 Fingerprint Collision',
        category: 'DUPLICATE',
        severity: 'CRITICAL',
        scoreImpact: -80,
        description: 'Canonical representation matches VRT-92837 exactly. Potential double-dipping fraud attempt.',
        ruleTriggered: 'RULE_EXACT_SHA256_COLLISION',
        explainability: 'Canonical fingerprint hash matches previously funded invoice in Tenant A repository.',
        mitigationHint: 'Decline financing request immediately. Flag seller account.',
        confidence: 0.99
      }
    ],
    documentName: 'INV-2026-8819_DUPLICATE.pdf',
    documentUrl: 'https://veritas-docs.s3.amazonaws.com/tenant-a/INV-2026-8819_DUPE.pdf',
    ocrProcessedAt: '2026-08-11T09:15:22Z',
    duplicateType: 'EXACT',
    duplicateMatchId: 'case-vrt-92837',
    duplicateSimilarityScore: 100,
    evidenceItems: []
  },

  {
    id: 'case-vrt-10928',
    caseNumber: 'VRT-10928',
    tenantId: 'tenant-a',
    sellerName: 'Apex Quantum Hardware Labs',
    sellerTaxId: 'US-1102938',
    buyerName: 'OmniTech Solutions',
    buyerTaxId: 'US-8839201',
    invoiceNumber: 'INV-Q-001',
    issueDate: '2026-08-05',
    dueDate: '2026-10-05',
    totalMinor: 9500000,
    currency: 'USD',
    status: 'EVIDENCE_REQUESTED',
    telemetry: {
      id: 'tp-10928',
      invoiceId: 'case-vrt-10928',
      trustScore: 54,
      confidenceScore: 48,
      evidenceCompleteness: 40,
      riskLevel: 'MEDIUM',
      recommendation: 'REQUEST_MORE_EVIDENCE',
      modelVersion: 'risk-0.3.0',
      featureSchemaVersion: 'feat-v1.4',
      reasons: ['Cold-start new entity gap', 'Low OCR field confidence on tax identifier', 'Missing delivery proof']
    },
    fields: [
      { id: 'f1', fieldName: 'invoice_number', label: 'Invoice Number', value: 'INV-Q-001', normalizedValue: 'INV-Q-001', confidence: 65, status: 'WARNING', spatialBox: { x: 65, y: 12, w: 25, h: 4 } }
    ],
    lineItems: [],
    riskSignals: [
      {
        id: 'r30',
        title: 'Cold-Start Entity (No Prior Trade History)',
        category: 'RELATIONSHIP',
        severity: 'MEDIUM',
        scoreImpact: -25,
        description: 'First time seller Apex Quantum Hardware Labs is submitting financing on OmniTech Solutions.',
        ruleTriggered: 'RULE_COLD_START_ENTITY',
        explainability: 'Zero historical trade graph edges recorded in VERITAS registry.',
        mitigationHint: 'Request 3 months of bank statements and signed proof of delivery.',
        confidence: 0.85
      }
    ],
    documentName: 'INV-Q-001_Scan.pdf',
    documentUrl: 'https://veritas-docs.s3.amazonaws.com/tenant-a/INV-Q-001.pdf',
    ocrProcessedAt: '2026-08-11T12:40:10Z',
    duplicateType: 'NONE',
    evidenceItems: [
      { id: 'ev1', name: 'Purchase Order', type: 'PO', verified: false, required: true, reliabilityScore: 0.0 },
      { id: 'ev2', name: 'Delivery Proof', type: 'DELIVERY', verified: false, required: true, reliabilityScore: 0.0 }
    ]
  }
];

export const mockGraphNodes: Record<string, GraphNode[]> = {
  'case-vrt-28491': [
    { id: 'n-seller', label: 'Acme Components Ltd', type: 'SELLER', trustStatus: 'HIGH', subtitle: 'GSTIN: IN-9840291-GST' },
    { id: 'n-buyer', label: 'Meridian Industries Inc', type: 'BUYER', trustStatus: 'HIGH', subtitle: 'GSTIN: IN-1029384-GST' },
    { id: 'n-inv', label: 'INV-1024', type: 'INVOICE', trustStatus: 'MEDIUM', subtitle: '₹5,00,000.00' },
    { id: 'n-prev', label: 'INV-984 (Fuzzy Match)', type: 'INVOICE', trustStatus: 'SUSPICIOUS', subtitle: '₹4,99,500.00 (94.2% Similarity)' },
    { id: 'n-pay1', label: 'Settlement Bank #9920', type: 'BANK', trustStatus: 'HIGH', subtitle: 'HDFC Commercial' }
  ],
  'case-vrt-92837': [
    { id: 'n-seller', label: 'AeroDynamics Tech LLC', type: 'SELLER', trustStatus: 'HIGH', subtitle: 'Tax ID: US-9840291' },
    { id: 'n-buyer', label: 'Global Logistics Corp', type: 'BUYER', trustStatus: 'HIGH', subtitle: 'Tax ID: US-1029384' },
    { id: 'n-inv', label: 'INV-2026-8819', type: 'INVOICE', trustStatus: 'HIGH', subtitle: '$185,000.00' },
    { id: 'n-pay1', label: 'Settlement Account #9920', type: 'BANK', trustStatus: 'HIGH', subtitle: 'JPMorgan Chase' }
  ]
};

export const mockGraphEdges: Record<string, GraphEdge[]> = {
  'case-vrt-28491': [
    { id: 'e1', source: 'n-seller', target: 'n-inv', label: 'ISSUED_BY', amountFormatted: '₹5,00,000' },
    { id: 'e2', source: 'n-inv', target: 'n-buyer', label: 'BILLED_TO', amountFormatted: '₹5,00,000' },
    { id: 'e3', source: 'n-inv', target: 'n-prev', label: '94.2% FUZZY SIMILARITY', isSuspicious: true },
    { id: 'e4', source: 'n-seller', target: 'n-pay1', label: 'VERIFIED_BANK' }
  ],
  'case-vrt-92837': [
    { id: 'e1', source: 'n-seller', target: 'n-inv', label: 'ISSUED_BY', amountFormatted: '$185,000' },
    { id: 'e2', source: 'n-inv', target: 'n-buyer', label: 'BILLED_TO', amountFormatted: '$185,000' },
    { id: 'e3', source: 'n-seller', target: 'n-pay1', label: 'VERIFIED_BANK' }
  ]
};

export const mockAuditEvents: Record<string, AuditEvent[]> = {
  'case-vrt-28491': [
    {
      id: 'aud-101',
      tenantId: 'tenant-a',
      actor: { id: 'usr-ai', name: 'VERITAS AI Trust Engine', role: 'AUTOMATED_SYSTEM' },
      action: 'INITIAL_TRUST_PROFILE_GENERATED',
      resourceType: 'INVOICE',
      resourceId: 'case-vrt-28491',
      result: 'WARNING',
      correlationId: 'corr-88402910',
      details: 'Calculated Trust: 82/100, Confidence: 64%, Evidence: 71%. Flagged 94.2% fuzzy match and 18.7x amount deviation.',
      proofHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      blockHeight: 1849201,
      createdAt: '2026-08-11T14:32:10Z'
    }
  ]
};

export const mockProofRecords: Record<string, ProofRecord> = {
  'case-vrt-28491': {
    id: 'proof-28491',
    resourceType: 'INVOICE_DECISION',
    resourceId: 'case-vrt-28491',
    canonicalHash: '{"caseId":"case-vrt-28491","invoiceNumber":"INV-1024","totalMinor":50000000,"trustScore":82}',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    proofType: 'MERKLE_LOG_NOTARY',
    chainId: 'Arbitrum One L2 (Chain ID: 42161)',
    txRef: '0x3a99201f8e77a112bc880912d34eef1102938475a1b2c3d4e5f6789a01234567',
    status: 'REGISTERED',
    verifiedAt: '2026-08-11T14:32:15Z',
    blockHeight: 1849201
  }
};
