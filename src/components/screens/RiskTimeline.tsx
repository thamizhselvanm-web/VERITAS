import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, AlertTriangle, AlertOctagon, CheckCircle2, ChevronDown, Lightbulb } from 'lucide-react';
import { TrustSignal } from '../../types';

interface RiskTimelineProps {
  signals: TrustSignal[];
  onOpenEvidencePanel?: () => void;
}

export const RiskTimeline: React.FC<RiskTimelineProps> = ({ signals, onOpenEvidencePanel }) => {
  const [expandedSignalId, setExpandedSignalId] = useState<string | null>(signals[0]?.id || null);

  const timelineSteps = [
    { title: 'Invoice Submitted', status: 'COMPLETED', time: '14:30:00' },
    { title: 'Duplicate Similarity Analysis', status: 'FLAGGED', time: '14:30:04' },
    { title: 'Behavioral Amount Anomaly', status: 'FLAGGED', time: '14:30:08' },
    { title: 'Evidence Completeness Evaluation', status: 'GAP', time: '14:30:10' },
    { title: 'Manual Review Recommended', status: 'RECOMMENDATION', time: '14:32:10' }
  ];

  return (
    <div className="spatial-panel p-6 border border-white/10 space-y-6 font-sans">
      
      {/* Header per Brief Sec 10 */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/10 text-[#D29922]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Why VERITAS Flagged This Request</h3>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">Interactive step-by-step risk timeline & evidence correlation</p>
          </div>
        </div>

        <span className="spatial-badge spatial-badge-review text-xs">
          {signals.length} Signals Flagged
        </span>
      </div>

      {/* Horizontal Interactive Timeline Chain per Brief Sec 10 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative py-2">
        {timelineSteps.map((step, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-lg border text-xs flex flex-col justify-between transition-all ${
              step.status === 'FLAGGED' || step.status === 'GAP'
                ? 'bg-[#D29922]/10 border-[#D29922]/40 text-[#D29922]'
                : step.status === 'RECOMMENDATION'
                ? 'bg-[#4F46E5]/15 border-[#6366F1]/40 text-[#818CF8] font-bold'
                : 'bg-[#05070B] border-white/10 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B] mb-2">
              <span>0{idx + 1}.</span>
              <span>{step.time}</span>
            </div>

            <div className="font-bold leading-tight mb-2">
              {step.title}
            </div>

            {step.status === 'FLAGGED' && (
              <span className="spatial-badge spatial-badge-review text-[9px] self-start">ANOMALY</span>
            )}
            {step.status === 'COMPLETED' && (
              <span className="spatial-badge spatial-badge-verified text-[9px] self-start">OK</span>
            )}
            {step.status === 'RECOMMENDATION' && (
              <span className="spatial-badge spatial-badge-review text-[9px] self-start">REVIEW</span>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Risk Signals Expansion */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider block">
          Flagged Signal Explanations & Evidence Attributions
        </span>

        {signals.map((sig) => {
          const isExpanded = expandedSignalId === sig.id;

          return (
            <div
              key={sig.id}
              className={`p-4 rounded-lg border transition-all space-y-3 ${
                sig.severity === 'CRITICAL' || sig.severity === 'HIGH'
                  ? 'bg-[#F85149]/10 border-[#F85149]/30'
                  : 'bg-[#D29922]/10 border-[#D29922]/30'
              }`}
            >
              <div 
                onClick={() => setExpandedSignalId(isExpanded ? null : sig.id)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className={`spatial-badge ${
                    sig.severity === 'CRITICAL' ? 'spatial-badge-risk' : 'spatial-badge-review'
                  }`}>
                    {sig.severity} RISK
                  </span>
                  <h4 className="font-bold text-white text-sm">{sig.title}</h4>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-[#F85149] font-bold">{sig.scoreImpact} Penalty</span>
                  <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Hover / Click Expansion per Brief Sec 10 */}
              {isExpanded && (
                <div className="space-y-3 pt-2 text-xs border-t border-white/10">
                  <p className="text-[#C9D1D9] leading-relaxed">{sig.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#05070B] p-3 rounded border border-white/10 font-mono">
                    <div>
                      <span className="text-[#64748B] block text-[10px]">Signal Metric Output:</span>
                      <span className="text-[#818CF8] font-bold block mt-0.5">{sig.explainability}</span>
                    </div>

                    <div>
                      <span className="text-[#64748B] block text-[10px]">Confidence Level:</span>
                      <span className="text-white font-bold block mt-0.5">{(sig.confidence * 100).toFixed(0)}% Certainty</span>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#D29922]/15 text-[#D29922] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 flex-shrink-0" />
                      <span><strong>Recommended Action:</strong> {sig.mitigationHint}</span>
                    </div>

                    {onOpenEvidencePanel && (
                      <button
                        onClick={onOpenEvidencePanel}
                        className="btn-spatial-secondary py-1 px-2 text-[11px] font-mono flex-shrink-0"
                      >
                        Inspect Evidence
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
