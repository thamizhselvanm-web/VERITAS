import React, { useState } from 'react';
import { Upload, AlertOctagon, CheckCircle2, ArrowRight, Activity, BarChart3 } from 'lucide-react';
import { FileScanner } from '../../services/fileScanner';
import { SecurityScanResult, InvoiceCase } from '../../types';
import { ReceiptAnalyticsModal } from '../modals/ReceiptAnalyticsModal';

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
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState<boolean>(false);

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

    for (let i = 0; i < pipelineSteps.length; i++) {
      setCurrentStepIndex(i);
      await new Promise((res) => setTimeout(res, 350));
      if (isMalware && i === 2) {
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
    <div className="space-y-6 font-sans select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2E2A27] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F7F4F1] tracking-tight">Secure Invoice Ingestion & Processing Pipeline</h1>
          <p className="text-xs text-[#9E8C7C] font-mono mt-1">
            Zero-trust signed intent URL &bull; Live step-by-step document intelligence pipeline
          </p>
        </div>

        {/* Primary Action Button to Launch PDF Receipt Real-Time Analytics */}
        <button
          onClick={() => setIsAnalyticsModalOpen(true)}
          className="btn-primary py-2.5 px-5 text-xs font-mono font-bold flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Upload PDF Receipt & Get Real-Time Analytics</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Drag Drop & Test Triggers (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="spatial-panel p-6 border border-[#2E2A27] space-y-4">
            <h3 className="font-bold text-[#F7F4F1] text-sm">Authenticated Upload Intent</h3>

            <div
              onClick={() => setIsAnalyticsModalOpen(true)}
              className="border-2 border-dashed border-[#2E2A27] hover:border-[#6366F1] rounded-xl p-8 text-center bg-[#141211] transition-colors cursor-pointer"
            >
              <Upload className="w-10 h-10 text-[#6366F1] mx-auto mb-2" />
              <h4 className="font-bold text-[#F7F4F1] text-xs">Drop invoice PDF or receipt file here</h4>
              <p className="text-[11px] text-[#9E8C7C] mt-1">Accepts PDF, TIFF, PNG (Max 35MB). Realtime OCR & Analytics.</p>
            </div>

            <div className="border-t border-[#2E2A27] pt-4 space-y-2">
              <span className="text-xs font-bold text-[#9E8C7C] uppercase tracking-wider block">
                Test Pipeline Scenarios:
              </span>

              <button
                onClick={() => setIsAnalyticsModalOpen(true)}
                className="w-full p-3 rounded-lg bg-[#141211] border border-[#2E2A27] hover:border-[#52B788] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                  <div>
                    <span className="font-bold text-[#F7F4F1] block">Upload Real PDF Receipt & Extract Analytics</span>
                    <span className="text-[10px] text-[#9E8C7C]">OCR, KYC, Tax & Realtime Telemetry</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#52B788]" />
              </button>

              <button
                onClick={() => handleSimulateUpload('Hostile_Malware_Payload.exe', true)}
                className="w-full p-3 rounded-lg bg-[#141211] border border-[#2E2A27] hover:border-[#F07151] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <AlertOctagon className="w-4 h-4 text-[#F07151]" />
                  <div>
                    <span className="font-bold text-[#F07151] block">Hostile Malware Payload (.exe)</span>
                    <span className="text-[10px] text-[#F07151]/80">Simulates PE32 magic byte block</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#F07151]" />
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Live Processing Timeline (7 cols) */}
        <div className="lg:col-span-7">
          <div className="spatial-panel p-6 border border-[#2E2A27] space-y-5 min-h-[420px] flex flex-col justify-between">
            
            <div className="flex items-center justify-between border-b border-[#2E2A27] pb-3.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#6366F1]" />
                <h3 className="font-bold text-[#F7F4F1] text-sm">Live Processing Timeline</h3>
              </div>
              <span className="text-[10px] font-mono text-[#9E8C7C]">
                {step === 'IDLE' ? 'Awaiting Upload' : step === 'PROCESSING' ? 'Pipeline Executing...' : step}
              </span>
            </div>

            <div className="space-y-2 py-1">
              {pipelineSteps.map((stepName, idx) => {
                const isCurrent = step === 'PROCESSING' && currentStepIndex === idx;
                const isPassed = step === 'SUCCESS' || (step === 'PROCESSING' && currentStepIndex > idx);
                const isFailed = step === 'BLOCKED' && currentStepIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'bg-[#6366F1]/15 border-[#6366F1] text-[#F7F4F1] font-bold'
                        : isPassed
                        ? 'bg-[#52B788]/10 border-[#52B788]/40 text-[#52B788]'
                        : isFailed
                        ? 'bg-[#F07151]/20 border-[#F07151] text-[#F07151] font-bold'
                        : 'bg-[#141211] border-[#2E2A27] text-[#9E8C7C]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] w-5 text-right opacity-75">{idx + 1}.</span>
                      <span>{stepName}</span>
                    </div>

                    {isPassed && <CheckCircle2 className="w-4 h-4 text-[#52B788]" />}
                    {isCurrent && <div className="w-3.5 h-3.5 rounded-full border-2 border-[#6366F1] border-t-transparent animate-spin"></div>}
                    {isFailed && <AlertOctagon className="w-4 h-4 text-[#F07151]" />}
                  </div>
                );
              })}
            </div>

            {step === 'SUCCESS' && (
              <div className="pt-3 border-t border-[#2E2A27] flex justify-end">
                <button
                  onClick={() => onNavigateToCase(createdCaseId)}
                  className="btn-spatial-primary text-xs"
                >
                  View Extracted Case Profile ({createdCaseId}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {step === 'BLOCKED' && scanResult && (
              <div className="p-3 rounded-lg bg-[#F07151]/15 border border-[#F07151]/40 text-xs text-[#F07151] flex items-center justify-between font-mono">
                <span>{scanResult.threatDetails}</span>
                <span className="font-bold">QUARANTINED</span>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* PDF Receipt Real-Time Data Analytics Modal */}
      <ReceiptAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        onCaseCreated={onUploadSuccess}
      />

    </div>
  );
};
