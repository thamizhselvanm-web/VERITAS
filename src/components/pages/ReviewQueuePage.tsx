import React, { useState } from 'react';
import { ListFilter, Search, UploadCloud, Inbox, RefreshCw, FileText, CheckCircle2, XCircle, HelpCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
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
    <section aria-label="Review Queue" className="space-y-10 font-sans select-none max-w-7xl mx-auto pb-8 overflow-x-hidden">
      
      {/* Header with Spacious Layout */}
      <header className="flex flex-wrap items-center justify-between gap-6 border-b border-[#2E2A27]/80 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold text-[#F7F4F1] tracking-tight flex items-center gap-3">
            <ListFilter className="w-7 h-7 text-[#6366F1]" />
            Underwriter Review Queue &amp; Trust Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#9E8C7C] font-mono">
            Institutional triage tool &middot; Showing {filteredCases.length} of {tenantCases.length} {tenantCases.length === 1 ? 'case' : 'cases'}
          </p>
        </div>

        <button 
          onClick={onNavigateToUpload} 
          className="px-5 py-3 text-xs bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl flex items-center gap-2 font-bold transition-all shadow-md cursor-pointer"
        >
          <UploadCloud className="w-4 h-4 text-white" /> Secure Upload Intent
        </button>
      </header>

      {/* Filter & Search Controls Bar */}
      <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-6 flex flex-wrap items-center justify-between gap-5 text-xs shadow-md">
        
        {/* Search Field */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#9E8C7C] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case Ref, Seller, Buyer, or Invoice Number..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#141211] border border-[#2E2A27] text-xs font-mono text-[#F7F4F1] placeholder-[#9E8C7C] outline-none focus:border-[#6366F1] transition-all"
            aria-label="Search cases"
          />
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex items-center gap-2">
            <span className="text-[#9E8C7C] font-mono text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#141211] border border-[#2E2A27] text-[#D8C7B8] text-xs font-mono py-2.5 px-3 rounded-xl outline-none cursor-pointer focus:border-[#6366F1]"
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
              className="bg-[#141211] border border-[#2E2A27] text-[#D8C7B8] text-xs font-mono py-2.5 px-3 rounded-xl outline-none cursor-pointer focus:border-[#6366F1]"
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
              className="bg-[#141211] border border-[#2E2A27] text-[#D8C7B8] text-xs font-mono py-2.5 px-3 rounded-xl outline-none cursor-pointer focus:border-[#6366F1]"
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
              className="py-2.5 px-4 rounded-xl bg-[#262320] border border-[#2E2A27] text-[#D8C7B8] hover:text-[#F7F4F1] text-xs font-mono flex items-center gap-1.5 transition-all"
              title="Reset Search & Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

      {/* Cases Data Container with ZERO Horizontal Scroll */}
      <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl overflow-hidden shadow-xl w-full">
        {filteredCases.length === 0 ? (
          <div className="p-14 text-center space-y-4 font-sans bg-[#141211]">
            <Inbox className="w-12 h-12 text-[#9E8C7C] mx-auto opacity-75" />
            <h3 className="text-sm font-bold text-[#F7F4F1]">No cases match current filter criteria</h3>
            <p className="text-xs text-[#D8C7B8] max-w-sm mx-auto">
              Try modifying your search term or resetting triage filters.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button onClick={clearFilters} className="px-4 py-2 border border-[#2E2A27] bg-[#262320] text-[#F7F4F1] text-xs rounded-xl">
                Clear Filters
              </button>
              <button onClick={onNavigateToUpload} className="px-4 py-2 bg-[#4F46E5] text-white text-xs font-bold rounded-xl">
                Upload New Invoice
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-hidden divide-y divide-[#2E2A27]">
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
                <div key={c.id} className="w-full">
                  {/* Perfectly Fitted Row Container */}
                  <div 
                    onClick={() => setExpandedCaseId(isExpanded ? null : c.id)} 
                    className="p-5 hover:bg-[#262320] transition-all duration-150 cursor-pointer flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 group"
                  >
                    {/* Case Reference & Entity Pair */}
                    <div className="space-y-1 min-w-[220px] flex-1">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-[#F7F4F1] text-sm group-hover:text-[#6366F1] transition-colors">{c.caseNumber}</span>
                        <span className="text-xs text-[#9E8C7C]">Inv #{c.invoiceNumber}</span>
                      </div>
                      <div className="text-xs text-[#D8C7B8] flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-[#F7F4F1]">{c.sellerName}</span>
                        <span className="text-[#9E8C7C] font-mono">&rarr;</span>
                        <span>{c.buyerName}</span>
                      </div>
                    </div>

                    {/* Amount & Telemetry */}
                    <div className="flex items-center gap-6 font-mono text-xs">
                      <div className="text-right min-w-[110px]">
                        <span className="font-bold text-[#F7F4F1] text-sm block">{formatCurrency(c.totalMinor, c.currency)}</span>
                        <span className="text-[10px] text-[#9E8C7C] block uppercase">{c.currency} Invoice</span>
                      </div>

                      {/* Telemetry Badges */}
                      <div className="flex items-center gap-2 bg-[#141211] p-2 rounded-xl border border-[#2E2A27]">
                        <div className="text-center px-1.5">
                          <span className="text-[9px] text-[#9E8C7C] block font-mono uppercase">Trust</span>
                          <span className={`font-mono font-extrabold ${trustTextColor}`}>{trustScore}</span>
                        </div>

                        <div className="w-12 h-1.5 bg-[#2E2A27] rounded-full overflow-hidden hidden md:block">
                          <span 
                            className={trustBarClass} 
                            style={{ width: `${Math.max(8, trustScore)}%` }}
                          />
                        </div>

                        <div className="text-center px-1.5 border-l border-[#2E2A27]">
                          <span className="text-[9px] text-[#9E8C7C] block font-mono uppercase">Conf</span>
                          <span className="font-mono text-[#D8C7B8]">{confidenceScore}%</span>
                        </div>

                        <div className="text-center px-1.5 border-l border-[#2E2A27]">
                          <span className="text-[9px] text-[#9E8C7C] block font-mono uppercase">Evid</span>
                          <span className={evidenceScore >= 75 ? 'text-[#10B981]' : 'text-[#F59E0B]'}>{evidenceScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-3">
                      {c.status === 'APPROVED' ? (
                        <span className="pill verified">Approved</span>
                      ) : c.status === 'REJECTED' ? (
                        <span className="pill risk">Rejected</span>
                      ) : c.status === 'EVIDENCE_REQUESTED' ? (
                        <span className="pill review">Evidence Needed</span>
                      ) : (
                        <span className="pill review">Needs Review</span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c.id);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#262320] border border-[#2E2A27] text-xs font-semibold text-[#F7F4F1] hover:border-[#6366F1] hover:text-[#6366F1] transition-all"
                      >
                        Inspect
                      </button>

                      <div className="text-[#9E8C7C] group-hover:text-[#F7F4F1] p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Drawer Details */}
                  {isExpanded && (
                    <div className="bg-[#181615] p-6 border-t border-[#2E2A27]">
                      <div className="space-y-5 bg-[#141211] p-6 rounded-2xl border border-[#2E2A27]">
                        
                        <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#2E2A27] pb-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F7F4F1]">
                              <FileText className="w-4 h-4 text-[#6366F1]" />
                              <span>Case {c.caseNumber} &middot; Evidence &amp; Confidence Telemetry</span>
                            </div>
                            <div className="text-xs text-[#9E8C7C] font-mono">
                              Model: {c.telemetry.modelVersion} &bull; Schema: {c.telemetry.featureSchemaVersion}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 font-mono text-xs">
                            <div className="bg-[#1C1917] px-4 py-2.5 rounded-xl border border-[#2E2A27]">
                              <span className="text-[10px] text-[#9E8C7C] block uppercase">Trust Score</span>
                              <strong className={trustTextColor}>{trustScore} / 100</strong>
                            </div>
                            <div className="bg-[#1C1917] px-4 py-2.5 rounded-xl border border-[#2E2A27]">
                              <span className="text-[10px] text-[#9E8C7C] block uppercase">Confidence Index</span>
                              <strong className="text-[#6366F1]">{confidenceScore}%</strong>
                            </div>
                            <div className="bg-[#1C1917] px-4 py-2.5 rounded-xl border border-[#2E2A27]">
                              <span className="text-[10px] text-[#9E8C7C] block uppercase">Evidence Completeness</span>
                              <strong className={evidenceScore >= 75 ? 'text-[#10B981]' : 'text-[#F59E0B]'}>{evidenceScore}%</strong>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                if (onRequestEvidence) onRequestEvidence(c);
                                else onSelectCase(c.id);
                              }}
                              className="px-4 py-2.5 rounded-xl bg-[#6366F1]/15 border border-[#6366F1]/40 text-[#6366F1] hover:bg-[#6366F1]/25 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                            >
                              <HelpCircle className="w-4 h-4 text-[#6366F1]" />
                              <span>Request Evidence</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (onExecuteDecision) onExecuteDecision(c.id, 'APPROVED');
                                else onSelectCase(c.id);
                              }}
                              className="px-4 py-2.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] hover:bg-[#10B981]/25 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                              <span>Approve Financing</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (onExecuteDecision) onExecuteDecision(c.id, 'REJECTED');
                                else onSelectCase(c.id);
                              }}
                              className="px-4 py-2.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] hover:bg-[#EF4444]/25 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                            >
                              <XCircle className="w-4 h-4 text-[#EF4444]" />
                              <span>Reject Financing</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onSelectCase(c.id)}
                            className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md cursor-pointer"
                          >
                            <span>Inspect Full Workspace</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </section>
  );
};
