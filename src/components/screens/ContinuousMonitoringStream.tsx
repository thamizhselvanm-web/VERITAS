import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Pause, Play, Zap, AlertTriangle, TrendingDown, ShieldCheck, Clock } from 'lucide-react';
import { MonitoringEventType, InvoiceCase } from '../../types';

interface StreamItem {
  id: string;
  timestamp: string;
  title: string;
  entity: string;
  detail: string;
  type: MonitoringEventType;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

interface ContinuousMonitoringStreamProps {
  cases: InvoiceCase[];
  onTriggerEvent: (eventType: MonitoringEventType, caseId: string) => void;
}

export const ContinuousMonitoringStream: React.FC<ContinuousMonitoringStreamProps> = ({
  cases,
  onTriggerEvent
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [streamItems, setStreamItems] = useState<StreamItem[]>([
    { id: '1', timestamp: '12:42:04', title: 'New Invoice Submission Ingested', entity: 'Acme Components Ltd', detail: 'Total Amount: ₹5,00,000.00', type: 'NEW_INVOICE', severity: 'INFO' },
    { id: '2', timestamp: '12:42:06', title: 'Duplicate Similarity Alert Flagged', entity: 'INV-1024 vs INV-984', detail: '94.2% fuzzy match detected', type: 'DUPLICATE_DISCOVERED', severity: 'WARNING' },
    { id: '3', timestamp: '12:42:08', title: 'Behavior Anomaly Amount Deviation', entity: 'Acme Components Ltd', detail: '18.7× historical relationship median', type: 'PAYMENT_DELAYED', severity: 'CRITICAL' },
    { id: '4', timestamp: '12:42:10', title: 'Recommendation Generated', entity: 'Case VRT-28491', detail: 'MANUAL REVIEW REQUIRED', type: 'BUYER_CONFIRMED', severity: 'WARNING' }
  ]);

  const handleInjectEvent = (type: MonitoringEventType, label: string) => {
    const timeStr = new Date().toLocaleTimeString();
    const newItem: StreamItem = {
      id: `stream-${Date.now()}`,
      timestamp: timeStr,
      title: label,
      entity: cases[0]?.sellerName || 'Acme Components',
      detail: 'Recalculated Trust Profile version sealed to audit ledger.',
      type,
      severity: type === 'DUPLICATE_DISCOVERED' ? 'CRITICAL' : type === 'PAYMENT_DELAYED' ? 'WARNING' : 'INFO'
    };

    setStreamItems(prev => [newItem, ...prev]);
    onTriggerEvent(type, cases[0]?.id || 'case-vrt-28491');
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Header per Brief Sec 15 */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5 font-mono">
            <Radio className="w-6 h-6 text-[#3FB950] animate-pulse" />
            VERITAS LIVE — Continuous Risk Monitoring Stream
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            Real-time trust recalculation on payment delays, duplicate discoveries, or ERP confirmations.
          </p>
        </div>

        {/* Pause Control per Brief Sec 15 */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`btn-spatial-secondary text-xs ${isPaused ? 'bg-amber-500/20 text-[#D29922]' : ''}`}
        >
          {isPaused ? <Play className="w-4 h-4 text-[#D29922]" /> : <Pause className="w-4 h-4 text-[#00F0FF]" />}
          {isPaused ? 'Resume Stream' : 'Pause Stream'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Event Triggers (4 cols) */}
        <div className="lg:col-span-4 spatial-panel p-5 border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-sm">Inject Market Events</h3>

          <div className="space-y-2 text-xs">
            <button
              onClick={() => handleInjectEvent('PAYMENT_DELAYED', 'PAYMENT_DELAYED (+30 Days Overdue)')}
              className="w-full p-3 rounded-lg bg-[#05070B] border border-white/10 hover:border-[#D29922] text-left flex items-center justify-between transition-all"
            >
              <span className="font-bold text-[#D29922]">PAYMENT_DELAYED</span>
              <Play className="w-3.5 h-3.5 text-[#D29922]" />
            </button>

            <button
              onClick={() => handleInjectEvent('DUPLICATE_DISCOVERED', 'DUPLICATE_DISCOVERED (Cross-Lender Match)')}
              className="w-full p-3 rounded-lg bg-[#05070B] border border-white/10 hover:border-[#F85149] text-left flex items-center justify-between transition-all"
            >
              <span className="font-bold text-[#F85149]">DUPLICATE_DISCOVERED</span>
              <Play className="w-3.5 h-3.5 text-[#F85149]" />
            </button>

            <button
              onClick={() => handleInjectEvent('BUYER_CONFIRMED', 'BUYER_CONFIRMED (ERP Verification)')}
              className="w-full p-3 rounded-lg bg-[#05070B] border border-white/10 hover:border-[#3FB950] text-left flex items-center justify-between transition-all"
            >
              <span className="font-bold text-[#3FB950]">BUYER_CONFIRMED</span>
              <Play className="w-3.5 h-3.5 text-[#3FB950]" />
            </button>
          </div>
        </div>

        {/* Right Live Stream Ticker per Brief Sec 15 (8 cols) */}
        <div className="lg:col-span-8 spatial-panel p-6 border border-white/10 space-y-4 min-h-[460px]">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
              Live Stream Feed ({streamItems.length} Events)
            </span>
            <span className="spatial-badge spatial-badge-verified text-[10px]">
              {isPaused ? 'PAUSED' : 'STREAMING LIVE'}
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            <AnimatePresence>
              {streamItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className={`p-4 rounded-lg border text-xs font-mono flex items-center justify-between transition-all ${
                    item.severity === 'CRITICAL'
                      ? 'bg-[#F85149]/10 border-[#F85149]/30'
                      : item.severity === 'WARNING'
                      ? 'bg-[#D29922]/10 border-[#D29922]/30'
                      : 'bg-[#05070B] border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#64748B] font-bold">{item.timestamp}</span>
                    <div>
                      <h4 className="font-bold text-white text-xs">{item.title}</h4>
                      <p className="text-[11px] text-[#94A3B8] font-sans mt-0.5">{item.entity} &bull; {item.detail}</p>
                    </div>
                  </div>

                  <span className={`spatial-badge text-[10px] ${
                    item.severity === 'CRITICAL' ? 'spatial-badge-risk' :
                    item.severity === 'WARNING' ? 'spatial-badge-review' : 'spatial-badge-cyan'
                  }`}>
                    {item.type}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
};
