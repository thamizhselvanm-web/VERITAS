import React, { useState } from 'react';
import { MessageSquare, CheckCheck, Send, X, ShieldCheck, Terminal, Key, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
  const [phoneInput, setPhoneInput] = useState(currentConfig.toWhatsAppNumber || '');
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

    // Save credentials to service & localStorage
    twilioWhatsAppService.setConfig({
      accountSid: accountSid.trim(),
      authToken: authToken.trim(),
      toWhatsAppNumber: phoneInput.trim().startsWith('whatsapp:') ? phoneInput.trim() : `whatsapp:${phoneInput.trim()}`,
    });

    const updatedPayload = await twilioWhatsAppService.sendApprovalWhatsApp(
      invoiceCase,
      undefined,
      phoneInput.trim()
    );

    setCurrentPayload(updatedPayload);
    setSending(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans select-none animate-fadeIn"
    >
      <div className="w-full max-w-xl bg-[#1C1816] border border-[#E07A5F]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <header className="p-4 bg-[#141211] border-b border-[#E07A5F]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#F7F4F1]">Twilio WhatsApp Notification</h3>
                {currentPayload.isRealDispatch ? (
                  <span className="pill verified text-[10px] py-0.5 px-2 font-mono bg-[#25D366]/15 text-[#25D366]">
                    <CheckCheck className="w-3 h-3 text-[#25D366]" /> LIVE SENT TO PHONE
                  </span>
                ) : (
                  <span className="pill review text-[10px] py-0.5 px-2 font-mono">
                    NEEDS TWILIO CREDENTIALS
                  </span>
                )}
              </div>
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
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Status Alert Banner */}
          {currentPayload.isRealDispatch ? (
            <div className="p-3.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-xs space-y-1">
              <div className="flex items-center gap-2 text-[#25D366] font-bold">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Twilio WhatsApp Message Dispatched to Mobile Phone!</span>
              </div>
              <p className="text-[#F7F4F1]">
                Message SID: <code className="font-mono text-[#25D366]">{currentPayload.sid}</code>. Check your WhatsApp on phone <strong className="text-white">{currentPayload.to}</strong>.
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-[rgba(244,162,97,0.14)] border border-[#F4A261]/40 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#F4A261] font-bold">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Why didn't you receive a WhatsApp message on your phone yet?</span>
              </div>
              <p className="text-[#D8C7B8] leading-relaxed">
                Twilio requires your <strong>Account SID</strong> &amp; <strong>Auth Token</strong> to deliver messages to your mobile phone. Paste your Twilio credentials below to send a live message to your WhatsApp right now!
              </p>
            </div>
          )}

          {/* Twilio API Error Notification */}
          {currentPayload.apiError && currentPayload.apiError.includes('Twilio API Error') && (
            <div className="p-3.5 rounded-xl bg-[rgba(229,72,77,0.14)] border border-[#E5484D]/40 text-xs text-[#E5484D] font-mono space-y-1">
              <strong>Twilio API Error Response:</strong>
              <p className="text-white">{currentPayload.apiError}</p>
            </div>
          )}

          {/* WhatsApp Message Preview Bubble */}
          <div className="bg-[#0B141A] rounded-xl border border-[#25D366]/30 overflow-hidden shadow-xl">
            <div className="bg-[#1F2C34] px-4 py-2 flex items-center justify-between border-b border-[#2A3942]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#25D366] text-black font-bold text-[11px] flex items-center justify-center">
                  V
                </div>
                <span className="text-xs font-bold text-[#E9EDEF]">VERITAS Trust Engine</span>
              </div>
              <span className="text-[10px] font-mono text-[#25D366]">Twilio WhatsApp API</span>
            </div>

            <div className="p-3.5 bg-[radial-gradient(#111b21_1px,transparent_1px)] [background-size:16px_16px] bg-[#0b141a]">
              <div className="max-w-md bg-[#005c4b] text-[#e9edef] rounded-lg rounded-tl-none p-3 shadow-md text-xs leading-relaxed font-sans space-y-1.5 border border-[#25D366]/20">
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

          {/* Twilio Credentials & Phone Number Form */}
          <form onSubmit={handleSendToPhone} className="p-4 border border-[#E07A5F]/30 rounded-xl bg-[#1A1E24] space-y-3.5 text-xs">
            
            <div className="flex items-center justify-between border-b border-[#E07A5F]/20 pb-2">
              <span className="font-bold text-[#F7F4F1] flex items-center gap-2">
                <Key className="w-4 h-4 text-[#E07A5F]" />
                Send Live WhatsApp Message to Mobile Phone
              </span>
              <span className="text-[10px] font-mono text-[#E07A5F]">TWILIO CREDS</span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-[#D8C7B8] block">TWILIO ACCOUNT SID *</label>
              <input
                type="text"
                value={accountSid}
                onChange={(e) => setAccountSid(e.target.value)}
                placeholder="Paste Account SID (starts with AC...)"
                required
                className="w-full bg-[#141211] border border-[#E07A5F]/30 rounded-lg p-2.5 text-xs text-[#F7F4F1] font-mono outline-none focus:border-[#E07A5F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-[#D8C7B8] block">TWILIO AUTH TOKEN *</label>
              <input
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Paste Auth Token from Twilio console"
                required
                className="w-full bg-[#141211] border border-[#E07A5F]/30 rounded-lg p-2.5 text-xs text-[#F7F4F1] font-mono outline-none focus:border-[#E07A5F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-[#D8C7B8] block">YOUR MOBILE PHONE NUMBER (WITH COUNTRY CODE) *</label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. +919876543210 or +14155551234"
                required
                className="w-full bg-[#141211] border border-[#E07A5F]/30 rounded-lg p-2.5 text-xs text-[#F7F4F1] font-mono outline-none focus:border-[#E07A5F]"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn primary w-full py-3 text-xs font-mono font-bold flex items-center justify-center gap-2 mt-2"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Dispatching to Twilio…' : 'Send Live WhatsApp Message Now'}</span>
            </button>

          </form>

          {/* Twilio API Payload Inspector */}
          <div className="border border-[#E07A5F]/20 rounded-xl overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setShowApiInspector(!showApiInspector)}
              className="w-full p-2.5 bg-[#141211] hover:bg-[#231E1B] flex items-center justify-between text-[#D8C7B8] font-mono text-xs font-semibold transition-colors"
            >
              <span className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#E07A5F]" />
                Inspect API Payload & Headers
              </span>
              <span className="text-[10px] text-[#E07A5F]">{showApiInspector ? 'Hide' : 'Show'}</span>
            </button>

            {showApiInspector && (
              <div className="p-3 bg-[#0B0D10] border-t border-[#E07A5F]/20 font-mono text-[11px] text-[#9E8C7C] space-y-1.5">
                <div className="flex justify-between border-b border-[#242830] pb-1">
                  <span>Endpoint:</span>
                  <span className="text-[#F7F4F1]">POST /twilio-api/2010-04-01/Accounts/.../Messages.json</span>
                </div>
                <div className="flex justify-between border-b border-[#242830] pb-1">
                  <span>Target Recipient:</span>
                  <a href={`tel:${(currentPayload.to || phoneInput || '').replace('whatsapp:', '')}`} className="text-[#E07A5F] hover:underline font-bold">
                    {currentPayload.to || phoneInput || 'Not specified'}
                  </a>
                </div>
                <div className="flex justify-between border-b border-[#242830] pb-1">
                  <span>Message SID:</span>
                  <span className="text-[#52B788]">{currentPayload.sid}</span>
                </div>
                <div className="flex justify-between">
                  <span>Live Account Status:</span>
                  <span className={accountSid ? 'text-[#52B788] font-bold' : 'text-[#F4A261]'}>
                    {accountSid ? 'Twilio Credentials Loaded' : 'Awaiting Account SID'}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <footer className="p-4 bg-[#141211] border-t border-[#E07A5F]/20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9E8C7C] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#52B788]" />
            <span>Twilio WhatsApp API v2010-04-01 Enforced</span>
          </div>

          <button onClick={onClose} className="btn-primary text-xs cursor-pointer">
            Done &amp; Close
          </button>
        </footer>

      </div>
    </div>
  );
};
