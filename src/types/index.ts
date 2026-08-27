export type TenantId = 'tenant-a' | 'tenant-b';

export interface Tenant {
  id: TenantId;
  name: string;
  code: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  createdAt: string;
}

export interface User {
  id: string;
  tenantId: TenantId;
  email: string;
  displayName: string;
  role: 'PLATFORM_ADMIN' | 'TENANT_ADMIN' | 'RISK_ANALYST' | 'REVIEWER' | 'AUDITOR' | 'MSME_USER';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Entity {
  id: string;
  tenantId: TenantId;
  entityType: 'SELLER' | 'BUYER';
  legalName: string;
  normalizedName: string;
  taxId: string;
  status: 'VERIFIED' | 'UNVERIFIED';
}

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  w: number; // percentage 0-100
  h: number; // percentage 0-100
}

export interface ExtractedField {
  id: string;
  fieldName: string;
  label: string;
  value: string;
  normalizedValue: string;
  confidence: number; // 0 - 100
  spatialBox: BoundingBox;
  status: 'VALID' | 'WARNING' | 'MISMATCH';
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceMinor: number; // minor units (e.g. cents/paise)
  totalMinor: number;
  confidence: number;
}

export type DecisionState = 
  | 'APPROVE_RECOMMENDATION'
  | 'MANUAL_REVIEW'
  | 'REQUEST_MORE_EVIDENCE'
  | 'FLAG_HIGH_RISK'
  | 'BLOCK_BY_POLICY';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskCategory = 'IDENTITY' | 'INTEGRITY' | 'DUPLICATE' | 'BEHAVIOR' | 'RELATIONSHIP' | 'EVIDENCE';

export interface TrustSignal {
  id: string;
  title: string;
  category: RiskCategory;
  severity: RiskSeverity;
  scoreImpact: number; // e.g. -18
  description: string;
  ruleTriggered: string;
  explainability: string;
  mitigationHint: string;
  evidenceReference?: string;
  confidence: number;
}

export interface TrustProfile {
  id: string;
  invoiceId: string;
  trustScore: number;            // 0 - 100
  confidenceScore: number;       // 0 - 100
  evidenceCompleteness: number;  // 0 - 100%
  riskLevel: RiskSeverity;
  recommendation: DecisionState;
  modelVersion: string;
  featureSchemaVersion: string;
  reasons: string[];
}

export type CaseStatus = 'NEEDS_REVIEW' | 'APPROVED' | 'REJECTED' | 'EVIDENCE_REQUESTED' | 'PROCESSING';

export interface EvidenceItem {
  id: string;
  name: string;
  type: string;
  verified: boolean;
  required: boolean;
  uploadedAt?: string;
  reliabilityScore: number;
}

export interface InvoiceCase {
  id: string;
  caseNumber: string;
  tenantId: TenantId;
  sellerName: string;
  sellerTaxId: string;
  buyerName: string;
  buyerTaxId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  totalMinor: number; // Integer minor units per 04_BACKEND_SCHEMA_VERITAS.md
  currency: string;
  status: CaseStatus;
  telemetry: TrustProfile;
  fields: ExtractedField[];
  lineItems: LineItem[];
  riskSignals: TrustSignal[];
  documentName: string;
  documentUrl: string;
  ocrProcessedAt: string;
  evidenceItems: EvidenceItem[];
  duplicateMatchId?: string;
  duplicateType?: 'EXACT' | 'NEAR' | 'NONE';
  duplicateSimilarityScore?: number;
}

export type NodeType = 'SELLER' | 'BUYER' | 'INVOICE' | 'PAYMENT' | 'BANK' | 'FINANCING';
export type NodeTrust = 'HIGH' | 'MEDIUM' | 'LOW' | 'SUSPICIOUS';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  trustStatus: NodeTrust;
  subtitle?: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  amountFormatted?: string;
  isSuspicious?: boolean;
}

export interface EvidenceRequest {
  id: string;
  invoiceId: string;
  caseId: string;
  requestedBy: string;
  requestType: string;
  status: 'PENDING' | 'FULFILLED' | 'EXPIRED';
  requiredDocs: {
    buyerConfirmation: boolean;
    purchaseOrder: boolean;
    deliveryProof: boolean;
    paymentEvidence: boolean;
    businessVerification: boolean;
    otherText?: string;
  };
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  tenantId: TenantId;
  actor: {
    id: string;
    name: string;
    role: string;
  };
  action: string;
  resourceType: string;
  resourceId: string;
  result: 'SUCCESS' | 'BLOCKED' | 'WARNING';
  correlationId: string;
  details: string;
  proofHash: string;
  blockHeight: number;
  createdAt: string;
}

export interface ProofRecord {
  id: string;
  resourceType: string;
  resourceId: string;
  canonicalHash: string;
  sha256: string;
  proofType: string;
  chainId: string;
  txRef: string;
  status: 'REGISTERED' | 'VERIFIED' | 'PENDING';
  verifiedAt: string;
  blockHeight: number;
}

export type MonitoringEventType = 
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_DELAYED'
  | 'NEW_INVOICE'
  | 'DUPLICATE_DISCOVERED'
  | 'IDENTITY_CHANGED'
  | 'BUYER_CONFIRMED';

export interface MonitoringEvent {
  id: string;
  caseId: string;
  eventType: MonitoringEventType;
  payload: Record<string, any>;
  observedAt: string;
}

export interface SecurityScanResult {
  safe: boolean;
  fileName: string;
  fileSize: number;
  mimeType: string;
  scanTimestamp: string;
  malwareClean: boolean;
  magicBytesValid: boolean;
  signedUrl: string;
  threatDetails?: string;
}

/**
 * Currency Formatter Utility
 * ₹ uses Lakh/Crore grouping (en-IN), $ uses standard grouping (en-US).
 */
export const formatCurrency = (totalMinor: number, currency: string = 'USD'): string => {
  const amount = totalMinor / 100;
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};
