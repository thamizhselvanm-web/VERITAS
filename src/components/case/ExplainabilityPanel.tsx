import React from 'react';
import { AlertOctagon, ShieldAlert, Info, CheckCircle, Lightbulb, Percent } from 'lucide-react';
import { TrustSignal } from '../../types';

interface ExplainabilityPanelProps {
  signals: TrustSignal[];
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({ signals }) => {
  return (
    <div className="inst-card p-6 border border-[#30363D] flex flex-col gap-5 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363D] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/10 text-[#D29922]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Explainable Risk Signals & Model Attribution</h3>
            <p className="text-xs text-[#8B949E] mt-0.5">Every recommendation includes human-readable reasons, evidence, and certainty metrics.</p>
          </div>
        </div>

        <span className="inst-badge inst-badge-info">
          {signals.length} Active Signals
        </span>
      </div>

      {/* Signals List matching UI Brief Sec 11 */}
      <div className="space-y-4">
        {signals.length === 0 ? (
          <p className="text-xs text-[#8B949E] py-4 text-center">No risk signals flagged for this case.</p>
        ) : (
          signals.map((signal) => (
            <div
              key={signal.id}
              className={`p-4 rounded border space-y-3 ${
                signal.severity === 'CRITICAL' || signal.severity === 'HIGH'
                  ? 'bg-[#DA3633]/10 border-[#DA3633]/40'
                  : 'bg-[#D29922]/10 border-[#D29922]/40'
              }`}
            >
              
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {signal.severity === 'CRITICAL' ? (
                    <span className="inst-badge inst-badge-risk">CRITICAL RISK</span>
                  ) : (
                    <span className="inst-badge inst-badge-review">HIGH / MEDIUM RISK</span>
                  )}
                  <h4 className="font-bold text-white text-sm">{signal.title}</h4>
                </div>

                <div className="font-mono text-xs font-bold text-[#F85149] bg-[#0D1117] px-2.5 py-1 rounded border border-[#30363D]">
                  {signal.scoreImpact} Penalty
                </div>
              </div>

              <p className="text-xs text-[#C9D1D9] leading-relaxed">
                {signal.description}
              </p>

              {/* Exact format per UI Brief Sec 11 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#0D1117] p-3 rounded border border-[#30363D]">
                <div>
                  <span className="text-[#8B949E] font-medium block">Explainability Signal Metrics:</span>
                  <span className="font-mono text-[#58A6FF] font-bold block mt-0.5">{signal.explainability}</span>
                </div>

                <div>
                  <span className="text-[#8B949E] font-medium block">Rule Code / Feature Source:</span>
                  <span className="font-mono text-white font-bold block mt-0.5">{signal.ruleTriggered}</span>
                </div>
              </div>

              <div className="text-xs bg-[#D29922]/15 text-[#D29922] p-3 rounded flex items-center gap-2">
                <Lightbulb className="w-4 h-4 flex-shrink-0" />
                <span><strong>Recommended Action:</strong> {signal.mitigationHint}</span>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
