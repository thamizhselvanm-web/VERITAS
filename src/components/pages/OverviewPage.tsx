import React from 'react';
import { Shield, AlertOctagon, HelpCircle, Clock, ArrowRight, CheckCircle2, ListFilter, UploadCloud } from 'lucide-react';
import { InvoiceCase, TenantId } from '../../types';

interface OverviewPageProps {
  cases: InvoiceCase[];
  activeTenantId: TenantId;
  onNavigateToQueue: () => void;
  onNavigateToUpload: () => void;
  onSelectCase: (id: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
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
    <div className="space-y-6 font-sans">
      
      {/* Header per UI Brief Sec 8 */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#30363D] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Trust Operations</h1>
          <p className="text-xs text-[#8B949E] font-mono mt-1">
            Tuesday, 11 August 2026 &bull; <strong className="text-white">{openCasesCount + 10} cases require attention</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onNavigateToUpload} className="btn-inst-secondary text-xs">
            <UploadCloud className="w-4 h-4" /> Secure Upload Intent
          </button>
          <button onClick={onNavigateToQueue} className="btn-inst-primary text-xs">
            <ListFilter className="w-4 h-4" /> Open Review Queue
          </button>
        </div>
      </div>

      {/* 4 KPIs Grid per UI Brief Sec 8 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="inst-card p-4 border border-[#30363D] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider block">Open Cases</span>
            <span className="text-3xl font-extrabold text-white font-mono font-numeric mt-1 block">{openCasesCount}</span>
          </div>
          <div className="p-3 rounded bg-blue-500/10 text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        <div className="inst-card p-4 border border-[#30363D] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider block">High Risk</span>
            <span className="text-3xl font-extrabold text-[#F85149] font-mono font-numeric mt-1 block">{highRiskCount}</span>
          </div>
          <div className="p-3 rounded bg-[#DA3633]/15 text-[#F85149]">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        <div className="inst-card p-4 border border-[#30363D] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider block">Evidence Gap</span>
            <span className="text-3xl font-extrabold text-[#D29922] font-mono font-numeric mt-1 block">{evidenceGapCount}</span>
          </div>
          <div className="p-3 rounded bg-[#D29922]/15 text-[#D29922]">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="inst-card p-4 border border-[#30363D] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider block">Avg. Review Time</span>
            <span className="text-3xl font-extrabold text-[#3FB950] font-mono font-numeric mt-1 block">4.2m</span>
          </div>
          <div className="p-3 rounded bg-[#238636]/15 text-[#3FB950]">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Priority Review Queue Data Table */}
      <div className="inst-card border border-[#30363D] overflow-hidden">
        <div className="p-4 border-b border-[#30363D] flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Priority Review Queue</h3>
          <button onClick={onNavigateToQueue} className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-1">
            View All Cases <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0D1117] text-[#8B949E] font-mono border-b border-[#30363D]">
                <th className="p-3">Case Ref</th>
                <th className="p-3">Seller Entity</th>
                <th className="p-3">Buyer Entity</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Trust</th>
                <th className="p-3 text-center">Confidence</th>
                <th className="p-3 text-center">Evidence</th>
                <th className="p-3">Recommendation</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {tenantCases.map((c) => (
                <tr key={c.id} className="hover:bg-[#161B22] transition-colors cursor-pointer" onClick={() => onSelectCase(c.id)}>
                  <td className="p-3 font-mono font-bold text-white">{c.caseNumber}</td>
                  <td className="p-3 text-[#C9D1D9] font-medium">{c.sellerName}</td>
                  <td className="p-3 text-[#C9D1D9] font-medium">{c.buyerName}</td>
                  <td className="p-3 text-right font-mono font-numeric font-bold text-white">
                    {c.currency} {(c.totalMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center font-mono font-numeric font-bold text-white">{c.telemetry.trustScore}</td>
                  <td className="p-3 text-center font-mono font-numeric text-[#58A6FF]">{c.telemetry.confidenceScore}%</td>
                  <td className="p-3 text-center font-mono font-numeric text-[#A371F7]">{c.telemetry.evidenceCompleteness}%</td>
                  <td className="p-3">
                    <span className={`inst-badge ${
                      c.telemetry.recommendation === 'APPROVE_RECOMMENDATION' ? 'inst-badge-verified' :
                      c.telemetry.recommendation === 'MANUAL_REVIEW' ? 'inst-badge-review' : 'inst-badge-risk'
                    }`}>
                      {c.telemetry.recommendation}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="btn-inst-secondary py-1 px-2.5 text-[11px]">Inspect</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
