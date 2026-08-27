import React from 'react';
import { ShieldAlert, Home, ArrowLeft, Search } from 'lucide-react';

interface NotFoundPageProps {
  onBackToOverview: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackToOverview }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 font-sans select-none">
      <div className="max-w-md w-full inst-card-elevated p-8 border border-[#E07A5F]/35 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#E07A5F]/15 rounded-full blur-2xl pointer-events-none" />

        {/* 404 Icon & Header */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B85235] to-[#E07A5F] flex items-center justify-center mx-auto shadow-lg shadow-[#E07A5F]/30">
          <ShieldAlert className="w-8 h-8 text-white" />
        </div>

        <div>
          <span className="font-mono text-xs text-[#E07A5F] font-bold tracking-widest uppercase block mb-1">
            ERROR 404 &bull; RESOURCE NOT FOUND
          </span>
          <h1 className="text-2xl font-extrabold text-[#F7F4F1] tracking-tight">Page missing or displaced</h1>
          <p className="text-xs text-[#D8C7B8] mt-2 leading-relaxed">
            The target trust case, proof record, or operational workspace route you requested does not exist or has been archived.
          </p>
        </div>

        <div className="p-3 bg-[#141211] rounded-xl border border-[#E07A5F]/20 text-[11px] font-mono text-[#9E8C7C] space-y-1">
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
