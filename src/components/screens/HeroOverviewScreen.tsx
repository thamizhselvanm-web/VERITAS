import React from 'react';
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
    <>
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Trust Operations</h1>
          <p className="meta">
            Tuesday, 25 August 2026 · <strong>{openCasesCount || 12} cases</strong> require attention
          </p>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={onNavigateToQueue}>Review Queue</button>
          <button className="btn primary" onClick={onNavigateToUpload}>Upload Invoice</button>
        </div>
      </div>

      {/* KPI Grid */}
      <dl className="kpi-grid">
        <div className="kpi">
          <dt>Open Cases</dt>
          <dd>{openCasesCount || 12}</dd>
        </div>
        <div className="kpi">
          <dt>High Risk</dt>
          <dd className="risk">{highRiskCount || 3}</dd>
        </div>
        <div className="kpi">
          <dt>Evidence Gap</dt>
          <dd className="review">{evidenceGapCount || 5}</dd>
        </div>
        <div className="kpi">
          <dt>Avg. Review Time</dt>
          <dd className="verified">4.2m</dd>
        </div>
      </dl>

      {/* Main Content Grid */}
      <div className="content-grid">
        
        {/* Priority Review Queue Table */}
        <section className="panel">
          <div className="panel-head">
            <h2>Priority review queue</h2>
            <button
              onClick={onNavigateToQueue}
              className="bg-transparent border-0 text-xs font-semibold cursor-pointer"
              style={{ color: 'var(--accent)' }}
            >
              View all →
            </button>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Case</th>
                <th>Seller → Buyer</th>
                <th>Amount</th>
                <th>Trust</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tenantCases.map((c) => (
                <tr key={c.id} onClick={() => onSelectCase(c.id)} className="cursor-pointer">
                  <td className="case-id">
                    {c.caseNumber}
                    <span>Invoice {c.invoiceNumber}</span>
                  </td>
                  <td>{c.sellerName} → {c.buyerName}</td>
                  <td className="amount mono">
                    ${(c.totalMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <div className="trust-cell">
                      <span className="mono">{c.telemetry.trustScore}</span>
                      <span className="bar">
                        <span style={{ width: `${c.telemetry.trustScore}%` }}></span>
                      </span>
                    </div>
                  </td>
                  <td>
                    {c.telemetry.recommendation === 'APPROVE_RECOMMENDATION' ? (
                      <span className="pill verified">Approved</span>
                    ) : c.telemetry.recommendation === 'MANUAL_REVIEW' ? (
                      <span className="pill review">Manual review</span>
                    ) : (
                      <span className="pill risk">High risk</span>
                    )}
                  </td>
                  <td className="row-action">
                    <button onClick={(e) => { e.stopPropagation(); onSelectCase(c.id); }}>Open</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* System Trust Health Sidebar */}
        <aside className="panel">
          <div className="panel-head">
            <h2>System trust health</h2>
            <span className="pill verified">Operational</span>
          </div>

          <div className="health-body">
            <div>
              <div className="health-score">
                <span className="num mono">91.4%</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Verification index</span>
              </div>
              <div className="health-track" style={{ marginTop: '10px' }}>
                <span style={{ width: '91.4%' }}></span>
              </div>
            </div>

            <div className="events">
              <h3>Recent verification events</h3>
              <div className="event">
                <div>
                  <div className="id">VRT-28491</div>
                  <div className="desc">OCR & tax match confirmed</div>
                </div>
                <span className="status verified">Verified</span>
              </div>
              <div className="event">
                <div>
                  <div className="id">VRT-28492</div>
                  <div className="desc">Payment delay flag raised</div>
                </div>
                <span className="status review">Review</span>
              </div>
              <div className="event">
                <div>
                  <div className="id">VRT-28497</div>
                  <div className="desc">Buyer confirmation pending</div>
                </div>
                <span className="status review">Review</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </>
  );
};
