import React, { useState } from 'react';
import { Radio, Play, X, Zap, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { MonitoringEventType } from '../../types';

interface EventSimulatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerEvent: (eventType: MonitoringEventType, caseId: string) => void;
  activeCaseId: string;
}

export const EventSimulatorPanel: React.FC<EventSimulatorPanelProps> = ({
  isOpen,
  onClose,
  onTriggerEvent,
  activeCaseId
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulate = (eventType: MonitoringEventType, label: string) => {
    onTriggerEvent(eventType, activeCaseId);
    setToastMessage(`Continuous Event Dispatched: ${label}. Trust Score updated in real-time.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full inst-card-elevated p-5 border border-[#238636]/50 shadow-2xl space-y-4 font-sans text-xs">
      
      {toastMessage && (
        <div className="bg-[#238636]/20 border border-[#238636] text-[#3FB950] p-3 rounded text-xs font-mono flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#3FB950] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#3FB950] animate-pulse" />
          <h4 className="font-bold text-white text-xs tracking-wider uppercase font-mono">
            Continuous Monitoring Event Simulator
          </h4>
        </div>

        <button onClick={onClose} className="text-[#8B949E] hover:text-white p-1 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[#C9D1D9] leading-relaxed">
        Trigger simulated external market & payment events for target case <strong className="text-blue-400 font-mono">{activeCaseId.toUpperCase()}</strong>.
      </p>

      <div className="grid grid-cols-1 gap-2">
        
        <button
          onClick={() => handleSimulate('PAYMENT_DELAYED', 'Payment Delayed (+30 days overdue)')}
          className="p-3 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#D29922] text-left flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <TrendingDown className="w-4 h-4 text-[#D29922]" />
            <div>
              <span className="font-bold text-[#D29922] block">PAYMENT_DELAYED Event</span>
              <span className="text-[10px] text-[#8B949E]">Degrades Behaviour Sub-score (-35)</span>
            </div>
          </div>
          <Play className="w-3.5 h-3.5 text-[#D29922]" />
        </button>

        <button
          onClick={() => handleSimulate('DUPLICATE_DISCOVERED', 'Duplicate Discovered Cross-Lender')}
          className="p-3 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#F85149] text-left flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#F85149]" />
            <div>
              <span className="font-bold text-[#F85149] block">DUPLICATE_DISCOVERED Event</span>
              <span className="text-[10px] text-[#8B949E]">Triggers Duplicate Fraud Signal (-60)</span>
            </div>
          </div>
          <Play className="w-3.5 h-3.5 text-[#F85149]" />
        </button>

        <button
          onClick={() => handleSimulate('BUYER_CONFIRMED', 'Buyer ERP Confirmation Received')}
          className="p-3 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#3FB950] text-left flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-[#3FB950]" />
            <div>
              <span className="font-bold text-[#3FB950] block">BUYER_CONFIRMED Event</span>
              <span className="text-[10px] text-[#8B949E]">Boosts Relationship & Trust (+15)</span>
            </div>
          </div>
          <Play className="w-3.5 h-3.5 text-[#3FB950]" />
        </button>

      </div>

    </div>
  );
};
