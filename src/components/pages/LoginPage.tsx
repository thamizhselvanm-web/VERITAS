import React, { useState } from 'react';
import { Lock, CheckCircle2, ArrowRight, Landmark, Building2 } from 'lucide-react';
import { TenantId } from '../../types';
import { SystemCardAnimation } from '../common/SystemCardAnimation';
import { VeritasLogo } from '../common/VeritasLogo';
import { authService } from '../../services/authService';

export type PortalType = 'bank' | 'company';

interface LoginPageProps {
  onLoginSuccess: (tenantId: TenantId, portalType?: PortalType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [portalType, setPortalType] = useState<PortalType>('bank');
  const [selectedTenant, setSelectedTenant] = useState<TenantId>('tenant-a');
  const [email, setEmail] = useState('');
  const [mfaCode, setMfaCode] = useState('849201');
  const [loading, setLoading] = useState(false);

  const isBank = portalType === 'bank';
  const identityRole = isBank ? 'Senior Credit Risk Officer (Bank)' : 'Corporate Finance Officer (Company)';
  const identityName = isBank ? 'Alex Morgan' : 'Sarah Jenkins';
  const activeEmail = email.trim() || 'thamizhselvanm2@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      authService.login(portalType, selectedTenant, activeEmail, identityName, identityRole);
      setLoading(false);
      onLoginSuccess(selectedTenant, portalType);
    }, 400);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 bg-[#141211] text-[#F7F4F1] select-none overflow-hidden font-sans">
      {/* Quiet Flat Background Container */}
      <SystemCardAnimation />

      {/* Centered Flat Graphite Auth Card */}
      <div className="relative z-10 w-full max-w-[480px] bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-4.5 sm:p-7 space-y-6 shadow-2xl">
        
        {/* Brand & Gateway Header */}
        <header className="flex items-center justify-between border-b border-[#2E2A27] pb-4">
          <VeritasLogo variant="full" size="md" />
          <span className="text-[10px] font-mono text-[#6366F1] uppercase tracking-widest bg-[#262320] px-2.5 py-1 rounded border border-[#2E2A27]">
            {isBank ? 'BANK GATEWAY' : 'COMPANY PORTAL'}
          </span>
        </header>

        {/* Card Intro */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#F7F4F1] tracking-tight">Access Workspace</h1>
          <p className="text-xs text-[#D8C7B8] mt-1.5 leading-relaxed">
            Select authentication side (Bank or Company) and confirm workspace credentials.
          </p>
        </div>

        {/* 2 Options: Bank Side vs Company Side */}
        <fieldset className="space-y-2 border-0 p-0 m-0">
          <legend className="text-[11px] font-mono font-bold text-[#6366F1] uppercase tracking-wider block mb-1.5">
            AUTHENTICATION SIDE
          </legend>

          <div className="grid grid-cols-2 gap-3">
            {/* Bank Side Option */}
            <button
              type="button"
              onClick={() => {
                setPortalType('bank');
                setSelectedTenant('tenant-a');
              }}
              className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer relative overflow-hidden focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
                isBank
                  ? 'bg-[#6366F1]/15 border-[#6366F1] text-[#F7F4F1] shadow-md ring-1 ring-[#6366F1]'
                  : 'bg-[#141211] border-[#2E2A27] text-[#9E8C7C] hover:border-[#6366F1]/50 hover:text-[#D8C7B8]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Landmark className={`w-4 h-4 ${isBank ? 'text-[#6366F1]' : 'text-[#9E8C7C]'}`} />
                <strong className="block text-xs font-bold leading-tight">Bank Side</strong>
              </div>
              <span className="block text-[10px] font-mono text-[#6366F1] tracking-wider mt-0.5">
                LENDER / UNDERWRITER
              </span>
            </button>

            {/* Company Side Option */}
            <button
              type="button"
              onClick={() => {
                setPortalType('company');
                setSelectedTenant('tenant-a');
              }}
              className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer relative overflow-hidden focus-visible:ring-2 focus-visible:ring-[#10B981] ${
                !isBank
                  ? 'bg-[#10B981]/15 border-[#10B981] text-[#F7F4F1] shadow-md ring-1 ring-[#10B981]'
                  : 'bg-[#141211] border-[#2E2A27] text-[#9E8C7C] hover:border-[#10B981]/50 hover:text-[#D8C7B8]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Building2 className={`w-4 h-4 ${!isBank ? 'text-[#10B981]' : 'text-[#9E8C7C]'}`} />
                <strong className="block text-xs font-bold leading-tight">Company Side</strong>
              </div>
              <span className="block text-[10px] font-mono text-[#10B981] tracking-wider mt-0.5">
                CORPORATE ENTERPRISE
              </span>
            </button>
          </div>
        </fieldset>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Tenant Selector */}
          <fieldset className="space-y-2 border-0 p-0 m-0">
            <legend className="text-[11px] font-mono font-bold text-[#6366F1] uppercase tracking-wider block mb-1.5">
              TENANT WORKSPACE
            </legend>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedTenant('tenant-a')}
                className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
                  selectedTenant === 'tenant-a'
                    ? 'bg-[#6366F1]/15 border-[#6366F1] text-[#F7F4F1] shadow-md'
                    : 'bg-[#141211] border-[#2E2A27] text-[#9E8C7C] hover:border-[#6366F1]/50 hover:text-[#D8C7B8]'
                }`}
              >
                <strong className="block text-xs font-bold leading-tight">
                  {isBank ? 'Apex Capital' : 'Acme Components'}
                </strong>
                <span className="block text-[10px] font-mono text-[#6366F1] tracking-wider mt-1">
                  {isBank ? 'TENANT A' : 'SUPPLIER A'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTenant('tenant-b')}
                className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
                  selectedTenant === 'tenant-b'
                    ? 'bg-[#6366F1]/15 border-[#6366F1] text-[#F7F4F1] shadow-md'
                    : 'bg-[#141211] border-[#2E2A27] text-[#9E8C7C] hover:border-[#6366F1]/50 hover:text-[#D8C7B8]'
                }`}
              >
                <strong className="block text-xs font-bold leading-tight">
                  {isBank ? 'Nexus Trade' : 'Meridian Industries'}
                </strong>
                <span className="block text-[10px] font-mono text-[#6366F1] tracking-wider mt-1">
                  {isBank ? 'TENANT B' : 'BUYER B'}
                </span>
              </button>
            </div>
          </fieldset>

          {/* Identity Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono font-bold text-[#D8C7B8] uppercase tracking-wider">
              <span>{isBank ? 'UNDERWRITER IDENTITY' : 'CORPORATE IDENTITY'}</span>
              <span className="text-[10px] text-[#6366F1] font-sans font-semibold">{identityRole}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="thamizhselvanm2@gmail.com"
                className="w-full p-3 rounded-xl bg-[#141211] border border-[#2E2A27] text-xs font-mono text-[#F7F4F1] placeholder-[#9E8C7C] outline-none focus:border-[#6366F1] transition-all duration-150"
              />
              <a
                href={`mailto:${activeEmail}`}
                className="btn-secondary py-3 px-3 text-xs flex items-center justify-center min-w-[70px] border border-[#2E2A27] bg-[#262320] text-[#F7F4F1] hover:border-[#6366F1]"
                title={`Send email to ${activeEmail}`}
              >
                Mail
              </a>
            </div>
          </div>

          {/* Hardware MFA Code Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono font-bold text-[#D8C7B8] uppercase tracking-wider">
              <span>HARDWARE MFA CODE</span>
              <span className="text-[#10B981] flex items-center gap-1 text-[10px]">
                <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> HARDWARE AUTHENTICATED
              </span>
            </div>
            <input
              type="text"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#141211] border border-[#2E2A27] text-sm font-mono font-numeric font-bold text-[#F7F4F1] tracking-widest focus:border-[#6366F1] outline-none transition-all duration-150"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-xs font-bold tracking-wider uppercase flex items-center justify-between px-5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg transition-all duration-150 mt-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#6366F1]"
          >
            <span>{loading ? 'Verifying credentials…' : `Access ${isBank ? 'Bank' : 'Company'} Portal`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Footer Auth Disclosure */}
        <footer className="flex items-center gap-2 pt-3 border-t border-[#2E2A27] text-[11px] text-[#9E8C7C] font-mono uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-[#6366F1]" />
          <span>OIDC SSO + Hardware MFA Enforced &bull; {isBank ? 'Bank Gateway' : 'Company Portal'}</span>
        </footer>

      </div>

    </main>
  );
};
