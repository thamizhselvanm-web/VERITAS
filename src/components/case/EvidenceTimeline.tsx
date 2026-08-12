import React from 'react';
import { Clock, ShieldCheck, CheckCircle2, FileCheck, Lock, ExternalLink } from 'lucide-react';
import { AuditEvent, InvoiceCase, EvidenceItem } from '../../types';

interface EvidenceTimelineProps {
  invoiceCase: InvoiceCase;
  auditEvents: AuditEvent[];
  onOpenProof: (event: AuditEvent) => void;
}

export const EvidenceTimeline: React.FC<EvidenceTimelineProps> = ({
  invoiceCase,
  auditEvents,
  onOpenProof
}) => {
  return (
    <div className="inst-card p-6 border border-[#30363D] flex flex-col gap-6 shadow-xl font-sans">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#30363D] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blue-500/10 text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Evidence Checklist & Immutable Audit Trail</h3>
            <p className="text-xs text-[#8B949E] mt-0.5">Cryptographically signed history of case actions & document verification</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Required Evidence Documents Checklist (5 cols) */}
        <div className="lg:col-span-5 bg-[#0D1117] rounded border border-[#30363D] p-5 space-y-4">
          <h4 className="text-xs font-bold text-[#8B949E] uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#3FB950]" />
            Verification Proof Documents
          </h4>

          <div className="space-y-3">
            {invoiceCase.evidenceItems.map((doc: EvidenceItem, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded bg-[#161B22] border border-[#30363D] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  {doc.verified ? (
                    <CheckCircle2 className="w-4 h-4 text-[#3FB950]" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-[#D29922] border-t-transparent animate-spin"></div>
                  )}
                  <div>
                    <h5 className="font-bold text-white">{doc.name}</h5>
                    <p className="text-[11px] text-[#8B949E] font-mono mt-0.5">
                      {doc.uploadedAt ? `Uploaded: ${new Date(doc.uploadedAt).toLocaleTimeString()}` : 'Awaiting Document Upload'}
                    </p>
                  </div>
                </div>

                {doc.verified ? (
                  <span className="inst-badge inst-badge-verified text-[10px]">VERIFIED</span>
                ) : (
                  <span className="inst-badge inst-badge-review text-[10px]">MISSING</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chronological Immutable Audit Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-[#0D1117] rounded border border-[#30363D] p-5 space-y-4">
          <h4 className="text-xs font-bold text-[#8B949E] uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            Immutable Audit Trail Events
          </h4>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#30363D]">
            {auditEvents.map((evt) => (
              <div key={evt.id} className="relative pl-8 text-xs">
                
                <div className="absolute left-1 top-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>

                <div className="p-4 rounded bg-[#161B22] border border-[#30363D] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-white font-mono">{evt.action}</span>
                    <span className="text-[11px] text-[#8B949E] font-mono">
                      {new Date(evt.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[#C9D1D9] text-xs leading-relaxed font-sans">{evt.details}</p>

                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#30363D] text-xs font-mono">
                    <span className="text-[#8B949E]">Actor: <strong className="text-blue-400 font-sans">{evt.actor.name}</strong> ({evt.actor.role})</span>

                    <button
                      onClick={() => onOpenProof(evt)}
                      className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Verify Cryptographic Proof
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
