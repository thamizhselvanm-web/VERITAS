import React from 'react';
import { ShieldAlert, Home, ArrowLeft, Search } from 'lucide-react';

interface NotFoundPageProps {
  onBackToOverview: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackToOverview }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 font-sans select-none">
      <div className="max-w-md w-full inst-card p-8 border border-[#2E2A27] space-y-6 shadow-xl relative overflow-hidden">
        
        {/* 404 Icon & Header */}
        <div className="w-14 h-14 rounded-2xl bg-[#4F46E5] flex items-center justify-center mx-auto border border-[#6366F1]">
          <ShieldAlert className="w-8 h-8 text-white" />
        </div>

        <div>
          <span className="font-mono text-xs text-[#818CF8] font-bold tracking-widest uppercase block mb-1">
            ERROR 404 &bull; RESOURCE NOT FOUND
          </span>
          <h1 className="text-2xl font-extrabold text-[#F7F4F1] tracking-tight">Page missing or displaced</h1>
          <p className="text-xs text-[#D8C7B8] mt-2 leading-relaxed">
            The target trust case, proof record, or operational workspace route you requested does not exist or has been archived.
          </p>
        </div>

        <div className="p-3 bg-[#141211] rounded-xl border border-[#2E2A27] text-[11px] font-mono text-[#9E8C7C] space-y-1">
          <div className="flex justify-between">
            <span>DIAGNOSTIC STATUS:</span>
            <span className="text-[#F07151] font-bold">ROUTE_UNRESOLVED</span>
          </div>
          <div className="flex justify-between">
            <span>CANONICAL FINGERPRINT:</span>
            <span className="text-[#D8C7B8]">0x404_NULL_STATE</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            onClick={onBackToOverview}
            className="btn-primary w-full sm:w-auto py-2.5 px-5 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Overview</span>
          </button>
          
          <button
            onClick={onBackToOverview}
            className="btn-secondary w-full sm:w-auto py-2.5 px-5 text-xs font-bold flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Safety</span>
          </button>
        </div>

      </div>
    </div>
  );
};
