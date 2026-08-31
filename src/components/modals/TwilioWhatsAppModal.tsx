import React, { useState } from 'react';
import { MessageSquare, CheckCheck, Send, X, ShieldCheck, Terminal, Key, CheckCircle2 } from 'lucide-react';
import { WhatsAppMessagePayload, twilioWhatsAppService } from '../../services/twilioWhatsAppService';
import { InvoiceCase } from '../../types';

interface TwilioWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: WhatsAppMessagePayload | null;
  invoiceCase: InvoiceCase | null;
}

export const TwilioWhatsAppModal: React.FC<TwilioWhatsAppModalProps> = ({
  isOpen,
  onClose,
  payload,
  invoiceCase
}) => {
  const currentConfig = twilioWhatsAppService.getConfig();

  const [accountSid, setAccountSid] = useState(currentConfig.accountSid);
  const [authToken, setAuthToken] = useState(currentConfig.authToken);
  const [phoneInput, setPhoneInput] = useState(
    currentConfig.toWhatsAppNumber?.replace('whatsapp:', '') || '+916369106960'
  );
  const [currentPayload, setCurrentPayload] = useState<WhatsAppMessagePayload | null>(payload);
  const [showApiInspector, setShowApiInspector] = useState(false);
  const [sending, setSending] = useState(false);

  // Sync state if payload changes
  React.useEffect(() => {
    if (payload) {
      setCurrentPayload(payload);
    }
  }, [payload]);

  if (!isOpen || !currentPayload || !invoiceCase) return null;

  const handleSendToPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const formattedNumber = phoneInput.trim().startsWith('+')
      ? phoneInput.trim()
      : `+91${phoneInput.trim().replace(/^0+/, '')}`;

    // Save credentials to service & localStorage
    twilioWhatsAppService.setConfig({
      accountSid: accountSid.trim(),
      authToken: authToken.trim(),
      toWhatsAppNumber: `whatsapp:${formattedNumber}`,
    });

    const updatedPayload = await twilioWhatsAppService.sendApprovalWhatsApp(
      invoiceCase,
      undefined,
      formattedNumber
    );

    setCurrentPayload(updatedPayload);
    setSending(false);
  };

  const targetNumberFormatted = phoneInput.trim().startsWith('+')
    ? phoneInput.trim()
    : `+91${phoneInput.trim().replace(/^0+/, '')}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans select-none animate-fadeIn"
    >
      <div className="w-full max-w-xl bg-[#1C1816] border border-[#2E2A27] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <header className="p-4 bg-[#141211] border-b border-[#2E2A27] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F7F4F1]">WhatsApp Dispatch Gateway</h3>
              <p className="text-[11px] text-[#9E8C7C] font-mono mt-0.5">
                Fund Disbursement Approval Message Engine
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

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">

          {/* API Error Notification if present */}
          {currentPayload.apiError && (
            <div className="p-3.5 rounded-xl bg-[rgba(229,72,77,0.14)] border border-[#E5484D]/40 text-xs text-[#E5484D] font-mono space-y-1">
              <strong>Gateway Notification:</strong>
              <p className="text-white">{currentPayload.apiError}</p>
            </div>
          )}

          {/* WhatsApp Message Preview Bubble */}
          <div className="bg-[#0B141A] rounded-xl border border-[#2E2A27] overflow-hidden shadow-lg">
            <div className="bg-[#1F2C34] px-4 py-2 flex items-center justify-between border-b border-[#2A3942]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#25D366] text-black font-bold text-[11px] flex items-center justify-center">
                  V
                </div>
                <span className="text-xs font-bold text-[#E9EDEF]">VERITAS Trust Engine</span>
              </div>
              <span className="text-[10px] font-mono text-[#25D366]">VERITAS WhatsApp API</span>
            </div>

            <div className="p-3.5 bg-[#0b141a]">
              <div className="max-w-md bg-[#005c4b] text-[#e9edef] rounded-lg rounded-tl-none p-3 shadow-md text-xs leading-relaxed font-sans space-y-1.5 border border-[#2A3942]">
                {currentPayload.body.split('\n').map((line, idx) => {
                  if (line.startsWith('📲')) {
                    return <p key={idx} className="font-bold text-white text-xs pb-1 border-b border-white/20">{line}</p>;
                  }
                  if (line.includes('*')) {
                    const parts = line.split('*');
                    return (
                      <p key={idx}>
                        {parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part))}
                      </p>
                    );
                  }
                  return <p key={idx}>{line}</p>;
                })}

                <div className="flex items-center justify-end gap-1.5 text-[10px] text-[#8696a0] pt-1 font-mono">
                  <span>{new Date(currentPayload.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                </div>
              </div>
            </div>
          </div>

          {/* Secure Gateway Credentials & Phone Form */}
          <form onSubmit={handleSendToPhone} className="p-4 border border-[#2E2A27] rounded-xl bg-[#141211] space-y-3.5 text-xs">
            
            <div className="flex items-center justify-between border-b border-[#2E2A27] pb-2">
              <span className="font-bold text-[#F7F4F1] flex items-center gap-2">
                <Key className="w-4 h-4 text-[#6366F1]" />
                Send Live WhatsApp Message to Mobile Phone
              </span>
              <span className="text-[10px] font-mono text-[#6366F1] uppercase tracking-wider">GATEWAY CREDS</span>
            </div>

            {/* Account SID (Masked as Password) */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-[#D8C7B8] block">ACCOUNT GATEWAY ID *</label>
              <input
                type="password"
                value={accountSid}
                onChange={(e) => setAccountSid(e.target.value)}
                placeholder="••••••••••••••••••••••••••••••••"
                required
                className="w-full bg-[#1C1917] border border-[#2E2A27] rounded-lg p-2.5 text-xs text-[#F7F4F1] font-mono outline-none focus:border-[#6366F1]"
              />
            </div>

            {/* Auth Token (Masked as Password) */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-[#D8C7B8] block">AUTH ACCESS TOKEN *</label>
              <input
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="••••••••••••••••••••••••••••••••"
                required
                className="w-full bg-[#1C1917] border border-[#2E2A27] rounded-lg p-2.5 text-xs text-[#F7F4F1] font-mono outline-none focus:border-[#6366F1]"
              />
            </div>

            {/* Default Phone Number Pre-populated with +916369106960 */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-[#D8C7B8] block">YOUR MOBILE PHONE NUMBER (WITH COUNTRY CODE) *</label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+916369106960"
                required
                className="w-full bg-[#1C1917] border border-[#6366F1]/50 rounded-lg p-2.5 text-xs text-[#F7F4F1] font-mono outline-none focus:border-[#6366F1] font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 text-xs font-mono font-bold flex items-center justify-center gap-2 mt-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Dispatching Message…' : 'Send Live WhatsApp Message Now'}</span>
            </button>

          </form>

          {/* Gateway API Payload Inspector */}
          <div className="border border-[#2E2A27] rounded-xl overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setShowApiInspector(!showApiInspector)}
              className="w-full p-2.5 bg-[#141211] hover:bg-[#262320] flex items-center justify-between text-[#D8C7B8] font-mono text-xs font-semibold transition-colors"
            >
              <span className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#6366F1]" />
                Inspect API Payload &amp; Headers
              </span>
              <span className="text-[10px] text-[#6366F1]">{showApiInspector ? 'Hide' : 'Show'}</span>
            </button>

            {showApiInspector && (
              <div className="p-3 bg-[#0B0F19] border-t border-[#2E2A27] font-mono text-[11px] text-[#9E8C7C] space-y-1.5">
                <div className="flex justify-between border-b border-[#2E2A27] pb-1">
                  <span>Endpoint:</span>
                  <span className="text-[#F7F4F1]">POST /gateway/v2.4/Accounts/.../Messages.json</span>
                </div>
                <div className="flex justify-between border-b border-[#2E2A27] pb-1">
                  <span>Target Recipient:</span>
                  <a href={`tel:${targetNumberFormatted}`} className="text-[#6366F1] hover:underline font-bold">
                    {targetNumberFormatted}
                  </a>
                </div>
                <div className="flex justify-between border-b border-[#2E2A27] pb-1">
                  <span>Message Ref:</span>
                  <span className="text-[#10B981]">{currentPayload.sid}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gateway Auth Status:</span>
                  <span className="text-[#10B981] font-bold">
                    Encrypted Credentials Loaded
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <footer className="p-4 bg-[#141211] border-t border-[#2E2A27] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9E8C7C] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>VERITAS WhatsApp Gateway v2.4 Enforced</span>
          </div>

          <button 
            onClick={onClose} 
            className="px-4 py-2 text-xs font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl cursor-pointer transition-all"
          >
            Done &amp; Close
          </button>
        </footer>

      </div>
    </div>
  );
};
