import React, { useState } from 'react';
import { InvoiceCase, TenantId, CaseStatus, formatCurrency } from '../../types';
import { Inbox, UploadCloud, Search, RefreshCw, FileText, CheckCircle2, XCircle, HelpCircle, ArrowRight, Activity, ShieldAlert, FileQuestion, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { VeritasLogo } from '../common/VeritasLogo';

interface HeroOverviewScreenProps {
  cases: InvoiceCase[];
  activeTenantId: TenantId;
  onNavigateToQueue: () => void;
  onNavigateToUpload: () => void;
  onSelectCase: (id: string) => void;
  onRequestEvidence?: (c: InvoiceCase) => void;
  onExecuteDecision?: (caseId: string, status: CaseStatus) => void;
}

export const HeroOverviewScreen: React.FC<HeroOverviewScreenProps> = ({
  cases,
  activeTenantId,
  onNavigateToQueue,
  onNavigateToUpload,
  onSelectCase,
  onRequestEvidence,
  onExecuteDecision
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [trustFilter, setTrustFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'TRUST_DESC' | 'TRUST_ASC' | 'AMOUNT_DESC' | 'DATE_DESC'>('TRUST_DESC');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  // All cases for active tenant
  const tenantCases = cases.filter(c => c.tenantId === activeTenantId);

  // Dynamic KPI Card derivation
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
    <div className="space-y-10 font-sans max-w-7xl mx-auto pb-8 overflow-x-hidden">
      
      {/* Rule 3: Flat --surface-page Header with Zero Glow / Gradients */}
      <header className="flex flex-wrap items-center justify-between gap-6 border-b border-[#2E2A27] pb-6 bg-[#141211]">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F7F4F1] tracking-tight">
            Trust Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#9E8C7C] font-mono">
            {formattedDate} &bull; <strong className="text-[#6366F1]">
              {openCasesCount} {openCasesCount === 1 ? 'case requires' : 'cases require'} immediate underwriter triage
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-3.5">
          <button 
            className="px-4 py-3 text-xs font-semibold border border-[#2E2A27] bg-[#262320] text-[#F7F4F1] rounded-xl hover:border-[#6366F1] transition-all" 
            onClick={onNavigateToQueue}
            aria-label="Navigate to Full Review Queue"
          >
            Review Queue Directory
          </button>
          
          {/* Rule 2: Primary Button uses --action-primary (#4F46E5), Zero Orange */}
          <button 
            className="px-5 py-3 text-xs font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer" 
            onClick={onNavigateToUpload}
            aria-label="Upload New Invoice"
          >
            <UploadCloud className="w-4 h-4 text-white" /> Upload New Invoice
          </button>
        </div>
      </header>

      {/* Dynamic KPI Cards Grid */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Open Cases (Rule 6: text-primary) */}
        <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-6.5 space-y-3 shadow-md hover:border-[#3A3532] transition-all">
          <div className="flex items-center justify-between">
            <dt className="text-[11px] font-mono font-bold text-[#9E8C7C] uppercase tracking-wider">Open Cases</dt>
            <div className="p-2 rounded-xl bg-[#6366F1]/10 text-[#6366F1]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <dd className="text-4xl font-extrabold font-numeric text-[#F7F4F1] tracking-tight">{openCasesCount}</dd>
          <p className="text-[11px] text-[#9E8C7C] font-mono">Requires decision execution</p>
        </div>

        {/* KPI 2: High Risk Cases (Rule 6: status-risk-text #DC2626) */}
        <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-6.5 space-y-3 shadow-md hover:border-[#3A3532] transition-all">
          <div className="flex items-center justify-between">
            <dt className="text-[11px] font-mono font-bold text-[#9E8C7C] uppercase tracking-wider">High Risk Cases</dt>
            <div className="p-2 rounded-xl bg-[#EF4444]/10 text-[#EF4444]">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <dd className="text-4xl font-extrabold font-numeric text-[#DC2626] tracking-tight">{highRiskCount}</dd>
          <p className="text-[11px] text-[#9E8C7C] font-mono">Telemetry risk level &ge; High</p>
        </div>

        {/* KPI 3: Evidence Gaps (Rule 6: text-primary) */}
        <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-6.5 space-y-3 shadow-md hover:border-[#3A3532] transition-all">
          <div className="flex items-center justify-between">
            <dt className="text-[11px] font-mono font-bold text-[#9E8C7C] uppercase tracking-wider">Evidence Gaps</dt>
            <div className="p-2 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
              <FileQuestion className="w-4 h-4" />
            </div>
          </div>
          <dd className="text-4xl font-extrabold font-numeric text-[#F7F4F1] tracking-tight">{evidenceGapCount}</dd>
          <p className="text-[11px] text-[#9E8C7C] font-mono">Completeness &lt; 75% or pending doc</p>
        </div>

        {/* KPI 4: Verification Index (Rule 6: text-primary) */}
        <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-6.5 space-y-3 shadow-md hover:border-[#3A3532] transition-all">
          <div className="flex items-center justify-between">
            <dt className="text-[11px] font-mono font-bold text-[#9E8C7C] uppercase tracking-wider">Verification Index</dt>
            <div className="p-2 rounded-xl bg-[#10B981]/10 text-[#10B981]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <dd className="text-4xl font-extrabold font-numeric text-[#F7F4F1] tracking-tight">91.4%</dd>
          <p className="text-[11px] text-[#9E8C7C] font-mono">Continuous model accuracy</p>
        </div>

      </dl>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start overflow-hidden">
        
        {/* Priority Review Queue Section (2 cols) */}
        <section className="lg:col-span-2 bg-[#1C1917] border border-[#2E2A27] rounded-2xl overflow-hidden shadow-xl w-full">
          
          {/* Section Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#2E2A27]">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-[#F7F4F1] tracking-tight">Priority Review Queue</h2>
              <p className="text-xs text-[#9E8C7C] font-mono">Triage directory sorted by continuous trust score and risk signals</p>
            </div>
            <button
              onClick={onNavigateToQueue}
              className="text-xs font-semibold text-[#6366F1] hover:underline bg-transparent border-0 cursor-pointer"
            >
              View directory &rarr;
            </button>
          </div>

          {/* Triage Controls Bar */}
          <div className="p-5 bg-[#141211] border-b border-[#2E2A27] flex flex-wrap items-center justify-between gap-4 text-xs">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-[#9E8C7C] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case, seller, buyer..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1C1917] border border-[#2E2A27] text-xs font-mono text-[#F7F4F1] placeholder-[#9E8C7C] outline-none focus:border-[#6366F1] transition-all"
                aria-label="Filter cases by search query"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2.5 px-3 rounded-xl bg-[#1C1917] border border-[#2E2A27] text-xs font-mono text-[#D8C7B8] outline-none cursor-pointer focus:border-[#6366F1]"
                aria-label="Filter by case status"
              >
                <option value="ALL">Status: All</option>
                <option value="NEEDS_REVIEW">Needs Review</option>
                <option value="EVIDENCE_REQUESTED">Evidence Requested</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={trustFilter}
                onChange={(e) => setTrustFilter(e.target.value)}
                className="py-2.5 px-3 rounded-xl bg-[#1C1917] border border-[#2E2A27] text-xs font-mono text-[#D8C7B8] outline-none cursor-pointer focus:border-[#6366F1]"
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
                className="py-2.5 px-3 rounded-xl bg-[#1C1917] border border-[#2E2A27] text-xs font-mono text-[#D8C7B8] outline-none cursor-pointer focus:border-[#6366F1]"
                aria-label="Sort queue order"
              >
                <option value="TRUST_DESC">Sort: Trust &darr;</option>
                <option value="TRUST_ASC">Sort: Trust &uarr;</option>
                <option value="AMOUNT_DESC">Sort: Amount &darr;</option>
                <option value="DATE_DESC">Sort: Newest</option>
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="py-2.5 px-3.5 rounded-xl bg-[#262320] border border-[#2E2A27] text-[#D8C7B8] hover:text-[#F7F4F1] text-xs font-mono flex items-center gap-1.5 transition-all"
                  title="Reset active triage filters"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset ({activeFiltersCount})
                </button>
              )}
            </div>

          </div>

          {/* Perfect Fit Container - ZERO Horizontal Scroll */}
          {filteredCases.length === 0 ? (
            <div className="p-14 text-center space-y-4 bg-[#141211]">
              <Inbox className="w-12 h-12 text-[#9E8C7C] mx-auto opacity-75" />
              <p className="text-sm text-[#D8C7B8]">No cases match the selected triage criteria.</p>
              <button 
                onClick={clearFilters} 
                className="px-4 py-2 border border-[#2E2A27] bg-[#262320] text-[#F7F4F1] rounded-xl text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="w-full overflow-hidden divide-y divide-[#2E2A27]">
              {filteredCases.map((c) => {
                const isExpanded = expandedCaseId === c.id;
                const trustScore = c.telemetry.trustScore;
                const confidenceScore = c.telemetry.confidenceScore;
                const evidenceScore = c.telemetry.evidenceCompleteness;

                {/* Rule 4: Dynamic Trust Score Band Colors (0-40 Red, 41-70 Amber, 71-100 Green) */}
                const trustBarClass = 
                  trustScore <= 40 ? 'bg-[#EF4444]' : 
                  trustScore <= 70 ? 'bg-[#F59E0B]' : 
                  'bg-[#10B981]';

                {/* Rule 4: Same color applied to adjacent numeric score for redundant signaling */}
                const trustTextColor = 
                  trustScore <= 40 ? 'text-[#DC2626]' : 
                  trustScore <= 70 ? 'text-[#D97706]' : 
                  'text-[#059669]';

                return (
                  <div key={c.id} className="w-full">
                    {/* Compact Responsively Fitted Row Block */}
                    <div 
                      onClick={() => setExpandedCaseId(isExpanded ? null : c.id)} 
                      className="p-5 hover:bg-[#262320] transition-all duration-150 cursor-pointer flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 group"
                    >
                      {/* Left: Case Reference & Entity Pair */}
                      <div className="space-y-1 min-w-[200px] flex-1">
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

                      {/* Middle: Amount & Trust Telemetry */}
                      <div className="flex items-center gap-5 sm:gap-6 font-mono text-xs">
                        {/* Amount */}
                        <div className="text-right min-w-[100px]">
                          <span className="font-bold text-[#F7F4F1] text-sm block">{formatCurrency(c.totalMinor, c.currency)}</span>
                          <span className="text-[10px] text-[#9E8C7C] block uppercase">{c.currency} Invoice</span>
                        </div>

                        {/* Combined Trust Telemetry Pill */}
                        <div className="flex items-center gap-2 bg-[#141211] p-2 rounded-xl border border-[#2E2A27]">
                          <div className="text-center px-1">
                            <span className="text-[9px] text-[#9E8C7C] block font-mono uppercase">Trust</span>
                            <span className={`font-mono font-extrabold ${trustTextColor}`}>{trustScore}</span>
                          </div>

                          <div className="w-12 h-1.5 bg-[#2E2A27] rounded-full overflow-hidden hidden md:block">
                            <span 
                              className={`h-full block rounded-full ${trustBarClass}`} 
                              style={{ width: `${Math.max(8, trustScore)}%` }}
                            />
                          </div>

                          <div className="text-center px-1 border-l border-[#2E2A27]">
                            <span className="text-[9px] text-[#9E8C7C] block font-mono uppercase">Conf</span>
                            <span className="font-mono text-[#D8C7B8]">{confidenceScore}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Status Badge (Rule 5: Tinted Fill & Dark Saturated Text Pairs) */}
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

                    {/* Inline Row Expansion Quick Preview & Action Buttons */}
                    {isExpanded && (
                      <div className="bg-[#181615] p-6 border-t border-[#2E2A27]">
                        <div className="space-y-5 bg-[#141211] p-6 rounded-2xl border border-[#2E2A27]">
                          
                          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#2E2A27] pb-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F7F4F1]">
                                <FileText className="w-4 h-4 text-[#6366F1]" />
                                <span>Case {c.caseNumber} &middot; Evidence &amp; Confidence Telemetry</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs font-mono text-[#9E8C7C]">
                                <span>Model: <strong className="text-[#F7F4F1]">{c.telemetry.modelVersion}</strong></span>
                                <span>Risk Severity: <strong className={c.telemetry.riskLevel === 'CRITICAL' || c.telemetry.riskLevel === 'HIGH' ? 'text-[#DC2626]' : 'text-[#059669]'}>{c.telemetry.riskLevel}</strong></span>
                              </div>
                            </div>

                            {/* Triple Metrics Preview Pills */}
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
                                <strong className={evidenceScore >= 75 ? 'text-[#059669]' : 'text-[#D97706]'}>{evidenceScore}%</strong>
                              </div>
                            </div>
                          </div>

                          {/* Integrated Interactive Action Buttons Grid */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              {/* Action 1: Request Evidence */}
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

                              {/* Action 2: Approve Financing */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (onExecuteDecision) onExecuteDecision(c.id, 'APPROVED');
                                  else onSelectCase(c.id);
                                }}
                                className="px-4 py-2.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#059669] hover:bg-[#10B981]/25 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
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
                                className="px-4 py-2.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#DC2626] hover:bg-[#EF4444]/25 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                              >
                                <XCircle className="w-4 h-4 text-[#EF4444]" />
                                <span>Reject Financing</span>
                              </button>
                            </div>

                            {/* Action 4: Open Full Workspace */}
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

        </section>

        {/* System Trust Health Sidebar Panel */}
        <aside className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl overflow-hidden shadow-xl space-y-0 w-full">
          
          <div className="flex items-center justify-between p-6 border-b border-[#2E2A27]">
            <h2 className="text-base font-extrabold text-[#F7F4F1]">System Trust Health</h2>
            <span className="pill verified">Operational</span>
          </div>

          <div className="p-6.5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-4xl font-extrabold font-numeric text-[#F7F4F1]">91.4%</span>
                <span className="text-xs text-[#9E8C7C]">Global Verification Index</span>
              </div>
              <div className="h-2.5 bg-[#2E2A27] rounded-full overflow-hidden">
                <span className="bg-[#10B981] h-full block rounded-full" style={{ width: '91.4%' }}></span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#2E2A27]">
              <h3 className="text-[11px] font-mono font-bold text-[#9E8C7C] uppercase tracking-wider">
                Recent Verification Events
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-2.5 border-b border-[#2E2A27]/50">
                  <div className="space-y-0.5">
                    <div className="font-mono font-bold text-[#F7F4F1]">VRT-28491</div>
                    <div className="text-[11px] text-[#9E8C7C]">OCR &amp; Tax ID match verified</div>
                  </div>
                  <span className="pill verified">Verified</span>
                </div>

                <div className="flex items-center justify-between text-xs py-2.5 border-b border-[#2E2A27]/50">
                  <div className="space-y-0.5">
                    <div className="font-mono font-bold text-[#F7F4F1]">VRT-28492</div>
                    <div className="text-[11px] text-[#9E8C7C]">Payment delay flag raised</div>
                  </div>
                  <span className="pill review">Flagged</span>
                </div>

                <div className="flex items-center justify-between text-xs py-2.5">
                  <div className="space-y-0.5">
                    <div className="font-mono font-bold text-[#F7F4F1]">VRT-28497</div>
                    <div className="text-[11px] text-[#9E8C7C]">Buyer confirmation pending</div>
                  </div>
                  <span className="pill review">Pending</span>
                </div>
              </div>

            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};
