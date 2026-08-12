import React, { useState } from 'react';
import { Upload, ShieldCheck, AlertOctagon, CheckCircle2, FileCode, ArrowRight, Lock, Activity } from 'lucide-react';
import { FileScanner } from '../../services/fileScanner';
import { SecurityScanResult, InvoiceCase } from '../../types';

interface UploadPipelinePageProps {
  onUploadSuccess: (newCase: Partial<InvoiceCase>) => void;
  onNavigateToCase: (caseId: string) => void;
}

export const UploadPipelinePage: React.FC<UploadPipelinePageProps> = ({
  onUploadSuccess,
  onNavigateToCase
}) => {
  const [step, setStep] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'BLOCKED'>('IDLE');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [scanResult, setScanResult] = useState<SecurityScanResult | null>(null);
  const [createdCaseId, setCreatedCaseId] = useState<string>('');

  const pipelineSteps = [
    'Secure Authenticated Upload Intent',
    'Pre-signed S3 Storage Allocation',
    'Zero-Trust Malware & MIME Signature Scan',
    'PDF Parser OCR Extraction Sandbox',
    'Canonical Field Normalization',
    'External Entity Identity Verification',
    'Exact SHA-256 & Near-Duplicate Analysis',
    'Relationship & Behavior Anomaly Scoring',
    '3-Pillar Trust Profile Telemetry Generation'
  ];

  const handleSimulateUpload = async (fileName: string, isMalware: boolean) => {
    setStep('PROCESSING');
    setCurrentStepIndex(0);

    // Step-by-step processing animation per UI Brief Sec 7
    for (let i = 0; i < pipelineSteps.length; i++) {
      setCurrentStepIndex(i);
      await new Promise((res) => setTimeout(res, 350));
      if (isMalware && i === 2) {
        // Block at malware step
        const fakeFile = new File(['MZ90'], fileName, { type: 'application/x-msdownload' });
        const res = await FileScanner.scanFile(fakeFile);
        setScanResult(res);
        setStep('BLOCKED');
        return;
      }
    }

    const fakeFile = new File(['PDF-1.7...'], fileName, { type: 'application/pdf' });
    const res = await FileScanner.scanFile(fakeFile);
    setScanResult(res);

    const newId = `case-vrt-${Math.floor(10000 + Math.random() * 90000)}`;
    setCreatedCaseId(newId);

    onUploadSuccess({
      id: newId,
      caseNumber: `VRT-${Math.floor(10000 + Math.random() * 90000)}`,
      sellerName: 'Apex Quantum Hardware Labs',
      sellerTaxId: 'US-1102938',
      buyerName: 'OmniTech Solutions',
      buyerTaxId: 'US-8839201',
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: '2026-08-11',
      dueDate: '2026-10-11',
      totalMinor: 14500000,
      currency: 'USD',
      status: 'NEEDS_REVIEW',
      documentName: fileName,
      documentUrl: res.signedUrl,
      ocrProcessedAt: new Date().toISOString()
    });

    setStep('SUCCESS');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363D] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Secure Invoice Ingestion & Processing Pipeline</h1>
          <p className="text-xs text-[#8B949E] font-mono mt-1">
            Zero-trust signed intent URL &bull; Live step-by-step document intelligence pipeline
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Drag Drop & Test Triggers (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="inst-card p-6 border border-[#30363D] space-y-4">
            <h3 className="font-bold text-white text-sm">Authenticated Upload Intent</h3>

            <div className="border-2 border-dashed border-[#30363D] hover:border-blue-500 rounded-lg p-8 text-center bg-[#0D1117] transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-blue-400 mx-auto mb-2" />
              <h4 className="font-bold text-white text-xs">Drop invoice PDF or image here</h4>
              <p className="text-[11px] text-[#8B949E] mt-1">Accepts PDF, TIFF, PNG (Max 25MB). Sandboxed Intent URL.</p>
            </div>

            <div className="border-t border-[#30363D] pt-4 space-y-2">
              <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider block">
                Test Pipeline Scenarios:
              </span>

              <button
                onClick={() => handleSimulateUpload('INV-2026-9900_Legitimate.pdf', false)}
                className="w-full p-3 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#3FB950] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#3FB950]" />
                  <div>
                    <span className="font-bold text-white block">Legitimate PDF Invoice</span>
                    <span className="text-[10px] text-[#8B949E]">Passes malware scan and executes OCR pipeline</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#3FB950]" />
              </button>

              <button
                onClick={() => handleSimulateUpload('Hostile_Malware_Payload.exe', true)}
                className="w-full p-3 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#F85149] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <AlertOctagon className="w-4 h-4 text-[#F85149]" />
                  <div>
                    <span className="font-bold text-[#F85149] block">Hostile Malware Payload (.exe)</span>
                    <span className="text-[10px] text-[#F85149]/80">Simulates PE32 magic byte block</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#F85149]" />
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Live Processing Timeline per UI Brief Sec 7 (7 cols) */}
        <div className="lg:col-span-7">
          <div className="inst-card p-6 border border-[#30363D] space-y-5 min-h-[420px] flex flex-col justify-between">
            
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Live Processing Timeline</h3>
              </div>
              <span className="text-[10px] font-mono text-[#8B949E]">
                {step === 'IDLE' ? 'Awaiting Upload' : step === 'PROCESSING' ? 'Pipeline Executing...' : step}
              </span>
            </div>

            {/* Step-by-step Timeline View per UI Brief Sec 7 */}
            <div className="space-y-2.5 py-2">
              {pipelineSteps.map((stepName, idx) => {
                const isCurrent = step === 'PROCESSING' && currentStepIndex === idx;
                const isPassed = step === 'SUCCESS' || (step === 'PROCESSING' && currentStepIndex > idx);
                const isFailed = step === 'BLOCKED' && currentStepIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded border text-xs flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'bg-blue-500/10 border-blue-500 text-white font-bold'
                        : isPassed
                        ? 'bg-[#238636]/10 border-[#238636]/40 text-[#3FB950]'
                        : isFailed
                        ? 'bg-[#DA3633]/20 border-[#DA3633] text-[#F85149] font-bold'
                        : 'bg-[#0D1117] border-[#30363D] text-[#8B949E]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] w-5 text-right opacity-75">{idx + 1}.</span>
                      <span>{stepName}</span>
                    </div>

                    {isPassed && <CheckCircle2 className="w-4 h-4 text-[#3FB950]" />}
                    {isCurrent && <div className="w-3 h-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>}
                    {isFailed && <AlertOctagon className="w-4 h-4 text-[#F85149]" />}
                  </div>
                );
              })}
            </div>

            {/* Result CTA Footer */}
            {step === 'SUCCESS' && (
              <div className="pt-3 border-t border-[#30363D] flex justify-end">
                <button
                  onClick={() => onNavigateToCase(createdCaseId)}
                  className="btn-inst-primary text-xs"
                >
                  View Extracted Case Profile ({createdCaseId}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {step === 'BLOCKED' && scanResult && (
              <div className="p-3 rounded bg-[#DA3633]/15 border border-[#DA3633]/40 text-xs text-[#F85149] flex items-center justify-between">
                <span>{scanResult.threatDetails}</span>
                <span className="font-mono font-bold">QUARANTINED</span>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
