import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SlimNavigationRail } from './components/shell/SlimNavigationRail';
import { TopCommandBar } from './components/shell/TopCommandBar';
import { CommandPalette } from './components/shell/CommandPalette';
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
import { EvidenceRequestModal } from './components/modals/EvidenceRequestModal';

import { mockCases, mockGraphNodes, mockGraphEdges, mockAuditEvents, mockTenants } from './mock/demoData';
import { authService, UserSession } from './services/authService';
import { InvoiceCase, TenantId, CaseStatus, AuditEvent, MonitoringEventType } from './types';
import { TrustEngine } from './services/trustEngine';
import { PageId } from './components/common/Sidebar';
import { twilioWhatsAppService, WhatsAppMessagePayload } from './services/twilioWhatsAppService';

const AppWorkspace: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [session, setSession] = useState<UserSession>(authService.getSession());
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-vrt-28491');
  const [cases, setCases] = useState<InvoiceCase[]>(mockCases);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProofEvent, setSelectedProofEvent] = useState<AuditEvent | null>(null);

  // Evidence Request Modal State
  const [evidenceRequestTargetCase, setEvidenceRequestTargetCase] = useState<InvoiceCase | null>(null);

  // Twilio WhatsApp Dispatch Modal State
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsappPayload, setWhatsappPayload] = useState<WhatsAppMessagePayload | null>(null);

  const { addToast } = useToast();

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
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
  const handleLoginSuccess = (tenantId: TenantId) => {
    const updated = authService.switchTenant(tenantId);
    setSession(updated);
    setIsAuthenticated(true);
    setActivePage('overview');
    addToast('Authenticated Successfully', `Switched workspace to ${updated.activeTenantId === 'tenant-a' ? 'Apex Capital' : 'Nexus Trade'}`, 'success');
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

  // Handle Decision Execution for any target case
  const handleExecuteDecisionForCase = async (targetCaseId: string, newStatus: CaseStatus, reason?: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== targetCaseId) return c;
      return {
        ...c,
        status: newStatus
      };
    }));

    const targetCase = cases.find(c => c.id === targetCaseId) || activeCase;

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
      resourceId: targetCase.caseNumber,
      result: newStatus === 'REJECTED' ? 'BLOCKED' : 'SUCCESS',
      correlationId: `corr-${Date.now()}`,
      proofHash: '0x8f3c...b29e',
      blockHeight: 1849210,
      createdAt: new Date().toISOString(),
      details: reason || `Decision ${newStatus} executed for case ${targetCase.caseNumber}`
    };

    if (mockAuditEvents[targetCaseId]) {
      mockAuditEvents[targetCaseId].unshift(newAuditEvent);
    }

    const toastTitle = newStatus === 'APPROVED' ? 'Loan Approved' : newStatus === 'REJECTED' ? 'Financing Rejected' : 'Evidence Requested';
    const toastType = newStatus === 'APPROVED' ? 'success' : newStatus === 'REJECTED' ? 'error' : 'warning';
    addToast(toastTitle, `Case ${targetCase.caseNumber} updated to ${newStatus}. Notarized on Arbitrum.`, toastType);

    // Auto-dispatch Twilio WhatsApp notification for Evidence Requests or Approvals
    if (newStatus === 'EVIDENCE_REQUESTED' || newStatus === 'APPROVED') {
      const payload = await twilioWhatsAppService.sendApprovalWhatsApp(targetCase);
      setWhatsappPayload(payload);
      setIsWhatsAppModalOpen(true);
    }
  };

  const handleExecuteDecision = (newStatus: CaseStatus, reason?: string) => {
    handleExecuteDecisionForCase(selectedCaseId, newStatus, reason);
  };

  // Handle New Upload Invoice Registration
  const handleUploadSuccess = (newCase: Partial<InvoiceCase>) => {
    const fullCase: InvoiceCase = {
      id: newCase.id || `case-${Date.now()}`,
      tenantId: session.activeTenantId,
      caseNumber: newCase.caseNumber || `VRT-${Math.floor(10000 + Math.random() * 90000)}`,
      invoiceNumber: newCase.invoiceNumber || 'INV-2026-001',
      sellerName: newCase.sellerName || 'Acme Supplier',
      buyerName: newCase.buyerName || 'Meridian Corp',
      sellerTaxId: newCase.sellerTaxId || 'TAX-998102',
      buyerTaxId: newCase.buyerTaxId || 'TAX-110293',
      totalMinor: newCase.totalMinor || 5000000,
      currency: newCase.currency || 'USD',
      issueDate: newCase.issueDate || new Date().toISOString().split('T')[0],
      dueDate: newCase.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'NEEDS_REVIEW',
      telemetry: newCase.telemetry || TrustEngine.calculateTelemetry(newCase.id || `case-${Date.now()}`, []),
      fields: newCase.fields || [],
      lineItems: newCase.lineItems || [],
      riskSignals: newCase.riskSignals || [],
      documentName: newCase.documentName || 'invoice.pdf',
      documentUrl: newCase.documentUrl || '',
      ocrProcessedAt: new Date().toISOString(),
      evidenceItems: newCase.evidenceItems || []
    };

    setCases(prev => [fullCase, ...prev]);
    setSelectedCaseId(fullCase.id);
    addToast('Invoice Uploaded', `Case ${fullCase.caseNumber} generated and submitted to trust pipeline.`, 'success');
  };

  // Handle Monitoring Stream Event Trigger
  const handleTriggerMonitoringEvent = (eventType: MonitoringEventType, caseId: string) => {
    const targetCase = cases.find(c => c.id === caseId) || activeCase;
    const recalculatedTelemetry = TrustEngine.calculateTelemetry(
      targetCase.id,
      targetCase.riskSignals,
      eventType === 'BUYER_CONFIRMED' ? 95 : 60
    );

    setCases(prev => prev.map(c => c.id === caseId ? { ...c, telemetry: recalculatedTelemetry } : c));
    addToast('Stream Telemetry Triggered', `Event ${eventType} processed for case ${targetCase.caseNumber}. Trust Score: ${recalculatedTelemetry.trustScore}`, 'info');
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
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

  if (activePage === 'public-verify') {
    return (
      <PublicProofVerifyPage 
        proofId={activeCase.caseNumber}
        onBackToApp={() => setActivePage('overview')}
      />
    );
  }

  return (
    <>
      <div className="app-shell flex min-h-screen bg-[#141211] text-[#F7F4F1] font-sans antialiased selection:bg-[#6366F1] selection:text-white">
        
        {/* Slim Desktop & Mobile Navigation Rail */}
        <SlimNavigationRail
          activePage={activePage}
          onNavigate={(page) => {
            setActivePage(page);
            setIsMobileMenuOpen(false);
          }}
          onLogout={handleLogout}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Application Area */}
        <main className="flex-1 md:ml-16 flex flex-col min-w-0 min-h-screen relative z-10">
          
          {/* Top Command Bar */}
          <TopCommandBar
            session={session}
            tenants={mockTenants}
            onSwitchTenant={handleSwitchTenant}
            onOpenSearch={() => setIsSearchOpen(true)}
            onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          />

          {/* Active View Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="p-6 sm:p-8 lg:p-10 flex-1 max-w-[1600px] w-full mx-auto"
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
                  onRequestEvidence={(c) => setEvidenceRequestTargetCase(c)}
                  onExecuteDecision={(id, status) => handleExecuteDecisionForCase(id, status)}
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
                  onRequestEvidence={(c) => setEvidenceRequestTargetCase(c)}
                  onExecuteDecision={(id, status) => handleExecuteDecisionForCase(id, status)}
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

      {/* Evidence Request Modal */}
      {evidenceRequestTargetCase && (
        <EvidenceRequestModal
          isOpen={!!evidenceRequestTargetCase}
          onClose={() => setEvidenceRequestTargetCase(null)}
          invoiceCase={evidenceRequestTargetCase}
          onSubmitRequest={(_, notes) => {
            handleExecuteDecisionForCase(
              evidenceRequestTargetCase.id,
              'EVIDENCE_REQUESTED',
              `Evidence requested by underwriter: ${notes}`
            );
            setEvidenceRequestTargetCase(null);
          }}
        />
      )}

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
