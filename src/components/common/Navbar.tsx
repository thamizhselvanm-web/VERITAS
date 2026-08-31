import React from 'react';
import { Shield, Lock, RefreshCw, Upload, Radio, Users, Cpu, FileCheck, Layers } from 'lucide-react';
import { Tenant, TenantId } from '../../types';
import { UserSession } from '../../services/authService';

interface NavbarProps {
  session: UserSession;
  tenants: Tenant[];
  onSwitchTenant: (tenantId: TenantId) => void;
  onOpenUpload: () => void;
  onOpenSimulator: () => void;
  activeView: 'dashboard' | 'case-detail' | 'audit-proof';
  onNavigate: (view: 'dashboard' | 'case-detail' | 'audit-proof') => void;
  selectedCaseId: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  tenants,
  onSwitchTenant,
  onOpenUpload,
  onOpenSimulator,
  activeView,
  onNavigate,
  selectedCaseId
}) => {
  return (
    <header className="border-b border-white/10 bg-[#090E1A]/95 backdrop-blur-xl sticky top-0 z-40 px-8 py-4 shadow-2xl transition-all">
      <div className="max-w-[1760px] mx-auto flex flex-wrap items-center justify-between gap-6">
        
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-10">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#4F46E5] p-[1.5px] border border-[#6366F1] group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#090E1A] rounded-[14px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-2xl tracking-wider text-white font-mono">VERITAS</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  ENTERPRISE AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">Continuous Trust & Verification</p>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <nav className="hidden lg:flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              Portfolio Dashboard
            </button>
            <button
              onClick={() => onNavigate('case-detail')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'case-detail'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Flagship Case ({selectedCaseId.toUpperCase()})
            </button>
            <button
              onClick={() => onNavigate('audit-proof')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'audit-proof'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Audit & Proof Ledger
            </button>
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-4">
          
          {/* Continuous Monitoring Event Simulator Button */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25 text-xs font-bold transition-all"
          >
            <span className="live-indicator"></span>
            <Radio className="w-4 h-4 text-emerald-400" />
            Live Event Simulator
          </button>

          {/* Secure Upload Intent Button */}
          <button
            onClick={onOpenUpload}
            className="btn-primary py-2.5 px-5 text-xs font-bold"
          >
            <Upload className="w-4 h-4" />
            Upload Intent
          </button>

          {/* Tenant Switcher Pill */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-white/10 rounded-2xl px-4 py-2 text-xs shadow-inner">
            <div className="p-1 rounded-lg bg-blue-500/15 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-slate-400 font-medium">Tenant:</span>
            <select
              value={session.activeTenantId}
              onChange={(e) => onSwitchTenant(e.target.value as TenantId)}
              className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer border-none pr-1"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.name} ({t.code})
                </option>
              ))}
            </select>
          </div>

          {/* User Profile / OIDC Status */}
          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <div className="w-9 h-9 rounded-xl bg-[#262320] border border-[#2E2A27] flex items-center justify-center font-extrabold text-white text-xs">
              AM
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{session.name}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono mt-0.5">
                <Lock className="w-3 h-3" />
                <span>OIDC + MFA Active</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
