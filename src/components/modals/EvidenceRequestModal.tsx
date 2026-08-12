import React, { useState } from 'react';
import { X, FileText, Send, AlertCircle, CheckSquare, Square } from 'lucide-react';
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
    <div className="modal-overlay">
      <div className="inst-card-elevated p-6 max-w-lg w-full shadow-2xl relative space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363D] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-blue-500/10 text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Request Supporting Evidence</h3>
              <p className="text-xs text-[#8B949E] font-mono mt-0.5">Case {invoiceCase.caseNumber}</p>
            </div>
          </div>

          <button onClick={onClose} className="text-[#8B949E] hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#C9D1D9] leading-relaxed">
          What evidence would reduce uncertainty for this financing request?
        </p>

        {/* Checkbox Items per UI Brief Section 13 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2.5 bg-[#0D1117] p-4 rounded border border-[#30363D] text-xs">
            
            <label 
              onClick={() => setBuyerConfirmation(!buyerConfirmation)}
              className="flex items-center gap-3 cursor-pointer text-[#C9D1D9] hover:text-white select-none"
            >
              {buyerConfirmation ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4 text-[#484F58]" />}
              <span>Buyer Direct Written Confirmation</span>
            </label>

            <label 
              onClick={() => setPurchaseOrder(!purchaseOrder)}
              className="flex items-center gap-3 cursor-pointer text-[#C9D1D9] hover:text-white select-none"
            >
              {purchaseOrder ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4 text-[#484F58]" />}
              <span>Signed Purchase Order Document</span>
            </label>

            <label 
              onClick={() => setDeliveryProof(!deliveryProof)}
              className="flex items-center gap-3 cursor-pointer text-[#C9D1D9] hover:text-white select-none"
            >
              {deliveryProof ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4 text-[#484F58]" />}
              <span>Proof of Delivery / Bill of Lading</span>
            </label>

            <label 
              onClick={() => setPaymentEvidence(!paymentEvidence)}
              className="flex items-center gap-3 cursor-pointer text-[#C9D1D9] hover:text-white select-none"
            >
              {paymentEvidence ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4 text-[#484F58]" />}
              <span>Historical Bank Payment Evidence</span>
            </label>

            <label 
              onClick={() => setBusinessVerification(!businessVerification)}
              className="flex items-center gap-3 cursor-pointer text-[#C9D1D9] hover:text-white select-none"
            >
              {businessVerification ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4 text-[#484F58]" />}
              <span>Seller Commercial Business Verification</span>
            </label>

          </div>

          <div>
            <label className="text-xs text-[#8B949E] font-medium block mb-1.5">Additional Underwriter Notes:</label>
            <textarea
              value={otherNotes}
              onChange={(e) => setOtherNotes(e.target.value)}
              placeholder="Specify precise document requirements or escalation timeline..."
              rows={3}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded p-3 text-xs text-white placeholder-[#484F58] focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-inst-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn-inst-primary text-xs">
              <Send className="w-3.5 h-3.5" /> Dispatch Evidence Request
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
