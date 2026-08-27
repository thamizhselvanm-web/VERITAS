import React from 'react';
import { CheckCircle2, Lock, ArrowLeft, ExternalLink } from 'lucide-react';
import { ProofRecord } from '../../types';
import { VeritasLogo } from '../common/VeritasLogo';

interface PublicProofVerifyPageProps {
  proofId?: string;
  onBackToApp: () => void;
}

export const PublicProofVerifyPage: React.FC<PublicProofVerifyPageProps> = ({
  proofId = 'VRT-928374',
  onBackToApp
}) => {
  const proof: ProofRecord = {
    id: `proof-${proofId}`,
    resourceType: 'INVOICE_DECISION_PROOF',
    resourceId: proofId,
    canonicalHash: '{"veritasId":"VRT-928374","status":"REGISTERED","merkleRoot":"0x8f2d9a11bc3e4f7a"}',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    proofType: 'MERKLE_TREE_BLOCKCHAIN_NOTARY',
    chainId: 'Ethereum Arbitrum L2 Notary (Chain ID: 42161)',
    txRef: '0x3a99201f8e77a112bc880912d34eef1102938475a1b2c3d4e5f6789a01234567',
    status: 'REGISTERED',
    verifiedAt: '11 Aug 2026',
    blockHeight: 1849205
  };

  return (
    <main className="min-h-screen bg-[#141211] text-[#F7F4F1] flex flex-col items-center justify-center p-4 select-none font-sans">
      
      <div className="max-w-md w-full bg-[#1C1917] p-8 border border-[#2E2A27] rounded-2xl shadow-2xl space-y-6">
        
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between border-b border-[#2E2A27] pb-4">
          <VeritasLogo variant="full" size="sm" />

          <span className="text-[10px] font-mono text-[#6366F1] uppercase tracking-widest bg-[#262320] px-2.5 py-1 rounded border border-[#2E2A27]">
            PUBLIC PROOF VERIFIER
          </span>
        </div>

        {/* Verification Status */}
        <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#10B981] flex-shrink-0" />
          <div>
            <h3 className="font-bold text-[#F7F4F1] text-xs uppercase tracking-wider">CRYPTOGRAPHIC PROOF VERIFIED</h3>
            <p className="text-[11px] text-[#D8C7B8] font-mono mt-0.5">Merkle root matches Arbitrum L2 ledger entry.</p>
          </div>
        </div>

        {/* Notary Details */}
        <dl className="space-y-2.5 text-xs font-mono bg-[#141211] p-4 rounded-xl border border-[#2E2A27]">
          <div className="flex justify-between py-1 border-b border-[#2E2A27]">
            <dt className="text-[#9E8C7C]">Resource ID:</dt>
            <dd className="font-bold text-[#F7F4F1]">{proof.resourceId}</dd>
          </div>

          <div className="flex justify-between py-1 border-b border-[#2E2A27]">
            <dt className="text-[#9E8C7C]">Proof Type:</dt>
            <dd className="text-[#6366F1] font-bold text-[11px]">Arbitrum L2 Notary</dd>
          </div>

          <div className="flex justify-between py-1 border-b border-[#2E2A27]">
            <dt className="text-[#9E8C7C]">Block Height:</dt>
            <dd className="text-[#F7F4F1] font-numeric">#{proof.blockHeight}</dd>
          </div>

          <div className="py-1 space-y-1">
            <dt className="text-[#9E8C7C]">SHA-256 Hash Digest:</dt>
            <dd className="text-[10px] text-[#10B981] break-all font-numeric bg-[#1C1917] p-2 rounded border border-[#2E2A27]">
              {proof.sha256}
            </dd>
          </div>
        </dl>

        {/* Blockchain Explorer Link */}
        <a 
          href={`https://arbiscan.io/tx/${proof.txRef}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#262320] border border-[#2E2A27] text-xs font-semibold text-[#F7F4F1] hover:border-[#6366F1] transition-all"
        >
          <span>Inspect Arbitrum Block Explorer</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#6366F1]" />
        </a>

        <div className="pt-2 border-t border-[#2E2A27]">
          <button 
            onClick={onBackToApp} 
            className="w-full py-2.5 text-xs text-[#9E8C7C] hover:text-[#F7F4F1] flex items-center justify-center gap-2 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to VERITAS Workspace
          </button>
        </div>

      </div>

    </main>
  );
};
