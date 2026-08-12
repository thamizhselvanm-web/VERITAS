import React from 'react';
import { FileCheck, Lock, ExternalLink, ShieldCheck } from 'lucide-react';
import { AuditEvent } from '../../types';

interface AuditProofPageProps {
  auditEvents: AuditEvent[];
  onOpenProof: (event: AuditEvent) => void;
}

export const AuditProofPage: React.FC<AuditProofPageProps> = ({ auditEvents, onOpenProof }) => {
  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363D] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-blue-400" />
            Append-Only Audit & Cryptographic Proof Ledger
          </h1>
          <p className="text-xs text-[#8B949E] font-mono mt-1">
            Immutable audit events anchored to Ethereum Arbitrum L2 blockchain notary ledger.
          </p>
        </div>

        <span className="inst-badge inst-badge-info font-mono text-xs">
          Arbitrum One L2 (Chain ID: 42161)
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="inst-card border border-[#30363D] overflow-hidden">
        <div className="p-4 border-b border-[#30363D] flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">System & Decision Audit Events</h3>
          <span className="text-xs text-[#8B949E] font-mono">{auditEvents.length} Recorded Events</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0D1117] text-[#8B949E] font-mono border-b border-[#30363D]">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor / Role</th>
                <th className="p-3">Action Event</th>
                <th className="p-3">Resource Ref</th>
                <th className="p-3">SHA-256 Digest</th>
                <th className="p-3">Block Height</th>
                <th className="p-3 text-right">Proof Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D] font-mono">
              {auditEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#161B22] transition-colors cursor-pointer" onClick={() => onOpenProof(evt)}>
                  <td className="p-3 text-[#C9D1D9]">{new Date(evt.createdAt).toLocaleString()}</td>
                  <td className="p-3 text-white font-sans font-bold">{evt.actor.name} <span className="text-[#8B949E] font-mono text-[10px]">({evt.actor.role})</span></td>
                  <td className="p-3 text-[#58A6FF] font-bold">{evt.action}</td>
                  <td className="p-3 text-[#C9D1D9]">{evt.resourceId}</td>
                  <td className="p-3 text-[#3FB950] font-bold">{evt.proofHash.substring(0, 16)}...</td>
                  <td className="p-3 text-white font-numeric">#{evt.blockHeight}</td>
                  <td className="p-3 text-right">
                    <button className="text-blue-400 hover:underline flex items-center justify-end gap-1 font-bold">
                      <ExternalLink className="w-3 h-3" /> Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
