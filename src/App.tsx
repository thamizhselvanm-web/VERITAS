import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SlimNavigationRail } from './components/shell/SlimNavigationRail';
import { TopCommandBar } from './components/shell/TopCommandBar';
import { CommandPalette } from './components/shell/CommandPalette';
import { VeritasLoader } from './components/common/VeritasLoader';
import { SystemCardAnimation } from './components/common/SystemCardAnimation';
import { ToastProvider, useToast } from './components/common/ToastContainer';

import { LoginPage } from './components/pages/LoginPage';
import { HeroOverviewScreen } from './components/screens/HeroOverviewScreen';
import { ReviewQueuePage } from './components/pages/ReviewQueuePage';
import { UploadPipelinePage } from './components/pages/UploadPipelinePage';
import { CinematicCaseWorkspace } from './components/screens/CinematicCaseWorkspace';
import { TrustGraph3D } from './components/3d/TrustGraph3D';
import { ContinuousMonitoringStream } from './components/screens/ContinuousMonitoringStream';
import { CryptographicProofScreen } from './components/screens/CryptographicProofScreen';
import { PublicProofVerifyPage } from './components/pages/PublicProofVerifyPage';
import { NotFoundPage } from './components/pages/NotFoundPage';

import { ProofInspectorModal } from './components/modals/ProofInspectorModal';
import { TwilioWhatsAppModal } from './components/modals/TwilioWhatsAppModal';
import { TenantSecurityGuard } from './components/common/TenantSecurityGuard';

import { mockCases, mockGraphNodes, mockGraphEdges, mockAuditEvents, mockTenants } from './mock/demoData';
import { authService, UserSession } from './services/authService';
import { InvoiceCase, TenantId, CaseStatus, AuditEvent, MonitoringEventType } from './types';
import { TrustEngine } from './services/trustEngine';
import { PageId } from './components/common/Sidebar';
import { twilioWhatsAppService, WhatsAppMessagePayload } from './services/twilioWhatsAppService';

