import React, { useState } from 'react';
import { Lock, ArrowRight, CheckCircle2, KeyRound, ShieldCheck } from 'lucide-react';
import { TenantId } from '../../types';

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
    }, 800);
  };

  return (
    <div className="veritas-login min-h-screen relative flex items-center justify-center p-6 bg-[#141211] text-[#F7F4F1] font-sans select-none overflow-hidden">
      <div className="veritas-login__texture pointer-events-none" aria-hidden="true" />

      {/* Ambient Copper Lighting */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#E07A5F]/10 blur-[130px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Brand Intro (6 cols) */}
        <section className="md:col-span-6 space-y-6">
          <p className="veritas-kicker">PRIVATE ACCESS / 08.2026</p>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#F7F4F1] tracking-tight leading-tight font-heading">
            Trust, made <br />
            <em className="text-[#E07A5F] not-italic">verifiable.</em>
          </h1>
          
          <p className="text-sm text-[#D8C7B8] leading-relaxed max-w-md">
            A secure financial intelligence layer for financing decisions, built around evidence you can inspect in real-time.
          </p>

          <div className="w-full max-w-xs h-[1px] bg-[#E07A5F]/30" />

          <div className="flex items-center gap-1.5 h-6">
            <span className="w-1 h-3 bg-[#E07A5F] rounded-full" />
            <span className="w-1 h-5 bg-[#E07A5F] rounded-full" />
            <span className="w-1 h-6 bg-[#E07A5F] rounded-full" />
            <span className="w-1 h-4 bg-[#E07A5F] rounded-full" />
            <span className="w-1 h-2 bg-[#E07A5F] rounded-full" />
          </div>

          <p className="text-xs text-[#9E8C7C] uppercase tracking-wider font-mono">
            Continuous verification for every transaction.
          </p>
        </section>

        {/* Right Column: Secure Access Panel (6 cols) */}
        <section className="md:col-span-6 spatial-panel p-8 border border-[#E07A5F]/30 shadow-2xl space-y-6 bg-[#1C1816]/95 backdrop-blur-xl">
          
          <div className="flex items-center justify-between border-b border-[#E07A5F]/20 pb-4">
            <div className="flex items-center gap-2.5 text-[#E07A5F]">
              <ShieldCheck className="w-5 h-5 text-[#E07A5F]" />
              <span className="font-symphony text-2xl tracking-wide text-[#F7F4F1]">VERITAS</span>
            </div>
            <span className="text-[10px] text-[#9E8C7C] font-mono tracking-wider">SECURE GATEWAY</span>
          </div>

          <div>
            <p className="veritas-kicker">AUTHORIZED PERSONNEL</p>
            <h2 className="text-xl font-bold text-[#F7F4F1] mt-1">Enter workspace</h2>
            <p className="text-xs text-[#9E8C7C] mt-1">Confirm your tenant workspace and identity to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#D8C7B8] uppercase tracking-wider block font-mono">
                Tenant Entity
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTenant('tenant-a')}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    selectedTenant === 'tenant-a'
                      ? 'bg-[#E07A5F]/20 border-[#E07A5F] text-[#E07A5F] font-bold'
                      : 'bg-[#141211] border-[#E07A5F]/20 text-[#9E8C7C] hover:border-[#E07A5F]/40'
                  }`}
                >
                  <span className="block font-bold">Apex Capital</span>
                  <small className="text-[9px] text-[#9E8C7C] font-mono tracking-wider block mt-1">TENANT A</small>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTenant('tenant-b')}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    selectedTenant === 'tenant-b'
                      ? 'bg-[#E07A5F]/20 border-[#E07A5F] text-[#E07A5F] font-bold'
                      : 'bg-[#141211] border-[#E07A5F]/20 text-[#9E8C7C] hover:border-[#E07A5F]/40'
                  }`}
                >
                  <span className="block font-bold">Nexus Trade</span>
                  <small className="text-[9px] text-[#9E8C7C] font-mono tracking-wider block mt-1">TENANT B</small>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#D8C7B8] uppercase tracking-wider block font-mono">
                Underwriter Identity
              </label>
              <input
                type="text"
                readOnly
                value="alex.morgan@apexcapital.com"
                className="veritas-input"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-[#D8C7B8] font-mono uppercase tracking-wider">
                <span>Hardware MFA Code</span>
                <span className="text-[#52B788] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> AUTO-FILLED DEMO</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#9E8C7C] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="veritas-input pl-10 font-bold tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-spatial-primary w-full justify-between py-3 text-xs uppercase tracking-wider mt-2"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Access VERITAS Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="flex items-center gap-2 pt-2 border-t border-[#E07A5F]/20 text-[10px] text-[#9E8C7C] font-mono uppercase">
            <Lock className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>OIDC SSO + Hardware MFA Enforced</span>
          </div>

        </section>
      </main>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-[#9E8C7C] font-mono tracking-widest">
        VERITAS CONTINUOUS TRUST PLATFORM &bull; © 2026 VERITAS GLOBAL
      </footer>
    </div>
  );
};
