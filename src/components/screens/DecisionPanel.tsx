import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, XCircle, Lock, PenTool, Send } from 'lucide-react';
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
    <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-7 sm:p-8 space-y-7 font-sans shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2E2A27] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#6366F1]/15 text-[#6366F1]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#F7F4F1] text-base">Accountable Decision Panel</h3>
            <p className="text-xs text-[#9E8C7C] font-mono mt-0.5">Underwriter decision execution with cryptographic notary sealing</p>
          </div>
        </div>

        <span className="pill review">
          {invoiceCase.status}
        </span>
      </div>

      {/* Decision Summary */}
      <div className="p-4.5 rounded-xl bg-[#141211] border border-[#2E2A27] space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#6366F1] uppercase tracking-wider font-mono text-[10px]">
            RECOMMENDATION: {invoiceCase.telemetry.recommendation}
          </span>
          <span className="text-[#9E8C7C] font-mono">Certainty: {invoiceCase.telemetry.confidenceScore}%</span>
        </div>

        <p className="text-[#D8C7B8] leading-relaxed">
          {invoiceCase.riskSignals.length} risk signals detected. Evidence completeness at {invoiceCase.telemetry.evidenceCompleteness}%. Verify purchase order and buyer confirmation before loan disbursement.
        </p>
      </div>

      {/* Decision Action Buttons Grid */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Request Evidence */}
          <button
            type="button"
            onClick={() => {
              setSelectedState('REQUEST_MORE_EVIDENCE');
              onOpenEvidenceRequest();
            }}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
              selectedState === 'REQUEST_MORE_EVIDENCE'
                ? 'bg-[#6366F1]/20 border-[#6366F1] text-[#6366F1] font-bold shadow-md'
                : 'bg-[#141211] border-[#2E2A27] text-[#D8C7B8] hover:border-[#6366F1]/50'
            }`}
          >
            <HelpCircle className="w-5 h-5 text-[#6366F1]" />
            <span>Request Evidence</span>
          </button>

          {/* Approve */}
          <button
            type="button"
            onClick={() => setSelectedState('APPROVE_RECOMMENDATION')}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
              selectedState === 'APPROVE_RECOMMENDATION'
                ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981] font-bold shadow-md'
                : 'bg-[#141211] border-[#2E2A27] text-[#D8C7B8] hover:border-[#10B981]/50'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <span>Approve Financing</span>
          </button>

          {/* Manual Review */}
          <button
            type="button"
            onClick={() => setSelectedState('MANUAL_REVIEW')}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
              selectedState === 'MANUAL_REVIEW'
                ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B] font-bold shadow-md'
                : 'bg-[#141211] border-[#2E2A27] text-[#D8C7B8] hover:border-[#F59E0B]/50'
            }`}
          >
            <PenTool className="w-5 h-5 text-[#F59E0B]" />
            <span>Manual Review</span>
          </button>

          {/* Reject */}
          <button
            type="button"
            onClick={() => setSelectedState('BLOCK_BY_POLICY')}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
              selectedState === 'BLOCK_BY_POLICY'
                ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444] font-bold shadow-md'
                : 'bg-[#141211] border-[#2E2A27] text-[#D8C7B8] hover:border-[#EF4444]/50'
            }`}
          >
            <XCircle className="w-5 h-5 text-[#EF4444]" />
            <span>Reject By Policy</span>
          </button>

        </div>

        {/* Mandatory Override Justification */}
        {isOverride && (
          <div className="p-4.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[#F59E0B] font-bold">
              <Lock className="w-4 h-4" />
              <span>Mandatory Override Rationale Required</span>
            </div>

            <div>
              <label className="text-[#D8C7B8] font-bold block mb-1">Override Reason *</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Specify precise rationale for overriding system trust recommendation..."
                rows={2}
                className="w-full bg-[#141211] border border-[#2E2A27] rounded-lg p-2.5 text-xs text-[#F7F4F1] placeholder-[#9E8C7C] outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <label className="text-[#D8C7B8] font-bold block mb-1">Evidence Supporting Override *</label>
              <input
                type="text"
                value={evidenceSupport}
                onChange={(e) => setEvidenceSupport(e.target.value)}
                placeholder="Reference verified document ref, executive sponsor email, or bank ref..."
                className="w-full bg-[#141211] border border-[#2E2A27] rounded-lg p-2.5 text-xs text-[#F7F4F1] placeholder-[#9E8C7C] outline-none focus:border-[#F59E0B]"
              />
            </div>
          </div>
        )}

        {errorMsg && <p className="text-xs text-[#EF4444] font-bold">{errorMsg}</p>}

        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            className="px-6 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md"
          >
            <Send className="w-4 h-4" /> Execute &amp; Cryptographically Notarize Decision
          </button>
        </div>

      </form>

    </div>
  );
};
