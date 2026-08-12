import React, { useState } from 'react';
import { ArrowLeft, Building2, Calendar, Shield, Lock, FileText, Send, Eye } from 'lucide-react';
import { InvoiceCase, GraphNode, GraphEdge, AuditEvent, CaseStatus } from '../../types';
import { TrustScore3D } from '../3d/TrustScore3D';
import { EvidenceLedger } from '../case/EvidenceLedger';
import { RiskTimeline } from './RiskTimeline';
import { AIReasoningPanel } from './AIReasoningPanel';
import { SpatialInvoiceWorkspace } from './SpatialInvoiceWorkspace';
import { DecisionPanel } from './DecisionPanel';
import { EvidenceChainDrawer } from './EvidenceChainDrawer';
import { EvidenceRequestModal } from '../modals/EvidenceRequestModal';

interface CinematicCaseWorkspaceProps {
  invoiceCase: InvoiceCase;
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  auditEvents: AuditEvent[];
  onBackToDashboard: () => void;
  onExecuteDecision: (newStatus: CaseStatus, reason?: string) => void;
  onOpenProof: (event: AuditEvent) => void;
}

export const CinematicCaseWorkspace: React.FC<CinematicCaseWorkspaceProps> = ({
  invoiceCase,
  auditEvents,
  onBackToDashboard,
  onExecuteDecision,
  onOpenProof
}) => {
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  const formattedAmount = `${invoiceCase.currency} ${(invoiceCase.totalMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* Top Header Bar per Brief Sec 16 */}
      <div className="spatial-panel p-5 border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        
        <div className="flex items-center gap-4">
          <button onClick={onBackToDashboard} className="btn-spatial-secondary p-2.5" title="Back to Cases">
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-3 font-mono">
              <h1 className="text-xl font-extrabold text-white tracking-wide">{invoiceCase.caseNumber}</h1>
              <span className="spatial-badge spatial-badge-cyan text-xs">INV {invoiceCase.invoiceNumber}</span>
              <span className={`spatial-badge ${
                invoiceCase.status === 'APPROVED' ? 'spatial-badge-verified' :
                invoiceCase.status === 'REJECTED' ? 'spatial-badge-risk' : 'spatial-badge-review'
              }`}>
                {invoiceCase.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#94A3B8] mt-1 font-sans">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#388BFD]" />
                Seller: <strong className="text-white">{invoiceCase.sellerName}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#3FB950]" />
                Buyer: <strong className="text-white">{invoiceCase.buyerName}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right font-mono">
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider block">Financing Amount</span>
            <span className="text-2xl font-extrabold text-white font-numeric mt-0.5 block">{formattedAmount}</span>
          </div>

          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <button onClick={() => setIsEvidenceDrawerOpen(true)} className="btn-spatial-secondary text-xs">
              <Eye className="w-3.5 h-3.5 text-[#00F0FF]" /> Chain of Custody
            </button>
            <button onClick={() => setIsEvidenceModalOpen(true)} className="btn-spatial-primary text-xs">
              <Send className="w-3.5 h-3.5" /> Request Evidence
            </button>
          </div>
        </div>

      </div>

      {/* 3 Primary Visual Zones Layout per Brief Sec 16 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT ZONE: Case Intelligence (3 cols) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Trust Score 3D Spherical Visualizer */}
          <div className="spatial-panel p-5 border border-white/10 flex flex-col items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider block self-start">
              Telemetry Trust Profile
            </span>

            <TrustScore3D
              score={invoiceCase.telemetry.trustScore}
              riskLevel={invoiceCase.telemetry.riskLevel}
            />

            <div className="w-full space-y-2 pt-3 border-t border-white/10 text-xs font-mono">
              <div className="flex justify-between text-[#94A3B8]">
                <span>AI Confidence:</span>
                <span className="text-[#00F0FF] font-bold font-numeric">{invoiceCase.telemetry.confidenceScore}%</span>
              </div>

              <div className="flex justify-between text-[#94A3B8]">
                <span>Evidence Coverage:</span>
                <span className="text-[#A371F7] font-bold font-numeric">{invoiceCase.telemetry.evidenceCompleteness}%</span>
              </div>
            </div>
          </div>

          {/* Evidence Ledger Categorized Summary */}
          <EvidenceLedger invoiceCase={invoiceCase} />

        </div>

        {/* CENTER ZONE: Interactive Spatial Document Workspace (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          <SpatialInvoiceWorkspace
            documentName={invoiceCase.documentName}
            fields={invoiceCase.fields}
            lineItems={invoiceCase.lineItems}
          />
        </div>

        {/* RIGHT ZONE: Decision Intelligence & Audit Trail (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Why VERITAS Flagged This Timeline */}
          <RiskTimeline
            signals={invoiceCase.riskSignals}
            onOpenEvidencePanel={() => setIsEvidenceDrawerOpen(true)}
          />

          {/* AI Flowing Attribution Reasoning */}
          <AIReasoningPanel telemetry={invoiceCase.telemetry} />

          {/* Accountable Underwriter Decision Panel */}
          <DecisionPanel
            invoiceCase={invoiceCase}
            onExecuteDecision={onExecuteDecision}
            onOpenEvidenceRequest={() => setIsEvidenceModalOpen(true)}
          />

        </div>

      </div>

      {/* Glassmorphism Evidence Chain Drawer */}
      <EvidenceChainDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        invoiceCase={invoiceCase}
      />

      {/* Evidence Request Modal */}
      <EvidenceRequestModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        invoiceCase={invoiceCase}
        onSubmitRequest={(docs, notes) => {
          onExecuteDecision('EVIDENCE_REQUESTED', `Evidence requested by underwriter: ${notes}`);
        }}
      />

    </div>
  );
};
