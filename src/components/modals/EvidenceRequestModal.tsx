import React, { useState } from 'react';
import { X, FileText, Send, CheckSquare, Square } from 'lucide-react';
import { InvoiceCase } from '../../types';

interface EvidenceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceCase: InvoiceCase;
  onSubmitRequest: (requiredDocs: Record<string, boolean>, notes: string) => void;
}

export const EvidenceRequestModal: React.FC<EvidenceRequestModalProps> = ({
  isOpen,
  onClose,
  invoiceCase,
  onSubmitRequest
}) => {
  const [buyerConfirmation, setBuyerConfirmation] = useState(true);
  const [purchaseOrder, setPurchaseOrder] = useState(false);
  const [deliveryProof, setDeliveryProof] = useState(true);
  const [paymentEvidence, setPaymentEvidence] = useState(false);
  const [businessVerification, setBusinessVerification] = useState(false);
  const [otherNotes, setOtherNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRequest(
      {
        buyerConfirmation,
        purchaseOrder,
        deliveryProof,
        paymentEvidence,
        businessVerification
      },
      otherNotes
    );
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Request Supporting Evidence Modal"
    >
      <div 
        className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2E2A27] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#6366F1]/15 text-[#6366F1]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#F7F4F1] text-base">Request Supporting Evidence</h3>
              <p className="text-xs text-[#9E8C7C] font-mono mt-0.5">Case Ref {invoiceCase.caseNumber}</p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="text-[#9E8C7C] hover:text-[#F7F4F1] p-1.5 rounded-lg bg-[#262320] border border-[#2E2A27] transition-all"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#D8C7B8] leading-relaxed">
          Select required documentation to reduce uncertainty for seller <strong className="text-[#F7F4F1]">{invoiceCase.sellerName}</strong>:
        </p>

        {/* Checkbox Options */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3 bg-[#141211] p-4.5 rounded-xl border border-[#2E2A27] text-xs">
            
            <label 
              onClick={() => setBuyerConfirmation(!buyerConfirmation)}
              className="flex items-center gap-3 cursor-pointer text-[#D8C7B8] hover:text-[#F7F4F1] select-none p-1"
            >
              {buyerConfirmation ? <CheckSquare className="w-4 h-4 text-[#6366F1]" /> : <Square className="w-4 h-4 text-[#9E8C7C]" />}
              <span>Buyer Direct Written Confirmation</span>
            </label>

            <label 
              onClick={() => setPurchaseOrder(!purchaseOrder)}
              className="flex items-center gap-3 cursor-pointer text-[#D8C7B8] hover:text-[#F7F4F1] select-none p-1"
            >
              {purchaseOrder ? <CheckSquare className="w-4 h-4 text-[#6366F1]" /> : <Square className="w-4 h-4 text-[#9E8C7C]" />}
              <span>Signed Purchase Order Document</span>
            </label>

            <label 
              onClick={() => setDeliveryProof(!deliveryProof)}
              className="flex items-center gap-3 cursor-pointer text-[#D8C7B8] hover:text-[#F7F4F1] select-none p-1"
            >
              {deliveryProof ? <CheckSquare className="w-4 h-4 text-[#6366F1]" /> : <Square className="w-4 h-4 text-[#9E8C7C]" />}
              <span>Proof of Delivery / Bill of Lading</span>
            </label>

            <label 
              onClick={() => setPaymentEvidence(!paymentEvidence)}
              className="flex items-center gap-3 cursor-pointer text-[#D8C7B8] hover:text-[#F7F4F1] select-none p-1"
            >
              {paymentEvidence ? <CheckSquare className="w-4 h-4 text-[#6366F1]" /> : <Square className="w-4 h-4 text-[#9E8C7C]" />}
              <span>Historical Bank Payment Evidence</span>
            </label>

            <label 
              onClick={() => setBusinessVerification(!businessVerification)}
              className="flex items-center gap-3 cursor-pointer text-[#D8C7B8] hover:text-[#F7F4F1] select-none p-1"
            >
              {businessVerification ? <CheckSquare className="w-4 h-4 text-[#6366F1]" /> : <Square className="w-4 h-4 text-[#9E8C7C]" />}
              <span>Seller Commercial Business Verification</span>
            </label>

          </div>

          <div>
            <label className="text-xs text-[#9E8C7C] font-mono font-bold uppercase tracking-wider block mb-2">
              Additional Underwriter Notes:
            </label>
            <textarea
              value={otherNotes}
              onChange={(e) => setOtherNotes(e.target.value)}
              placeholder="Specify precise document requirements or escalation timeline..."
              rows={3}
              className="w-full bg-[#141211] border border-[#2E2A27] rounded-xl p-3 text-xs font-mono text-[#F7F4F1] placeholder-[#9E8C7C] outline-none focus:border-[#6366F1]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded-lg bg-[#262320] border border-[#2E2A27] text-xs font-semibold text-[#D8C7B8] hover:text-[#F7F4F1]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Evidence Request
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
