import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Building2, FileText, Link2, UploadCloud, ListFilter } from 'lucide-react';
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
    <div className="space-y-6 font-sans pb-8 select-none">
      
      {/* Hero Intelligence Header */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch pt-2">
        
        {/* Left Headline & Essential Actions (6 cols) */}
        <div className="xl:col-span-7 space-y-5 flex flex-col justify-between">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E07A5F]/15 border border-[#E07A5F]/40 text-[#E07A5F] text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5 text-[#E07A5F]" />
              CONTINUOUS TRUST VERIFICATION
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#F7F4F1] tracking-tight leading-tight">
              Financial Trust, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4A261] via-[#E07A5F] to-[#F07151]">
                Continuously Verified.
              </span>
            </h1>

            <p className="text-sm text-[#D8C7B8] leading-relaxed max-w-xl">
              VERITAS connects invoices, entities, behavioral patterns, evidence completeness, and risk signals into one continuously verified intelligence layer.
            </p>
          </motion.div>

          {/* Metrics Summary Grid */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="spatial-panel p-3.5 border border-[#E07A5F]/20">
              <span className="text-[#9E8C7C] block text-[10px] uppercase font-bold">Open Cases</span>
              <span className="text-2xl font-bold font-numeric text-[#F7F4F1] mt-0.5 block">{openCasesCount}</span>
            </div>

            <div className="spatial-panel p-3.5 border border-[#E07A5F]/20">
              <span className="text-[#9E8C7C] block text-[10px] uppercase font-bold">High Risk</span>
              <span className="text-2xl font-bold font-numeric text-[#F07151] mt-0.5 block">{highRiskCount}</span>
            </div>

            <div className="spatial-panel p-3.5 border border-[#E07A5F]/20">
              <span className="text-[#9E8C7C] block text-[10px] uppercase font-bold">Evidence Gap</span>
              <span className="text-2xl font-bold font-numeric text-[#F4A261] mt-0.5 block">{evidenceGapCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button onClick={onNavigateToQueue} className="btn-spatial-primary text-xs">
              <ListFilter className="w-4 h-4" /> Open Review Queue
            </button>
            <button onClick={onNavigateToUpload} className="btn-spatial-secondary text-xs">
              <UploadCloud className="w-4 h-4 text-[#E07A5F]" /> Upload Intent
            </button>
          </div>
        </div>

        {/* Clean Verified Transaction Chain (5 cols) */}
        <div className="xl:col-span-5 spatial-panel p-5 border border-[#E07A5F]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#E07A5F]/20 pb-3">
            <div>
              <p className="text-[10px] font-mono font-bold text-[#E07A5F] uppercase tracking-widest">Relationship Intelligence</p>
              <h2 className="mt-1 text-lg font-bold text-[#F7F4F1]">Verified Transaction Chain</h2>
            </div>
            <span className="spatial-badge spatial-badge-copper">STATIC VIEW</span>
          </div>

          <div className="space-y-2 py-4">
            <div className="flex items-center justify-between p-3 bg-[#141211]/80 rounded-lg border border-[#E07A5F]/20">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-[#E07A5F]" />
                <div>
                  <strong className="text-xs text-[#F7F4F1] block">Seller Entity</strong>
                  <small className="text-[10px] text-[#9E8C7C] font-mono">Acme Components Ltd</small>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#52B788]">VERIFIED</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#141211]/80 rounded-lg border border-[#E07A5F]/20">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#F4A261]" />
                <div>
                  <strong className="text-xs text-[#F7F4F1] block">Invoice Record</strong>
                  <small className="text-[10px] text-[#9E8C7C] font-mono">VRT-28491 / USD 145,000</small>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#F4A261]">REVIEW</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#141211]/80 rounded-lg border border-[#E07A5F]/20">
              <div className="flex items-center gap-3">
                <Link2 className="w-4 h-4 text-[#E07A5F]" />
                <div>
                  <strong className="text-xs text-[#F7F4F1] block">Buyer Relationship</strong>
                  <small className="text-[10px] text-[#9E8C7C] font-mono">Meridian Industries Inc</small>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#E07A5F]">MONITORED</span>
            </div>
          </div>

          <p className="text-[10px] font-mono text-[#9E8C7C] border-t border-[#E07A5F]/20 pt-3">
            10 entities connected / 14 evidence links / last recalculation 08:42:16 UTC
          </p>
        </div>

      </div>

      {/* Intelligence Review Table Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Cases Table (8 cols) */}
        <div className="xl:col-span-8 spatial-panel border border-[#E07A5F]/20 overflow-hidden">
          <div className="p-4 border-b border-[#E07A5F]/20 flex items-center justify-between">
            <h3 className="font-bold text-[#F7F4F1] text-sm">Active Intelligence Review Cases</h3>
            <button onClick={onNavigateToQueue} className="text-xs text-[#E07A5F] hover:underline font-semibold flex items-center gap-1">
              View All Cases <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#141211] text-[#9E8C7C] font-mono border-b border-[#E07A5F]/20">
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
              <tbody className="divide-y divide-[#E07A5F]/10">
                {tenantCases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#E07A5F]/10 transition-colors cursor-pointer" onClick={() => onSelectCase(c.id)}>
                    <td className="p-3 font-mono font-bold text-[#F7F4F1]">{c.caseNumber}</td>
                    <td className="p-3 text-[#D8C7B8] font-medium">{c.sellerName}</td>
                    <td className="p-3 text-[#D8C7B8] font-medium">{c.buyerName}</td>
                    <td className="p-3 text-right font-mono font-numeric font-bold text-[#F7F4F1]">
                      {c.currency} {(c.totalMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center font-mono font-numeric font-bold text-[#F7F4F1]">{c.telemetry.trustScore}</td>
                    <td className="p-3 text-center font-mono font-numeric text-[#E07A5F]">{c.telemetry.confidenceScore}%</td>
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

        {/* Portfolio Trust Index Summary (4 cols) */}
        <div className="xl:col-span-4 spatial-panel p-5 border border-[#E07A5F]/20 flex flex-col items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#9E8C7C] uppercase tracking-wider block self-start">
            Portfolio Trust Index
          </span>

          <TrustScore3D score={82} label="AVERAGE TRUST" riskLevel="MODERATE" />

          <div className="w-full border-t border-[#E07A5F]/20 pt-3 text-xs text-[#9E8C7C] flex justify-between font-mono">
            <span>Model: risk-0.3.0</span>
            <span className="text-[#52B788]">82% System Health</span>
          </div>
        </div>

      </div>

    </div>
  );
};
