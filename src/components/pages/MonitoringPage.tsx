import React, { useState } from 'react';
import { Radio, Play, Zap, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MonitoringEventType, InvoiceCase } from '../../types';

interface MonitoringPageProps {
  cases: InvoiceCase[];
  activeCaseId: string;
  onTriggerEvent: (eventType: MonitoringEventType, caseId: string) => void;
}

export const MonitoringPage: React.FC<MonitoringPageProps> = ({
  cases,
  activeCaseId,
  onTriggerEvent
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCaseId || cases[0]?.id);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const handleSimulate = (eventType: MonitoringEventType, label: string) => {
    onTriggerEvent(eventType, selectedCaseId);
    setToastMessage(`Continuous Risk Event Ingested: ${label}. Recalculated Trust Profile version generated.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363D] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-[#3FB950] animate-pulse" />
            Continuous Risk Monitoring Engine
          </h1>
          <p className="text-xs text-[#8B949E] font-mono mt-1">
            Real-time trust recalculation on payment delays, duplicate discoveries, or buyer confirmations.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded bg-[#238636]/20 border border-[#238636] text-[#3FB950] text-xs font-mono flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#3FB950]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Target Case Selector (4 cols) */}
        <div className="lg:col-span-4 inst-card p-5 border border-[#30363D] space-y-4">
          <h3 className="font-bold text-white text-sm">Target Monitoring Case</h3>

          <div className="space-y-2">
            {cases.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-3 rounded border cursor-pointer transition-colors text-xs ${
                  selectedCaseId === c.id
                    ? 'bg-[#21262D] border-blue-500 text-white font-bold'
                    : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono">{c.caseNumber}</span>
                  <span className="font-mono text-white font-numeric">Trust: {c.telemetry.trustScore}</span>
                </div>
                <p className="text-[11px] text-[#8B949E] mt-0.5">{c.sellerName} &rarr; {c.buyerName}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Event Trigger Dispatcher per TRD Sec 15 (8 cols) */}
        <div className="lg:col-span-8 inst-card p-6 border border-[#30363D] space-y-6">
          
          <div className="flex justify-between items-center border-b border-[#30363D] pb-3.5">
            <div>
              <h3 className="font-bold text-white text-sm">Ingest Simulated Market & Ledger Events</h3>
              <p className="text-xs text-[#8B949E] mt-0.5 font-mono">Selected: {activeCase?.caseNumber}</p>
            </div>

            <span className="inst-badge inst-badge-info font-mono">
              Trust Score: {activeCase?.telemetry.trustScore}/100
            </span>
          </div>

          {/* Event Dispatchers per TRD Sec 15 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            
            <button
              onClick={() => handleSimulate('PAYMENT_DELAYED', 'PAYMENT_DELAYED (+30 Days Overdue)')}
              className="p-4 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#D29922] text-left space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#D29922] flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" /> PAYMENT_DELAYED
                </span>
                <Play className="w-3.5 h-3.5 text-[#D29922]" />
              </div>
              <p className="text-[11px] text-[#8B949E]">Degrades Behaviour sub-score by -35 penalty.</p>
            </button>

            <button
              onClick={() => handleSimulate('DUPLICATE_DISCOVERED', 'DUPLICATE_DISCOVERED (Cross-Lender Match)')}
              className="p-4 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#F85149] text-left space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F85149] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> DUPLICATE_DISCOVERED
                </span>
                <Play className="w-3.5 h-3.5 text-[#F85149]" />
              </div>
              <p className="text-[11px] text-[#8B949E]">Triggers Duplicate Fraud Signal (-60 score penalty).</p>
            </button>

            <button
              onClick={() => handleSimulate('BUYER_CONFIRMED', 'BUYER_CONFIRMED (ERP Verification Received)')}
              className="p-4 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#3FB950] text-left space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#3FB950] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> BUYER_CONFIRMED
                </span>
                <Play className="w-3.5 h-3.5 text-[#3FB950]" />
              </div>
              <p className="text-[11px] text-[#8B949E]">Boosts Relationship & Evidence Completeness (+15).</p>
            </button>

            <button
              onClick={() => handleSimulate('PAYMENT_RECEIVED', 'PAYMENT_RECEIVED (Bank Wire Cleared)')}
              className="p-4 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#3FB950] text-left space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#3FB950] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> PAYMENT_RECEIVED
                </span>
                <Play className="w-3.5 h-3.5 text-[#3FB950]" />
              </div>
              <p className="text-[11px] text-[#8B949E]">Closes invoice financing lifecycle successfully.</p>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
