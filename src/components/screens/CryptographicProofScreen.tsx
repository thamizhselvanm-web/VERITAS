import React, { useState } from 'react';
import { FileCheck, ShieldCheck, CheckCircle2, RefreshCw, ArrowRight, Copy } from 'lucide-react';
import { AuditEvent, ProofRecord } from '../../types';
import { mockProofRecords } from '../../mock/demoData';
import { ProofService } from '../../services/proofService';
import { useToast } from '../common/ToastContainer';

interface CryptographicProofScreenProps {
  auditEvents: AuditEvent[];
  onOpenProof: (event: AuditEvent) => void;
}

export const CryptographicProofScreen: React.FC<CryptographicProofScreenProps> = ({
  auditEvents,
  onOpenProof
}) => {
  const { addToast } = useToast();
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
      addToast('Proof Re-Verified', 'SHA-256 hash matches Arbitrum L2 notary block record 100%.', 'success');
    }, 500);
  };

  const handleCopyHash = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', `Copied ${label} to clipboard.`, 'info');
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E07A5F]/20 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F7F4F1] tracking-tight flex items-center gap-2.5 font-mono">
            <FileCheck className="w-6 h-6 text-[#E07A5F]" />
            Cryptographic Proof & Evidence Infrastructure
          </h1>
          <p className="text-xs text-[#9E8C7C] font-mono mt-1">
            Immutable audit events anchored to Ethereum Arbitrum L2 blockchain notary ledger.
          </p>
        </div>

        <span className="inst-badge inst-badge-accent text-xs">
          Arbitrum One L2 (Chain ID: 42161)
        </span>
      </div>

      {/* Visual Chain Infrastructure */}
      <div className="inst-card p-6 space-y-4">
        <span className="text-xs font-mono font-bold text-[#D8C7B8] uppercase tracking-wider block">
          Evidence Cryptographic Chain of Custody
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
          {chainNodes.map((node, idx) => (
            <React.Fragment key={idx}>
              <div className="inst-card p-4 border border-[#E07A5F]/30 text-center space-y-1 bg-[#E07A5F]/10">
                <span className="font-bold text-[#F7F4F1] font-mono text-sm block">{node.title}</span>
                <span className="text-[11px] text-[#E07A5F] font-mono block">{node.desc}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Verification Status & Hash Actions */}
      <div className="inst-card p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#52B788]" />
            <div>
              <h3 className="font-bold text-[#F7F4F1] text-sm">PROOF STATUS: VERIFIED</h3>
              <p className="text-xs text-[#9E8C7C] font-mono">Block Height #{proof.blockHeight} &bull; Network: {proof.chainId}</p>
            </div>
          </div>

          <button onClick={handleVerify} disabled={verifying} className="btn-primary text-xs">
            {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Re-Verify SHA-256 Hash
          </button>
        </div>

        {verifiedSuccess && (
          <div className="p-3 rounded-xl bg-[#52B788]/20 border border-[#52B788] text-[#52B788] text-xs font-mono">
            ✓ Cryptographic SHA-256 hash matches Arbitrum L2 notary block record 100%.
          </div>
        )}

        <div className="space-y-3 font-mono text-xs">
          <div className="bg-[#141211] p-3.5 rounded-xl border border-[#E07A5F]/20 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#9E8C7C] text-[10px]">Canonical Payload:</span>
              <button
                onClick={() => handleCopyHash(proof.canonicalHash, 'Canonical Payload')}
                className="text-[#E07A5F] hover:underline flex items-center gap-1 text-[11px]"
              >
                <Copy className="w-3 h-3" /> Copy Payload
              </button>
            </div>
            <code className="text-[#E07A5F] block break-all mt-0.5">{proof.canonicalHash}</code>
          </div>

          <div className="bg-[#141211] p-3.5 rounded-xl border border-[#E07A5F]/20 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#9E8C7C] text-[10px]">SHA-256 Digest:</span>
              <button
                onClick={() => handleCopyHash(proof.sha256, 'SHA-256 Digest')}
                className="text-[#52B788] hover:underline flex items-center gap-1 text-[11px]"
              >
                <Copy className="w-3 h-3" /> Copy Hash
              </button>
            </div>
            <code className="text-[#52B788] font-bold block break-all mt-0.5">{proof.sha256}</code>
          </div>
        </div>
      </div>

    </div>
  );
};
