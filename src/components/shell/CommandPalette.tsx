import React, { useEffect, useState } from 'react';
import { Search, X, Shield, FileText, ArrowRight } from 'lucide-react';
import { InvoiceCase } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  cases: InvoiceCase[];
  onSelectCase: (caseId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  cases,
  onSelectCase
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCases = cases.filter(c => 
    c.caseNumber.toLowerCase().includes(query.toLowerCase()) ||
    c.sellerName.toLowerCase().includes(query.toLowerCase()) ||
    c.buyerName.toLowerCase().includes(query.toLowerCase()) ||
    c.invoiceNumber.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay font-sans select-none z-50">
      <div className="spatial-panel-elevated p-4 max-w-xl w-full border border-white/20 shadow-2xl relative space-y-4">
        
        {/* Search input bar */}
        <div className="relative border-b border-white/10 pb-3">
          <Search className="w-4 h-4 text-[#00F0FF] absolute left-3 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, invoices, entities..."
            autoFocus
            className="w-full bg-[#05070B] border border-white/10 rounded-lg pl-9 pr-9 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF] font-sans"
          />
          <button onClick={onClose} className="absolute right-3 top-3 text-[#64748B] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {filteredCases.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#64748B]">No matching cases or entities found.</div>
          ) : (
            filteredCases.map(c => (
              <div
                key={c.id}
                onClick={() => {
                  onSelectCase(c.id);
                  onClose();
                }}
                className="p-3 rounded-lg bg-[#05070B] border border-white/5 hover:border-[#00F0FF]/40 cursor-pointer flex items-center justify-between text-xs transition-all hover:translate-x-1"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white font-mono block">{c.caseNumber}</span>
                    <span className="text-[11px] text-[#94A3B8]">{c.sellerName} &rarr; {c.buyerName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="spatial-badge spatial-badge-cyan text-[10px]">{c.currency} {(c.totalMinor/100).toLocaleString()}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00F0FF]" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