const AppWorkspace: React.FC = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [session, setSession] = useState<UserSession>(authService.getSession());
  const [cases, setCases] = useState<InvoiceCase[]>(mockCases);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-vrt-28491');
  const [activePage, setActivePage] = useState<PageId>('overview');
  
  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProofEvent, setSelectedProofEvent] = useState<AuditEvent | null>(null);
  const [whatsappPayload, setWhatsappPayload] = useState<WhatsAppMessagePayload | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const activeGraphNodes = mockGraphNodes[selectedCaseId] || mockGraphNodes['case-vrt-28491'];
  const activeGraphEdges = mockGraphEdges[selectedCaseId] || mockGraphEdges['case-vrt-28491'];
  const activeAuditEvents = mockAuditEvents[selectedCaseId] || mockAuditEvents['case-vrt-28491'];

  // Dynamic Page Title & Meta Description update
  useEffect(() => {
    const titles: Record<string, string> = {
      'overview': 'Overview — VERITAS Continuous Trust Engine',
      'review-queue': 'Underwriter Review Queue — VERITAS',
      'upload-pipeline': 'Invoice Upload & Processing Pipeline — VERITAS',
      'case-detail': `Case ${activeCase?.caseNumber || ''} — VERITAS Trust Workspace`,
      'trust-graph': '3D Financial Trust Graph — VERITAS',
      'monitoring': 'Continuous Risk & Transaction Stream — VERITAS',
      'audit-proof': 'Cryptographic Audit & Blockchain Proofs — VERITAS',
      'public-verify': 'Public Proof Verifier — VERITAS',
    };

    const descriptions: Record<string, string> = {
      'overview': 'High-level dashboard overview of active trust cases, open risk alerts, and system health index.',
      'review-queue': 'Prioritized underwriter review queue sorted by trust score, confidence index, and risk signals.',
      'upload-pipeline': 'Zero-trust invoice uploading pipeline with real-time malware isolation and OCR extraction.',
      'case-detail': `Detailed investigation workspace for invoice case ${activeCase?.caseNumber || ''}.`,
      'trust-graph': 'Interactive 3D graph visualization of seller-buyer trade relationships and duplicate risk edges.',
      'monitoring': 'Real-time telemetry event stream for continuous transaction monitoring.',
      'audit-proof': 'Cryptographic SHA-256 audit trail and Arbitrum L2 notary proof records.',
      'public-verify': 'Public QR verification portal for cryptographic proof records.',
    };

    const newTitle = titles[activePage] || 'VERITAS — Continuous Financial Trust Engine';
    const newDesc = descriptions[activePage] || 'VERITAS Continuous Financial Trust Engine platform.';

    document.title = newTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', newDesc);
    }
  }, [activePage, activeCase?.caseNumber]);

  // Keyboard shortcut listener for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Login / Authentication
  const handleLoginSuccess = (tenantId: TenantId, portalType?: 'bank' | 'company') => {
    const updated = authService.getSession();
    setSession(updated);
    setIsAuthenticated(true);
    setActivePage('overview');
    const portalName = portalType === 'bank' ? 'Bank Underwriting' : 'Corporate Enterprise';
    addToast('Authenticated Successfully', `Logged into ${portalName} Portal as ${updated.name} (${updated.role})`, 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    addToast('Signed Out', 'You have been logged out of VERITAS workspace.', 'info');
  };

  // Handle Tenant Switch
  const handleSwitchTenant = (tenantId: TenantId) => {
    const updated = authService.switchTenant(tenantId);
    setSession(updated);
    const tenantCase = cases.find(c => c.tenantId === tenantId);
    if (tenantCase) {
      setSelectedCaseId(tenantCase.id);
    }
    const tenantName = tenantId === 'tenant-a' ? 'Apex Capital' : 'Nexus Trade Credit';
    addToast('Tenant Switched', `Active workspace changed to ${tenantName}`, 'info');
  };

  // Handle Decision Execution
  const handleExecuteDecision = async (newStatus: CaseStatus, reason?: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== selectedCaseId) return c;
      return {
        ...c,
        status: newStatus
      };
    }));

    const newAuditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      tenantId: session.activeTenantId,
      actor: {
        id: session.userId,
        name: session.name,
        role: session.role
      },
      action: `DECISION_${newStatus}`,
      resourceType: 'INVOICE_DECISION',
      resourceId: selectedCaseId,
      result: 'SUCCESS',
      correlationId: `corr-${Date.now()}`,
      details: reason || `Updated case status to ${newStatus}`,
      proofHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      blockHeight: 1849350 + Math.floor(Math.random() * 10),
      createdAt: new Date().toISOString()
    };

    mockAuditEvents[selectedCaseId] = [newAuditEvent, ...(mockAuditEvents[selectedCaseId] || [])];

    if (newStatus === 'APPROVED') {
      addToast('Case Approved', `Invoice ${activeCase.caseNumber} approved for financing. Dispatching dispatch notification...`, 'success');
      const targetCase = cases.find(c => c.id === selectedCaseId) || activeCase;
      const payload = await twilioWhatsAppService.sendApprovalWhatsApp(targetCase, newAuditEvent.proofHash);
      setWhatsappPayload(payload);
      setIsWhatsAppModalOpen(true);
    } else if (newStatus === 'REJECTED') {
      addToast('Case Rejected', `Invoice ${activeCase.caseNumber} financing declined. Reason logged in audit trail.`, 'error');
    } else if (newStatus === 'EVIDENCE_REQUESTED') {
      addToast('Evidence Requested', `Evidence request dispatched to seller for ${activeCase.caseNumber}.`, 'warning');
    }
  };

  // Handle Continuous Risk Monitoring Events
  const handleTriggerMonitoringEvent = (eventType: MonitoringEventType, targetCaseId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== targetCaseId) return c;

      let riskSignals = [...c.riskSignals];
      let evidenceScore = c.telemetry.evidenceCompleteness;

      if (eventType === 'PAYMENT_DELAYED') {
        riskSignals.unshift({
          id: `r-sim-${Date.now()}`,
          title: 'PAYMENT_DELAYED Event Ingested',
          category: 'BEHAVIOR',
          severity: 'HIGH',
          scoreImpact: -35,
          description: 'Payment delay signal (+30 days overdue) detected on buyer transaction account.',
          ruleTriggered: 'RULE_CONTINUOUS_PAYMENT_DELAY',
          explainability: 'Continuous monitoring event degraded behaviour sub-score by -35.',
          mitigationHint: 'Hold disbursement until buyer bank confirmation is re-verified.',
          confidence: 0.95
        });
        addToast('Payment Delay Signal', `Flagged +30 day payment delay on case ${targetCaseId}`, 'warning');
      } else if (eventType === 'DUPLICATE_DISCOVERED') {
        riskSignals.unshift({
          id: `r-sim-${Date.now()}`,
          title: 'CRITICAL: Duplicate Discovered Cross-Lender',
          category: 'DUPLICATE',
          severity: 'CRITICAL',
          scoreImpact: -60,
          description: 'Adjacent lender registry detected identical line item invoice submission.',
          ruleTriggered: 'RULE_CROSS_LENDER_DUPLICATE',
          explainability: 'Canonical hash similarity spike detected.',
          mitigationHint: 'Initiate double-financing fraud review immediately.',
          confidence: 0.99
        });
        addToast('Duplicate Signal Flagged', `Cross-lender duplicate detected on case ${targetCaseId}`, 'error');
      } else if (eventType === 'BUYER_CONFIRMED') {
        evidenceScore = Math.min(100, evidenceScore + 15);
        addToast('Buyer Confirmed', `Evidence score increased to ${evidenceScore}%`, 'success');
      }

      const telemetry = TrustEngine.calculateTelemetry(targetCaseId, riskSignals, evidenceScore);

      return {
        ...c,
        riskSignals,
        telemetry
      };
    }));
  };

  // Handle Upload Success
  const handleUploadSuccess = (newCasePartial: Partial<InvoiceCase>) => {
    const fullCase: InvoiceCase = {
      id: newCasePartial.id || `case-vrt-${Date.now()}`,
      caseNumber: newCasePartial.caseNumber || 'VRT-9900',
      tenantId: session.activeTenantId,
      sellerName: newCasePartial.sellerName || 'Apex Quantum Hardware Labs',
      sellerTaxId: newCasePartial.sellerTaxId || 'US-1102938',
      buyerName: newCasePartial.buyerName || 'OmniTech Solutions',
      buyerTaxId: newCasePartial.buyerTaxId || 'US-8839201',
      invoiceNumber: newCasePartial.invoiceNumber || 'INV-2026-9900',
      issueDate: '2026-08-11',
      dueDate: '2026-10-11',
      totalMinor: newCasePartial.totalMinor || 14500000,
      currency: 'USD',
      status: 'NEEDS_REVIEW',
      telemetry: {
        id: `tp-${Date.now()}`,
        invoiceId: newCasePartial.id || `case-vrt-${Date.now()}`,
        trustScore: 88,
        confidenceScore: 94,
        evidenceCompleteness: 85,
        riskLevel: 'LOW',
        recommendation: 'APPROVE_RECOMMENDATION',
        modelVersion: 'risk-0.3.0',
        featureSchemaVersion: 'feat-v1.4',
        reasons: ['Document scanned clean and verified']
      },
      fields: mockCases[0].fields,
      lineItems: mockCases[0].lineItems,
      riskSignals: [],
      documentName: newCasePartial.documentName || 'Invoice.pdf',
      documentUrl: newCasePartial.documentUrl || '',
      ocrProcessedAt: new Date().toISOString(),
      evidenceItems: mockCases[0].evidenceItems
    };

    setCases([fullCase, ...cases]);
    setSelectedCaseId(fullCase.id);
    addToast('Invoice Processed', `Created new case ${fullCase.caseNumber} (${fullCase.documentName})`, 'success');
  };

  // Custom VERITAS Loading Sequence
  if (isLoading) {
    return <VeritasLoader onComplete={() => setIsLoading(false)} />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Standalone Public QR Proof Route
  if (activePage === 'public-verify') {
    return (
      <PublicProofVerifyPage
        proofId={activeCase.caseNumber}
        onBackToApp={() => setActivePage('case-detail')}
      />
    );
  }

  const validPages: PageId[] = [
    'overview',
    'review-queue',
    'upload-pipeline',
    'case-detail',
    'trust-graph',
    'monitoring',
    'audit-proof',
    'public-verify'
  ];

  const isValidPage = validPages.includes(activePage);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      {/* 3D Interactive VERITAS Card Animation Background */}
      <SystemCardAnimation />

      <div className="shell relative z-10">
        {/* Navigation Rail */}
        <SlimNavigationRail
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={handleLogout}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        {/* Top Command Bar */}
        <TopCommandBar
          session={session}
          tenants={mockTenants}
          onSwitchTenant={handleSwitchTenant}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Tenant Security Guard Banner */}
        <TenantSecurityGuard
          activeTenantId={session.activeTenantId}
          targetCaseTenantId={activeCase.tenantId}
        />

        {/* Main Content Workspace Container */}
        <main id="main">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.22 }}
            >
              {!isValidPage && (
                <NotFoundPage onBackToOverview={() => setActivePage('overview')} />
              )}

              {activePage === 'overview' && (
                <HeroOverviewScreen
                  cases={cases}
                  activeTenantId={session.activeTenantId}
                  onNavigateToQueue={() => setActivePage('review-queue')}
                  onNavigateToUpload={() => setActivePage('upload-pipeline')}
                  onSelectCase={(id) => {
                    setSelectedCaseId(id);
                    setActivePage('case-detail');
                  }}
                />
              )}

              {activePage === 'review-queue' && (
                <ReviewQueuePage
                  cases={cases}
                  activeTenantId={session.activeTenantId}
                  onSelectCase={(id) => {
                    setSelectedCaseId(id);
                    setActivePage('case-detail');
                  }}
                  onNavigateToUpload={() => setActivePage('upload-pipeline')}
                />
              )}

              {activePage === 'upload-pipeline' && (
                <UploadPipelinePage
                  onUploadSuccess={handleUploadSuccess}
                  onNavigateToCase={(id) => {
                    setSelectedCaseId(id);
                    setActivePage('case-detail');
                  }}
                />
              )}

              {activePage === 'case-detail' && (
                <CinematicCaseWorkspace
                  invoiceCase={activeCase}
                  graphNodes={activeGraphNodes}
                  graphEdges={activeGraphEdges}
                  auditEvents={activeAuditEvents}
                  onBackToDashboard={() => setActivePage('review-queue')}
                  onExecuteDecision={handleExecuteDecision}
                  onOpenProof={(evt: AuditEvent) => setSelectedProofEvent(evt)}
                />
              )}

              {activePage === 'trust-graph' && (
                <TrustGraph3D
                  nodes={activeGraphNodes}
                  edges={activeGraphEdges}
                  caseNumber={activeCase.caseNumber}
                />
              )}

              {activePage === 'monitoring' && (
                <ContinuousMonitoringStream
                  cases={cases}
                  onTriggerEvent={handleTriggerMonitoringEvent}
                />
              )}

              {activePage === 'audit-proof' && (
                <CryptographicProofScreen
                  auditEvents={activeAuditEvents}
                  onOpenProof={(evt: AuditEvent) => setSelectedProofEvent(evt)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Command Palette Modal (Ctrl+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        cases={cases}
        onSelectCase={(id) => {
          setSelectedCaseId(id);
          setActivePage('case-detail');
        }}
      />

      {/* Proof Inspector Modal */}
      <ProofInspectorModal
        event={selectedProofEvent}
        onClose={() => setSelectedProofEvent(null)}
      />

      {/* Twilio WhatsApp Dispatch Notification Modal */}
      <TwilioWhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        payload={whatsappPayload}
        invoiceCase={activeCase}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppWorkspace />
    </ToastProvider>
  );
};
