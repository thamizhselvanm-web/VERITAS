import React, { useState } from 'react';
import { 
  FileText, Upload, X, ShieldCheck, CheckCircle2, AlertTriangle, 
  BarChart3, Cpu, DollarSign, Send, ArrowRight, RefreshCw, Layers 
} from 'lucide-react';
import { receiptParserService, ExtractedReceiptData } from '../../services/receiptParserService';
import { twilioWhatsAppService } from '../../services/twilioWhatsAppService';
import { InvoiceCase } from '../../types';

interface ReceiptAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: Partial<InvoiceCase>) => void;
}

export const ReceiptAnalyticsModal: React.FC<ReceiptAnalyticsModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedReceiptData | null>(null);
  const [whatsappSent, setWhatsappSent] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    setParsing(true);
    setExtractedData(null);
    setWhatsappSent(false);

    const result = await receiptParserService.parseReceiptPdf(selectedFile);
    setExtractedData(result);
    setParsing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = (sampleName: string, highRisk: boolean = false) => {
    const fakeContent = 'PDF-1.7 %PDF-INVOICE-DATA...';
    const fakeFile = new File(
      [fakeContent], 
      highRisk ? `High_Risk_Duplicate_${sampleName}` : sampleName, 
      { type: 'application/pdf' }
    );
    handleFileUpload(fakeFile);
  };

  const handleAddToQueue = () => {
    if (!extractedData) return;
    const partialCase = receiptParserService.convertToInvoiceCase(extractedData);
    onCaseCreated(partialCase);
    onClose();
  };

  const handleApproveAndDispatchWhatsApp = async () => {
    if (!extractedData) return;
    const partialCase = receiptParserService.convertToInvoiceCase(extractedData) as InvoiceCase;
    
    // Dispatch Twilio WhatsApp Message using loaded credentials
    await twilioWhatsAppService.sendApprovalWhatsApp(partialCase, extractedData.analytics.hash);
    setWhatsappSent(true);

    onCaseCreated(partialCase);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans select-none animate-fadeIn"
    >
      <div className="w-full max-w-3xl bg-[#1C1816] border border-[#E07A5F]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <header className="p-4 bg-[#141211] border-b border-[#E07A5F]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B85235] to-[#E07A5F] flex items-center justify-center text-white shadow-md shadow-[#E07A5F]/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#F7F4F1]">PDF Receipt Extraction & Real-Time Data Analytics</h3>
                <span className="pill verified text-[10px] py-0.5 px-2 font-mono">
                  REALTIME OCR ENGINE
                </span>
              </div>
              <p className="text-[11px] text-[#9E8C7C] font-mono mt-0.5">
                Upload PDF receipt for instant telemetry extraction & fraud risk scoring
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9E8C7C] hover:text-[#F7F4F1] hover:bg-[#231E1B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          
          {/* File Upload Dropzone */}
          {!extractedData && !parsing && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[#E07A5F]/40 hover:border-[#E07A5F] rounded-2xl p-8 text-center bg-[#141211]/80 cursor-pointer transition-all hover:bg-[#141211] space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-[#E07A5F]/15 border border-[#E07A5F]/30 text-[#E07A5F] flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#F7F4F1] text-sm">Drag & Drop PDF Receipt or Click to Browse</h4>
                  <p className="text-xs text-[#9E8C7C] mt-1">Supports PDF, TIFF, PNG invoices up to 35MB</p>
                </div>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="pdf-receipt-file-input"
                />
                <label
                  htmlFor="pdf-receipt-file-input"
                  className="btn primary py-2 px-5 text-xs font-mono inline-block cursor-pointer"
                >
                  Browse PDF File
                </label>
              </div>

              {/* Quick Sample File Tests */}
              <div className="border-t border-[#E07A5F]/20 pt-4 space-y-2">
                <span className="text-[11px] font-mono text-[#D8C7B8] font-bold uppercase tracking-wider block">
                  Or Test Sample PDF Receipts:
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSampleClick('Legitimate_Hardware_Receipt_INV-9900.pdf', false)}
                    className="p-3 rounded-xl bg-[#141211] border border-[#E07A5F]/20 hover:border-[#52B788] text-left flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                      <div>
                        <span className="font-bold text-[#F7F4F1] block">Legitimate PDF Receipt</span>
                        <span className="text-[10px] text-[#9E8C7C] font-mono">100% Tax & KYC Match</span>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSampleClick('Duplicate_Vendor_Receipt_INV-4410.pdf', true)}
                    className="p-3 rounded-xl bg-[#141211] border border-[#E07A5F]/20 hover:border-[#E5484D] text-left flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-[#E5484D]" />
                      <div>
                        <span className="font-bold text-[#E5484D] block">High Risk Duplicate</span>
                        <span className="text-[10px] text-[#E5484D]/80 font-mono">Hash Collision Anomaly</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Parsing Spinner */}
          {parsing && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-3 border-[#E07A5F] border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h4 className="font-bold text-[#F7F4F1] text-sm">Extracting PDF Telemetry & Analytics…</h4>
                <p className="text-xs text-[#9E8C7C] font-mono mt-1">Running OCR, layout parsing, and tax registry check</p>
              </div>
            </div>
          )}

          {/* Real-Time Data Analytics Results */}
          {extractedData && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Real-Time Telemetry Bar */}
              <div className="grid grid-cols-4 gap-3 text-xs">
                
                <div className="p-3 rounded-xl bg-[#141211] border border-[#E07A5F]/20 space-y-1">
                  <span className="text-[10px] font-mono text-[#9E8C7C] block">OCR CONFIDENCE</span>
                  <strong className="text-base font-bold text-[#52B788] font-mono block">
                    {extractedData.analytics.ocrConfidence}%
                  </strong>
                  <span className="text-[9px] text-[#9E8C7C]">Precise Text extraction</span>
                </div>

                <div className="p-3 rounded-xl bg-[#141211] border border-[#E07A5F]/20 space-y-1">
                  <span className="text-[10px] font-mono text-[#9E8C7C] block">PARSING ACCURACY</span>
                  <strong className="text-base font-bold text-[#F7F4F1] font-mono block">
                    {extractedData.analytics.parsingAccuracy}%
                  </strong>
                  <span className="text-[9px] text-[#9E8C7C]">Layout structure matched</span>
                </div>

                <div className="p-3 rounded-xl bg-[#141211] border border-[#E07A5F]/20 space-y-1">
                  <span className="text-[10px] font-mono text-[#9E8C7C] block">VENDOR KYC MATCH</span>
                  <strong className="text-base font-bold text-[#E07A5F] font-mono block">
                    {extractedData.analytics.vendorKycScore}%
                  </strong>
                  <span className="text-[9px] text-[#9E8C7C]">IRS / VIES Verified</span>
                </div>

                <div className="p-3 rounded-xl bg-[#141211] border border-[#E07A5F]/20 space-y-1">
                  <span className="text-[10px] font-mono text-[#9E8C7C] block">OVERALL TRUST SCORE</span>
                  <strong className={`text-base font-bold font-mono block ${
                    extractedData.analytics.overallTrustScore >= 80 ? 'text-[#52B788]' : 'text-[#E5484D]'
                  }`}>
                    {extractedData.analytics.overallTrustScore} / 100
                  </strong>
                  <span className="text-[9px] text-[#9E8C7C]">Continuous Risk Index</span>
                </div>

              </div>

              {/* Extracted Invoice Details Card */}
              <div className="bg-[#141211] p-4 rounded-xl border border-[#E07A5F]/30 space-y-4">
                
                <div className="flex items-center justify-between border-b border-[#E07A5F]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#E07A5F]" />
                    <span className="font-mono font-bold text-xs text-[#F7F4F1]">
                      Invoice #{extractedData.invoiceNumber}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-[#9E8C7C]">
                    File: <code className="text-[#E07A5F]">{extractedData.fileName}</code>
                  </span>
                </div>

                {/* Entity & Amount Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#1C1816] border border-[#E07A5F]/20 space-y-1">
                    <span className="text-[10px] text-[#9E8C7C] block">SELLER ENTITY</span>
                    <strong className="text-[#F7F4F1] block">{extractedData.sellerName}</strong>
                    <span className="text-[10px] text-[#E07A5F]">Tax ID: {extractedData.sellerTaxId}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1C1816] border border-[#E07A5F]/20 space-y-1">
                    <span className="text-[10px] text-[#9E8C7C] block">BUYER ENTITY</span>
                    <strong className="text-[#F7F4F1] block">{extractedData.buyerName}</strong>
                    <span className="text-[10px] text-[#E07A5F]">Tax ID: {extractedData.buyerTaxId}</span>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#D8C7B8] font-bold uppercase tracking-wider block">
                    Extracted Line Items:
                  </span>

                  <table className="w-full text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-[#E07A5F]/20 text-[#9E8C7C] text-[10px] text-left">
                        <th className="py-1.5">Description</th>
                        <th className="py-1.5 text-center">Qty</th>
                        <th className="py-1.5 text-right">Unit Price</th>
                        <th className="py-1.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractedData.lineItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-[#231E1B]">
                          <td className="py-2 text-[#F7F4F1]">{item.description}</td>
                          <td className="py-2 text-center text-[#D8C7B8]">{item.qty}</td>
                          <td className="py-2 text-right text-[#D8C7B8]">${(item.unitPrice / 100).toLocaleString()}</td>
                          <td className="py-2 text-right font-bold text-[#E07A5F]">${(item.total / 100).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Financial Summary */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E07A5F]/20 text-xs font-mono">
                  <span className="text-[#9E8C7C]">GROSS AMOUNT PAYABLE:</span>
                  <strong className="text-lg font-bold text-[#52B788]">
                    {extractedData.currency} ${(extractedData.totalMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </strong>
                </div>

              </div>

              {/* WhatsApp Sent Feedback Alert */}
              {whatsappSent && (
                <div className="p-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-xs text-[#25D366] font-mono flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Live WhatsApp Approval Notification Dispatched via Twilio API!
                  </span>
                  <span className="text-[10px]">Check your phone</span>
                </div>
              )}

              {/* Action Buttons Footer */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setExtractedData(null)}
                  className="btn text-xs font-mono py-2.5 px-4 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Upload Another PDF</span>
                </button>

                <button
                  onClick={handleAddToQueue}
                  className="btn primary flex-1 text-xs font-mono py-2.5 flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>Add Case to VERITAS Queue</span>
                </button>

                <button
                  onClick={handleApproveAndDispatchWhatsApp}
                  className="btn primary py-2.5 px-5 text-xs font-mono font-bold flex items-center gap-2 bg-gradient-to-r from-[#B85235] to-[#E07A5F]"
                >
                  <Send className="w-4 h-4" />
                  <span>Approve &amp; Send WhatsApp</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <footer className="p-4 bg-[#141211] border-t border-[#E07A5F]/20 flex items-center justify-between text-[11px] text-[#9E8C7C] font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#52B788]" />
            <span>VERITAS Zero-Trust Realtime Receipt Analytics Engine</span>
          </div>

          <button onClick={onClose} className="btn text-xs">
            Close
          </button>
        </footer>

      </div>
    </div>
  );
};
