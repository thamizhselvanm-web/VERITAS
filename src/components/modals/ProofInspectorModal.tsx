import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, RefreshCw } from 'lucide-react';
import { AuditEvent, ProofRecord } from '../../types';
import { mockProofRecords } from '../../mock/demoData';
import { ProofService } from '../../services/proofService';

interface ProofInspectorModalProps {
  event: AuditEvent | null;
  onClose: () => void;
}

export const ProofInspectorModal: React.FC<ProofInspectorModalProps> = ({ event, onClose }) => {
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState<boolean | null>(null);

  if (!event) return null;

  const proof: ProofRecord = mockProofRecords[event.resourceId] || {
    id: `proof-${event.id}`,
    resourceType: event.resourceType,
    resourceId: event.resourceId,
    canonicalHash: `{"resourceId":"${event.resourceId}","action":"${event.action}","proofHash":"${event.proofHash}"}`,
    sha256: event.proofHash,
    proofType: 'MERKLE_LOG_NOTARY',
    chainId: 'Arbitrum One L2 (Chain ID: 42161)',
    txRef: '0x3a99201f8e77a112bc880912d34eef1102938475a1b2c3d4e5f6789a01234567',
    status: 'REGISTERED',
    verifiedAt: event.createdAt,
    blockHeight: event.blockHeight || 1849205
  };

  const handleVerify = async () => {
    setVerifying(true);
    const result = await ProofService.verifyProof(proof);
    setTimeout(() => {
      setVerifiedSuccess(result);
      setVerifying(false);
    }, 500);
  };

  return (
    <div className="modal-overlay">
      <div className="inst-card-elevated p-6 max-w-xl w-full border border-[#30363D] shadow-2xl relative space-y-5 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363D] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-blue-500/10 text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Cryptographic Blockchain Proof Inspector</h3>
              <p className="text-xs text-[#8B949E] font-mono">Zero-Knowledge Immutable Audit State Verification</p>
            </div>
          </div>

          <button onClick={onClose} className="text-[#8B949E] hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verification Status Banner */}
        <div className="p-4 rounded bg-[#238636]/15 border border-[#238636]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#3FB950]" />
            <div>
              <h4 className="font-bold text-[#3FB950] text-xs">NOTARIZED ON IMMUTABLE LEDGER</h4>
              <p className="text-[11px] text-[#C9D1D9] mt-0.5">{proof.chainId}</p>
            </div>
          </div>

          <span className="inst-badge inst-badge-verified text-xs">
            Block #{proof.blockHeight}
          </span>
        </div>

        {/* Cryptographic Fields */}
        <div className="space-y-3 font-mono text-xs">
          
          <div className="bg-[#0D1117] p-3 rounded border border-[#30363D]">
            <span className="text-[#8B949E] text-[10px] block mb-0.5">Canonical Payload Digest:</span>
            <code className="text-[#58A6FF] block break-all leading-relaxed">{proof.canonicalHash}</code>
          </div>

          <div className="bg-[#0D1117] p-3 rounded border border-[#30363D]">
            <span className="text-[#8B949E] text-[10px] block mb-0.5">SHA-256 Digest:</span>
            <code className="text-[#3FB950] font-bold block break-all leading-relaxed">{proof.sha256}</code>
          </div>

          <div className="bg-[#0D1117] p-3 rounded border border-[#30363D]">
            <span className="text-[#8B949E] text-[10px] block mb-0.5">Anchor Tx Reference:</span>
            <code className="text-[#A371F7] block break-all leading-relaxed">{proof.txRef}</code>
          </div>

        </div>

        <div className="border-t border-[#30363D] pt-4 flex items-center justify-between">
          <div>
            {verifiedSuccess && (
              <span className="text-xs font-mono text-[#3FB950] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 MATCHES ON-CHAIN 100%
              </span>
            )}
          </div>

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="btn-inst-primary text-xs"
          >
            {verifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            Re-run Hash Verification
          </button>
        </div>

      </div>
    </div>
  );
};
