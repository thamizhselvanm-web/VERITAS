import React from 'react';
import { ShieldCheck, Lock, AlertOctagon } from 'lucide-react';
import { TenantId } from '../../types';

interface TenantSecurityGuardProps {
  activeTenantId: TenantId;
  targetCaseTenantId: TenantId;
}

export const TenantSecurityGuard: React.FC<TenantSecurityGuardProps> = ({
  activeTenantId,
  targetCaseTenantId
}) => {
  const isAllowed = activeTenantId === targetCaseTenantId;

  if (isAllowed) {
    return (
      <div className="bg-blue-950/20 border border-blue-500/20 p-3 rounded-2xl text-xs flex items-center justify-between font-mono shadow-md">
        <div className="flex items-center gap-2.5 text-blue-300">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Tenant Authorization Guard: Active ({activeTenantId.toUpperCase()})</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
          ISOLATION VERIFIED ✓
        </span>
      </div>
    );
  }

  return (
    <div className="bg-red-950/50 border-2 border-red-500/80 p-6 rounded-2xl text-xs space-y-3 shadow-2xl">
      <div className="flex items-center gap-3">
        <AlertOctagon className="w-6 h-6 text-red-400 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-red-300 text-sm">SECURITY ACCESS VIOLATION (IDOR DEFENSE)</h4>
          <p className="text-slate-300 mt-0.5">
            Active Tenant <strong className="text-white">{activeTenantId.toUpperCase()}</strong> attempted to access a record belonging to <strong className="text-white">{targetCaseTenantId.toUpperCase()}</strong>.
          </p>
        </div>
      </div>

      <p className="text-[11px] text-red-300/90 bg-black/40 p-3.5 rounded-xl font-mono">
        Cross-tenant data access blocked by VERITAS Tenant Context Middleware. Cross-tenant queries are logged to SIEM audit stream.
      </p>
    </div>
  );
};
