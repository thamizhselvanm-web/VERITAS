import React, { useState } from 'react';
import { ListFilter, Search, UploadCloud, Inbox, RefreshCw, FileText, CheckCircle2, XCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { InvoiceCase, TenantId, CaseStatus, formatCurrency } from '../../types';

interface ReviewQueuePageProps {
  cases: InvoiceCase[];
  activeTenantId: TenantId;
  onSelectCase: (id: string) => void;
  onNavigateToUpload: () => void;
  onRequestEvidence?: (c: InvoiceCase) => void;
  onExecuteDecision?: (caseId: string, status: CaseStatus) => void;
}

export const ReviewQueuePage: React.FC<ReviewQueuePageProps> = ({
  cases,
  activeTenantId,
  onSelectCase,
  onNavigateToUpload,
  onRequestEvidence,
  onExecuteDecision
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [trustBandFilter, setTrustBandFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'TRUST_DESC' | 'TRUST_ASC' | 'AMOUNT_DESC' | 'DATE_DESC'>('TRUST_DESC');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  const tenantCases = cases.filter(c => c.tenantId === activeTenantId);

  const filteredCases = tenantCases.filter(c => {
    const matchesSearch = 
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    let matchesTrust = true;
    if (trustBandFilter === 'LOW_0_40') matchesTrust = c.telemetry.trustScore <= 40;
    else if (trustBandFilter === 'MID_41_70') matchesTrust = c.telemetry.trustScore > 40 && c.telemetry.trustScore <= 70;
    else if (trustBandFilter === 'HIGH_71_100') matchesTrust = c.telemetry.trustScore > 70;

    return matchesSearch && matchesStatus && matchesTrust;
  }).sort((a, b) => {
    if (sortBy === 'TRUST_DESC') return b.telemetry.trustScore - a.telemetry.trustScore;
    if (sortBy === 'TRUST_ASC') return a.telemetry.trustScore - b.telemetry.trustScore;
    if (sortBy === 'AMOUNT_DESC') return b.totalMinor - a.totalMinor;
    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setTrustBandFilter('ALL');
    setSortBy('TRUST_DESC');
  };

  const activeFiltersCount = (searchQuery ? 1 : 0) + (statusFilter !== 'ALL' ? 1 : 0) + (trustBandFilter !== 'ALL' ? 1 : 0);

  return (
    <section aria-label="Review Queue" className="space-y-7 font-sans select-none">
      
      {/* Header with Spacious Layout */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2E2A27] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F7F4F1] tracking-tight flex items-center gap-3">
            <ListFilter className="w-6 h-6 text-[#6366F1]" />
            Underwriter Review Queue &amp; Trust Directory
          </h1>
          <p className="text-xs text-[#9E8C7C] font-mono mt-1">
            Institutional triage tool &middot; Showing {filteredCases.length} of {tenantCases.length} {tenantCases.length === 1 ? 'case' : 'cases'}
          </p>
        </div>

        <button 
          onClick={onNavigateToUpload} 
          className="btn-primary text-xs px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl flex items-center gap-2 font-bold transition-all duration-150 shadow-md"
        >
          <UploadCloud className="w-4 h-4 text-white" /> Secure Upload Intent
        </button>
      </header>

      {/* Filter & Search Controls Bar */}
      <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 text-xs shadow-sm">
        
        {/* Search Field */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#9E8C7C] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case Ref, Seller, Buyer, or Invoice Number..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#141211] border border-[#2E2A27] text-xs font-mono text-[#F7F4F1] placeholder-[#9E8C7C] outline-none focus:border-[#6366F1] transition-all"
            aria-label="Search cases"
          />
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#9E8C7C] font-mono text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#141211] border border-[#2E2A27] text-[#D8C7B8] text-xs font-mono py-2 px-3 rounded-xl outline-none cursor-pointer focus:border-[#6366F1]"
              aria-label="Filter cases by status"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
              <option value="EVIDENCE_REQUESTED">Evidence Requested</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#9E8C7C] font-mono text-[11px]">Trust Band:</span>
            <select
              value={trustBandFilter}
              onChange={(e) => setTrustBandFilter(e.target.value)}
              className="bg-[#141211] border border-[#2E2A27] text-[#D8C7B8] text-xs font-mono py-2 px-3 rounded-xl outline-none cursor-pointer focus:border-[#6366F1]"
              aria-label="Filter cases by trust band"
            >
              <option value="ALL">All Trust Bands</option>
              <option value="HIGH_71_100">Green (71-100)</option>
              <option value="MID_41_70">Amber (41-70)</option>
              <option value="LOW_0_40">Red (0-40)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#9E8C7C] font-mono text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#141211] border border-[#2E2A27] text-[#D8C7B8] text-xs font-mono py-2 px-3 rounded-xl outline-none cursor-pointer focus:border-[#6366F1]"
              aria-label="Sort queue"
            >
              <option value="TRUST_DESC">Trust Score &darr;</option>
              <option value="TRUST_ASC">Trust Score &uarr;</option>
              <option value="AMOUNT_DESC">Amount &darr;</option>
              <option value="DATE_DESC">Newest Date</option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="py-2 px-3.5 rounded-xl bg-[#262320] border border-[#2E2A27] text-[#D8C7B8] hover:text-[#F7F4F1] text-xs font-mono flex items-center gap-1.5 transition-all"
              title="Reset Search & Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

      {/* Cases Data Table / Empty State */}
      <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl overflow-hidden shadow-lg">
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center space-y-3 font-sans bg-[#141211]">
            <Inbox className="w-10 h-10 text-[#9E8C7C] mx-auto opacity-75" />
            <h3 className="text-sm font-bold text-[#F7F4F1]">No cases match current filter criteria</h3>
            <p className="text-xs text-[#D8C7B8] max-w-sm mx-auto">
              Try modifying your search term or resetting triage filters.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button onClick={clearFilters} className="btn-secondary text-xs px-4 py-2 border border-[#2E2A27] rounded-xl">
                Clear Filters
              </button>
              <button onClick={onNavigateToUpload} className="btn-primary text-xs px-4 py-2 bg-[#4F46E5] text-white rounded-xl">
                Upload New Invoice
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#141211] text-[#9E8C7C] font-mono text-[11px] border-b border-[#2E2A27]">
                  <th scope="col" className="p-4 font-bold uppercase">Case Reference</th>
                  <th scope="col" className="p-4 font-bold uppercase">Seller Entity</th>
                  <th scope="col" className="p-4 font-bold uppercase">Buyer Entity</th>
                  <th scope="col" className="p-4 font-bold uppercase text-right">Amount</th>
                  <th scope="col" className="p-4 font-bold uppercase text-center">1. Trust Score</th>
                  <th scope="col" className="p-4 font-bold uppercase text-center">2. Confidence</th>
                  <th scope="col" className="p-4 font-bold uppercase text-center">3. Evidence</th>
                  <th scope="col" className="p-4 font-bold uppercase">Status</th>
                  <th scope="col" className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E2A27]">
                {filteredCases.map((c) => {
                  const isExpanded = expandedCaseId === c.id;
                  const trustScore = c.telemetry.trustScore;
                  const confidenceScore = c.telemetry.confidenceScore;
                  const evidenceScore = c.telemetry.evidenceCompleteness;

                  const trustBarClass = 
                    trustScore <= 40 ? 'trust-bar-red' : 
                    trustScore <= 70 ? 'trust-bar-amber' : 
                    'trust-bar-green';

                  const trustTextColor = 
                    trustScore <= 40 ? 'text-[#EF4444]' : 
                    trustScore <= 70 ? 'text-[#F59E0B]' : 
                    'text-[#10B981]';

                  return (
                    <React.Fragment key={c.id}>
                      <tr 
                        className="hover:bg-[#262320] transition-colors duration-150 cursor-pointer group" 
                        onClick={() => setExpandedCaseId(isExpanded ? null : c.id)}
                      >
                        <td className="p-4 font-mono font-semibold text-[#F7F4F1]">
                          <span className="group-hover:text-[#6366F1] transition-colors font-bold">{c.caseNumber}</span>
                          <span className="block text-[11px] text-[#9E8C7C] font-normal mt-0.5">Inv #{c.invoiceNumber}</span>
                        </td>
                        <td className="p-4 text-[#D8C7B8] font-medium">{c.sellerName}</td>
                        <td className="p-4 text-[#D8C7B8] font-medium">{c.buyerName}</td>
                        <td className="p-4 text-right font-mono font-bold text-[#F7F4F1]">
                          {formatCurrency(c.totalMinor, c.currency)}
                        </td>

                        {/* 1. Trust Score Metric */}
                        <td className="p-4 text-center">
                          <div className="trust-cell justify-center">
                            <span className={`font-mono font-bold ${trustTextColor}`}>{trustScore}</span>
                            <div className="bar w-12 h-1.5 bg-[#2E2A27] rounded-full overflow-hidden">
                              <span 
                                className={trustBarClass} 
                                style={{ width: `${Math.max(8, trustScore)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* 2. Confidence Index Metric */}
                        <td className="p-4 text-center font-mono font-numeric text-[#D8C7B8]">
                          <span className="bg-[#262320] px-2.5 py-1 rounded-lg border border-[#2E2A27]">
                            {confidenceScore}%
                          </span>
                        </td>

                        {/* 3. Evidence Completeness Metric */}
                        <td className="p-4 text-center font-mono font-numeric text-[#D8C7B8]">
                          <span className={`px-2.5 py-1 rounded-lg border ${
                            evidenceScore >= 80 ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30' :
                            evidenceScore >= 60 ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30' :
                            'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
                          }`}>
                            {evidenceScore}%
                          </span>
                        </td>

                        <td className="p-4">
                          {c.status === 'APPROVED' ? (
                            <span className="pill verified">Approved</span>
                          ) : c.status === 'REJECTED' ? (
                            <span className="pill risk">Rejected</span>
                          ) : c.status === 'EVIDENCE_REQUESTED' ? (
                            <span className="pill review">Evidence Needed</span>
                          ) : (
                            <span className="pill review">Needs Review</span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectCase(c.id);
                            }}
                            className="btn-secondary py-1.5 px-3 text-xs rounded-lg bg-[#262320] border border-[#2E2A27] hover:border-[#6366F1] hover:text-[#6366F1]"
                          >
                            Inspect Case
                          </button>
                        </td>
                      </tr>

                      {/* Row Hover / Expansion Quick Preview & Action Buttons */}
                      {isExpanded && (
                        <tr className="bg-[#181615]">
                          <td colSpan={9} className="p-5 border-b border-[#2E2A27]">
                            <div className="space-y-4 bg-[#141211] p-5 rounded-2xl border border-[#2E2A27]">
                              
                              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2E2A27] pb-3.5">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F7F4F1]">
                                    <FileText className="w-4 h-4 text-[#6366F1]" />
                                    <span>Case {c.caseNumber} &middot; Evidence &amp; Confidence Telemetry</span>
                                  </div>
                                  <div className="text-xs text-[#9E8C7C] font-mono">
                                    Model: {c.telemetry.modelVersion} &bull; Schema: {c.telemetry.featureSchemaVersion}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 font-mono text-xs">
                                  <div className="bg-[#1C1917] px-3.5 py-2 rounded-xl border border-[#2E2A27]">
                                    <span className="text-[10px] text-[#9E8C7C] block uppercase">Trust Score</span>
                                    <strong className={trustTextColor}>{trustScore} / 100</strong>
                                  </div>
                                  <div className="bg-[#1C1917] px-3.5 py-2 rounded-xl border border-[#2E2A27]">
                                    <span className="text-[10px] text-[#9E8C7C] block uppercase">Confidence Index</span>
                                    <strong className="text-[#6366F1]">{confidenceScore}%</strong>
                                  </div>
                                  <div className="bg-[#1C1917] px-3.5 py-2 rounded-xl border border-[#2E2A27]">
                                    <span className="text-[10px] text-[#9E8C7C] block uppercase">Evidence Completeness</span>
                                    <strong className={evidenceScore >= 75 ? 'text-[#10B981]' : 'text-[#F59E0B]'}>{evidenceScore}%</strong>
                                  </div>
                                </div>
                              </div>

                              {/* Integrated Interactive Action Buttons Grid */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                <div className="flex items-center gap-2.5">
                                  {/* Action 1: Request Evidence */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onRequestEvidence) onRequestEvidence(c);
                                      else onSelectCase(c.id);
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-[#6366F1]/15 border border-[#6366F1]/40 text-[#6366F1] hover:bg-[#6366F1]/25 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                                  >
                                    <HelpCircle className="w-4 h-4 text-[#6366F1]" />
                                    <span>Request Evidence</span>
                                  </button>

                                  {/* Action 2: Approve Financing */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onExecuteDecision) onExecuteDecision(c.id, 'APPROVED');
                                      else onSelectCase(c.id);
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] hover:bg-[#10B981]/25 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                                    <span>Approve Financing</span>
                                  </button>

                                  {/* Action 3: Reject Case */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onExecuteDecision) onExecuteDecision(c.id, 'REJECTED');
                                      else onSelectCase(c.id);
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] hover:bg-[#EF4444]/25 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                                  >
                                    <XCircle className="w-4 h-4 text-[#EF4444]" />
                                    <span>Reject Financing</span>
                                  </button>
                                </div>

                                {/* Action 4: Open Full Workspace */}
                                <button
                                  type="button"
                                  onClick={() => onSelectCase(c.id)}
                                  className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md cursor-pointer"
                                >
                                  <span>Inspect Full Workspace</span>
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
