import React, { useState } from 'react';
import { ArrowLeft, Building2, Eye, Send, CheckCircle2, AlertTriangle, AlertCircle, ChevronDown } from 'lucide-react';
import { InvoiceCase, GraphNode, GraphEdge, AuditEvent, CaseStatus } from '../../types';
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
  onBackToDashboard,
  onExecuteDecision
}) => {
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  const formattedAmount = `${invoiceCase.currency} ${(invoiceCase.totalMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <article className="space-y-8 pb-16 font-sans select-none">
      
      {/* Case Header Bar */}
      <header className="inst-card p-6 sm:p-7 flex flex-wrap items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <button onClick={onBackToDashboard} className="btn-secondary p-2" title="Back to Cases">
            <ArrowLeft className="w-4 h-4 text-[#5B8DEF]" />
          </button>

          <div>
            <div className="flex items-center gap-3 font-mono">
              <h1 className="text-xl font-bold text-[#F2F3F5] tracking-tight">{invoiceCase.caseNumber}</h1>
              <span className="inst-badge inst-badge-accent text-xs">INV {invoiceCase.invoiceNumber}</span>
              <span className={`inst-badge ${
                invoiceCase.status === 'APPROVED' ? 'inst-badge-verified' :
                invoiceCase.status === 'REJECTED' ? 'inst-badge-risk' : 'inst-badge-review'
              }`}>
                {invoiceCase.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#D8C7B8] mt-1 font-sans">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#6366F1]" />
                Seller: <strong className="text-[#F7F4F1]">{invoiceCase.sellerName}</strong>
                <a href={`mailto:contact@${invoiceCase.sellerName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`} className="text-[#6366F1] hover:underline text-[11px] ml-1">
                  [email]
                </a>
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#52B788]" />
                Buyer: <strong className="text-[#F7F4F1]">{invoiceCase.buyerName}</strong>
                <a href={`tel:+1415555${Math.floor(1000 + Math.random() * 9000)}`} className="text-[#52B788] hover:underline text-[11px] ml-1">
                  [phone]
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="text-right font-mono">
            <span className="text-[11px] text-[#9E8C7C] uppercase tracking-wider block">Financing Amount</span>
            <span className="text-xl font-bold text-[#F7F4F1] font-numeric mt-0.5 block">{formattedAmount}</span>
          </div>

          <div className="flex items-center gap-2 border-l border-[#2E2A27] pl-4">
            <button onClick={() => setIsEvidenceDrawerOpen(true)} className="btn-secondary text-xs">
              <Eye className="w-3.5 h-3.5 text-[#6366F1]" /> Custody Chain
            </button>
            <button onClick={() => setIsEvidenceModalOpen(true)} className="btn-primary text-xs">
              <Send className="w-3.5 h-3.5" /> Request Evidence
            </button>
          </div>
        </div>

      </header>

      {/* 3-up Score Summary Row (§16 requirement) */}
      <dl className="grid grid-cols-1 md:grid-cols-3 gap-6 m-0">
        
        <div className="inst-card p-5 flex items-center justify-between">
          <div>
            <dt className="text-[11px] font-mono font-medium text-[#5C6470] uppercase tracking-wider">Trust Score</dt>
            <dd className="text-2xl font-bold font-numeric text-[#F2F3F5] mt-1 m-0">
              {invoiceCase.telemetry.trustScore} <span className="text-xs text-[#5C6470] font-normal">/ 100</span>
            </dd>
          </div>
          <span className="inst-badge inst-badge-verified text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> {invoiceCase.telemetry.riskLevel}
          </span>
        </div>

        <div className="inst-card p-5 flex items-center justify-between">
          <div>
            <dt className="text-[11px] font-mono font-medium text-[#5C6470] uppercase tracking-wider">AI Confidence</dt>
            <dd className="text-2xl font-bold font-numeric text-[#5B8DEF] mt-1 m-0">
              {invoiceCase.telemetry.confidenceScore}%
            </dd>
          </div>
          <span className="inst-badge inst-badge-accent text-xs">HIGH CERTAINTY</span>
        </div>

        <div className="inst-card p-5 flex items-center justify-between">
          <div>
            <dt className="text-[11px] font-mono font-medium text-[#5C6470] uppercase tracking-wider">Evidence Coverage</dt>
            <dd className="text-2xl font-bold font-numeric text-[#E0A63C] mt-1 m-0">
              {invoiceCase.telemetry.evidenceCompleteness}%
            </dd>
          </div>
          <span className="inst-badge inst-badge-review text-xs">GAP DETECTED</span>
        </div>

      </dl>

      {/* 2-Column Grid: Invoice Summary & Top Risk Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Spatial Invoice Extraction Workspace (7 cols) */}
        <section className="lg:col-span-7 space-y-8">
          
          <SpatialInvoiceWorkspace
            documentName={invoiceCase.documentName}
            fields={invoiceCase.fields}
            lineItems={invoiceCase.lineItems}
          />

          {/* Native <details>/<summary> Accordion for Evidence Ledger */}
          <section className="inst-card p-6 space-y-4">
            <h2 className="text-xs font-mono font-bold text-[#5C6470] uppercase tracking-wider">
              Evidence Ledger
            </h2>

            <div className="space-y-3">
              {invoiceCase.evidenceItems.map((evt) => (
                <details
                  key={evt.id}
                  className="group inst-card-elevated border border-[#242830] rounded-xl overflow-hidden text-xs"
                >
                  <summary className="p-3.5 font-semibold text-[#F2F3F5] cursor-pointer flex items-center justify-between hover:bg-[#1A1E24] transition-colors select-none">
                    <span className="flex items-center gap-2 font-mono">
                      {evt.verified ? (
                        <CheckCircle2 className="w-4 h-4 text-[#34B37E]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#E0A63C]" />
                      )}
                      <span>{evt.name}</span>
                    </span>

                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[11px] text-[#9AA1AC]">{evt.type}</span>
                      <ChevronDown className="w-4 h-4 text-[#5C6470] transition-transform duration-200 group-open:rotate-180" />
                    </div>
                  </summary>

                  <div className="p-4 border-t border-[#242830] bg-[#12151A] space-y-2.5 font-mono text-xs text-[#9AA1AC]">
                    <p>Reliability Score: <code className="text-[#F2F3F5]">{evt.reliabilityScore}%</code></p>
                    <p>Uploaded At: <span className="text-[#F2F3F5]">{evt.uploadedAt || 'Pending Upload'}</span></p>
                    <p>Required: <span className="text-[#F2F3F5]">{evt.required ? 'YES' : 'NO'}</span></p>
                  </div>
                </details>
              ))}
            </div>
          </section>

        </section>

        {/* Right Column: Top Risk Signals & Decision Panel (5 cols) */}
        <section className="lg:col-span-5 space-y-8">
          
          {/* Top Risk Signals */}
          <div className="inst-card p-6 space-y-4">
            <h2 className="text-xs font-mono font-bold text-[#5C6470] uppercase tracking-wider">
              Top Risk Signals
            </h2>

            <ul className="space-y-3 list-none">
              {invoiceCase.riskSignals.length === 0 ? (
                <li className="text-xs text-[#9AA1AC] italic">No high-severity risk signals detected.</li>
              ) : (
                invoiceCase.riskSignals.map((signal) => (
                  <li key={signal.id} className="p-3.5 rounded-xl bg-[#1A1E24] border border-[#242830] space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#F2F3F5]">
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-[#E5484D]" />
                        <span>{signal.title}</span>
                      </span>
                      <span className="font-mono text-[#E5484D] font-numeric">{signal.scoreImpact} pts</span>
                    </div>
                    <p className="text-xs text-[#9AA1AC] leading-relaxed">{signal.description}</p>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Decision Panel */}
          <DecisionPanel
            invoiceCase={invoiceCase}
            onExecuteDecision={onExecuteDecision}
            onOpenEvidenceRequest={() => setIsEvidenceModalOpen(true)}
          />

        </section>

      </div>

      {/* Chain of Custody Drawer */}
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
        onSubmitRequest={(_, notes) => {
          onExecuteDecision('EVIDENCE_REQUESTED', `Evidence requested by underwriter: ${notes}`);
        }}
      />

    </article>
  );
};
