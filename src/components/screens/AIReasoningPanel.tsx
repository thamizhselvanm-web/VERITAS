import React from 'react';
import { Cpu, ArrowRight, ShieldCheck, Activity, Layers, HelpCircle } from 'lucide-react';
import { TrustProfile } from '../../types';

interface AIReasoningPanelProps {
  telemetry: TrustProfile;
}

export const AIReasoningPanel: React.FC<AIReasoningPanelProps> = ({ telemetry }) => {
  return (
    <div className="spatial-panel p-6 border border-white/10 space-y-6 font-sans">
      
      {/* Header per Brief Sec 11 */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-purple-500/10 text-[#A371F7]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">VERITAS AI Reasoning Engine</h3>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">Model version: {telemetry.modelVersion}</p>
          </div>
        </div>

        <span className="spatial-badge spatial-badge-cyan text-xs">
          {telemetry.confidenceScore}% Model Confidence
        </span>
      </div>

      {/* Flowing Visual Attribution Composition per Brief Sec 11 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        
        {/* Step 1: Signals Input */}
        <div className="spatial-panel p-4 border border-white/10 space-y-3">
          <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider block">
            1. INGESTED SIGNALS
          </span>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-[#05070B] border border-white/5 flex justify-between">
              <span className="text-[#94A3B8]">Near-Duplicate Match:</span>
              <span className="font-bold text-[#D29922]">94.2%</span>
            </div>

            <div className="p-2.5 rounded bg-[#05070B] border border-white/5 flex justify-between">
              <span className="text-[#94A3B8]">Amount Deviation:</span>
              <span className="font-bold text-[#D29922]">18.7× Median</span>
            </div>

            <div className="p-2.5 rounded bg-[#05070B] border border-white/5 flex justify-between">
              <span className="text-[#94A3B8]">Evidence Coverage:</span>
              <span className="font-bold text-[#A371F7]">{telemetry.evidenceCompleteness}%</span>
            </div>
          </div>
        </div>

        {/* Step 2: Evidence Correlation */}
        <div className="spatial-panel p-4 border border-white/10 space-y-3">
          <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider block">
            2. EVIDENCE CORRELATION
          </span>

          <p className="text-xs text-[#C9D1D9] leading-relaxed">
            Invoice amount exceeds historical trade median between Acme Components and Meridian Industries. Delivery proof is missing.
          </p>

          <div className="p-2.5 rounded bg-[#05070B] border border-white/5 text-[11px] font-mono text-[#94A3B8]">
            Feature Schema: {telemetry.featureSchemaVersion}
          </div>
        </div>

        {/* Step 3: Decision Synthesis */}
        <div className="spatial-panel p-4 border border-white/10 space-y-3 bg-[#4F46E5]/10 border-[#6366F1]/30">
          <span className="text-[10px] font-mono font-bold text-[#818CF8] uppercase tracking-wider block">
            3. SYNTHESIZED RECOMMENDATION
          </span>

          <div className="text-sm font-bold text-white font-mono">
            {telemetry.recommendation}
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Manual review required to verify purchase order PO-9920 and buyer confirmation before loan disbursement.
          </p>
        </div>

      </div>

    </div>
  );
};
