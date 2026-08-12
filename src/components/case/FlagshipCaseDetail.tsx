import React, { useState } from 'react';
import { ArrowLeft, Building2, Calendar, Shield, Lock, FileText, Send } from 'lucide-react';
import { InvoiceCase, GraphNode, GraphEdge, AuditEvent, CaseStatus } from '../../types';
import { TelemetryHUD } from '../common/TelemetryHUD';
import { EvidenceLedger } from './EvidenceLedger';
import { ExplainabilityPanel } from './ExplainabilityPanel';
import { DocumentExtractionViewer } from './DocumentExtractionViewer';
import { DecisionConsole } from './DecisionConsole';
import { EvidenceRequestModal } from '../modals/EvidenceRequestModal';

interface FlagshipCaseDetailProps {
  invoiceCase: InvoiceCase;
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  auditEvents: AuditEvent[];
  onBackToDashboard: () => void;
  onExecuteDecision: (newStatus: CaseStatus, reason?: string) => void;
  onOpenProof: (event: AuditEvent) => void;
}

export const FlagshipCaseDetail: React.FC<FlagshipCaseDetailProps> = ({
  invoiceCase,
  graphNodes,
  graphEdges,
  auditEvents,
  onBackToDashboard,
  onExecuteDecision,
  onOpenProof
}) => {
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  const formattedAmount = `${invoiceCase.currency} ${(invoiceCase.totalMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* 1. CASE HEADER BAR per UI Brief Section 9 */}
      <div className="inst-card p-6 border border-[#30363D] flex flex-wrap items-center justify-between gap-4 shadow-xl">
        
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToDashboard}
            className="btn-inst-secondary p-2.5"
            title="Back to Review Queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-mono text-white tracking-wide">CASE {invoiceCase.caseNumber}</h1>
              <span className="inst-badge inst-badge-info">Invoice {invoiceCase.invoiceNumber}</span>
              <span className={`inst-badge ${
                invoiceCase.status === 'APPROVED' ? 'inst-badge-verified' :
                invoiceCase.status === 'REJECTED' ? 'inst-badge-risk' : 'inst-badge-review'
              }`}>
                {invoiceCase.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#8B949E] mt-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#58A6FF]" />
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
          <div className="text-right">
            <span className="text-[10px] text-[#8B949E] uppercase tracking-wider block font-mono">Total Financing Amount</span>
            <span className="text-2xl font-extrabold text-white font-mono font-numeric mt-0.5 block">{formattedAmount}</span>
          </div>

          <div className="flex items-center gap-2 border-l border-[#30363D] pl-4">
            <button 
              onClick={() => setIsEvidenceModalOpen(true)}
              className="btn-inst-secondary text-xs"
            >
              <Send className="w-3.5 h-3.5 text-[#58A6FF]" /> Request Evidence
            </button>
          </div>
        </div>

      </div>

      {/* 2. 3-PILLAR TELEMETRY HUD */}
      <TelemetryHUD telemetry={invoiceCase.telemetry} />

      {/* 3. EVIDENCE & FEATURE LEDGER per UI Brief Sec 10 */}
      <EvidenceLedger invoiceCase={invoiceCase} />

      {/* 4. EXPLAINABLE RISK SIGNALS per UI Brief Sec 11 */}
      <ExplainabilityPanel signals={invoiceCase.riskSignals} />

      {/* 5. DOCUMENT SPATIAL OCR VIEWER */}
      <DocumentExtractionViewer
        documentName={invoiceCase.documentName}
        documentUrl={invoiceCase.documentUrl}
        fields={invoiceCase.fields}
        lineItems={invoiceCase.lineItems}
      />

      {/* 6. UNDERWRITER ACCOUNTABLE DECISION CONSOLE */}
      <DecisionConsole
        invoiceCase={invoiceCase}
        onExecuteDecision={onExecuteDecision}
        onOpenEvidenceRequest={() => setIsEvidenceModalOpen(true)}
      />

      {/* Evidence Request Workflow Modal */}
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
