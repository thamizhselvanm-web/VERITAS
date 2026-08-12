import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
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
    <div className="min-h-screen bg-[#070A11] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full glass-panel-elevated p-10 space-y-8 relative z-10 border border-white/10 shadow-2xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-[2px] shadow-2xl shadow-blue-500/30 mx-auto">
            <div className="w-full h-full bg-[#090E1A] rounded-[22px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-wider font-mono">VERITAS</h1>
            <p className="text-xs text-slate-400 font-medium mt-1">Enterprise Continuous Trust Platform</p>
          </div>
        </div>

        {/* Security Banner */}
        <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-3 text-xs text-blue-300">
          <Lock className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>OIDC SSO Protocol v2.4 + Hardware MFA Enforcement</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Tenant Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
              Select Tenant Entity:
            </label>
            <div className="grid grid-cols-2 gap-3">
              
              <button
                type="button"
                onClick={() => setSelectedTenant('tenant-a')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedTenant === 'tenant-a'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/15'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs block">Apex Capital</span>
                <span className="text-[10px] text-slate-400 font-mono">Tenant A</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTenant('tenant-b')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedTenant === 'tenant-b'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/15'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs block">Nexus Trade</span>
                <span className="text-[10px] text-slate-400 font-mono">Tenant B</span>
              </button>

            </div>
          </div>

          {/* User Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
              Underwriter Identity:
            </label>
            <input
              type="text"
              readOnly
              value="alex.morgan@apexcapital.com"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white"
            />
          </div>

          {/* MFA Security Code */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider flex items-center justify-between">
              <span>Hardware MFA Code:</span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Auto-Filled Demo
              </span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs font-mono font-bold tracking-widest text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3.5 text-xs font-bold shadow-xl shadow-blue-600/30"
          >
            {loading ? (
              <span>Verifying OIDC Credentials...</span>
            ) : (
              <>
                <span>Sign In to VERITAS Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
};
