import React from 'react';
import { ShieldCheck, Activity, FileText, CheckCircle2, AlertTriangle, HelpCircle, XCircle, ShieldAlert } from 'lucide-react';
import { TrustProfile, DecisionState } from '../../types';

interface TelemetryHUDProps {
  telemetry: TrustProfile;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ telemetry }) => {
  const { trustScore, confidenceScore, evidenceCompleteness, recommendation } = telemetry;

  const getTrustBadgeClass = (score: number) => {
    if (score >= 85) return 'inst-badge-verified';
    if (score >= 60) return 'inst-badge-review';
    return 'inst-badge-risk';
  };

  const getRecommendationBadge = (rec: DecisionState) => {
    switch (rec) {
      case 'APPROVE_RECOMMENDATION':
        return (
          <span className="inst-badge inst-badge-verified text-xs px-3 py-1">
            <CheckCircle2 className="w-4 h-4" />
            RECOMMENDATION: APPROVE FINANCING
          </span>
        );
      case 'MANUAL_REVIEW':
        return (
          <span className="inst-badge inst-badge-review text-xs px-3 py-1">
            <AlertTriangle className="w-4 h-4" />
            RECOMMENDATION: MANUAL REVIEW REQUIRED
          </span>
        );
      case 'REQUEST_MORE_EVIDENCE':
        return (
          <span className="inst-badge inst-badge-info text-xs px-3 py-1">
            <HelpCircle className="w-4 h-4" />
            RECOMMENDATION: REQUEST MORE EVIDENCE
          </span>
        );
      case 'FLAG_HIGH_RISK':
      case 'BLOCK_BY_POLICY':
      default:
        return (
          <span className="inst-badge inst-badge-risk text-xs px-3 py-1">
            <XCircle className="w-4 h-4" />
            RECOMMENDATION: BLOCK BY POLICY / REJECT
          </span>
        );
    }
  };

  return (
    <div className="inst-card p-6 border border-[#30363D] space-y-6 shadow-xl">
      
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#30363D] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-bold text-[#8B949E] uppercase tracking-wider">
            3-Pillar Telemetry Summary
          </span>
          <span className="text-[10px] font-mono text-[#58A6FF] bg-[#161B22] border border-[#30363D] px-2 py-0.5 rounded">
            Model: {telemetry.modelVersion}
          </span>
        </div>

        {getRecommendationBadge(recommendation)}
      </div>

      {/* 3 Metric Pillars per UI Brief Sec 9 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Pillar 1: Trust Score */}
        <div className="p-4 rounded bg-[#0D1117] border border-[#30363D] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-[#8B949E]">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#388BFD]" />
              TRUST SCORE
            </span>
            <span className={`inst-badge ${getTrustBadgeClass(trustScore)}`}>
              {trustScore >= 85 ? 'HIGH TRUST' : trustScore >= 60 ? 'MODERATE' : 'CRITICAL RISK'}
            </span>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono font-numeric text-white">{trustScore}</span>
            <span className="text-xs text-[#8B949E] font-medium">/ 100</span>
          </div>

          <div className="w-full bg-[#21262D] rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all ${
                trustScore >= 85 ? 'bg-[#238636]' : trustScore >= 60 ? 'bg-[#D29922]' : 'bg-[#DA3633]'
              }`}
              style={{ width: `${trustScore}%` }}
            ></div>
          </div>
        </div>

        {/* Pillar 2: Confidence Level */}
        <div className="p-4 rounded bg-[#0D1117] border border-[#30363D] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-[#8B949E]">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#58A6FF]" />
              AI CONFIDENCE
            </span>
            <span className="inst-badge inst-badge-info">CERTAINTY</span>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono font-numeric text-[#58A6FF]">{confidenceScore}%</span>
            <span className="text-xs text-[#8B949E] font-medium">Model Certainty</span>
          </div>

          <div className="w-full bg-[#21262D] rounded-full h-2 overflow-hidden">
            <div className="h-full bg-[#1F6FEB] transition-all" style={{ width: `${confidenceScore}%` }}></div>
          </div>
        </div>

        {/* Pillar 3: Evidence Completeness */}
        <div className="p-4 rounded bg-[#0D1117] border border-[#30363D] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-[#8B949E]">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#A371F7]" />
              EVIDENCE COVERAGE
            </span>
            <span className="inst-badge inst-badge-info">DOCUMENT PROOF</span>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono font-numeric text-[#A371F7]">{evidenceCompleteness}%</span>
            <span className="text-xs text-[#8B949E] font-medium">Complete</span>
          </div>

          <div className="w-full bg-[#21262D] rounded-full h-2 overflow-hidden">
            <div className="h-full bg-[#8957E5] transition-all" style={{ width: `${evidenceCompleteness}%` }}></div>
          </div>
        </div>

      </div>

    </div>
  );
};
