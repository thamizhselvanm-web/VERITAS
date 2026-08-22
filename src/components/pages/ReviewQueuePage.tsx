import React, { useState } from 'react';
import { ListFilter, Search, UploadCloud } from 'lucide-react';
import { InvoiceCase, TenantId } from '../../types';

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
    <div className="space-y-6 font-sans select-none">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E07A5F]/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F7F4F1] tracking-tight flex items-center gap-2.5">
            <ListFilter className="w-6 h-6 text-[#E07A5F]" />
            Underwriter Review Queue & Trust Directory
          </h1>
          <p className="text-xs text-[#9E8C7C] font-mono mt-1">
            Prioritized case directory sorted by trust score, risk signals, and evidence completeness.
          </p>
        </div>

        <button onClick={onNavigateToUpload} className="btn-spatial-primary text-xs">
          <UploadCloud className="w-4 h-4" /> Secure Upload Intent
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="spatial-panel p-4 border border-[#E07A5F]/20 flex flex-wrap items-center justify-between gap-4 text-xs">
        
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#9E8C7C] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case Ref, Seller, Buyer, or Invoice Number..."
            className="w-full bg-[#141211] border border-[#E07A5F]/20 rounded-lg pl-9 pr-3 py-2 text-xs text-[#F7F4F1] placeholder-[#9E8C7C] focus:outline-none focus:border-[#E07A5F] font-sans"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#D8C7B8] font-medium">Filter Recommendation:</span>
          <select
            value={filterRecommendation}
            onChange={(e) => setFilterRecommendation(e.target.value)}
            className="bg-[#141211] border border-[#E07A5F]/20 text-[#F7F4F1] rounded-lg text-xs px-3 py-2 focus:outline-none cursor-pointer font-sans"
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
      <div className="spatial-panel border border-[#E07A5F]/20 overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#141211] text-[#9E8C7C] font-mono border-b border-[#E07A5F]/20">
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
            <tbody className="divide-y divide-[#E07A5F]/10">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-[#E07A5F]/10 transition-colors cursor-pointer" onClick={() => onSelectCase(c.id)}>
                  <td className="p-3 font-mono font-bold text-[#F7F4F1]">{c.caseNumber}</td>
                  <td className="p-3 text-[#D8C7B8] font-medium">{c.sellerName}</td>
                  <td className="p-3 text-[#D8C7B8] font-medium">{c.buyerName}</td>
                  <td className="p-3 text-right font-mono font-numeric font-bold text-[#F7F4F1]">
                    {c.currency} {(c.totalMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center font-mono font-numeric font-bold text-[#F7F4F1]">{c.telemetry.trustScore}</td>
                  <td className="p-3 text-center font-mono font-numeric text-[#E07A5F]">{c.telemetry.confidenceScore}%</td>
                  <td className="p-3 text-center font-mono font-numeric text-[#F4A261]">{c.telemetry.evidenceCompleteness}%</td>
                  <td className="p-3">
                    <span className={`spatial-badge ${
                      c.telemetry.recommendation === 'APPROVE_RECOMMENDATION' ? 'spatial-badge-verified' :
                      c.telemetry.recommendation === 'MANUAL_REVIEW' ? 'spatial-badge-review' : 'spatial-badge-risk'
                    }`}>
                      {c.telemetry.recommendation}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="btn-spatial-secondary py-1 px-2.5 text-[11px]">Inspect Case</button>
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
