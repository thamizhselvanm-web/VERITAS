import React from 'react';
import { Shield, CheckCircle2, Lock, ArrowLeft, ExternalLink } from 'lucide-react';
import { ProofRecord } from '../../types';

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
    <div className="min-h-screen bg-[#070A11] text-[#C9D1D9] flex flex-col items-center justify-center p-6 font-sans">
      
      <div className="max-w-md w-full inst-card-elevated p-8 border border-[#30363D] shadow-2xl space-y-6">
        
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-extrabold text-white tracking-wider font-mono text-base">VERITAS</span>
          </div>

          <span className="text-[10px] font-mono text-[#8B949E] uppercase tracking-widest bg-[#0D1117] px-2.5 py-1 rounded border border-[#30363D]">
            PUBLIC PROOF VERIFIER
          </span>
        </div>

        {/* Verification Status per UI Brief Sec 16 */}
        <div className="p-4 rounded bg-[#238636]/15 border border-[#238636]/40 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#3FB950] flex-shrink-0" />
          <div>
            <h4 className="font-bold text-[#3FB950] text-sm">✓ Proof Verified</h4>
            <p className="text-xs text-[#C9D1D9] mt-0.5 font-mono">Blockchain Cryptographic State Verified</p>
          </div>
        </div>

        {/* Minimal Details per UI Brief Sec 16 */}
        <div className="space-y-3 font-mono text-xs bg-[#0D1117] p-4 rounded border border-[#30363D]">
          <div className="flex justify-between border-b border-[#30363D]/60 pb-2">
            <span className="text-[#8B949E]">VERITAS ID:</span>
            <span className="font-bold text-white">{proofId}</span>
          </div>

          <div className="flex justify-between border-b border-[#30363D]/60 pb-2">
            <span className="text-[#8B949E]">Status:</span>
            <span className="font-bold text-[#3FB950]">{proof.status}</span>
          </div>

          <div className="flex justify-between border-b border-[#30363D]/60 pb-2">
            <span className="text-[#8B949E]">Timestamp:</span>
            <span className="text-[#C9D1D9]">{proof.verifiedAt}</span>
          </div>

          <div className="flex justify-between border-b border-[#30363D]/60 pb-2">
            <span className="text-[#8B949E]">Block Height:</span>
            <span className="text-[#C9D1D9]">#{proof.blockHeight}</span>
          </div>

          <div className="pt-1 text-[11px] text-[#F85149] font-sans flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#F85149]" />
            <span>Sensitive financial information: <strong>Not displayed (OFF-CHAIN)</strong></span>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="border-t border-[#30363D] pt-4 flex items-center justify-between">
          <button onClick={onBackToApp} className="btn-inst-secondary text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Application
          </button>

          <span className="text-[10px] text-[#8B949E] font-mono">Arbitrum L2 Notary</span>
        </div>

      </div>

    </div>
  );
};
