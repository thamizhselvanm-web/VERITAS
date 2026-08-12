import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Radio, ArrowRight, Zap, Layers, UploadCloud, ListFilter } from 'lucide-react';
import { TrustSphere3D } from '../3d/TrustSphere3D';
import { TrustScore3D } from '../3d/TrustScore3D';
import { InvoiceCase, TenantId } from '../../types';

interface HeroOverviewScreenProps {
  cases: InvoiceCase[];
  activeTenantId: TenantId;
  onNavigateToQueue: () => void;
  onNavigateToUpload: () => void;
  onSelectCase: (id: string) => void;
}

export const HeroOverviewScreen: React.FC<HeroOverviewScreenProps> = ({
  cases,
  activeTenantId,
  onNavigateToQueue,
  onNavigateToUpload,
  onSelectCase
}) => {
  const tenantCases = cases.filter(c => c.tenantId === activeTenantId);
  const openCasesCount = tenantCases.filter(c => c.status === 'NEEDS_REVIEW').length;
  const highRiskCount = tenantCases.filter(c => c.telemetry.riskLevel === 'HIGH' || c.telemetry.riskLevel === 'CRITICAL').length;
  const evidenceGapCount = tenantCases.filter(c => c.telemetry.evidenceCompleteness < 75).length;

  return (
    <div className="space-y-8 font-sans pb-12 select-none">
      
      {/* Hero Intelligence Header per Brief Sec 8 & 34 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center pt-2">
        
        {/* Left Headline & Key Actions (6 cols) */}
        <div className="xl:col-span-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5 text-[#00F0FF]" />
              CONTINUOUS TRUST VERIFICATION
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Financial Trust, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#00F0FF] to-purple-400">
                Continuously Verified.
              </span>
            </h1>

            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-xl">
              VERITAS connects invoices, entities, behavioral patterns, evidence completeness, and risk signals into one continuously verified intelligence layer.
            </p>
          </motion.div>

          {/* Quick Metrics Bar per Brief Sec 34 */}
          <div className="grid grid-cols-3 gap-4 font-mono text-xs">
            <div className="spatial-panel p-3.5 border border-white/10">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Open Cases</span>
              <span className="text-2xl font-bold font-numeric text-white mt-0.5 block">{openCasesCount}</span>
            </div>

            <div className="spatial-panel p-3.5 border border-white/10">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">High Risk</span>
              <span className="text-2xl font-bold font-numeric text-[#F85149] mt-0.5 block">{highRiskCount}</span>
            </div>

            <div className="spatial-panel p-3.5 border border-white/10">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Evidence Gap</span>
              <span className="text-2xl font-bold font-numeric text-[#D29922] mt-0.5 block">{evidenceGapCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button onClick={onNavigateToQueue} className="btn-spatial-primary text-xs">
              <ListFilter className="w-4 h-4" /> Open Review Queue
            </button>
            <button onClick={onNavigateToUpload} className="btn-spatial-secondary text-xs">
              <UploadCloud className="w-4 h-4 text-[#00F0FF]" /> Upload Intent
            </button>
          </div>
        </div>

        {/* Right Interactive 3D Trust Sphere Canvas per Brief Sec 8 & 36 (6 cols) */}
        <div className="xl:col-span-6 spatial-panel p-4 border border-white/10 relative min-h-[460px] flex items-center justify-center overflow-hidden">
          
          <div className="absolute top-4 left-4 z-10 text-xs font-mono text-[#94A3B8] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00F0FF]" />
            <span>Interactive 3D Trust Sphere (Drag to Rotate)</span>
          </div>

          <TrustSphere3D onSelectEntity={(id) => onSelectCase(id)} />
        </div>

      </div>

      {/* Live Intelligence & Cases Table Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Priority Review Cases (8 cols) */}
        <div className="xl:col-span-8 spatial-panel border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Active Intelligence Review Cases</h3>
            <button onClick={onNavigateToQueue} className="text-xs text-[#00F0FF] hover:underline font-semibold flex items-center gap-1">
              View All Cases <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#05070B] text-[#64748B] font-mono border-b border-white/10">
                  <th className="p-3">Case Ref</th>
                  <th className="p-3">Seller Entity</th>
                  <th className="p-3">Buyer Entity</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Trust</th>
                  <th className="p-3 text-center">Confidence</th>
                  <th className="p-3">Recommendation</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tenantCases.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onSelectCase(c.id)}>
                    <td className="p-3 font-mono font-bold text-white">{c.caseNumber}</td>
                    <td className="p-3 text-[#C9D1D9] font-medium">{c.sellerName}</td>
                    <td className="p-3 text-[#C9D1D9] font-medium">{c.buyerName}</td>
                    <td className="p-3 text-right font-mono font-numeric font-bold text-white">
                      {c.currency} {(c.totalMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center font-mono font-numeric font-bold text-white">{c.telemetry.trustScore}</td>
                    <td className="p-3 text-center font-mono font-numeric text-[#00F0FF]">{c.telemetry.confidenceScore}%</td>
                    <td className="p-3">
                      <span className={`spatial-badge ${
                        c.telemetry.recommendation === 'APPROVE_RECOMMENDATION' ? 'spatial-badge-verified' :
                        c.telemetry.recommendation === 'MANUAL_REVIEW' ? 'spatial-badge-review' : 'spatial-badge-risk'
                      }`}>
                        {c.telemetry.recommendation}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="btn-spatial-secondary py-1 px-2.5 text-[11px]">Inspect</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3D Radial Trust Score Summary Widget per Brief Sec 9 (4 cols) */}
        <div className="xl:col-span-4 spatial-panel p-6 border border-white/10 flex flex-col items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider block self-start">
            Portfolio Trust Index
          </span>

          <TrustScore3D score={82} label="AVERAGE TRUST" riskLevel="MODERATE" />

          <div className="w-full border-t border-white/10 pt-4 text-xs text-[#94A3B8] flex justify-between font-mono">
            <span>Model: risk-0.3.0</span>
            <span className="text-[#3FB950]">82% System Health</span>
          </div>
        </div>

      </div>

    </div>
  );
};
