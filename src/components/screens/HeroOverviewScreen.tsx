import React, { useState } from 'react';
import { InvoiceCase, TenantId, formatCurrency } from '../../types';
import { Inbox, UploadCloud, Search, RefreshCw, ChevronDown, ChevronUp, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [trustFilter, setTrustFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'TRUST_DESC' | 'TRUST_ASC' | 'AMOUNT_DESC' | 'DATE_DESC'>('TRUST_DESC');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  // All cases for active tenant
  const tenantCases = cases.filter(c => c.tenantId === activeTenantId);

  // Dynamic KPI Card derivation (derived from actual data array)
  const openCasesCount = tenantCases.filter(c => c.status === 'NEEDS_REVIEW' || c.status === 'EVIDENCE_REQUESTED').length;
  const highRiskCount = tenantCases.filter(c => c.telemetry.riskLevel === 'HIGH' || c.telemetry.riskLevel === 'CRITICAL').length;
  const evidenceGapCount = tenantCases.filter(c => c.telemetry.evidenceCompleteness < 75 || c.status === 'EVIDENCE_REQUESTED').length;

  // Filtered and Sorted Cases
  const filteredCases = tenantCases.filter(c => {
    const matchesSearch = 
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    
    let matchesTrust = true;
    if (trustFilter === 'LOW_0_40') matchesTrust = c.telemetry.trustScore <= 40;
    else if (trustFilter === 'MID_41_70') matchesTrust = c.telemetry.trustScore > 40 && c.telemetry.trustScore <= 70;
    else if (trustFilter === 'HIGH_71_100') matchesTrust = c.telemetry.trustScore > 70;

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
    setTrustFilter('ALL');
    setSortBy('TRUST_DESC');
  };

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const activeFiltersCount = (searchQuery ? 1 : 0) + (statusFilter !== 'ALL' ? 1 : 0) + (trustFilter !== 'ALL' ? 1 : 0);

  return (
    <>
      {/* Flat Graphite Page Header */}
      <div className="page-head">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F7F4F1] tracking-tight">Trust Operations Dashboard</h1>
          <p className="meta mt-1 text-xs text-[#9E8C7C]">
            {formattedDate} &middot; <strong className="text-[#6366F1]">
              {openCasesCount} {openCasesCount === 1 ? 'case requires' : 'cases require'} attention
            </strong>
          </p>
        </div>
        <div className="page-actions">
          <button 
            className="btn-secondary text-xs px-3.5 py-2 font-medium" 
            onClick={onNavigateToQueue}
            aria-label="Navigate to Full Review Queue"
          >
            Review Queue Directory
          </button>
          <button 
            className="btn-primary text-xs px-4 py-2 font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg flex items-center gap-2 transition-all duration-150" 
            onClick={onNavigateToUpload}
            aria-label="Upload New Invoice"
          >
            <UploadCloud className="w-4 h-4 text-white" /> Upload Invoice
          </button>
        </div>
      </div>

      {/* Dynamic KPI Cards Grid (Derived from Data Array) */}
      <dl className="kpi-grid">
        <div className="kpi bg-[#1C1917] border border-[#2E2A27] rounded-xl p-4 transition-all duration-150 hover:border-[#3A3532]">
          <dt className="text-[11px] font-mono font-bold text-[#9E8C7C] uppercase tracking-wider">Open Cases</dt>
          <dd className="text-2xl font-bold font-numeric text-[#F7F4F1] mt-1">{openCasesCount}</dd>
        </div>
        <div className="kpi bg-[#1C1917] border border-[#2E2A27] rounded-xl p-4 transition-all duration-150 hover:border-[#3A3532]">
          <dt className="text-[11px] font-mono font-bold text-[#9E8C7C] uppercase tracking-wider">High Risk Cases</dt>
          <dd className="text-2xl font-bold font-numeric text-[#EF4444] mt-1">{highRiskCount}</dd>
        </div>
        <div className="kpi bg-[#1C1917] border border-[#2E2A27] rounded-xl p-4 transition-all duration-150 hover:border-[#3A3532]">
          <dt className="text-[11px] font-mono font-bold text-[#9E8C7C] uppercase tracking-wider">Evidence Gap Count</dt>
          <dd className="text-2xl font-bold font-numeric text-[#F59E0B] mt-1">{evidenceGapCount}</dd>
        </div>
        <div className="kpi bg-[#1C1917] border border-[#2E2A27] rounded-xl p-4 transition-all duration-150 hover:border-[#3A3532]">
          <dt className="text-[11px] font-mono font-bold text-[#9E8C7C] uppercase tracking-wider">Verification Index</dt>
          <dd className="text-2xl font-bold font-numeric text-[#10B981] mt-1">91.4%</dd>
        </div>
      </dl>

      {/* Main Content Grid */}
      <div className="content-grid">
        
        {/* Priority Review Queue Section */}
        <section className="panel bg-[#1C1917] border border-[#2E2A27] rounded-xl overflow-hidden shadow-lg">
          
          <div className="panel-head flex items-center justify-between p-4 border-b border-[#2E2A27]">
            <div>
              <h2 className="text-sm font-bold text-[#F7F4F1] tracking-tight">Priority Review Queue</h2>
              <span className="text-[11px] text-[#9E8C7C] font-mono">Triage tool sorted by trust score & risk signals</span>
            </div>
            <button
              onClick={onNavigateToQueue}
              className="text-xs font-semibold text-[#6366F1] hover:underline bg-transparent border-0 cursor-pointer"
            >
              View directory &rarr;
            </button>
          </div>

          {/* Review Queue Triage Controls Bar */}
          <div className="p-3 bg-[#141211] border-b border-[#2E2A27] flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-3.5 h-3.5 text-[#9E8C7C] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case, seller, buyer..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#1C1917] border border-[#2E2A27] text-xs font-mono text-[#F7F4F1] placeholder-[#9E8C7C] outline-none focus:border-[#6366F1] transition-all"
                aria-label="Filter cases by search query"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-1.5 rounded-lg bg-[#1C1917] border border-[#2E2A27] text-xs font-mono text-[#D8C7B8] outline-none cursor-pointer focus:border-[#6366F1]"
                aria-label="Filter by case status"
              >
                <option value="ALL">Status: All</option>
                <option value="NEEDS_REVIEW">Status: Needs Review</option>
                <option value="EVIDENCE_REQUESTED">Status: Evidence Requested</option>
                <option value="APPROVED">Status: Approved</option>
                <option value="REJECTED">Status: Rejected</option>
              </select>

              <select
                value={trustFilter}
                onChange={(e) => setTrustFilter(e.target.value)}
                className="p-1.5 rounded-lg bg-[#1C1917] border border-[#2E2A27] text-xs font-mono text-[#D8C7B8] outline-none cursor-pointer focus:border-[#6366F1]"
                aria-label="Filter by trust band"
              >
                <option value="ALL">Trust: All Bands</option>
                <option value="HIGH_71_100">Green (71-100)</option>
                <option value="MID_41_70">Amber (41-70)</option>
                <option value="LOW_0_40">Red (0-40)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 rounded-lg bg-[#1C1917] border border-[#2E2A27] text-xs font-mono text-[#D8C7B8] outline-none cursor-pointer focus:border-[#6366F1]"
                aria-label="Sort queue order"
              >
                <option value="TRUST_DESC">Sort: Trust (High &rarr; Low)</option>
                <option value="TRUST_ASC">Sort: Trust (Low &rarr; High)</option>
                <option value="AMOUNT_DESC">Sort: Amount (High &rarr; Low)</option>
                <option value="DATE_DESC">Sort: Newest First</option>
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-2.5 py-1.5 rounded-lg bg-[#2E2A27] text-[#D8C7B8] hover:text-[#F7F4F1] hover:bg-[#3A3532] text-xs font-mono flex items-center gap-1 transition-all"
                  title="Reset active triage filters"
                >
                  <RefreshCw className="w-3 h-3" /> Reset ({activeFiltersCount})
                </button>
              )}
            </div>

          </div>

          {/* Queue Data Table & Empty State */}
          {filteredCases.length === 0 ? (
            <div className="p-10 text-center space-y-3 bg-[#141211]">
              <Inbox className="w-8 h-8 text-[#9E8C7C] mx-auto opacity-80" />
              <p className="text-xs text-[#D8C7B8]">No cases match the selected filter criteria.</p>
              <button 
                onClick={clearFilters} 
                className="btn-secondary text-xs px-3 py-1.5 border border-[#2E2A27] rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#141211] text-[#9E8C7C] font-mono text-[11px] border-b border-[#2E2A27]">
                    <th className="p-3 font-bold uppercase">Case Reference</th>
                    <th className="p-3 font-bold uppercase">Seller &rarr; Buyer</th>
                    <th className="p-3 font-bold uppercase text-right">Invoice Amount</th>
                    <th className="p-3 font-bold uppercase text-center">Trust Score</th>
                    <th className="p-3 font-bold uppercase text-center">Confidence</th>
                    <th className="p-3 font-bold uppercase text-center">Evidence</th>
                    <th className="p-3 font-bold uppercase">Status</th>
                    <th className="p-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2A27]">
                  {filteredCases.map((c) => {
                    const isExpanded = expandedCaseId === c.id;
                    const trustScore = c.telemetry.trustScore;
                    const confidenceScore = c.telemetry.confidenceScore;
                    const evidenceScore = c.telemetry.evidenceCompleteness;

                    // Length-proportional & semantically color-coded trust bar
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
                          onClick={() => setExpandedCaseId(isExpanded ? null : c.id)} 
                          className="hover:bg-[#262320] transition-all duration-150 cursor-pointer group"
                        >
                          <td className="p-3 font-mono">
                            <span className="font-bold text-[#F7F4F1] group-hover:text-[#6366F1] transition-colors">{c.caseNumber}</span>
                            <span className="block text-[11px] text-[#9E8C7C] mt-0.5">Inv #{c.invoiceNumber}</span>
                          </td>

                          <td className="p-3 text-xs text-[#D8C7B8]">
                            <span className="font-medium text-[#F7F4F1]">{c.sellerName}</span>
                            <span className="block text-[11px] text-[#9E8C7C] mt-0.5">&rarr; {c.buyerName}</span>
                          </td>

                          <td className="p-3 text-right font-mono font-bold text-[#F7F4F1]">
                            {formatCurrency(c.totalMinor, c.currency)}
                          </td>

                          {/* 1. Trust Score Metric (Length-proportional & Semantically Color-coded) */}
                          <td className="p-3 text-center">
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
                          <td className="p-3 text-center font-mono text-xs text-[#D8C7B8]">
                            <span className="bg-[#2E2A27] px-2 py-0.5 rounded border border-[#3A3532]">
                              {confidenceScore}%
                            </span>
                          </td>

                          {/* 3. Evidence Completeness Metric */}
                          <td className="p-3 text-center font-mono text-xs text-[#D8C7B8]">
                            <span className={`px-2 py-0.5 rounded border ${
                              evidenceScore >= 80 ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30' :
                              evidenceScore >= 60 ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30' :
                              'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
                            }`}>
                              {evidenceScore}%
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="p-3">
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

                          {/* Action Button */}
                          <td className="p-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCase(c.id);
                              }}
                              className="px-2.5 py-1 rounded bg-[#262320] border border-[#2E2A27] text-xs font-semibold text-[#F7F4F1] hover:border-[#6366F1] hover:text-[#6366F1] transition-all"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>

                        {/* Inline Row Expansion Quick Preview Panel */}
                        {isExpanded && (
                          <tr className="bg-[#181615]">
                            <td colSpan={8} className="p-4 border-b border-[#2E2A27]">
                              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141211] p-3.5 rounded-xl border border-[#2E2A27]">
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F7F4F1]">
                                    <FileText className="w-4 h-4 text-[#6366F1]" />
                                    <span>Case {c.caseNumber} Telemetry Breakdown</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs font-mono text-[#D8C7B8]">
                                    <span>Model Version: <strong className="text-[#F7F4F1]">{c.telemetry.modelVersion}</strong></span>
                                    <span>Risk Level: <strong className={c.telemetry.riskLevel === 'CRITICAL' || c.telemetry.riskLevel === 'HIGH' ? 'text-[#EF4444]' : 'text-[#10B981]'}>{c.telemetry.riskLevel}</strong></span>
                                  </div>
                                </div>

                                {/* Triple Metrics Preview Pills */}
                                <div className="flex items-center gap-3 font-mono text-xs">
                                  <div className="bg-[#1C1917] px-3 py-1.5 rounded-lg border border-[#2E2A27]">
                                    <span className="text-[10px] text-[#9E8C7C] block uppercase">Trust Score</span>
                                    <strong className={trustTextColor}>{trustScore} / 100</strong>
                                  </div>
                                  <div className="bg-[#1C1917] px-3 py-1.5 rounded-lg border border-[#2E2A27]">
                                    <span className="text-[10px] text-[#9E8C7C] block uppercase">Confidence Index</span>
                                    <strong className="text-[#6366F1]">{confidenceScore}%</strong>
                                  </div>
                                  <div className="bg-[#1C1917] px-3 py-1.5 rounded-lg border border-[#2E2A27]">
                                    <span className="text-[10px] text-[#9E8C7C] block uppercase">Evidence Completeness</span>
                                    <strong className={evidenceScore >= 75 ? 'text-[#10B981]' : 'text-[#F59E0B]'}>{evidenceScore}%</strong>
                                  </div>
                                </div>

                                <button
                                  onClick={() => onSelectCase(c.id)}
                                  className="btn-primary text-xs px-3.5 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg flex items-center gap-1.5"
                                >
                                  <span>Open Full Workspace</span> &rarr;
                                </button>
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

        </section>

        {/* System Trust Health Sidebar Panel */}
        <aside className="panel bg-[#1C1917] border border-[#2E2A27] rounded-xl overflow-hidden shadow-lg">
          <div className="panel-head flex items-center justify-between p-4 border-b border-[#2E2A27]">
            <h2 className="text-sm font-bold text-[#F7F4F1]">System Trust Health</h2>
            <span className="pill verified">Operational</span>
          </div>

          <div className="health-body p-4 space-y-4">
            <div>
              <div className="health-score flex items-baseline justify-between">
                <span className="num mono text-2xl font-bold text-[#F7F4F1]">91.4%</span>
                <span className="text-xs text-[#9E8C7C]">Global Verification Index</span>
              </div>
              <div className="health-track mt-2 h-1.5 bg-[#2E2A27] rounded-full overflow-hidden">
                <span className="bg-[#10B981] h-full block" style={{ width: '91.4%' }}></span>
              </div>
            </div>

            <div className="events space-y-2.5 pt-2 border-t border-[#2E2A27]">
              <h3 className="text-[11px] font-mono font-bold text-[#9E8C7C] uppercase tracking-wider">
                Recent Verification Events
              </h3>
              
              <div className="event flex items-center justify-between text-xs py-1.5 border-b border-[#2E2A27]/50">
                <div>
                  <div className="font-mono font-bold text-[#F7F4F1]">VRT-28491</div>
                  <div className="text-[11px] text-[#9E8C7C]">OCR & Tax ID match verified</div>
                </div>
                <span className="pill verified">Verified</span>
              </div>

              <div className="event flex items-center justify-between text-xs py-1.5 border-b border-[#2E2A27]/50">
                <div>
                  <div className="font-mono font-bold text-[#F7F4F1]">VRT-28492</div>
                  <div className="text-[11px] text-[#9E8C7C]">Payment delay flag raised</div>
                </div>
                <span className="pill review">Flagged</span>
              </div>

              <div className="event flex items-center justify-between text-xs py-1.5">
                <div>
                  <div className="font-mono font-bold text-[#F7F4F1]">VRT-28497</div>
                  <div className="text-[11px] text-[#9E8C7C]">Buyer confirmation pending</div>
                </div>
                <span className="pill review">Pending</span>
              </div>

            </div>
          </div>
        </aside>

      </div>
    </>
  );
};
