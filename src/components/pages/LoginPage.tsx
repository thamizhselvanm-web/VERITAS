import React, { useState } from 'react';
import { Lock, ShieldCheck, CheckCircle2, ArrowRight, Landmark, Building2 } from 'lucide-react';
import { TenantId } from '../../types';
import { SystemCardAnimation } from '../common/SystemCardAnimation';
import { authService } from '../../services/authService';

export type PortalType = 'bank' | 'company';

interface LoginPageProps {
  onLoginSuccess: (tenantId: TenantId, portalType?: PortalType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [portalType, setPortalType] = useState<PortalType>('bank');
  const [selectedTenant, setSelectedTenant] = useState<TenantId>('tenant-a');
  const [mfaCode, setMfaCode] = useState('849201');
  const [loading, setLoading] = useState(false);

  const isBank = portalType === 'bank';
  const identityEmail = isBank ? 'alex.morgan@apexcapital.com' : 'treasury@acmecomponents.com';
  const identityRole = isBank ? 'Senior Credit Risk Officer (Bank)' : 'Corporate Finance Officer (Company)';
  const identityName = isBank ? 'Alex Morgan' : 'Sarah Jenkins';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      authService.login(portalType, selectedTenant, identityEmail, identityName, identityRole);
      setLoading(false);
      onLoginSuccess(selectedTenant, portalType);
    }, 400);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 bg-[#141211] text-[#F7F4F1] select-none overflow-hidden font-sans">
      {/* Radiant Glowing Molten Metal Liquid Steel WebGL Background */}
      <SystemCardAnimation />

      {/* Centered Glassmorphic Auth Card */}
      <div className="relative z-10 w-full max-w-[500px] bg-[#1C1816]/90 backdrop-blur-2xl border border-[#E07A5F]/40 rounded-2xl p-7 space-y-6 shadow-2xl shadow-[#E07A5F]/25">
        
        {/* Brand & Gateway Header */}
        <header className="flex items-center justify-between border-b border-[#E07A5F]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B85235] via-[#E07A5F] to-[#FFB703] flex items-center justify-center shadow-lg shadow-[#E07A5F]/40">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-sans font-extrabold text-xl text-[#F7F4F1] tracking-tight block leading-none">VERITAS</span>
              <span className="text-[9px] font-mono text-[#E07A5F] uppercase tracking-widest block mt-1">CONTINUOUS TRUST ENGINE</span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#E07A5F] uppercase tracking-widest bg-[#231E1B] px-3 py-1 rounded-full border border-[#E07A5F]/30 shadow-inner">
            {isBank ? 'BANK GATEWAY' : 'CORPORATE PORTAL'}
          </span>
        </header>

        {/* Card Intro */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#F7F4F1] tracking-tight">Select Authentication Side</h1>
          <p className="text-xs text-[#D8C7B8] mt-1.5 leading-relaxed">
            Choose whether you are authenticating from the Bank (Financing Institution) or Company (Corporate Enterprise) side.
          </p>
        </div>

        {/* 2 Portal Options: Bank Side vs Company Side */}
        <fieldset className="space-y-2 border-0 p-0 m-0">
          <legend className="text-[11px] font-mono font-bold text-[#E07A5F] uppercase tracking-wider block mb-2">
            1. AUTHENTICATION SIDE
          </legend>

          <div className="grid grid-cols-2 gap-3">
            {/* Bank Side Option */}
            <button
              type="button"
              onClick={() => {
                setPortalType('bank');
                setSelectedTenant('tenant-a');
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isBank
                  ? 'bg-gradient-to-br from-[#E07A5F]/25 to-[#B85235]/20 border-[#E07A5F] text-[#F7F4F1] shadow-lg shadow-[#E07A5F]/25 ring-1 ring-[#E07A5F]'
                  : 'bg-[#141211]/80 border-[#E07A5F]/20 text-[#9E8C7C] hover:border-[#E07A5F]/50 hover:text-[#D8C7B8]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Landmark className={`w-4 h-4 ${isBank ? 'text-[#FFB703]' : 'text-[#9E8C7C]'}`} />
                <strong className="block text-xs font-bold leading-tight">Bank Side</strong>
              </div>
              <p className="text-[10px] text-[#D8C7B8] leading-tight">
                Lender / Underwriter Portal
              </p>
              <span className="inline-block text-[9px] font-mono text-[#E07A5F] tracking-wider mt-2 bg-[#141211]/60 px-2 py-0.5 rounded border border-[#E07A5F]/30">
                FINANCIAL INST.
              </span>
            </button>

            {/* Company Side Option */}
            <button
              type="button"
              onClick={() => {
                setPortalType('company');
                setSelectedTenant('tenant-a');
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                !isBank
                  ? 'bg-gradient-to-br from-[#52B788]/25 to-[#2D6A4F]/20 border-[#52B788] text-[#F7F4F1] shadow-lg shadow-[#52B788]/25 ring-1 ring-[#52B788]'
                  : 'bg-[#141211]/80 border-[#E07A5F]/20 text-[#9E8C7C] hover:border-[#52B788]/50 hover:text-[#D8C7B8]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Building2 className={`w-4 h-4 ${!isBank ? 'text-[#52B788]' : 'text-[#9E8C7C]'}`} />
                <strong className="block text-xs font-bold leading-tight">Company Side</strong>
              </div>
              <p className="text-[10px] text-[#D8C7B8] leading-tight">
                Corporate Supplier / Buyer
              </p>
              <span className="inline-block text-[9px] font-mono text-[#52B788] tracking-wider mt-2 bg-[#141211]/60 px-2 py-0.5 rounded border border-[#52B788]/30">
                ENTERPRISE
              </span>
            </button>
          </div>
        </fieldset>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Tenant Selector */}
          <fieldset className="space-y-2 border-0 p-0 m-0">
            <legend className="text-[11px] font-mono font-bold text-[#D8C7B8] uppercase tracking-wider block mb-1.5">
              2. TENANT WORKSPACE
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
                <strong className="block text-xs font-bold leading-tight">
                  {isBank ? 'Apex Capital' : 'Acme Components'}
                </strong>
                <span className="block text-[10px] font-mono text-[#E07A5F] tracking-wider mt-1">
                  {isBank ? 'LENDER A' : 'SUPPLIER A'}
                </span>
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
                <strong className="block text-xs font-bold leading-tight">
                  {isBank ? 'Nexus Trade Credit' : 'Meridian Industries'}
                </strong>
                <span className="block text-[10px] font-mono text-[#E07A5F] tracking-wider mt-1">
                  {isBank ? 'LENDER B' : 'BUYER B'}
                </span>
              </button>
            </div>
          </fieldset>

          {/* Identity Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono font-bold text-[#D8C7B8] uppercase tracking-wider">
              <span>{isBank ? 'UNDERWRITER IDENTITY' : 'CORPORATE IDENTITY'}</span>
              <span className="text-[10px] text-[#E07A5F] font-sans font-semibold">{identityRole}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={identityEmail}
                className="w-full p-3 rounded-xl bg-[#141211] border border-[#E07A5F]/25 text-xs font-mono text-[#D8C7B8] outline-none"
              />
              <a
                href={`mailto:${identityEmail}`}
                className="btn-secondary py-3 px-3 text-xs"
                title={`Send email to ${identityEmail}`}
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
            <span>{loading ? 'Verifying access credentials…' : `Access ${isBank ? 'Bank' : 'Company'} Portal`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Footer Auth Disclosure */}
        <footer className="flex items-center gap-2 pt-3 border-t border-[#E07A5F]/20 text-[11px] text-[#9E8C7C] font-mono uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>OIDC SSO + Hardware MFA Enforced &bull; {isBank ? 'FII Risk Node' : 'Corporate Enterprise Node'}</span>
        </footer>

      </div>

    </main>
  );
};
