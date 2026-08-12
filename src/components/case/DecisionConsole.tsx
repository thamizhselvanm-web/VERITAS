import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, XCircle, PenTool, Lock } from 'lucide-react';
import { CaseStatus, InvoiceCase, DecisionState } from '../../types';

interface DecisionConsoleProps {
  invoiceCase: InvoiceCase;
  onExecuteDecision: (newStatus: CaseStatus, reason?: string) => void;
  onOpenEvidenceRequest: () => void;
}

export const DecisionConsole: React.FC<DecisionConsoleProps> = ({
  invoiceCase,
  onExecuteDecision,
  onOpenEvidenceRequest
}) => {
  const [selectedState, setSelectedState] = useState<DecisionState>(invoiceCase.telemetry.recommendation);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [evidenceSupport, setEvidenceSupport] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isOverride = selectedState !== invoiceCase.telemetry.recommendation;

  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isOverride) {
      if (!overrideReason.trim() || !evidenceSupport.trim()) {
        setErrorMsg('MANDATORY: Overriding AI recommendations requires both an Override Reason * and Supporting Evidence *.');
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
    <div className="inst-card p-6 border border-[#30363D] flex flex-col gap-6 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#30363D] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blue-500/10 text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Underwriter Accountable Decision Console</h3>
            <p className="text-xs text-[#8B949E] mt-0.5">AI provides intelligence. Accountable underwriters execute decisions notarized on-chain.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8B949E]">Current Status:</span>
          <span className="inst-badge inst-badge-review">{invoiceCase.status}</span>
        </div>
      </div>

      <form onSubmit={handleDecisionSubmit} className="space-y-6">
        
        {/* Decision Radio Options per UI Brief Sec 14 */}
        <div>
          <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider block mb-3">
            Select Decision State
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            
            <label className={`p-3.5 rounded border cursor-pointer transition-all flex items-center gap-3 text-xs select-none ${
              selectedState === 'APPROVE_RECOMMENDATION'
                ? 'bg-[#238636]/15 border-[#238636] text-[#3FB950] font-bold'
                : 'bg-[#0D1117] border-[#30363D] text-[#C9D1D9] hover:border-[#8B949E]'
            }`}>
              <input
                type="radio"
                name="decisionState"
                checked={selectedState === 'APPROVE_RECOMMENDATION'}
                onChange={() => setSelectedState('APPROVE_RECOMMENDATION')}
                className="hidden"
              />
              <CheckCircle2 className="w-4 h-4 text-[#3FB950]" />
              <span>Approve Recommendation</span>
            </label>

            <label className={`p-3.5 rounded border cursor-pointer transition-all flex items-center gap-3 text-xs select-none ${
              selectedState === 'MANUAL_REVIEW'
                ? 'bg-[#D29922]/15 border-[#D29922] text-[#D29922] font-bold'
                : 'bg-[#0D1117] border-[#30363D] text-[#C9D1D9] hover:border-[#8B949E]'
            }`}>
              <input
                type="radio"
                name="decisionState"
                checked={selectedState === 'MANUAL_REVIEW'}
                onChange={() => setSelectedState('MANUAL_REVIEW')}
                className="hidden"
              />
              <PenTool className="w-4 h-4 text-[#D29922]" />
              <span>Manual Review</span>
            </label>

            <label 
              onClick={onOpenEvidenceRequest}
              className={`p-3.5 rounded border cursor-pointer transition-all flex items-center gap-3 text-xs select-none ${
              selectedState === 'REQUEST_MORE_EVIDENCE'
                ? 'bg-[#388BFD]/15 border-[#388BFD] text-[#58A6FF] font-bold'
                : 'bg-[#0D1117] border-[#30363D] text-[#C9D1D9] hover:border-[#8B949E]'
            }`}>
              <input
                type="radio"
                name="decisionState"
                checked={selectedState === 'REQUEST_MORE_EVIDENCE'}
                onChange={() => setSelectedState('REQUEST_MORE_EVIDENCE')}
                className="hidden"
              />
              <HelpCircle className="w-4 h-4 text-[#58A6FF]" />
              <span>Request Evidence</span>
            </label>

            <label className={`p-3.5 rounded border cursor-pointer transition-all flex items-center gap-3 text-xs select-none ${
              selectedState === 'FLAG_HIGH_RISK'
                ? 'bg-[#DA3633]/15 border-[#DA3633] text-[#F85149] font-bold'
                : 'bg-[#0D1117] border-[#30363D] text-[#C9D1D9] hover:border-[#8B949E]'
            }`}>
              <input
                type="radio"
                name="decisionState"
                checked={selectedState === 'FLAG_HIGH_RISK'}
                onChange={() => setSelectedState('FLAG_HIGH_RISK')}
                className="hidden"
              />
              <AlertTriangle className="w-4 h-4 text-[#F85149]" />
              <span>Flag High Risk</span>
            </label>

            <label className={`p-3.5 rounded border cursor-pointer transition-all flex items-center gap-3 text-xs select-none ${
              selectedState === 'BLOCK_BY_POLICY'
                ? 'bg-[#DA3633]/25 border-[#DA3633] text-[#F85149] font-bold'
                : 'bg-[#0D1117] border-[#30363D] text-[#C9D1D9] hover:border-[#8B949E]'
            }`}>
              <input
                type="radio"
                name="decisionState"
                checked={selectedState === 'BLOCK_BY_POLICY'}
                onChange={() => setSelectedState('BLOCK_BY_POLICY')}
                className="hidden"
              />
              <XCircle className="w-4 h-4 text-[#F85149]" />
              <span>Reject By Policy</span>
            </label>

          </div>
        </div>

        {/* Mandatory Override Fields per UI Brief Sec 14 */}
        {isOverride && (
          <div className="p-4 rounded bg-[#D29922]/10 border border-[#D29922]/40 space-y-3">
            <div className="flex items-center gap-2 text-[#D29922] font-bold text-xs">
              <Lock className="w-4 h-4" />
              <span>AI Recommendation Override Active (Mandatory Rationale Required)</span>
            </div>

            <div>
              <label className="text-xs text-[#C9D1D9] font-bold block mb-1">Override Reason *</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Explicit reason why underwriter is overriding system trust recommendation..."
                rows={2}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded p-2.5 text-xs text-white placeholder-[#484F58] focus:outline-none focus:border-[#D29922]"
              ></textarea>
            </div>

            <div>
              <label className="text-xs text-[#C9D1D9] font-bold block mb-1">Evidence Supporting Override *</label>
              <input
                type="text"
                value={evidenceSupport}
                onChange={(e) => setEvidenceSupport(e.target.value)}
                placeholder="Reference verified document ID, executive approval email, or bank ledger ref..."
                className="w-full bg-[#0D1117] border border-[#30363D] rounded p-2.5 text-xs text-white placeholder-[#484F58] focus:outline-none focus:border-[#D29922]"
              />
            </div>
          </div>
        )}

        {errorMsg && <p className="text-xs text-[#F85149] font-bold">{errorMsg}</p>}

        {/* Execute Button */}
        <div className="flex justify-end pt-2">
          <button type="submit" className="btn-inst-primary text-xs font-bold px-6 py-2.5">
            Confirm & Notarize Decision State
          </button>
        </div>

      </form>

    </div>
  );
};
