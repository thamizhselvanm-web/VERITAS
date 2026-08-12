import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Lock, FileCheck, Shield, ExternalLink } from 'lucide-react';
import { InvoiceCase } from '../../types';

interface EvidenceChainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceCase: InvoiceCase;
}

export const EvidenceChainDrawer: React.FC<EvidenceChainDrawerProps> = ({
  isOpen,
  onClose,
  invoiceCase
}) => {
  if (!isOpen) return null;

  const custodySteps = [
    { title: 'Document Uploaded', desc: 'Pre-signed S3 upload intent & malware signature scan clean.', time: '14:30:00', status: 'VERIFIED' },
    { title: 'OCR Processed', desc: 'VERITAS Vision-v4.2 extracted 6 spatial fields & 2 line items.', time: '14:30:04', status: 'VERIFIED' },
    { title: 'Feature Extracted', desc: 'Canonical normalization and entity identity resolution completed.', time: '14:30:08', status: 'VERIFIED' },
    { title: 'Risk Evaluated', desc: 'Near-duplicate 94.2% match & 18.7x amount deviation flagged.', time: '14:30:10', status: 'FLAGGED' },
    { title: 'Evidence Hashed', desc: 'Web Crypto SHA-256 canonical payload digest computed.', time: '14:32:00', status: 'VERIFIED' },
    { title: 'Verification Completed', desc: 'Notarized on Ethereum Arbitrum L2 Block #1849201.', time: '14:32:15', status: 'VERIFIED' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end font-sans select-none">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#05070B]/80 backdrop-blur-md"
        />

        {/* Spatial Glass Drawer per Brief Sec 13 */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-xl h-full spatial-glass-drawer p-8 space-y-6 overflow-y-auto z-10"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Chain of Custody & Evidence Ledger</h3>
                <p className="text-xs text-[#94A3B8] font-mono">Case {invoiceCase.caseNumber}</p>
              </div>
            </div>

            <button onClick={onClose} className="text-[#64748B] hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chain of Custody Timeline per Brief Sec 13 */}
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider block">
              Chain of Custody Pipeline
            </span>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-white/10">
              {custodySteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="relative pl-8 text-xs"
                >
                  <div className="absolute left-1 top-1 w-5 h-5 rounded-full bg-[#1F6FEB] border-2 border-[#05070B] flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#05070B] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-white text-xs">{step.title}</span>
                      <span className="text-[10px] text-[#64748B]">{step.time}</span>
                    </div>

                    <p className="text-[#C9D1D9] text-xs leading-relaxed font-sans">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cryptographic Metadata */}
          <div className="space-y-3 pt-4 border-t border-white/10 font-mono text-xs">
            <span className="text-[#94A3B8] font-bold block text-[10px] uppercase tracking-wider">
              Cryptographic Notary Metadata
            </span>

            <div className="p-3.5 rounded-lg bg-[#05070B] border border-white/10 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#64748B]">SHA-256 Digest:</span>
                <span className="text-[#3FB950] font-bold">e3b0c44298fc1c14...</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#64748B]">Anchor Chain:</span>
                <span className="text-white">Arbitrum One L2</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#64748B]">Block Height:</span>
                <span className="text-[#00F0FF] font-numeric">#1849201</span>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
