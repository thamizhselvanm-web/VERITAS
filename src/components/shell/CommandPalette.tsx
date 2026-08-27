import React, { useEffect, useState, useRef } from 'react';
import { Search, X, Shield, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { InvoiceCase, formatCurrency } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  cases: InvoiceCase[];
  onSelectCase: (caseId: string) => void;
  initialQuery?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  cases,
  onSelectCase,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter cases across multiple fields
  const filteredCases = cases.filter(c => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.caseNumber.toLowerCase().includes(q) ||
      c.sellerName.toLowerCase().includes(q) ||
      c.buyerName.toLowerCase().includes(q) ||
      c.invoiceNumber.toLowerCase().includes(q) ||
      c.sellerTaxId.toLowerCase().includes(q) ||
      c.buyerTaxId.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  });

  // Focus input and reset query when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialQuery]);

  // Reset selectedIndex when filtered cases change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation listener (Escape, ArrowUp, ArrowDown, Enter)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (filteredCases.length > 0 ? (prev + 1) % filteredCases.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (filteredCases.length > 0 ? (prev - 1 + filteredCases.length) % filteredCases.length : 0));
      } else if (e.key === 'Enter') {
        if (filteredCases.length > 0 && selectedIndex < filteredCases.length) {
          e.preventDefault();
          onSelectCase(filteredCases[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCases, selectedIndex, onClose, onSelectCase]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans select-none"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Global Search Command Palette"
    >
      <div 
        className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-4 max-w-xl w-full shadow-2xl space-y-3 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Header Input */}
        <div className="relative border-b border-[#2E2A27] pb-3 flex items-center gap-3">
          <Search className="w-4 h-4 text-[#6366F1] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search case ref, seller, buyer, invoice #, or tax ID..."
            className="w-full bg-[#141211] border border-[#2E2A27] rounded-xl pl-3 pr-8 py-2.5 text-xs font-mono text-[#F7F4F1] placeholder-[#9E8C7C] outline-none focus:border-[#6366F1] transition-all"
            aria-label="Global search input"
          />
          {query ? (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-3 text-[#9E8C7C] hover:text-[#F7F4F1] p-1"
              title="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="absolute right-3 text-[#9E8C7C] hover:text-[#F7F4F1] p-1 text-[11px] font-mono"
              title="Close search palette (Esc)"
            >
              ESC
            </button>
          )}
        </div>

        {/* Results List Header */}
        <div className="flex items-center justify-between px-1 text-[11px] font-mono text-[#9E8C7C]">
          <span>Found {filteredCases.length} {filteredCases.length === 1 ? 'case' : 'cases'}</span>
          <span>Use &uarr; &darr; to navigate, Enter to select</span>
        </div>

        {/* Results List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
          {filteredCases.length === 0 ? (
            <div className="p-8 text-center space-y-2 bg-[#141211] rounded-xl border border-[#2E2A27]">
              <Search className="w-6 h-6 text-[#9E8C7C] mx-auto opacity-75" />
              <p className="text-xs text-[#F7F4F1] font-semibold">No matching cases or entities found</p>
              <p className="text-[11px] text-[#9E8C7C]">Try searching by invoice number, vendor name, or case code.</p>
            </div>
          ) : (
            filteredCases.map((c, index) => {
              const isSelected = index === selectedIndex;
              const trustScore = c.telemetry.trustScore;
              const trustTextColor = 
                trustScore <= 40 ? 'text-[#EF4444]' : 
                trustScore <= 70 ? 'text-[#F59E0B]' : 
                'text-[#10B981]';

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCase(c.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#262320] border-[#6366F1] text-[#F7F4F1] ring-1 ring-[#6366F1]'
                      : 'bg-[#141211] border-[#2E2A27] text-[#D8C7B8] hover:border-[#6366F1]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#6366F1]/15 text-[#6366F1] flex-shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F7F4F1] font-mono">{c.caseNumber}</span>
                        <span className="text-[10px] font-mono text-[#9E8C7C]">Inv #{c.invoiceNumber}</span>
                      </div>
                      <span className="text-[11px] text-[#9E8C7C] block mt-0.5">
                        {c.sellerName} &rarr; {c.buyerName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#F7F4F1] block">
                        {formatCurrency(c.totalMinor, c.currency)}
                      </span>
                      <span className={`text-[10px] font-mono block ${trustTextColor}`}>
                        Trust {trustScore} / 100
                      </span>
                    </div>

                    <div className={`p-1.5 rounded-lg border ${isSelected ? 'bg-[#4F46E5] text-white border-[#6366F1]' : 'bg-[#262320] text-[#9E8C7C] border-[#2E2A27]'}`}>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Palette Footer */}
        <div className="pt-2 border-t border-[#2E2A27] flex items-center justify-between text-[11px] font-mono text-[#9E8C7C]">
          <span>VERITAS Continuous Search Engine</span>
          <button 
            onClick={onClose} 
            className="hover:text-[#F7F4F1] underline cursor-pointer bg-transparent border-0"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
