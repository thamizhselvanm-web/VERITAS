import React, { useState } from 'react';
import { ListFilter, Search, ArrowRight, UploadCloud } from 'lucide-react';
import { InvoiceCase, TenantId, DecisionState } from '../../types';

interface ReviewQueuePageProps {
  cases: InvoiceCase[];
  activeTenantId: TenantId;
  onSelectCase: (id: string) => void;
  onNavigateToUpload: () => void;
}

export const ReviewQueuePage: React.FC<ReviewQueuePageProps> = ({
  cases,
  activeTenantId,
  onSelectCase,
  onNavigateToUpload
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRecommendation, setFilterRecommendation] = useState<string>('ALL');

  const tenantCases = cases.filter(c => c.tenantId === activeTenantId);

  const filteredCases = tenantCases.filter(c => {
    const matchesSearch = 
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRec = filterRecommendation === 'ALL' || c.telemetry.recommendation === filterRecommendation;

    return matchesSearch && matchesRec;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#30363D] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ListFilter className="w-6 h-6 text-blue-400" />
            Underwriter Review Queue & Trust Directory
          </h1>
          <p className="text-xs text-[#8B949E] font-mono mt-1">
            Prioritized case directory sorted by trust score, risk signals, and evidence completeness.
          </p>
        </div>

        <button onClick={onNavigateToUpload} className="btn-inst-primary text-xs">
          <UploadCloud className="w-4 h-4" /> Secure Upload Intent
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="inst-card p-4 border border-[#30363D] flex flex-wrap items-center justify-between gap-4 text-xs">
        
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#8B949E] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case Ref, Seller, Buyer, or Invoice Number..."
            className="w-full bg-[#0D1117] border border-[#30363D] rounded pl-9 pr-3 py-2 text-xs text-white placeholder-[#484F58] focus:outline-none focus:border-blue-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#8B949E] font-medium">Filter Recommendation:</span>
          <select
            value={filterRecommendation}
            onChange={(e) => setFilterRecommendation(e.target.value)}
            className="bg-[#0D1117] border border-[#30363D] text-white rounded text-xs px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Recommendations</option>
            <option value="APPROVE_RECOMMENDATION">APPROVE_RECOMMENDATION</option>
            <option value="MANUAL_REVIEW">MANUAL_REVIEW</option>
            <option value="REQUEST_MORE_EVIDENCE">REQUEST_MORE_EVIDENCE</option>
            <option value="BLOCK_BY_POLICY">BLOCK_BY_POLICY</option>
          </select>
        </div>

      </div>

      {/* Cases Data Table */}
      <div className="inst-card border border-[#30363D] overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
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
              {filteredCases.map((c) => (
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
                    <button className="btn-inst-secondary py-1 px-2.5 text-[11px]">Inspect Case</button>
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
