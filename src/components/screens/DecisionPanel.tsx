import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, XCircle, Lock, PenTool } from 'lucide-react';
import { CaseStatus, InvoiceCase, DecisionState } from '../../types';

interface DecisionPanelProps {
  invoiceCase: InvoiceCase;
  onExecuteDecision: (newStatus: CaseStatus, reason?: string) => void;
  onOpenEvidenceRequest: () => void;
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({
  invoiceCase,
  onExecuteDecision,
  onOpenEvidenceRequest
}) => {
  const [selectedState, setSelectedState] = useState<DecisionState>(invoiceCase.telemetry.recommendation);
  const [overrideReason, setOverrideReason] = useState('');
  const [evidenceSupport, setEvidenceSupport] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isOverride = selectedState !== invoiceCase.telemetry.recommendation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isOverride) {
      if (!overrideReason.trim() || !evidenceSupport.trim()) {
        setErrorMsg('MANDATORY: Overriding AI recommendation requires explicit Override Reason * and Supporting Evidence *.');
        return;
      }
    }

    setErrorMsg(null);

    let mappedStatus: CaseStatus = 'APPROVED';
    if (selectedState === 'MANUAL_REVIEW') mappedStatus = 'NEEDS_REVIEW';
    if (selectedState === 'REQUEST_MORE_EVIDENCE') mappedStatus = 'EVIDENCE_REQUESTED';
    if (selectedState === 'FLAG_HIGH_RISK' || selectedState === 'BLOCK_BY_POLICY') mappedStatus = 'REJECTED';

    const fullReason = isOverride
      ? `MANUAL OVERRIDE [${selectedState}]: ${overrideReason} | Supporting Evidence: ${evidenceSupport}`
      : `EXECUTED DECISION [${selectedState}]: Accepted system recommendation.`;

    onExecuteDecision(mappedStatus, fullReason);
  };

  return (
    <div className="spatial-panel p-6 border border-white/10 space-y-6 font-sans">
      
      {/* Header per Brief Sec 17 */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blue-500/10 text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">VERITAS Accountable Decision Panel</h3>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">Underwriter decision execution with cryptographic notary sealing</p>
          </div>
        </div>

        <span className="spatial-badge spatial-badge-review text-xs font-mono">
          {invoiceCase.status}
        </span>
      </div>

      {/* Decision Summary per Brief Sec 17 */}
      <div className="p-4 rounded-lg bg-[#111827] border border-[#00F0FF]/30 space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#00F0FF] uppercase tracking-wider font-mono text-[10px]">
            RECOMMENDATION: {invoiceCase.telemetry.recommendation}
          </span>
          <span className="text-[#94A3B8] font-mono">Certainty: {invoiceCase.telemetry.confidenceScore}%</span>
        </div>

        <p className="text-[#C9D1D9] leading-relaxed">
          {invoiceCase.riskSignals.length} risk signals detected. Evidence completeness at {invoiceCase.telemetry.evidenceCompleteness}%. Verify purchase order and buyer confirmation before loan disbursement.
        </p>
      </div>

      {/* Decision Action Buttons Grid per Brief Sec 17 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Request Evidence */}
          <button
            type="button"
            onClick={() => {
              setSelectedState('REQUEST_MORE_EVIDENCE');
              onOpenEvidenceRequest();
            }}
            className={`p-3.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedState === 'REQUEST_MORE_EVIDENCE'
                ? 'bg-[#388BFD]/20 border-[#388BFD] text-[#00F0FF] font-bold shadow-lg shadow-cyan-500/20'
                : 'bg-[#05070B] border-white/10 text-[#C9D1D9] hover:border-white/30'
            }`}
          >
            <HelpCircle className="w-5 h-5 text-[#00F0FF]" />
            <span>Request Evidence</span>
          </button>

          {/* Approve */}
          <button
            type="button"
            onClick={() => setSelectedState('APPROVE_RECOMMENDATION')}
            className={`p-3.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedState === 'APPROVE_RECOMMENDATION'
                ? 'bg-[#3FB950]/20 border-[#3FB950] text-[#3FB950] font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-[#05070B] border-white/10 text-[#C9D1D9] hover:border-white/30'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-[#3FB950]" />
            <span>Approve Financing</span>
          </button>

          {/* Manual Review */}
          <button
            type="button"
            onClick={() => setSelectedState('MANUAL_REVIEW')}
            className={`p-3.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedState === 'MANUAL_REVIEW'
                ? 'bg-[#D29922]/20 border-[#D29922] text-[#D29922] font-bold shadow-lg shadow-amber-500/20'
                : 'bg-[#05070B] border-white/10 text-[#C9D1D9] hover:border-white/30'
            }`}
          >
            <PenTool className="w-5 h-5 text-[#D29922]" />
            <span>Manual Review</span>
          </button>

          {/* Reject */}
          <button
            type="button"
            onClick={() => setSelectedState('BLOCK_BY_POLICY')}
            className={`p-3.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedState === 'BLOCK_BY_POLICY'
                ? 'bg-[#F85149]/20 border-[#F85149] text-[#F85149] font-bold shadow-lg shadow-red-500/20'
                : 'bg-[#05070B] border-white/10 text-[#C9D1D9] hover:border-white/30'
            }`}
          >
            <XCircle className="w-5 h-5 text-[#F85149]" />
            <span>Reject By Policy</span>
          </button>

        </div>

        {/* Mandatory Override Justification per Brief Sec 14 & 17 */}
        {isOverride && (
          <div className="p-4 rounded-lg bg-[#D29922]/10 border border-[#D29922]/40 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[#D29922] font-bold">
              <Lock className="w-4 h-4" />
              <span>Mandatory Override Rationale Required</span>
            </div>

            <div>
              <label className="text-[#C9D1D9] font-bold block mb-1">Override Reason *</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Specify precise rationale for overriding system trust recommendation..."
                rows={2}
                className="w-full bg-[#05070B] border border-white/10 rounded p-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#D29922]"
              />
            </div>

            <div>
              <label className="text-[#C9D1D9] font-bold block mb-1">Evidence Supporting Override *</label>
              <input
                type="text"
                value={evidenceSupport}
                onChange={(e) => setEvidenceSupport(e.target.value)}
                placeholder="Reference verified document ref, executive sponsor email, or bank ref..."
                className="w-full bg-[#05070B] border border-white/10 rounded p-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#D29922]"
              />
            </div>
          </div>
        )}

        {errorMsg && <p className="text-xs text-[#F85149] font-bold">{errorMsg}</p>}

        <div className="flex justify-end pt-2">
          <button type="submit" className="btn-spatial-primary text-xs font-bold px-6 py-2.5">
            Execute & Cryptographically Notarize Decision
          </button>
        </div>

      </form>

    </div>
  );
};
