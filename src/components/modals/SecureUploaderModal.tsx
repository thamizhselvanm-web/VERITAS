import React, { useState } from 'react';
import { Upload, X, ShieldCheck, AlertOctagon, CheckCircle2, ArrowRight, RefreshCw, Lock } from 'lucide-react';
import { FileScanner } from '../../services/fileScanner';
import { SecurityScanResult, InvoiceCase } from '../../types';

interface SecureUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newCase: Partial<InvoiceCase>) => void;
}

export const SecureUploaderModal: React.FC<SecureUploaderModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [step, setStep] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'BLOCKED'>('IDLE');
  const [scanResult, setScanResult] = useState<SecurityScanResult | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  if (!isOpen) return null;

  const handleTestUpload = async (fileName: string, isHostile: boolean) => {
    setSelectedFileName(fileName);
    setStep('SCANNING');

    const fakeFile = new File(
      [isHostile ? 'MZ90' : 'PDF-1.7...'],
      fileName,
      { type: isHostile ? 'application/x-msdownload' : 'application/pdf' }
    );

    const result = await FileScanner.scanFile(fakeFile);
    setScanResult(result);

    if (result.safe) {
      setStep('SUCCESS');
      const newCaseId = `case-vrt-${Math.floor(10000 + Math.random() * 90000)}`;
      onUploadSuccess({
        id: newCaseId,
        caseNumber: `VRT-${Math.floor(10000 + Math.random() * 90000)}`,
        sellerName: 'Apex Quantum Hardware Labs',
        sellerTaxId: 'US-1102938',
        buyerName: 'OmniTech Solutions',
        buyerTaxId: 'US-8839201',
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        totalMinor: 14500000,
        currency: 'USD',
        status: 'NEEDS_REVIEW',
        documentName: fileName,
        documentUrl: result.signedUrl,
        ocrProcessedAt: new Date().toISOString()
      });
    } else {
      setStep('BLOCKED');
    }
  };

  const resetModal = () => {
    setStep('IDLE');
    setScanResult(null);
  };

  return (
    <div className="modal-overlay font-sans">
      <div className="inst-card-elevated p-6 max-w-md w-full border border-[#30363D] shadow-2xl relative space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363D] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-blue-500/10 text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Secure Upload & Intent Pipeline</h3>
              <p className="text-xs text-[#8B949E]">Zero-Trust Sandbox Malware & MIME Inspection</p>
            </div>
          </div>

          <button onClick={onClose} className="text-[#8B949E] hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content View */}
        {step === 'IDLE' && (
          <div className="space-y-4">
            
            <div className="border-2 border-dashed border-[#30363D] hover:border-blue-500 rounded p-6 text-center cursor-pointer transition-colors bg-[#0D1117]">
              <Upload className="w-10 h-10 text-blue-400 mx-auto mb-2" />
              <h4 className="font-bold text-white text-xs">Drop invoice document here</h4>
              <p className="text-[11px] text-[#8B949E] mt-1">Accepts PDF, TIFF, PNG (Max 25MB). Sandboxed Intent URL.</p>
            </div>

            <div className="border-t border-[#30363D] pt-4 space-y-2">
              <span className="text-xs text-[#8B949E] font-bold uppercase tracking-wider block">
                Test Pipeline Scenarios:
              </span>
              
              <button
                onClick={() => handleTestUpload('Legitimate_Invoice_INV-8890.pdf', false)}
                className="w-full p-3 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#3FB950] text-left flex items-center justify-between transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#3FB950]" />
                  <div>
                    <span className="font-bold text-white block">Legitimate PDF Invoice</span>
                    <span className="text-[10px] text-[#8B949E]">Valid MIME, passes malware scan</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#3FB950]" />
              </button>

              <button
                onClick={() => handleTestUpload('Malicious_Payload.exe', true)}
                className="w-full p-3 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#F85149] text-left flex items-center justify-between transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <AlertOctagon className="w-4 h-4 text-[#F85149]" />
                  <div>
                    <span className="font-bold text-[#F85149] block">Hostile Executable (.exe)</span>
                    <span className="text-[10px] text-[#F85149]/80">PE32 magic byte block</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#F85149]" />
              </button>

            </div>

          </div>
        )}

        {step === 'SCANNING' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <h4 className="font-bold text-white text-xs">Running Security Pipeline...</h4>
          </div>
        )}

        {step === 'BLOCKED' && scanResult && (
          <div className="space-y-3 py-2 text-xs">
            <div className="p-4 rounded bg-[#DA3633]/15 border border-[#DA3633]/40 flex items-start gap-2.5">
              <AlertOctagon className="w-5 h-5 text-[#F85149] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#F85149] text-xs">SECURITY ALERT: FILE BLOCKED</h4>
                <p className="text-[#C9D1D9] mt-1 text-[11px] leading-relaxed">{scanResult.threatDetails}</p>
              </div>
            </div>

            <button onClick={resetModal} className="btn-inst-secondary w-full justify-center text-xs">
              <RefreshCw className="w-3.5 h-3.5" /> Reset and Try Another File
            </button>
          </div>
        )}

        {step === 'SUCCESS' && scanResult && (
          <div className="space-y-4 py-2 text-center text-xs">
            <div className="w-12 h-12 bg-[#238636]/20 text-[#3FB950] rounded-full flex items-center justify-center mx-auto border border-[#238636]/40">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h4 className="font-bold text-white text-sm">Document Passed Security Inspection!</h4>

            <button onClick={onClose} className="btn-inst-primary w-full justify-center text-xs">
              View Extracted Case Profile
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
