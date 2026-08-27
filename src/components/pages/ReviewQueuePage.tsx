import React, { useState } from 'react';
import { ListFilter, Search, UploadCloud, Inbox, RefreshCw } from 'lucide-react';
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

  const clearFilters = () => {
    setSearchQuery('');
    setFilterRecommendation('ALL');
  };

  return (
    <section aria-label="Review Queue" className="space-y-6 font-sans select-none">
      
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E07A5F]/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F7F4F1] tracking-tight flex items-center gap-2.5">
            <ListFilter className="w-6 h-6 text-[#E07A5F]" />
            Underwriter Review Queue & Trust Directory
          </h1>
          <p className="text-xs text-[#9E8C7C] font-mono mt-1">
            Prioritized case directory sorted by trust score, risk signals, and evidence completeness.
          </p>
        </div>

        <button onClick={onNavigateToUpload} className="btn-primary text-xs flex items-center gap-2">
          <UploadCloud className="w-4 h-4" /> Secure Upload Intent
        </button>
      </header>

      {/* Filter & Search Bar */}
      <div className="inst-card p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#9E8C7C] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case Ref, Seller, Buyer, or Invoice Number..."
            className="inst-input pl-9 text-xs"
            aria-label="Search cases"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#D8C7B8] font-medium">Filter Recommendation:</span>
          <select
            value={filterRecommendation}
            onChange={(e) => setFilterRecommendation(e.target.value)}
            className="inst-input w-auto text-xs py-1.5 cursor-pointer"
            aria-label="Filter cases by recommendation"
          >
            <option value="ALL">All Recommendations</option>
            <option value="APPROVE_RECOMMENDATION">APPROVE_RECOMMENDATION</option>
            <option value="MANUAL_REVIEW">MANUAL_REVIEW</option>
            <option value="REQUEST_MORE_EVIDENCE">REQUEST_MORE_EVIDENCE</option>
            <option value="BLOCK_BY_POLICY">BLOCK_BY_POLICY</option>
          </select>

          {(searchQuery || filterRecommendation !== 'ALL') && (
            <button
              onClick={clearFilters}
              className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
              title="Reset Search & Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

      {/* Cases Data Table / Empty State */}
      <div className="inst-card overflow-hidden">
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center space-y-3 font-sans">
            <Inbox className="w-10 h-10 text-[#9E8C7C] mx-auto opacity-75" />
            <h3 className="text-sm font-bold text-[#F7F4F1]">No cases match current filter criteria</h3>
            <p className="text-xs text-[#D8C7B8] max-w-sm mx-auto">
              Try modifying your search term or resetting recommendation filters.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button onClick={clearFilters} className="btn-secondary text-xs">
                Clear Filters
              </button>
              <button onClick={onNavigateToUpload} className="btn-primary text-xs">
                Upload New Invoice
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#141211] text-[#9E8C7C] font-mono text-[11px] border-b border-[#E07A5F]/20">
                  <th scope="col" className="p-3">Case Ref</th>
                  <th scope="col" className="p-3">Seller Entity</th>
                  <th scope="col" className="p-3">Buyer Entity</th>
                  <th scope="col" className="p-3 text-right">Amount</th>
                  <th scope="col" className="p-3 text-center">Trust</th>
                  <th scope="col" className="p-3 text-center">Confidence</th>
                  <th scope="col" className="p-3 text-center">Evidence</th>
                  <th scope="col" className="p-3">Recommendation</th>
                  <th scope="col" className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E07A5F]/15">
                {filteredCases.map((c) => {
                  const currencySymbol = c.currency === 'INR' ? '₹' : '$';
                  return (
                    <tr key={c.id} className="hover:bg-[#E07A5F]/10 transition-colors cursor-pointer" onClick={() => onSelectCase(c.id)}>
                      <td className="p-3 font-mono font-semibold text-[#F7F4F1]">{c.caseNumber}</td>
                      <td className="p-3 text-[#D8C7B8] font-medium">{c.sellerName}</td>
                      <td className="p-3 text-[#D8C7B8] font-medium">{c.buyerName}</td>
                      <td className="p-3 text-right font-mono font-numeric font-semibold text-[#F7F4F1]">
                        {currencySymbol} {(c.totalMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-center font-mono font-numeric font-bold text-[#F7F4F1]">{c.telemetry.trustScore}</td>
                      <td className="p-3 text-center font-mono font-numeric text-[#E07A5F]">{c.telemetry.confidenceScore}%</td>
                      <td className="p-3 text-center font-mono font-numeric text-[#F4A261]">{c.telemetry.evidenceCompleteness}%</td>
                      <td className="p-3">
                        <span className={`inst-badge ${
                          c.telemetry.recommendation === 'APPROVE_RECOMMENDATION' ? 'inst-badge-verified' :
                          c.telemetry.recommendation === 'MANUAL_REVIEW' ? 'inst-badge-review' : 'inst-badge-risk'
                        }`}>
                          {c.telemetry.recommendation}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button className="btn-secondary py-1 px-2.5 text-[11px]">Inspect Case</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </section>
  );
};
