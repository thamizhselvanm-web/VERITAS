import React, { useState } from 'react';
import { Lock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { TenantId } from '../../types';
import { SystemCardAnimation } from '../common/SystemCardAnimation';

interface LoginPageProps {
  onLoginSuccess: (tenantId: TenantId) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [selectedTenant, setSelectedTenant] = useState<TenantId>('tenant-a');
  const [mfaCode, setMfaCode] = useState('849201');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(selectedTenant);
    }, 400);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 bg-[#141211] text-[#F7F4F1] select-none overflow-hidden font-sans">
      {/* Background Molten Metal Liquid Steel WebGL Animation */}
      <SystemCardAnimation />

      {/* Centered Auth Card */}
      <div className="relative z-10 w-full max-w-[460px] bg-[#1C1816]/90 backdrop-blur-xl border border-[#E07A5F]/35 rounded-2xl p-7 space-y-6 shadow-2xl shadow-[#E07A5F]/20">
        
        {/* Brand & Gateway Header */}
        <header className="flex items-center justify-between border-b border-[#E07A5F]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#B85235] to-[#E07A5F] flex items-center justify-center shadow-lg shadow-[#E07A5F]/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-sans font-bold text-lg text-[#F7F4F1] tracking-tight block leading-none">VERITAS</span>
              <span className="text-[9px] font-mono text-[#E07A5F] uppercase tracking-widest block mt-0.5">TRUST OPERATIONS</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#9E8C7C] uppercase tracking-widest bg-[#231E1B] px-2.5 py-1 rounded border border-[#E07A5F]/20">
            GATEWAY ACCESS
          </span>
        </header>

        {/* Card Intro */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#F7F4F1] tracking-tight">Access workspace</h1>
          <p className="text-xs text-[#D8C7B8] mt-1.5 leading-relaxed">
            Select authorized workspace tenant and confirm hardware credentials.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Tenant Selector */}
          <fieldset className="space-y-2 border-0 p-0 m-0">
            <legend className="text-[11px] font-mono font-bold text-[#E07A5F] uppercase tracking-wider block mb-1.5">
              TENANT WORKSPACE
            </legend>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedTenant('tenant-a')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedTenant === 'tenant-a'
                    ? 'bg-[#E07A5F]/20 border-[#E07A5F] text-[#F7F4F1] shadow-lg shadow-[#E07A5F]/20'
                    : 'bg-[#141211]/80 border-[#E07A5F]/20 text-[#9E8C7C] hover:border-[#E07A5F]/50 hover:text-[#D8C7B8]'
                }`}
              >
                <strong className="block text-xs font-bold leading-tight">Apex Capital</strong>
                <span className="block text-[10px] font-mono text-[#E07A5F] tracking-wider mt-1">TENANT A</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTenant('tenant-b')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedTenant === 'tenant-b'
                    ? 'bg-[#E07A5F]/20 border-[#E07A5F] text-[#F7F4F1] shadow-lg shadow-[#E07A5F]/20'
                    : 'bg-[#141211]/80 border-[#E07A5F]/20 text-[#9E8C7C] hover:border-[#E07A5F]/50 hover:text-[#D8C7B8]'
                }`}
              >
                <strong className="block text-xs font-bold leading-tight">Nexus Trade</strong>
                <span className="block text-[10px] font-mono text-[#E07A5F] tracking-wider mt-1">TENANT B</span>
              </button>
            </div>
          </fieldset>

          {/* Underwriter Identity Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-[#D8C7B8] uppercase tracking-wider block">
              UNDERWRITER IDENTITY
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="alex.morgan@apexcapital.com"
                className="w-full p-3 rounded-xl bg-[#141211] border border-[#E07A5F]/25 text-xs font-mono text-[#D8C7B8] outline-none"
              />
              <a
                href="mailto:alex.morgan@apexcapital.com"
                className="btn-secondary py-3 px-3 text-xs"
                title="Send email to Alex Morgan"
              >
                Mail
              </a>
            </div>
          </div>

          {/* Hardware MFA Code Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono font-bold text-[#D8C7B8] uppercase tracking-wider">
              <span>HARDWARE MFA CODE</span>
              <span className="text-[#52B788] flex items-center gap-1 text-[10px]">
                <CheckCircle2 className="w-3 h-3 text-[#52B788]" /> HARDWARE AUTHENTICATED
              </span>
            </div>
            <input
              type="text"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#141211] border border-[#E07A5F]/35 text-sm font-mono font-numeric font-bold text-[#F7F4F1] tracking-widest focus:border-[#E07A5F] outline-none"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-xs font-bold tracking-wider uppercase flex items-center justify-between px-5 rounded-xl shadow-lg shadow-[#E07A5F]/30 hover:brightness-110 transition-all mt-2 cursor-pointer"
          >
            <span>{loading ? 'Verifying access…' : 'Access workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Footer Auth Disclosure */}
        <footer className="flex items-center gap-2 pt-3 border-t border-[#E07A5F]/20 text-[11px] text-[#9E8C7C] font-mono uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>OIDC SSO + Hardware MFA Enforced</span>
        </footer>

      </div>

    </main>
  );
};
