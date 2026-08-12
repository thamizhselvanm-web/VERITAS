import React, { useState } from 'react';
import { FileCheck, ShieldCheck, Lock, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import { AuditEvent, ProofRecord } from '../../types';
import { mockProofRecords } from '../../mock/demoData';
import { ProofService } from '../../services/proofService';

interface CryptographicProofScreenProps {
  auditEvents: AuditEvent[];
  onOpenProof: (event: AuditEvent) => void;
}

export const CryptographicProofScreen: React.FC<CryptographicProofScreenProps> = ({
  auditEvents,
  onOpenProof
}) => {
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState<boolean | null>(null);

  const proof: ProofRecord = mockProofRecords['case-vrt-28491'] || {
    id: 'proof-28491',
    resourceType: 'INVOICE_DECISION',
    resourceId: 'case-vrt-28491',
    canonicalHash: '{"caseId":"case-vrt-28491","trustScore":82}',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    proofType: 'MERKLE_LOG_NOTARY',
    chainId: 'Arbitrum One L2 (Chain ID: 42161)',
    txRef: '0x3a99201f8e77a112bc880912d34eef1102938475a1b2c3d4e5f6789a01234567',
    status: 'REGISTERED',
    verifiedAt: '2026-08-11T14:32:15Z',
    blockHeight: 1849201
  };

  const handleVerify = async () => {
    setVerifying(true);
    const result = await ProofService.verifyProof(proof);
    setTimeout(() => {
      setVerifiedSuccess(result);
      setVerifying(false);
    }, 500);
  };

  const chainNodes = [
    { title: 'DOCUMENT', desc: 'Canonical JSON Payload' },
    { title: 'HASH', desc: 'SHA-256 Digest' },
    { title: 'PROOF', desc: 'Arbitrum L2 Notary' },
    { title: 'VERIFICATION', desc: 'Integrity Confirmed' }
  ];

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5 font-mono">
            <FileCheck className="w-6 h-6 text-[#00F0FF]" />
            Cryptographic Proof & Evidence Infrastructure
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            Immutable audit events anchored to Ethereum Arbitrum L2 blockchain notary ledger.
          </p>
        </div>

        <span className="spatial-badge spatial-badge-cyan text-xs">
          Arbitrum One L2 (Chain ID: 42161)
        </span>
      </div>

      {/* Visual Chain Infrastructure per Brief Sec 39 */}
      <div className="spatial-panel p-6 border border-white/10 space-y-4">
        <span className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider block">
          Evidence Cryptographic Chain of Custody
        </span>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {chainNodes.map((node, idx) => (
            <React.Fragment key={idx}>
              <div className="spatial-panel p-4 border border-[#00F0FF]/30 text-center space-y-1 bg-[#1F6FEB]/10">
                <span className="font-bold text-white font-mono text-sm block">{node.title}</span>
                <span className="text-[11px] text-[#00F0FF] font-mono block">{node.desc}</span>
              </div>

              {idx < chainNodes.length - 1 && (
                <div className="hidden md:flex justify-center text-[#00F0FF]">
                  <ArrowRight className="w-5 h-5 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Verification Status & Hash Actions */}
      <div className="spatial-panel p-6 border border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#3FB950]" />
            <div>
              <h3 className="font-bold text-white text-sm">PROOF STATUS: VERIFIED</h3>
              <p className="text-xs text-[#94A3B8] font-mono">Block Height #{proof.blockHeight} &bull; Network: {proof.chainId}</p>
            </div>
          </div>

          <button onClick={handleVerify} disabled={verifying} className="btn-spatial-primary text-xs">
            {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Re-Verify SHA-256 Hash
          </button>
        </div>

        {verifiedSuccess && (
          <div className="p-3 rounded bg-[#3FB950]/20 border border-[#3FB950] text-[#3FB950] text-xs font-mono">
            ✓ Cryptographic SHA-256 hash matches Arbitrum L2 notary block record 100%.
          </div>
        )}

        <div className="space-y-3 font-mono text-xs">
          <div className="bg-[#05070B] p-3.5 rounded border border-white/10">
            <span className="text-[#64748B] block text-[10px]">Canonical Payload:</span>
            <code className="text-[#00F0FF] block break-all mt-0.5">{proof.canonicalHash}</code>
          </div>

          <div className="bg-[#05070B] p-3.5 rounded border border-white/10">
            <span className="text-[#64748B] block text-[10px]">SHA-256 Digest:</span>
            <code className="text-[#3FB950] font-bold block break-all mt-0.5">{proof.sha256}</code>
          </div>
        </div>
      </div>

    </div>
  );
};
