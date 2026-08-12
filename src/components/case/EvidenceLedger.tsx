import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, Layers } from 'lucide-react';
import { InvoiceCase } from '../../types';

interface EvidenceLedgerProps {
  invoiceCase: InvoiceCase;
}

export const EvidenceLedger: React.FC<EvidenceLedgerProps> = ({ invoiceCase }) => {
  return (
    <div className="inst-card p-6 border border-[#30363D] flex flex-col gap-5 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363D] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blue-500/10 text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Evidence & Feature Ledger</h3>
            <p className="text-xs text-[#8B949E] mt-0.5">Categorized breakdown of identity, document, duplicate, behaviour, and evidence features.</p>
          </div>
        </div>
      </div>

      {/* Grid of 5 Evidence Category Cards per UI Brief Sec 10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        
        {/* IDENTITY */}
        <div className="p-3.5 rounded bg-[#0D1117] border border-[#30363D] space-y-2">
          <span className="font-bold text-[#8B949E] uppercase tracking-wider block text-[10px]">
            IDENTITY
          </span>
          <div className="space-y-1.5 font-sans">
            <div className="flex items-center gap-1.5 text-[#3FB950] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Seller verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#3FB950] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Buyer verified</span>
            </div>
          </div>
        </div>

        {/* DOCUMENT */}
        <div className="p-3.5 rounded bg-[#0D1117] border border-[#30363D] space-y-2">
          <span className="font-bold text-[#8B949E] uppercase tracking-wider block text-[10px]">
            DOCUMENT
          </span>
          <div className="space-y-1.5 font-sans">
            <div className="flex items-center gap-1.5 text-[#3FB950] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Invoice fields consistent</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#3FB950] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>PDF structure verified</span>
            </div>
          </div>
        </div>

        {/* DUPLICATE */}
        <div className="p-3.5 rounded bg-[#0D1117] border border-[#30363D] space-y-2">
          <span className="font-bold text-[#8B949E] uppercase tracking-wider block text-[10px]">
            DUPLICATE
          </span>
          <div className="space-y-1.5 font-sans">
            {invoiceCase.duplicateSimilarityScore ? (
              <div className="flex items-start gap-1.5 text-[#D29922] font-medium">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{invoiceCase.duplicateSimilarityScore}% similarity with INV-984</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[#3FB950] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Zero duplicate collision</span>
              </div>
            )}
          </div>
        </div>

        {/* BEHAVIOUR */}
        <div className="p-3.5 rounded bg-[#0D1117] border border-[#30363D] space-y-2">
          <span className="font-bold text-[#8B949E] uppercase tracking-wider block text-[10px]">
            BEHAVIOUR
          </span>
          <div className="space-y-1.5 font-sans">
            <div className="flex items-start gap-1.5 text-[#D29922] font-medium">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>Amount is 18.7× historical median</span>
            </div>
          </div>
        </div>

        {/* EVIDENCE */}
        <div className="p-3.5 rounded bg-[#0D1117] border border-[#30363D] space-y-2">
          <span className="font-bold text-[#8B949E] uppercase tracking-wider block text-[10px]">
            EVIDENCE
          </span>
          <div className="space-y-1.5 font-sans">
            <div className="flex items-start gap-1.5 text-[#D29922] font-medium">
              <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>Payment history unavailable</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
